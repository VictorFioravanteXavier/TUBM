// resetPasswordEmail.js
module.exports = (data = {}) => {
  const resetLink = data.reset_link || '#';

  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Redefinir senha</title>
  </head>
  <body style="margin:0; padding:20px; background-color:#F7F8FA; font-family: Arial, Helvetica, sans-serif; color:#333;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="max-width:600px; margin:0 auto;">
      <tr>
        <td style="background:#ffffff; padding:28px; border-radius:8px; box-shadow:0 1px 3px rgba(0,0,0,0.06);">
          
          <h2 style="margin:0 0 12px 0; font-size:20px; color:#111827;">Redefinição de senha</h2>

          <div style="text-align:center; margin:18px 0;">
            <!-- Botão principal -->
            <a href="${resetLink}" target="_blank" rel="noopener noreferrer"
               style="display:inline-block; padding:12px 22px; font-size:16px; font-weight:600; text-decoration:none; border-radius:8px; background:linear-gradient(180deg,#B82627,#A21E20); color:#fff;">
              Redefinir minha senha
            </a>
          </div>

          <p style="margin:0 0 12px 0; font-size:14px; color:#6B7280;">
            Se o botão acima não funcionar, copie e cole este link no seu navegador:
          </p>

          <p style="word-break:break-all; font-size:13px; color:#2563EB; margin:0 0 18px 0;">
            <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="color:#2563EB; text-decoration:none;">
              ${resetLink}
            </a>
          </p>

        </td>
      </tr>

      <tr>
        <td style="padding:16px 0; text-align:center; font-size:12px; color:#9CA3AF;">
          <p style="margin:0;">© ${new Date().getFullYear()} TUBM. Todos os direitos reservados.</p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  return html;
}
