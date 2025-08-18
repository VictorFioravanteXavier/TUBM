const Account = require("../models/AccountModel");
const Venda = require("../models/VendaModel");
const agruparVendasPorConta = require("../utils/agruparVendasPorConta");
const htmlEmail = require("../utils/htmlEmail");
const sendEmailUtils = require("../utils/sendEmail").default;

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

exports.sendEmail = async (req, res) => {
    try {
        const filtros = req.body;
        const vendas = await Venda.findAllFiltredShippingReportingNoPage(filtros);

        const vendasAgrupadas = agruparVendasPorConta(vendas);

        for (const accountId of Object.keys(vendasAgrupadas)) {
            const vendasDaConta = vendasAgrupadas[accountId];

            let valor_total = 0;
            vendasDaConta.forEach((element) => {
                valor_total += element.valor_total / 100;
            });

            // aplica multa se existir
            if (req.body.multa) {
                valor_total += (valor_total * req.body.multa) / 100;
            }

            // percorre usuários da conta e envia e-mail
            for (const usuario of vendasDaConta[0].account_id.users) {
                const html_send = htmlEmail({ name: usuario.name, valor_total });

                await sendEmailUtils(
                    usuario.email,
                    "Conta Cantina do Zé",
                    "AAA",
                    html_send
                );
            }
        }

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao enviar e-mails" });
    }
};
