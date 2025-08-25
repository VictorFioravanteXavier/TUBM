const Account = require("../models/AccountModel");
const Venda = require("../models/VendaModel");
const Session = require("../models/ClientWhatsappModel");
const agruparVendasPorConta = require("../utils/agruparVendasPorConta");
const htmlEmail = require("../utils/htmlEmail");
const sendEmailUtils = require("../utils/sendEmail").default;
const QRCode = require("qrcode");

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

let clientInstance = null;

exports.sendWhatsapp = async (req, res) => {
    try {
        if (!clientInstance) {
            clientInstance = await Session.createClient();
        }

        // Se ainda tem QR pendente, retorna para frontend
        if (Session.qrTemp) {
            const qrImage = await QRCode.toDataURL(Session.qrTemp);
            // envia apenas o QR mais recente para o frontend
            return res.json({ qr: qrImage, message: "Escaneie o QR Code para autenticar" });
        }


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
                const message = `
Olá ${usuario.name}, chegou o dia de pagar a conta da Cantina do Zé!

💰 Valor a Pagar: ${valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

🔑 Chave Pix:
CPF: 123.456.789-00

⚠️ Informações importantes:

Se dividir a conta, confira se a outra pessoa já pagou.

Pague até a data de vencimento para evitar juros e multas.

Após o pagamento, envie o comprovante para:
📧 financeiro@empresa.com.br

📱 WhatsApp: (48) 99174-0223

❓ Dúvidas? Fale conosco:
📧 contato@empresa.com.br

☎️ (11) 1234-5678
📱 WhatsApp: (11) 98765-4321
    `;

                const phone = usuario.tel.replace(/\D/g, ''); // remove tudo que não é número
                const result = await Session.sendMessage(phone, message);

                if (!result.success) {
                    console.log("Envio interrompido:", result.mesage);
                    return res.status(500).json({ error: result.mesage });
                }
            }
        }

        return res.json({ success: true, message: "Mensagens enviadas com sucesso!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }
};

exports.removeNumber = async (req, res) => {
    try {
        await Session.clearSession()
        return res.status(200).json({ message: "Número de Whatsapp removido com sucesso!" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
    }

}