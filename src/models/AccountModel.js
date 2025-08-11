const mongoose = require('mongoose');
const gerarNumeroConta = require("../utils/accountNumber")
const User = require("./UserModel");
const { user } = require('../controllers/choicesScreenController');

const AccountSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    active: { type: Boolean, default: true },
    delete: { type: Boolean, default: false },
    create_date: { type: Date, default: Date.now() },
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
                        User.activeAccount(user);
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

    static async findAllNoPage() {
        const accounts = await AccountModule.find({ delete: false, active: true })
            .sort({ name: -1 })

        return accounts;
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

    static async findById(id) {
        const query = {};

        if (obj.id) {
            if (!mongoose.Types.ObjectId.isValid(obj.id)) return null;
            query._id = obj.id;
        }

        if (Object.keys(query).length === 0) return null;


        const account = await AccountModule.findOne(query);
        return account;
    }

    static async findAccountsByUserId(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) return [];

        const account = await AccountModule.find({
            users: new mongoose.Types.ObjectId(userId),
            delete: false
        })
            .populate('users'); // agora populando o campo "users" corretamente

        return account[0];
    }


    static async findIdsByNameAndNumber(searchName, searchNumber) {
        const filter = {};

        if (searchName && typeof searchName === 'string' && searchName.trim() !== '') {
            filter.name = { $regex: new RegExp(searchName, 'i') };
        }

        if (searchNumber && typeof searchNumber === 'string' && searchNumber.trim() !== '') {
            filter.number = { $regex: new RegExp(searchNumber, 'i') };
        }

        if (Object.keys(filter).length === 0) {
            // Sem filtro, retorna array vazio (ou todos? dependendo da necessidade)
            return [];
        }

        const accounts = await AccountModule.find(filter).select('_id').lean();

        return accounts.map(acc => acc._id);
    }


    async edit(id, data) {
        try {
            this.account = await AccountModule.findByIdAndUpdate(
                {
                    _id: id
                },
                {
                    name: data.name,
                    users: data.users,
                    update_date: Date.now()  // <-- execute a função para passar o valor
                });

            data.users.forEach(user => {
                User.activeAccount(user._id);
            });

            data.deletedUsers.forEach(user => {
                User.desactiveAccount(user);
            });

            return;
        } catch (e) {
            if (e.code === 11000 && e.keyValue?.number) {
            } else if (e.code === 11000 && e.keyValue?.name) {
                this.errors.push("O nome de conta fornecido já está em uso.");
                return;
            } else {
                throw e;
            }
        }
    }

    static async delete(id) {
        if (!mongoose.isValidObjectId(id)) {
            this.errors.push("Usuário inválido.")
            return
        }

        try {
            await AccountModule.findByIdAndUpdate(
                { _id: id },
                {
                    delete: true,
                    update_date: Date.now(),
                },
                { new: true }
            )

            return { success: true }
        } catch (e) {
            this.errors.push("Ocorreu um erro inesperado.")
            console.log(e);
            return { success: false }
        }
    }

    static async restaurar(id) {
        if (!mongoose.isValidObjectId(id)) {
            this.errors.push("Usuário inválido.")
            return
        }

        try {
            await AccountModule.findByIdAndUpdate(
                { _id: id },
                {
                    delete: false,
                    update_date: Date.now(),
                },
                { new: true }
            )

            return { success: true }
        } catch (e) {
            this.errors.push("Ocorreu um erro inesperado.")
            console.log(e);
            return { success: false }
        }
    }

    static async deactivate(id) {
        if (!mongoose.isValidObjectId(id)) {
            this.errors.push("Usuário inválido.")
            return
        }

        try {
            await AccountModule.findByIdAndUpdate(
                { _id: id },
                {
                    active: false,
                    update_date: Date.now(),
                },
                { new: true }
            )

            return { success: true }
        } catch (e) {
            this.errors.push("Ocorreu um erro inesperado.")
            console.log(e);
            return { success: false }
        }
    }

    static async activate(id) {
        if (!mongoose.isValidObjectId(id)) {
            this.errors.push("Usuário inválido.")
            return
        }

        try {
            await AccountModule.findByIdAndUpdate(
                { _id: id },
                {
                    active: true,
                    update_date: Date.now(),
                },
                { new: true }
            )

            return { success: true }
        } catch (e) {
            this.errors.push("Ocorreu um erro inesperado.")
            console.log(e);
            return { success: false }
        }
    }

    static async thisAccount(id_account, id_user) {
        try {
            const conta = await AccountModule.findById(id_account);
            if (!conta) return false;

            // Verifica se algum usuário da conta tem o mesmo ID
            const pertence = conta.users.some(user => user.toString() === id_user.toString());
            return pertence;
        } catch (e) {
            console.error("Erro em thisAccount:", e);
            return false;
        }
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