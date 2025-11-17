const mongoose = require('mongoose');
const crypto = require("crypto");
const { type } = require('os');

const TokenForgottenPasswordSchema = new mongoose.Schema({
    resetToken: { type: String, required: true, unique: true },
    expires_at: { type: Date, default: Date.now() + 1000 * 60 * 20 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const TokenForgottenPasswordModule = mongoose.model('TokenForgottenPassword', TokenForgottenPasswordSchema);

class TokenForgottenPassword {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.role = null;
    }

    static async GerateUUIDLink(user) {
        const uuid = crypto.randomUUID()

        try {
            await TokenForgottenPasswordModule.create({
                resetToken: uuid,
                user: user
            })

            return {response: true, result: uuid}
        } catch (error) {
            console.log(`Erro ao criar o token de recuperação: ${error}`);

            return {response: false, result: ""}
        }
    }


}