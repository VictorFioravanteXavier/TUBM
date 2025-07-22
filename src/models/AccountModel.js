const mongoose = require('mongoose');
const gerarNumeroConta = require("../utils/accountNumber")
const User = require("./UserModel")

const AccountSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    active: { type: Boolean, default: true },
    delete: { type: Boolean, default: false }
});


const AccountModule = mongoose.model('Account', AccountSchema);

class Account {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.account = null;
    }

    async register() {
        try {
            let tentativas = 0;
            const maxTentativas = 5;

            while (tentativas < maxTentativas) {
                this.body.number = gerarNumeroConta();
                this.valida();
                if (this.errors.length > 0) return;

                try {
                    this.account = await AccountModule.create({
                        number: this.body.number,
                        name: this.body.name,
                        users: this.body.users
                    });

                    this.body.users.forEach(user => {
                        User.activeAccont(user);
                    });
                    
                    return;
                } catch (e) {
                    if (e.code === 11000 && e.keyValue?.number) {
                        tentativas++;
                        continue;
                    } else if (e.code === 11000 && e.keyValue?.name) {
                        this.errors.push("O nome de conta fornecido já está em uso.");
                        return;
                    } else {
                        throw e;
                    }
                }
            }

            this.errors.push("Não foi possível gerar um número de conta único. Tente novamente mais tarde.");
        } catch (err) {
            console.error("Erro ao registrar conta:", err);
            this.errors.push("Erro inesperado ao registrar conta.");
        }
    }


    async valida() {
        if (!this.body.number) {
            this.errors.push("Erro ao gerar o número da conta");
        }

        if (!this.body.name || typeof this.body.name !== "string") {
            this.errors.push("Nome da conta é obrigatório");
        }

        if (!Array.isArray(this.body.users)) {
            this.body.users = [this.body.users];
        } else {
            for (const user_id of this.body.users) {
                if (!mongoose.isValidObjectId(user_id)) {
                    this.errors.push(`ID de usuário inválido: ${user_id}`);
                    continue;
                }

                const alreadyLinked = await User.findOne({ users: user_id });
                if (alreadyLinked) {
                    this.errors.push(`Tem um usuário que já está em uma conta.`);
                }
            }
        }
    }

}

module.exports = Account