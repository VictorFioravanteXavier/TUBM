const mongoose = require('mongoose');
const Produto = require('./ProdutoModel.js');
const centTrasform = require('../utils/centTrasform.js')

const VendaSchema = new mongoose.Schema({
    account_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    data_venda: { type: Date, required: true, default: Date.now },
    date_pay: { type: Date },
    valor_total: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false },
    observacoes: { type: String, required: false },

    // Lista de itens da venda
    itens: [{
        produto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produtos', required: true },
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