const mongoose = require('mongoose');
const Produto = require('./ProdutoModel.js');
const centTrasform = require('../utils/centTrasform.js');
const Account = require('./AccountModel.js');
const gerarNumeroVenda = require('../utils/vendaNumber.js');
const isValidDate = require('../utils/isValidDate.js');

const VendaSchema = new mongoose.Schema({
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    data_venda: { type: Date, required: true, default: Date.now },
    date_pay: { type: Date },
    valor_total: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false },
    observacoes: { type: String, required: false },
    cod_venda: { type: String, required: true },
    // Lista de itens da venda
    itens: [{
        _id: false,
        produto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
        quantidade: { type: Number, required: true },
        subtotal: { type: Number, required: true },
        custo_produto: { type: Number, required: true },
        valor_venda: { type: Number, required: true },
    }],

    delete: { type: Boolean, default: false }
});

const VendaModule = mongoose.model('Venda', VendaSchema);

class Venda {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.venda = null;
    }

    async registrar() {
        await this.valida();

        if (this.errors.length > 0) {
            return;
        }

        const data = {
            account_id: this.body.account_id,
            date_pay: this.body.status ? Date.now() : null,
            valor_total: centTrasform(this.body.valor_total),
            status: this.body.status,
            observacoes: this.body.observacoes,
            cod_venda: gerarNumeroVenda(),
            itens: [],
        };

        for (const item of this.body.itens) {
            const validaProduto = await Produto.VendaFeita(item.produto_id, item.quantidade);
            if (validaProduto.success) {
                data.itens.push({
                    produto_id: item.produto_id,
                    quantidade: item.quantidade,
                    subtotal: centTrasform(item.subtotal),
                    custo_produto: validaProduto.produto.custo,
                    valor_venda: validaProduto.produto.valor_venda
                });
            } else {
                this.errors.push(validaProduto.error);
            }
        }

        if (this.errors.length > 0) {
            return;
        }

        this.venda = await VendaModule.create(data);
    }


    static async findAll(page = 1) {
        const limit = 10;
        const skip = (page - 1) * limit;

        const [vendas, total] = await Promise.all([
            VendaModule.find({ delete: false })
                .sort({ data_venda: -1 })
                .skip(skip)
                .limit(limit)
                .populate('account_id')
                .populate('itens.produto_id'),

            VendaModule.countDocuments({ delete: false })
        ]);

        return {
            vendas,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    static async findAllFiltred(page = 1, status, searchName, searchNumber) {
        const limit = 10;
        const skip = (page - 1) * limit;
        const errors = [];

        // Convertendo status para boolean (ou undefined)
        let statusBool;
        if (typeof status === 'boolean') {
            statusBool = status;
        } else if (status === 'true') {
            statusBool = true;
        } else if (status === 'false') {
            statusBool = false;
        } else if (status === undefined || status === null) {
            statusBool = undefined;
        } else {
            statusBool = null;
        }

        if (status !== undefined && statusBool === null) {
            errors.push("Erro ao filtrar o status da venda");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        // Busca IDs das contas que batem com nome e número
        let accountIds = [];
        if (searchName || searchNumber) {
            accountIds = await Account.findIdsByNameAndNumber(searchName, searchNumber);
            if (accountIds.length === 0) {
                // Nenhuma conta bateu com filtro: retorna vazio imediatamente
                return {
                    vendas: [],
                    totalPages: 1,
                    currentPage: page
                };
            }
        }

        // Monta filtro para vendas
        const filters = { delete: false };

        if (statusBool !== undefined) {
            filters.status = statusBool;
        }

        if (accountIds.length > 0) {
            filters.account_id = { $in: accountIds };
        }

        // Busca as vendas com paginação e popula account_id e itens.produto_id
        const vendas = await VendaModule.find(filters)
            .populate('account_id')
            .populate('itens.produto_id')
            .sort({ data_venda: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await VendaModule.countDocuments(filters);

        return {
            vendas,
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: page
        };
    }

    static async findAllCompras(account_id, page = 1) {
        const limit = 10;
        const skip = (page - 1) * limit;

        // Garante que o account_id é um ObjectId válido
        if (!mongoose.isValidObjectId(account_id)) {
            throw new Error("ID de conta inválido");
        }

        const objectId = new mongoose.Types.ObjectId(account_id);
        let [vendas, total] = [0, 0]
        try {
            [vendas, total] = await Promise.all([
                VendaModule.find({ delete: false, account_id: objectId })
                    .sort({ data_venda: -1 })
                    .skip(skip)
                    .limit(limit)
                    .populate('account_id')
                    .populate('itens.produto_id'),

                VendaModule.countDocuments({ delete: false, account_id: objectId })
            ]);
        } catch (error) {
            console.log(error);

        }


        return {
            vendas,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }



    static async findComprasAllFiltred(account_id, page = 1, status, searchCode) {
        const limit = 10;
        const skip = (page - 1) * limit;
        const errors = [];

        // Convertendo status para boolean (ou undefined)
        let statusBool;
        if (typeof status === 'boolean') {
            statusBool = status;
        } else if (status === 'true') {
            statusBool = true;
        } else if (status === 'false') {
            statusBool = false;
        } else if (status === undefined || status === null) {
            statusBool = undefined;
        } else {
            statusBool = null;
        }

        if (!mongoose.isObjectIdOrHexString(account_id)) {
            errors.push("Usuário não encontrado");
        }

        if (status !== undefined && statusBool === null) {
            errors.push("Erro ao filtrar o status da venda");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        // Monta filtro para vendas
        const filters = { delete: false };

        if (statusBool !== undefined) {
            filters.status = statusBool;
        }

        if (searchCode) {
            filters.cod_venda = { $regex: new RegExp(searchCode, 'i') }; // case-insensitive
        }

        if (account_id) {
            filters.account_id = account_id
        }

        const vendas = await VendaModule.find(filters)
            .populate('account_id')
            .populate('itens.produto_id')
            .sort({ data_venda: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await VendaModule.countDocuments(filters);

        return {
            vendas,
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: page
        };
    }

    static async findAllFiltredShippingReporting(obj, page = 1) {
        const limit = 10;
        const skip = (page - 1) * limit;

        // Converte para Date
        const initialDate = new Date(obj.initial_date);
        const finalDate = new Date(obj.final_date);

        // Monta filtro para vendas
        const filters = { delete: false };

        if (isValidDate(initialDate) || isValidDate(finalDate)) {
            filters.data_venda = {};
            if (isValidDate(initialDate)) {
                filters.data_venda.$gte = initialDate;
            }
            if (isValidDate(finalDate)) {
                filters.data_venda.$lte = finalDate;
            }
        }


        if (obj.min_val || obj.max_val) {
            filters.valor_total = {};
            if (obj.min_val && !isNaN(obj.min_val)) {
                filters.valor_total.$gte = Number(obj.min_val);
            }
            if (obj.max_val && !isNaN(obj.max_val)) {
                filters.valor_total.$lte = Number(obj.max_val);
            }
        }


        if (obj.status === "false" || obj.status === "true") {
            filters.status = obj.status;
        }

        if (mongoose.isValidObjectId(obj.account)) {
            filters.account_id = obj.account
        }

        const vendas = await VendaModule.find(filters)
            .populate('account_id')
            .sort({ data_venda: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await VendaModule.countDocuments(filters);

        return {
            vendas,
            totalPages: Math.ceil(total / limit) || 1,
            currentPage: page
        };
    }



    static async delete(id) {
        if (!mongoose.isValidObjectId(id)) {
            this.errors.push("Usuário inválido.")
            return
        }

        try {
            await VendaModule.findByIdAndUpdate(
                { _id: id },
                {
                    delete: true,
                    update_date: Date.now(),
                },
                { new: true }
            )

            return { success: true }
        } catch (e) {
            this.errors.push("Ocorreu um erro inesperado.")
            console.log(e);
            return { success: false }
        }
    }

    static async restaurar(id) {
        if (!mongoose.isValidObjectId(id)) {
            this.errors.push("Usuário inválido.")
            return
        }

        try {
            await VendaModule.findByIdAndUpdate(
                { _id: id },
                {
                    delete: false,
                    update_date: Date.now(),
                },
                { new: true }
            )

            return { success: true }
        } catch (e) {
            this.errors.push("Ocorreu um erro inesperado.")
            console.log(e);
            return { success: false }
        }
    }

    async valida() {
        if (!mongoose.isValidObjectId(this.body.account_id)) {
            this.errors.push('Tem que ter uma conta para fazer a venda');
        }

        if (!this.body.valor_total) {
            this.errors.push('Tem que ter um valor total para fazer a venda');
        } else if (typeof this.body.valor_total !== 'number') {
            this.errors.push('Valor total tem que ser um número');
        } else if (this.body.valor_total <= 0) {
            this.errors.push('Valor total tem que ser maior que 0');
        }

        if (typeof this.body.status !== 'boolean') {
            this.errors.push('Tem que ter um status para fazer a venda (só verdadeiro ou falso)');
        }

        if (!this.body.itens) {
            this.errors.push('Tem que ter itens para fazer a venda');
        } else if (!Array.isArray(this.body.itens)) {
            this.errors.push('Itens tem que ser um array');
        } else {
            for (let i = 0; i < this.body.itens.length; i++) {
                const item = this.body.itens[i];

                if (!item.produto_id) {
                    this.errors.push(`Item ${i + 1} tem que ter um id`);
                    continue;
                }

                const produto = await Produto.buscaPorId(item.produto_id);
                if (!produto) {
                    this.errors.push(`Item ${i + 1} tem um id inválido`);
                }
            }
        }
    }
}

module.exports = Venda;