const Account = require("../models/AccountModel");
const Venda = require("../models/VendaModel");
const agruparVendasPorConta = require("../utils/agruparVendasPorConta");
const htmlEmail = require("../utils/htmlEmail");
const sendEmailUtils = require("../utils/sendEmail").default;
const transformFilters = require("../utils/transformFilters");
const isValidDate = require("../utils/isValidDate");
const generatePDF = require("../utils/generatePDF");

exports.index = async (req, res) => {
    const accounts = await Account.findAllNoPage()

    res.render('shippingReporting', { accounts })
}

exports.getDataFiltred = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const filtros = req.body;

        const valid_filters = transformFilters(filtros)

        if (!valid_filters.success) {
            console.error('Filtro inválido');
            return res.status(400).json({
                success: false,
                error: 'Filtro inválido'
            });
        }

        const result = await Venda.findAllFiltredShippingReporting(valid_filters.data, page);
        return res.json(result);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar relatórios filtrados" });
    }
}

exports.sendEmail = async (req, res) => {
    try {
        const filtros = req.body.filter;
        const dueDate = req.body.dueDate;
        const penaltyRaw = req.body.penalty;
        const typePenalty = req.body.typePenalty;

        const penalty = penaltyRaw === undefined || penaltyRaw === ''
            ? 0
            : Number(penaltyRaw);


        if (!isValidDate(dueDate)) {
            console.error('Data de vencimento inválida');
            return res.status(400).json({
                success: false,
                error: 'Data de vencimento inválida'
            });
        }

        const validDate = new Date(dueDate)

        if (isNaN(penalty) && Number(penalty) > 0) {
            console.error('Multa inválida, não é um número ou é menor que 0');
            return res.status(400).json({
                success: false,
                error: 'Data de vencimento inválida, não é um número ou é menor que 0'
            });
        }

        if (!(typePenalty === "true" || typePenalty === "false")) {
            console.error('Erro no tipo de multa se é em R$ ou %.');
            return res.status(400).json({
                success: false,
                error: 'Erro no tipo de multa se é em R$ ou %.'
            });
        }

        const validTypePenalty = typePenalty === "true"

        const valid_filters = transformFilters(filtros)

        if (!valid_filters.success) {
            console.error('Filtro inválido');
            return res.status(400).json({
                success: false,
                error: 'Filtro inválido'
            });
        }

        const vendas = await Venda.findAllFiltredShippingReportingNoPage(valid_filters.data);

        const vendasAgrupadas = agruparVendasPorConta(vendas);

        for (const accountId of Object.keys(vendasAgrupadas)) {
            const vendasDaConta = vendasAgrupadas[accountId];

            let valor_total = 0;
            vendasDaConta.forEach((element) => {
                valor_total += element.valor_total / 100;
            });

            // percorre usuários da conta e envia e-mail
            for (const usuario of vendasDaConta[0].account_id.users) {
                const html_send = htmlEmail({ name: usuario.name, valor_total, date: validDate, penalty: penalty, type_penalty: validTypePenalty });

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

exports.getTotalValueAccount = async (req, res) => {
    try {
        const filtros = req.body.filter;

        if (!filtros || Object.keys(filtros).length === 0) {
            console.error('Filtro inválido');
            return res.status(400).json({
                success: false,
                error: 'Filtro inválido'
            });
        }

        const valid_filters = transformFilters(filtros)

        if (!valid_filters.success) {
            console.error('Filtro inválido');
            return res.status(400).json({
                success: false,
                error: 'Filtro inválido'
            });
        }

        const vendas = await Venda.findAllFiltredShippingReportingNoPage(valid_filters.data);

        const vendasAgrupadas = agruparVendasPorConta(vendas);
        let valor_total = 0;
        let account;

        for (const accountId of Object.keys(vendasAgrupadas)) {
            const vendasDaConta = vendasAgrupadas[accountId];

            vendasDaConta.forEach((element) => {
                valor_total += element.valor_total / 100;
            });
        }

        const data = {
            account: vendas[0].account_id,
            total_value: valor_total
        }

        return res.status(200).json({ success: false, data: data });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, error: err.message });
    }
}

exports.markAsPaid = async (req, res) => {
    try {
        const filter = req.body.filter

        if (!filter || typeof filter !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Filtro inválido'
            });
        }

        const valid_filters = transformFilters(filter)

        if (!valid_filters.success) {
            console.error('Filtro inválido');
            return res.status(400).json({
                success: false,
                error: 'Filtro inválido'
            });
        }

        const result = await Venda.markAsPaid(valid_filters.data)

        if (!result.success) {
            console.error(result.error)
            return res.status(500).json({ success: false, error: result.error });
        }

        if (result.matched < 1 || result.modified < 1) {
            console.error("Nenhuma venda modificada ou pendente");
            return res.status(404).json({ success: false, error: "Nenhuma venda modificada ou pendente" });
        }


        return res.status(200).json({
            success: true,
            data: {
                matched: result.matched,
                modified: result.modified,
            }
        });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, error: err.message });
    }
}

exports.markAsPending = async (req, res) => {
    try {
        const filter = req.body.filter

        if (!filter || typeof filter !== 'object') {
            return res.status(400).json({
                success: false,
                error: 'Filtro inválido'
            });
        }

        const valid_filters = transformFilters(filter)

        if (!valid_filters.success) {
            console.error('Filtro inválido');
            return res.status(400).json({
                success: false,
                error: 'Filtro inválido'
            });
        }

        const result = await Venda.markAsPending(valid_filters.data)

        if (!result.success) {
            console.error(result.error)
            return res.status(500).json({ success: false, error: result.error });
        }

        if (result.matched < 1 || result.modified < 1) {
            console.error("Nenhuma venda modificada ou paga");
            return res.status(404).json({ success: false, error: "Nenhuma venda modificada ou paga" });
        }


        return res.status(200).json({
            success: true,
            data: {
                matched: result.matched,
                modified: result.modified,
            }
        });
    } catch (err) {
        console.error(err)
        return res.status(500).json({ success: false, error: err.message });
    }
}

exports.downloadPdf = async (req, res) => {
    try {
        const pdf = await generatePDF();

        console.log('PDF type:', Buffer.isBuffer(pdf));
        console.log('PDF size:', pdf?.length);

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=relatorio.pdf',
        });

        return res.send(pdf);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao gerar PDF' });
    }
}