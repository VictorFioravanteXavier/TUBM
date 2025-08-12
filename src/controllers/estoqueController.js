const Produto = require("../models/ProdutoModel");

exports.index = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    let produtos, totalPages, currentPage;

    try {
        if ( req.query.searchName || req.query.searchNumber) {
            let search_name;
            let search_number;

            if (req.query.searchName && typeof req.query.searchName === "string" && req.query.searchName.trim() !== "") {
                search_name = req.query.searchName
            }

            if (req.query.searchNumber && typeof req.query.searchNumber === "string" && req.query.searchNumber.trim() !== "") {
                search_number = req.query.searchNumber;
            }

            const result = await Produto.findAllFiltred(page, search_name, search_number);

            produtos = result.produtos;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        } else {
            const result = await Produto.findAll(page);

            produtos = result.produtos;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        }

        res.render('estoque', {
            produtos,
            totalPages,
            currentPage
        });
    } catch (error) {
        console.error(error);
        res.render('estoque', {
            users: [],
            totalPages: 1,
            currentPage: 1,
            error: error.message
        });
    }
};