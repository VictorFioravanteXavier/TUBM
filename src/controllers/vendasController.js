const Account = require('../models/AccountModel');
const Venda = require('../models/VendaModel');

exports.index = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    let vendas, totalPages, currentPage;
    
    try {
        if (req.query.status || req.query.searchName || req.query.searchNumber) {
            let status;
            let search_name;
            let search_number;

            if (req.query.status === "pago") {
                status = true;
            } else if (req.query.status === "pendente") {
                status = false;
            }

            if (req.query.searchName && typeof req.query.searchName === "string" && req.query.searchName.trim() !== "") {
                search_name = req.query.searchName
            }

            if (req.query.searchNumber && typeof req.query.searchNumber === "string" && req.query.searchNumber.trim() !== "") {
                search_number = req.query.searchNumber;
            }

            const result = await Venda.findAllFiltred(page, status, search_name, search_number);
            
            vendas = result.vendas;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        } else {
            const result = await Venda.findAll(page);
            
            vendas = result.vendas;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        }

        res.render('vendas', {
            vendas,
            totalPages,
            currentPage
        });
    } catch (error) {
        console.error(error);
        res.render('vendas', {
            users: [],
            totalPages: 1,
            currentPage: 1,
            error: error.message
        });
    }
};