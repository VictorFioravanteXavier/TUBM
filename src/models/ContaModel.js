const mongoose = require('mongoose');
const { validarCPF } = require('../utils/validaCpf');
const { validarTelefone } = require('../utils/validaTelefone');

const ContaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    telefone: { type: String, required: true },
    data_criacao: { type: Date, default: Date.now() },
    delete: { type: Boolean, default: false },
})

const ContaModule = mongoose.model('Conta', ContaSchema);

class Conta {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.conta = null;
    }

    async registrar() {
        this.valida()

        if (this.errors.length > 0) {
            return
        }

        this.conta = await ContaModule.create(this.body)
    }

    static async buscarContas() {
        const contas = await ContaModule.find({ delete: false }).sort({ name: 1 }).lean();
        return contas;
    }

    static async buscarConta(id) {
        const conta = await ContaModule.findById(id).lean();
        return conta;
    }

    async edit(id) {
        if (typeof id !== 'string') return;

        this.valida();

        if (this.errors.length > 0) return;

        this.conta = await ContaModule.findByIdAndUpdate(id, this.body, { new: true });
    };

    static async delete(id) {
        if (typeof id !== 'string') return;

        const conta = await ContaModule.findByIdAndUpdate(
            id,
            { delete: true },
            { new: true }
        );
        return conta;
    }

    static async restaurar(id) {
        if (typeof id !== 'string') return;

        const conta = await ContaModule.findByIdAndUpdate(
            id,
            { delete: false },
            { new: true }
        );
        return conta;
    }

    valida() {
        if (!this.body.nome) {
            this.errors.push('Nome é obrigatório');
        }

        if (!this.body.cpf || !validarCPF(this.body.cpf)) {
            this.errors.push('Cpf é obrigatória e deve ser valido');
        }

        if (!this.body.telefone || !validarTelefone(this.body.telefone)) {
            this.errors.push('Telefone é obrigatório e deve ser um número válido');
        }
    }
}

module.exports = Conta;