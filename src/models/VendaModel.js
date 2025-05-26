const mongoose = require('mongoose');
const Conta = require('./ContaModel.js');
const Produto = require('./ProdutoModel.js');

const VendaSchema = new mongoose.Schema({
    cliente_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    data_venda: { type: Date, required: true, default: Date.now },
    valor_total: { type: Number, required: true },
    status: { type: Boolean, required: true, default: false },
    observacoes: { type: String, required: false },

    // Lista de itens da venda
    itens: [
        {
            produto_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
            nome_produto: { type: String, required: true },
            quantidade: { type: Number, required: true },
            preco_unitario: { type: Number, required: true },
            subtotal: { type: Number, required: true }
        }
    ]
});

const VendaModule = mongoose.model('Venda', VendaSchema);

class Venda {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.venda = null;
    }

    async registrar() {
        console.log('Chamou registrar', this.body);

        await this.valida();

        if (this.errors.length > 0) {
            console.log('Erros na validação:', this.errors);
            return;
        }

        this.venda = await VendaModule.create(this.body);
        console.log('Venda registrada no banco:', this.venda);
    }

    async valida() {
        const conta = await Conta.buscarConta(this.body.cliente_id);
        if (!this.body.cliente_id) {
            this.errors.push('Tem que ter uma conta para fazer a venda');
        } else if (!conta) {
            this.errors.push('Conta inválida');
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