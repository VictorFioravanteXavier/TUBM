const mongoose = require('mongoose');
const crypto = require("crypto");
const { type } = require('os');
const { response } = require('express');

const TokenForgottenPasswordSchema = new mongoose.Schema({
    resetToken: { type: String, required: true, unique: true },
    expires_at: {
        type: Date,
        default: () => new Date(Date.now() + 1000 * 60 * 20),
        expires: 0
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const TokenForgottenPasswordModule = mongoose.model('TokenForgottenPassword', TokenForgottenPasswordSchema);

class TokenForgottenPassword {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.role = null;
    }

    static async GerateUUID(user) {
        const uuid = crypto.randomUUID();

        try {
            await TokenForgottenPasswordModule.deleteMany({ user });

            await TokenForgottenPasswordModule.create({
                resetToken: uuid,
                user
            });

            return { response: true, result: uuid };
        } catch (error) {
            console.error(`Erro ao criar o token de recuperação: ${error}`);
            return { response: false, result: "" };
        }
    }


    static async IsValidUUID(uuid) {
        try {
            const token = await TokenForgottenPasswordModule.findOne({ resetToken: uuid });

            if (!token) {
                return { response: true, valid: false };
            }

            if (token.expires_at < new Date()) {
                await TokenForgottenPasswordModule.deleteOne({ resetToken: uuid });

                return { response: true, valid: false };
            }

            return { response: true, valid: true };
        } catch (error) {
            console.error(`Erro ao validar o token de recuperação: ${error}`);
            return { response: false, result: "" };
        }
    }

    static async GetUser(uuid) {
        try {
            const token = await TokenForgottenPasswordModule.findOne({ resetToken: uuid });

            if (!token) {
                return { response: true, result: null };
            }

            return { response: true, result: token.user };
        } catch (error) {
            console.error(`Erro ao encontrar usuário: ${error}`);
            return { response: false, result: null };
        }
    }

}


module.exports = TokenForgottenPassword