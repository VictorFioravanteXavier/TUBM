const User = require('../models/UserModel');
const Role = require('../models/RoleModel');
const { validarCPF } = require('../utils/validaCpf');
const { validarTelefone } = require('../utils/validaTelefone');

exports.index = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    let users, totalPages, currentPage;

    try {
        if (req.query.status || req.query.cargo || req.query.search) {
            let status;
            let role;
            let search;

            if (req.query.status === "ativo") {
                status = true;
            } else if (req.query.status === "sem-conta") {
                status = false;
            }

            if (["financeiro", "venda", "user"].includes(req.query.cargo)) {
                role = await Role.findOne({ name: req.query.cargo });
            }

            if (req.query.search && typeof req.query.search === "string" && req.query.search.trim() !== "") {
                search = req.query.search
            }

            const result = await User.findAllFiltred(page, status, role?._id, search);
            users = result.users;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        } else {
            const result = await User.findAll(page);
            users = result.users;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        }

        res.render('users', {
            users,
            totalPages,
            currentPage
        });
    } catch (error) {
        console.error(error);
        res.render('users', {
            users: [],
            totalPages: 1,
            currentPage: 1,
            error: error.message
        });
    }
};

exports.editUser = async (req, res) => {
    try {
        const { id, name, cpf, tel, role } = req.body;

        // Validação do nome
        if (typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ error: "Nome inválido" });
        }

        // Validação do CPF
        if (!validarCPF(cpf)) {
            return res.status(400).json({ error: "CPF inválido" });
        }

        // Validação do telefone
        if (!validarTelefone(tel)) {
            return res.status(400).json({ error: "Telefone inválido" });
        }

        // Verifica se o cargo existe no banco de dados
        const roleExistente = await Role.findOne({ name: role });
        if (!roleExistente) {
            return res.status(400).json({ error: "Role inválido" });
        }

        // Aqui você faria a atualização no banco de dados, por exemplo:
        // await User.findByIdAndUpdate(id, { name, cpf, telefone: tel, role });

        await User.editUser({ id: id, name: name, cpf: cpf, tel: tel, role: roleExistente._id })

        return res.status(200).json({ success: true });

    } catch (err) {
        console.error("Erro ao editar usuário:", err);
        return res.status(500).json({ error: "Erro ao editar usuário" });
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID do usuário não fornecido." });
        }

        await User.delete(id); // Certifique-se de que essa função existe no seu model

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Erro ao deletar usuário:", err);
        return res.status(500).json({ error: "Erro ao deletar usuário" });
    }
};

exports.getAll = async (req, res) => {
    try {
        const users = await User.findAll(); // ou User.find()
        return res.json({ success: true, users }); // <-- ESSA LINHA É ESSENCIAL
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, error: 'Erro ao buscar usuários' });
    }
};
