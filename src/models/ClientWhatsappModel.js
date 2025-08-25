const { Client, LocalAuth } = require("whatsapp-web.js");
const fs = require("fs");
const path = require("path");


class Session {
    static qrTemp = null; // QR temporário
    static clientInstance = null; // para manter o client

    // Cria ou retorna o client já inicializado
    static async createClient() {
        if (this.clientInstance) return this.clientInstance;

        const client = new Client({
            puppeteer: { headless: true },
            authStrategy: new LocalAuth() // autenticação automática
        });

        // Evento QR code (aparece só na primeira vez)
        client.on("qr", (qr) => {
            console.log("📱 Escaneie este QR Code:", qr);
            this.qrTemp = qr;
        });

        // Quando o cliente estiver pronto
        client.on("ready", () => {
            console.log("🚀 WhatsApp pronto!");
            this.qrTemp = null; // QR não é mais necessário
        });

        client.on("authenticated", () => {
            console.log("✅ Autenticado com sucesso!");
            this.qrTemp = null;
        });

        client.on("auth_failure", (err) => {
            console.error("❌ Falha na autenticação:", err);
        });

        await client.initialize();
        this.clientInstance = client;
        return client;
    }

    // Envia mensagem para um número
    static async sendMessage(phone, message) {
        const client = await this.createClient();

        if (!client.info || !client.info.wid) {
            console.log("⚠️ Cliente ainda não pronto. Tente novamente em alguns segundos.");
            return { success: false, message: "⚠️ Cliente ainda não pronto. Tente novamente em alguns segundos." };
        }

        const formattedPhone = `55${phone.replace(/\D/g, "")}@c.us`;
        await client.sendMessage(formattedPhone, message);
        return { success: true }
    }


    // Retorna QR temporário (para o frontend mostrar se precisar)
    static getQr() {
        return this.qrTemp;
    }

    // Limpa sessão local (apaga arquivos de LocalAuth)
    static async clearSession() {
        try {
            // Destroi o cliente atual primeiro
            if (this.clientInstance) {
                await this.clientInstance.destroy();
                this.clientInstance = null;
            }

            // Agora remove a pasta usada pelo LocalAuth
            const sessionPath = path.join(process.cwd(), ".wwebjs_auth");

            if (fs.existsSync(sessionPath)) {
                fs.rmSync(sessionPath, { recursive: true, force: true });
                console.log("🗑️ Cache da sessão removido com sucesso!");
            }

            this.qrTemp = null;
        } catch (err) {
            console.error("Erro ao limpar sessão:", err);
        }
    }

}

module.exports = Session;
