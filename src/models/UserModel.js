const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')
const { validarCPF } = require('../utils/validaCpf');
const { validarTelefone } = require('../utils/validaTelefone');
const { default: isEmail } = require('validator/lib/isEmail');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cpf: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tel: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    create_date: { type: Date, default: Date.now() },
    update_date: { type: Date, default: Date.now() },
    role: { type: mongoose.Schema.Types.ObjectId, ref: "Role", default: new mongoose.Types.ObjectId("6841e5f407b42d061c4b7b3e") },
    verified: {type: Boolean, default: false},
    delete: { type: Boolean, default: false },
})

const UserModule = mongoose.model('User', UserSchema);

class User {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        if (this.errors.length > 0) return;

        const user = await UserModule.findOne({ name: this.body.name });
        if (!user) {
            this.errors.push('Usuário não existe.');
            return;
        }

        const senhaValida = bcryptjs.compareSync(this.body.password, user.password);
        if (!senhaValida) {
            this.errors.push('Senha inválida.');
            return;
        }

        this.user = user;
    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        const user = await UserModule.findOne({ cpf: this.body.cpf });
        if (user) {
            this.errors.push("Usuário já existe.");
            return;
        }

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.user = await UserModule.create({
            name: this.body.name,
            cpf: this.body.cpf,
            password: this.body.password,
            tel: this.body.tel,
            email: this.body.email
        });

    }

    static async delete(id) {
        if (typeof id !== 'string') return;

        const conta = await UserModule.findByIdAndUpdate(
            id,
            { delete: true },
            { new: true }
        );
        return conta;
    }

    static async restaurar(id) {
        if (typeof id !== 'string') return;

        const conta = await UserModule.findByIdAndUpdate(
            id,
            { delete: false },
            { new: true }
        );
        return conta;
    }

    valida() {
        if (!this.body.name) {
            this.errors.push("Nome é obrigatório.");
        }

        if (!this.body.password || this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push("A senha precisa ter entre 3 a 50 caracteres.");
        }

        if (!this.body.cpf || !validarCPF(this.body.cpf)) {
            this.errors.push('Cpf é obrigatório e deve ser valido');
        }

        if (!this.body.tel || !validarTelefone(this.body.tel)) {
            this.errors.push('Telefone é obrigatório e deve ser um número válido');
        }

        if (!this.body.email || !isEmail(this.body.email)) {
            this.errors.push('Email é obrigatório e deve um email válido');
        }
    }
}

module.exports = User