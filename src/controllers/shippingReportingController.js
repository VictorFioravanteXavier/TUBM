const Account = require("../models/AccountModel");
const Venda = require("../models/VendaModel");

exports.index = async (req, res) => {
    const accounts = await Account.findAllNoPage()

    res.render('shippingReporting', { accounts })
}

exports.getDataFiltred = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const filtros = req.body; // 🚀 agora vem no body

        const result = await Venda.findAllFiltredShippingReporting(filtros, page);
        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar relatórios filtrados" });
    }
}
