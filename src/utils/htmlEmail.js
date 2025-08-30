module.exports = (data) => {
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
                <p style="margin:5px 0; font-size:28px; font-weight:bold; color:#B82627;">${data.valor_total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </td>
            </tr>

            <tr>
            <td style="padding:20px 0; border-bottom:1px solid #ddd;">
                <h3 style="margin:0 0 10px 0; font-size:16px; color:#1F2937;">Chave Pix</h3>
                <p style="margin:0; padding:12px; background:#FFF4E8; border:2px solid #B82627; font-size:16px;">
                <strong>CPF:</strong> 123.456.789-00
                </p>
            </td>
            </tr>

            <tr>
            <td style="padding:20px 0; border-bottom:1px solid #ddd;">
                <h3 style="margin:0 0 10px 0; font-size:16px; color:#1F2937;">Informações Importantes</h3>
                <p style="margin:0 0 10px 0; color:#4B5563;">Se dividir a conta com outra pessoa é aconselhável conferir se já foi pago pela outra pessoa.</p>
                <p style="margin:0 0 10px 0; color:#4B5563;">O pagamento deve ser realizado até a data de vencimento para evitar juros e multas.</p>
                <p style="margin:0 0 10px 0; color:#4B5563;">Após o pagamento, envie o comprovante para:</p>
                <p style="margin:0; color:#4B5563;">📧 financeiro@empresa.com.br<br>📱 WhatsApp: (48) 99174-0223</p>
            </td>
            </tr>

            <tr>
            <td style="padding-top:20px; font-size:14px; color:#555;">
                <p style="margin:0 0 5px 0;">Em caso de dúvidas, entre em contato conosco:</p>
                <p style="margin:0;">📧 contato@empresa.com.br<br>☎️ (11) 1234-5678<br>📱 WhatsApp: (11) 98765-4321</p>
            </td>
            </tr>
        </table>

        </body>
        </html>
    `

    return html
}