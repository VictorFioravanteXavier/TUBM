const User = require('../models/UserModel');
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
        const { name, users, deletedUsers } = req.body;

        if (!name || typeof name !== 'string') {
            return res.status(400).json({ success: false, message: "Nome da conta inválido." });
        }

        if (!Array.isArray(users) || !Array.isArray(deletedUsers)) {
            return res.status(400).json({ success: false, message: "Lista de usuários inválida." });
        }

        // Verificação dos usuários ativos
        for (let user of users) {
            if (!user._id || !mongoose.isValidObjectId(user._id)) {
                return res.status(400).json({ success: false, message: "ID de usuário inválido." });
            }

            const userExists = await User.findOne({ id: user._id });
            if (!userExists) {
                const errorMsg = `Usuário não encontrado.`;
                req.flash("errors", [errorMsg]);
                return req.session.save(() => {
                    res.status(400).json({ success: false, errors: [errorMsg] });
                });
            }

            if (userExists.verified) {
                const pertence = await Account.thisAccount(req.params.id, user._id);
                
                if (!pertence) {
                    const errorMsg = `Usuário "${userExists.name}" pertence tem outra conta cadastrada.`;
                    req.flash("errors", [errorMsg]);
                    return req.session.save(() => {
                        res.status(400).json({ success: false, errors: [errorMsg] });
                    });
                }
            }
        }

        // Verificação dos usuários a serem removidos
        for (let userId of deletedUsers) {
            if (!mongoose.isValidObjectId(userId)) {
                const errorMsg = `ID de usuário inválido (deletados).`;
                req.flash("errors", [errorMsg]);
                return req.session.save(() => {
                    res.status(400).json({ success: false, errors: [errorMsg] });
                });
            }

            const userExists = await User.findOne({ id: userId });
            if (!userExists) {
                const errorMsg = `Usuário deletado com ID ${userId} não encontrado.`;
                req.flash("errors", [errorMsg]);
                return req.session.save(() => {
                    res.status(400).json({ success: false, errors: [errorMsg] });
                });
            }
        }

        // Edição da conta
        const account = new Account(req.body);
        await account.edit(req.params.id, {
            name,
            users,
            deletedUsers
        });

        if (account.errors.length > 0) {
            req.flash("errors", account.errors);
            return req.session.save(() => {
                res.status(400).json({ success: false, errors: account.errors });
            });
        }

        req.flash("success", "Conta editada com sucesso!");
        return req.session.save(() => {
            res.status(200).json({ success: true });
        });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Erro interno no servidor." });
    }
};



exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID da conta não fornecido." });
        }

        await Account.delete(id);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Erro ao deletar conta:", err);
        return res.status(500).json({ error: "Erro ao deletar conta" });
    }
}

exports.deactivate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID da conta não fornecido." });
        }

        await Account.deactivate(id);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Erro ao desativar a conta:", err);
        return res.status(500).json({ error: "Erro ao desativar a conta" });
    }
}

exports.activate = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ error: "ID da conta não fornecido." });
        }

        await Account.activate(id);

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Erro ao desativar a conta:", err);
        return res.status(500).json({ error: "Erro ao desativar a conta" });
    }
}