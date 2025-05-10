const mongoose = require('mongoose');


const ProdutoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    quantidade: { type: Number, required: true },
    custo: { type: Number, required: true },
    valor_venda: { type: Number, required: true },
    data_cadastro: { type: Date, required: true },
    data_atualizacao: { type: Date, required: true }
});

const ProdutoModule = mongoose.model('Produto', ProdutoSchema);

class Produto {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.produto = null;
    }

    async registrar() {
        this.valida()

        if (this.errors.length > 0) {
            return
        }

        this.produto = await ProdutoModule.create(this.body)
    }

    async edit(id) {
        if (typeof id !== 'string') return;

        this.valida();

        if (this.errors.length > 0) return;

        this.produto = await ProdutoModule.findByIdAndUpdate(id, this.body, { new: true });
    };

    static async delete(id) {
        if (typeof id !== 'string') return

        const produto = await ProdutoModule.findOneAndDelete({ _id: id });
        return produto
    }


    static async searchLastCode() {
        const ultimoProduto = await ProdutoModule.findOne().sort({ code: -1 }).lean();

        let proximoNumero = 1;

        if (ultimoProduto && ultimoProduto.code) {
            const numeroAtual = parseInt(ultimoProduto.code.replace('Cod', ''), 10);
            proximoNumero = numeroAtual + 1;
        }

        // Gera o novo código com zeros à esquerda (ex: Cod0001)
        return 'Cod' + proximoNumero.toString().padStart(4, '0');
    }

    static async buscarProdutos() {
        const produtos = await ProdutoModule.find().sort({ name: 1 }).lean();
        return produtos;
    }

    static async buscaPorId(id) {
        const produto = await ProdutoModule.findById(id).lean();
        return produto;
    }

    valida() {
        if (!this.body.name) {
            this.errors.push('Nome é obrigatório');
        }

        if (!this.body.quantidade || isNaN(Number(this.body.quantidade))) {
            this.errors.push('Quantidade é obrigatória e deve ser numérica');
        }

        if (!this.body.custo || isNaN(Number(this.body.custo))) {
            this.errors.push('Custo é obrigatório e deve ser numérico');
        }

        if (!this.body.valor_venda || isNaN(Number(this.body.valor_venda))) {
            this.errors.push('Valor de venda é obrigatório e deve ser numérico');
        }
    }

}

module.exports = Produto;