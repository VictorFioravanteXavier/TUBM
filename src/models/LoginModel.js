const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});


const LoginModule = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;

        const user = await LoginModule.findOne({ username: this.body.username });
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

        const user = await LoginModule.findOne({ username: this.body.username });
        if (user) {
            this.errors.push("Usuário já existe.");
            return;
        }

        const salt = bcryptjs.genSaltSync();
        this.body.password = bcryptjs.hashSync(this.body.password, salt);

        this.user = await LoginModule.create({
            username: this.body.username,
            password: this.body.password
        });
    }

    valida() {
        this.cleanUp();

        if (!this.body.username || this.body.username.length < 3 || this.body.username.length > 50) {
            this.errors.push("Nome de usuário inválido.");
        }

        if (!this.body.password || this.body.password.length < 3 || this.body.password.length > 50) {
            this.errors.push("A senha precisa ter entre 3 a 50 caracteres.");
        }
    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            username: this.body.username,
            password: this.body.password
        };
    }
}



module.exports = Login // assim que se faz isso