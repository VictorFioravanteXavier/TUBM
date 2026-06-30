module.exports = (data) => {

    let valueTopay = data.valor_total;
    let messagePenalty = "";

    if (data.penalty > 0) {
        if (data.type_penalty) {
            valueTopay += data.penalty
            messagePenalty = `<p style="margin:0; font-size:12px; color:#4B5563;">
                                Multa aplicada no valor de 
                                <strong>
                                    ${Number(data.penalty).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            })}
                                </strong>.
                            </p>`
        } else {
            valueTopay += (data.valor_total * data.penalty) / 100
            messagePenalty = `<p style="margin:0; font-size:12px; color:#4B5563;">
                            Multa aplicada no valor de 
                            <strong>
                                ${Number(data.penalty)}%
                            </strong> do valor total.
                        </p>`
        }
    }


    const day = String(data.date.getUTCDate()).padStart(2, '0');
    const month = String(data.date.getUTCMonth() + 1).padStart(2, '0');
    const year = data.date.getUTCFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const weekday = new Date(
        data.date.getUTCFullYear(),
        data.date.getUTCMonth(),
        data.date.getUTCDate()
    ).toLocaleDateString('pt-BR', { weekday: 'long' });

    const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
        <meta charset="UTF-8">
        <title>Pagamento</title>
        </head>
        <body style="margin:0; padding:20px; background-color:#FFF4E8; font-family:Arial, sans-serif; color:#333;">

        <table width="100%" cellspacing="0" cellpadding="0" border="0" align="center" style="max-width:800px; background:#ffffff; margin:0 auto; padding:20px; border:1px solid #ddd;">
            <tr>
            <td style="padding-bottom:20px; border-bottom:1px solid #ddd;">
                <p style="margin:0; font-size:16px; color:#4B5563;">Nome:</p>
                <p style="margin:5px 0 20px 0; font-size:20px; font-weight:bold; color:#1F2937;">${data.name}</p>

                <p style="margin:0; font-size:16px; color:#4B5563;">Valor a Pagar:</p>
                <p style="margin:5px 0; font-size:28px; font-weight:bold; color:#B82627;">${valueTopay.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                ${messagePenalty}
            </td>
            </tr>

            <tr>
            <td style="padding:20px 0; border-bottom:1px solid #ddd;">
                <h3 style="margin:0 0 10px 0; font-size:16px; color:#1F2937;">Chave Pix</h3>
                <p style="margin:0; padding:12px; background:#FFF4E8; border:2px solid #B82627; font-size:16px;">
                <strong>Email:</strong> tubm2020@gmail.com
                </p>
            </td>
            </tr>

            <tr>
                <td>
                    <p style="margin:0 0 10px 0; color:#4B5563;">Você está recebendo o valor da sua contribuição mensal à Tenda de Umbanda Beira Mar, que inclui: </p>
                    <ul style="margin:0 0 10px 0; color:#4B5563;"> 
                        <li>Mensalidade: R$ 40,00</li>
                        <li>Consumo realizado no último mês no Café do Zé (cantina)</li>
                    </ul>
                </td>
            </tr>

            <tr>
                <td style="padding:20px 0; border-bottom:1px solid #ddd;">
                    <h3 style="margin:0 0 10px 0; font-size:16px; color:#1F2937;">Informações Importantes</h3>
                    <p style="margin:0 0 10px 0; color:#4B5563;">O pagamento deve ser feito até o 5º dia útil. Fique atento!</p>
                    <br>
                    <p style="margin:0 0 10px 0; color:#4B5563;">Em caso de pagamento após a data de vencimento, haverá um acréscimo de R$ 10,00 (dez reais) ao valor da mensalidade.</p>
                    <br>
                    <p style="margin:0 0 10px 0; color:#4B5563;">A conta da cantina ficará suspensa até a regularização do pagamento.</p>
                    <br>
                    <p style="margin:0 0 10px 0; color:#4B5563;">As contas são individuais. Não existem mais contas conjuntas.</p>
                    <br>
                    <p style="margin:0 0 10px 0; color:#4B5563;">Após o pagamento, envie o comprovante para:</p>
                    <p style="margin:0; color:#4B5563;">📱 WhatsApp: (41) 99691-1727</p>
                </td>
            </tr>

            <tr>
            <td style="padding-top:20px; font-size:14px; color:#555;">
                <p style="margin:0 0 5px 0;">Em caso de dúvidas, entre em contato conosco:</p>
                <p style="margin:0;">📱 WhatsApp: (41) 99691-1727</p>
            </td>
            </tr>
        </table>

        </body>
        </html>
    `

    return html
}