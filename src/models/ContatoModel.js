const mongoose = require('mongoose');
const validator = require('validator')

const ContatoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now },
})

const ContatoModule = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
    this.body = body
    this.errors = []
    this.contato = null
}

Contato.prototype.register = async function () {
    this.valida()

    if (this.errors.length > 0) {
        return
    }

    this.contato = await ContatoModule.create(this.body)
}

Contato.prototype.valida = function () {
    this.cleanUp()

    // Validação
    // O e-mail precisa ser válido
    if (this.body.email && !validator.isEmail(this.body.email)) {
        this.errors.push('E-mail inválido')
    }

    if (!this.body.nome) this.errors.push("Nome é um campo obrigatório")

    if (!this.body.email && !this.body.telefone) this.errors.push("Pelomenos um contato precisa ser enviado: 'email' ou 'telefone'")
}

Contato.prototype.cleanUp = function () {
    for (const key in this.body) {
        if (typeof this.body[key] !== 'string') {
            this.body[key] = ''
        }
    }

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone,
    }
}

Contato.prototype.edit = async function(id) {
    if (typeof id !== 'string') return;

    this.valida();

    if (this.errors.length > 0) return;

    this.contato = await ContatoModule.findByIdAndUpdate(id, this.body, {new: true});
};

// Métodos estáticos

Contato.buscaPorId = async function (id) {
    if (typeof id !== 'string') return

    const contato = await ContatoModule.findById(id);
    return contato
}

Contato.buscaContatos = async function() {
    const contatos = await ContatoModule.find().sort({ criadoEm: -1 }); // Example: Fetch from MongoDB
    return contatos; // Returns an array
};

Contato.delete = async function (id) {
    if (typeof id !== 'string') return

    const contato = await ContatoModule.findOneAndDelete({_id:id});
    return contato
}


module.exports = Contato 