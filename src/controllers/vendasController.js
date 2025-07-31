const Account = require('../models/AccountModel');

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