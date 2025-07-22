const User = require('../models/UserModel');
const Role = require('../models/RoleModel');
const { validarCPF } = require('../utils/validaCpf');
const { validarTelefone } = require('../utils/validaTelefone');
const Account = require('../models/AccountModel');

exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
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

        res.render('accounts', {
            users,
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
                return res.status(400).json({ success: false})
                return
            })
            return
        }

        req.flash("success", "Conta criada com sucesso!")
        req.session.save(function () {
        })
        return res.status(200).json({ success: true})
    } catch (e) {
        console.log(e);
        res.render('404')
        return res.status(500).json({ success: false });

    }
}