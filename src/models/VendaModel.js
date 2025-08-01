const mongoose = require('mongoose');
const Produto = require('./ProdutoModel.js');
const centTrasform = require('../utils/centTrasform.js');
const Account = require('./AccountModel.js');

const VendaSchema = new mongoose.Schema({
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    data_venda: { type: Date, required: true, default: Date.now },
    date_pay: { type: Date },
    valor_total: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false },
    observacoes: { type: String, required: false },

    // Lista de itens da venda
    itens: [{
        produto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
        quantidade: { type: Number, required: true },
        subtotal: { type: Number, required: true }
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
            itens: []
        }

        this.body.itens.forEach(item => {
            data.itens.push({
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                subtotal: centTrasform(item.subtotal)
            })
        });

        this.venda = await VendaModule.create(
            data
        );
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


    static async getResumoContasComComprasPaginado(page = 1) {
        const limit = 10;
        const skip = (page - 1) * limit;

        // Busca todas as vendas não deletadas com os dados da conta
        const vendas = await VendaModule.find({ delete: false })
            .populate('account_id')
            .populate('itens.produto_id'); // se quiser também incluir os produtos da venda

        const resumoPorConta = {};

        vendas.forEach(venda => {
            const conta = venda.account_id;
            if (!conta) return;

            const contaId = conta._id.toString();

            if (!resumoPorConta[contaId]) {
                resumoPorConta[contaId] = {
                    nomeConta: conta.nome || conta.name || 'Sem nome',
                    numeroConta: conta.number || conta.number || '---',
                    contasPendentes: 0,
                    dividaTotalCentavos: 0
                };
            }

            if (!venda.status) {
                resumoPorConta[contaId].contasPendentes += 1;
                resumoPorConta[contaId].dividaTotalCentavos += venda.valor_total;
            }
        });

        const contasArray = Object.values(resumoPorConta);

        const total = contasArray.length;
        const totalPages = Math.ceil(total / limit);
        const paginated = contasArray.slice(skip, skip + limit);

        return {
            vendas: paginated.map(conta => ({
                ...conta,
                dividaTotal: (conta.dividaTotalCentavos / 100).toFixed(2)
            })),
            totalPages,
            currentPage: page
        };
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