const Venda = require("../models/VendaModel");

exports.index = async (req, res) => {
    const page = parseInt(req.params.page) || 1;
    let compras, totalPages, currentPage;

    try {
        if (req.query.status || req.query.searchCode ) {
            let status;
            let search_code;

            if (req.query.status === "pago") {
                status = true;
            } else if (req.query.status === "pendente") {
                status = false;
            }

            if (req.query.searchCode && typeof req.query.searchCode === "string" && req.query.searchCode.trim() !== "") {
                search_code = req.query.searchCode
            }

            const result = await Venda.findComprasAllFiltred(page, status, search_code);

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
            const result = await Venda.findAll(page);

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