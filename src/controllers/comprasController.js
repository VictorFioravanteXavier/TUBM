const Account = require("../models/AccountModel");
const Venda = require("../models/VendaModel");
const isValidDate = require("../utils/isValidDate");

exports.index = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    let compras, totalPages, currentPage;
    const account = await Account.findAccountsByUserId(req.session.user._id)

    try {
        if (req.query.status || req.query.searchCode || req.query.InitialDate || req.query.FinalDate) {
            let status;
            let search_code;
            const initialDate = new Date(req.query.InitialDate);
            const finalDate = new Date(req.query.FinalDate);

            let date = {}

            if (req.query.status === "pago") {
                status = true;
            } else if (req.query.status === "pendente") {
                status = false;
            }

            if (req.query.searchCode && typeof req.query.searchCode === "string" && req.query.searchCode.trim() !== "") {
                search_code = req.query.searchCode
            }

            if (isValidDate(initialDate) || isValidDate(finalDate)) {
                if (isValidDate(initialDate)) {
                    date.$gte = new Date(initialDate);
                }
                if (isValidDate(finalDate)) {
                    const end = new Date(finalDate);
                    end.setDate(end.getDate() + 2);
                    date.$lte = end;
                }
            }

            const result = await Venda.findComprasAllFiltred(account._id, page, status, search_code, date);

            result.vendas.forEach(venda => {
                venda.total_itens = 0;
                for (const item of venda.itens) {
                    venda.total_itens += item.quantidade;
                }
            });

            compras = result.vendas;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        } else {
            const result = await Venda.findAllCompras(account._id, page);

            result.vendas.forEach(venda => {
                venda.total_itens = 0;
                for (const item of venda.itens) {
                    venda.total_itens += item.quantidade;
                }
            });

            compras = result.vendas;
            totalPages = result.totalPages;
            currentPage = result.currentPage;
        }

        res.render('compras', {
            compras,
            totalPages,
            currentPage
        });
    } catch (error) {
        console.error(error);
        res.render('compras', {
            compras: [],
            totalPages: 1,
            currentPage: 1,
            error: error.message
        });
    }
}