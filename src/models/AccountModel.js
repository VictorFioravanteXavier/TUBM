const mongoose = require('mongoose');
const gerarNumeroConta = require("../utils/accountNumber")
const User = require("./UserModel")

const AccountSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    active: { type: Boolean, default: true },
    delete: { type: Boolean, default: false },
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now() },
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
                await this.valida();
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

    static async findAll(page = 1) {
        const limit = 10;
        const skip = (page - 1) * limit;

        const [accounts, total] = await Promise.all([
            AccountModule.find({ delete: false })
                .sort({ name: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: 'users' }), // <- Aqui popula os usuários completos

            AccountModule.countDocuments({ delete: false })
        ]);

        return {
            accounts, // Já inclui os dados dos usuários no campo `users`
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    static async findAllFiltred(page = 1, active, searchName, searchNumber) {
        const limit = 10;
        const skip = (page - 1) * limit;
        const errors = [];

        let activeBool;
        if (typeof active === 'boolean') {
            activeBool = active;
        } else if (active === 'true') {
            activeBool = true;
        } else if (active === 'false') {
            activeBool = false;
        } else if (active === undefined || active === null) {
            activeBool = undefined;
        } else {
            activeBool = null;
        }

        if (active !== undefined && activeBool === null) {
            errors.push("Erro ao filtrar o status");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const filters = { delete: false };

        if (activeBool !== undefined) {
            filters.active = activeBool;
        }

        if (searchName && typeof searchName === 'string' && searchName.trim() !== '') {
            filters.name = { $regex: new RegExp(searchName, 'i') }; // busca parcial e case-insensitive
        }

        if (searchNumber && typeof searchNumber === 'string' && searchNumber.trim() !== '') {
            filters.number = { $regex: new RegExp(searchNumber, 'i') }; // busca parcial e case-insensitive
        }

        const [accounts, total] = await Promise.all([
            AccountModule.find(filters)
                .sort({ name: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: 'users' }), // Corrigido para 'users' e não 'role'
            AccountModule.countDocuments(filters)
        ]);

        return {
            accounts,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }


    async valida() {
        if (!this.body.number) {
            this.errors.push("Erro ao gerar o número da conta.");
        }

        if (!this.body.name || typeof this.body.name !== "string") {
            this.errors.push("Nome da conta é obrigatório.");
        }

        if (!Array.isArray(this.body.users)) {
            this.body.users = [this.body.users];
        }

        for (const user_id of this.body.users) {
            if (!mongoose.isValidObjectId(user_id)) {
                this.errors.push(`ID de usuário inválido: ${user_id}`);
                continue;
            }

            // Verifica se o usuário já está vinculado a uma conta ativa
            const accountWithUser = await AccountModule.findOne({
                users: user_id,
                delete: false,
                active: true,
            });

            if (accountWithUser) {
                this.errors.push(`Um usuário já está vinculado a uma conta ativa. Numero da conta ativa: ${accountWithUser.number}`);
            }
        }
    }


}

module.exports = Account