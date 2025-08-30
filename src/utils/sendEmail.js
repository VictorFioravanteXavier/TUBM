import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

// Configuração OAuth2
const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground" // Redirect URI do playground
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Função para enviar email
export default async (to, subject, text, html = null) => {
    try {
        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        const mailOptions = {
            from: `"Cantina do Zé" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html: html || text,
        };

        const info = await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Erro ao enviar email:", error);
        return false;
    }
}
