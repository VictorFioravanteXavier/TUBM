const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')
const { validarCPF } = require('../utils/validaCpf');
const { validarTelefone } = require('../utils/validaTelefone');
const validPassword = require('../utils/validPassword');
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
    verified: { type: Boolean, default: false },
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

        const user = await UserModule.findOne({ email: this.body.email });
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
        try {
            this.valida();
            if (this.errors.length > 0) return;

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
        catch (e) {
            if (e.code === 11000) {
                if (e.keyValue?.cpf) {
                    this.errors.push("O CPF fornecido já está em uso.");
                } else if (e.keyValue?.email) {
                    this.errors.push("O e-mail fornecido já está em uso.");
                } else {
                    this.errors.push("Já existe um cadastro com os dados fornecidos.");
                }
                return;
            }

            console.error(e);
            this.errors.push("Ocorreu um erro interno ao tentar cadastrar o usuário.");
        }
    }

    static async findOne(obj) {
        const query = {};

        if (obj.id) {
            if (!mongoose.Types.ObjectId.isValid(obj.id)) return null;
            query._id = obj.id;
        }

        if (Object.keys(query).length === 0) return null;


        const user = await UserModule.findOne(query);
        return user;
    }

    static async findAll(page = 1) {
        const limit = 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            UserModule.find({ delete: false })
                .sort({ name: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: 'role', select: 'name' }),

            UserModule.countDocuments({ delete: false })
        ]);

        const mappedUsers = users.map(user => {
            const obj = user.toObject();
            obj.role_name = obj.role?.name || null;
            delete obj.role;
            return obj;
        });

        return {
            users: mappedUsers,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
    }

    static async findAllFiltred(page = 1, verified, role, searchName) {
        const limit = 10;
        const skip = (page - 1) * limit;
        const errors = [];

        let verifiedBool;
        if (typeof verified === 'boolean') {
            verifiedBool = verified;
        } else if (verified === 'true') {
            verifiedBool = true;
        } else if (verified === 'false') {
            verifiedBool = false;
        } else if (verified === undefined || verified === null) {
            verifiedBool = undefined;
        } else {
            verifiedBool = null;
        }

        if (verified !== undefined && verifiedBool === null) {
            errors.push("Erro ao filtrar o status");
        }

        if (role && !mongoose.Types.ObjectId.isValid(role)) {
            errors.push("Role inválida");
        }

        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const filters = { delete: false };

        if (verifiedBool !== undefined) {
            filters.verified = verifiedBool;
        }

        if (role) {
            filters.role = role;
        }

        if (searchName && typeof searchName === 'string' && searchName.trim() !== '') {
            filters.name = { $regex: new RegExp(searchName, 'i') }; // busca parcial e case-insensitive
        }

        const [users, total] = await Promise.all([
            UserModule.find(filters)
                .sort({ name: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: 'role', select: 'name' }),
            UserModule.countDocuments(filters)
        ]);

        const mappedUsers = users.map(user => {
            const obj = user.toObject();
            obj.role_name = obj.role?.name || null;
            delete obj.role;
            return obj;
        });

        return {
            users: mappedUsers,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        };
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

        if (!validPassword(this.body.password)) {
            this.errors.push("A senha não é válida para fazer cadastro!");
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