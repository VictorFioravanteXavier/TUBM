const User = require('../models/UserModel');
const Role = require('../models/RoleModel');
const { validarCPF } = require('../utils/validaCpf');
const { validarTelefone } = require('../utils/validaTelefone');
const Account = require('../models/AccountModel');
const { default: mongoose } = require('mongoose');

exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let accounts, totalPages, currentPage;


    try {
        if (req.query.status || req.query.searchName || req.query.searchNumber) {
            let status;
            let search_name;
            let search_number;

            if (req.query.status === "ativo") {
                status = true;
            } else if (req.query.status === "inativo") {
                status = false;
            }

            if (req.query.searchName && typeof req.query.searchName === "string" && req.query.searchName.trim() !== "") {
                search_name = req.query.searchName
            }

            if (req.query.searchNumber && typeof req.query.searchNumber === "string" && req.query.searchNumber.trim() !== "") {
                search_number = req.query.searchNumber;
            }

            const result = await Account.findAllFiltred(page, status, search_name, search_number);
            accounts = result.accounts;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        } else {
            const result = await Account.findAll(page);
            accounts = result.accounts;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        }

        res.render('accounts', {
            accounts,
            totalPages,
            currentPage
        });
    } catch (error) {
        console.error(error);
        res.render('accounts', {
            users: [],
            totalPages: 1,
            currentPage: 1,
            error: error.message
        });
    }
};


exports.register = async (req, res) => {
    try {
        const account = new Account(req.body)
        await account.register()

        if (account.errors.length > 0) {
            req.flash("errors", account.errors)
            req.session.save(function () {
                return res.status(400).json({ success: false })
            })
            return
        }

        req.flash("success", "Conta criada com sucesso!")
        req.session.save(function () {
        })
        return res.status(200).json({ success: true })
    } catch (e) {
        console.log(e);
        res.render('404')
        return res.status(500).json({ success: false });

    }
}

exports.edit = async (req, res) => {
    try {
        console.log(req.body);
        
        const { name, users, deletedUsers } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ success: false, message: "Nome da conta inválido." });
        }

        if (!Array.isArray(users) || !Array.isArray(deletedUsers)) {
            return res.status(400).json({ success: false, message: "Lista de usuários inválida." });
        }

        // Validação dos usuários ativos
        for (let user of users) {
            if (!user._id || !mongoose.isValidObjectId(user._id)) {
                return res.status(400).json({ success: false, message: "ID de usuário inválido (ativos)." });
            }

            const userExists = await User.findOne({ id: user._id });
            if (!userExists) {
                return res.status(404).json({ success: false, message: `Usuário com ID ${user._id} não encontrado.` });
            }
        }

        // Validação dos usuários deletados (supõe-se que deletedUsers é array de strings)
        for (let userId of deletedUsers) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).json({ success: false, message: "ID de usuário inválido (deletados)." });
            }

            const userExists = await User.findOne({ id: userId });
            if (!userExists) {
                return res.status(404).json({ success: false, message: `Usuário deletado com ID ${userId} não encontrado.` });
            }
        }

        const account = new Account(req.body);
        await account.edit(req.params.id, {
            name,
            users,
            deletedUsers
        });

        if (account.errors.length > 0) {
            req.flash("errors", account.errors);
            req.session.save(() => {
                return res.status(400).json({ success: false });
            });
            return;
        }

        req.flash("success", "Conta editada com sucesso!");
        req.session.save(() => { });
        return res.status(200).json({ success: true });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
};

