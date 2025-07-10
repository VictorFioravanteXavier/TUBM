const User = require('../models/UserModel');
const Role = require('../models/RoleModel');

exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    let users, totalPages, currentPage;

    try {
        if (req.query.status || req.query.cargo) {
            let status;
            let role;

            if (req.query.status === "ativo") {
                status = true;
            } else if (req.query.status === "sem-conta") {
                status = false;
            }

            if (["financeiro", "venda", "user"].includes(req.query.cargo)) {
                role = await Role.findOne({ name: req.query.cargo });
            }

            const result = await User.findAllFiltred(page, status, role?._id);
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
