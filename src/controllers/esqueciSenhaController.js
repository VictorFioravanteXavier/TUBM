const User = require('../models/UserModel');
const TokenForgottenPassword = require('../models/TokenForgottenPasswordModel');
const bcryptjs = require('bcryptjs')

const sendEmailUtils = require("../utils/sendEmail").default;
const resetEmail = require('../utils/htmlEmailEsqueciSenha');
const validPassword = require('../utils/validPassword');

exports.index = async (req, res) => {
    res.render('esqueciSenha');
}

exports.enviarEmail = async (req, res) => {
    const email = req.body.email;
    const errors = [];

    const valid_email = await User.isEmailRegistered(email);

    if (!valid_email.success) {
        errors.push("Ocorreu um erro interno, tente novamente mais tarde.");
    } else if (valid_email.response === false) {
        errors.push("Erro: email não encontrado. Verifique se está correto ou consulte o financeiro.");
    }

    if (errors.length > 0) {
        req.flash("errors", errors[0]);
        req.session.save(() => res.redirect('/esqueci-senha/'));
        return;
    }

    const GeratedUuid = await TokenForgottenPassword.GerateUUID(valid_email.user);

    if (!GeratedUuid.response) {
        req.flash("errors", "Erro ao criar token para recuperação de senha.");
        req.session.save(() => res.redirect('/esqueci-senha/'));
        return;
    }

    const origin = `${req.protocol}://${req.get('host')}`;
    const link = `${origin}/trocar-senha/${GeratedUuid.result}`;

    const html = resetEmail({ reset_link: link });

    const result = await sendEmailUtils(
        email,
        "Esqueci minha senha - Site TUBM",
        "Clique no link para redefinir sua senha",
        html
    );

    if (!result) {
        req.flash("errors", "Erro ao enviar o email.");
        req.session.save(() => res.redirect('/esqueci-senha/'));
        return;
    }

    req.flash("success", "Email enviado com sucesso!");
    req.session.save(() => res.redirect('/esqueci-senha/'));
};


exports.indexTrocarSenha = async (req, res) => {
    const uuid = req.params.code

    const validatedToken = await TokenForgottenPassword.IsValidUUID(uuid)

    if (validatedToken.response === false) {
        req.flash("errors", "Erro ao entrar na página de troca de senha");
        req.session.save(() => res.redirect('/esqueci-senha/'));
        return;
    }

    if (validatedToken.valid === false) {
        req.flash("errors", "Erro! Link de troca de senha invalido, entre em um link valido ou envie outro email de recuperação.");
        req.session.save(() => res.redirect('/esqueci-senha/'));
        return;
    }

    res.render('trocarSenha');
}

exports.sendTrocarSenha = async (req, res) => {
    const uuid = req.params.code;

    const validatedToken = await TokenForgottenPassword.IsValidUUID(uuid);

    if (validatedToken.response === false) {
        req.flash("errors", "Erro ao trocar de senha");
        req.session.save(() => {
            return res.status(400).json({ success: false, redirect: "/esqueci-senha" });
        });
        return;
    }

    if (validatedToken.valid === false) {
        req.flash("errors", "Erro! Link inválido ou expirado.");
        req.session.save(() => {
            return res.status(400).json({ success: false, redirect: "/esqueci-senha" });
        });
        return;
    }

    const password = req.body.newPassword;

    if (!validPassword(password)) {
        req.flash("errors", "Erro! Senha inválida.");
        req.session.save(() => {
            return res.status(400).json({ success: false });
        });
        return;
    }

    const salt = bcryptjs.genSaltSync();
    const passwordEncrypted = bcryptjs.hashSync(password, salt);

    const resultGetUser = await TokenForgottenPassword.GetUser(uuid);

    if (!resultGetUser.response || resultGetUser.result === null) {
        req.flash("errors", "Erro ao encontrar usuário.");
        req.session.save(() => {
            return res.status(400).json({ success: false });
        });
        return;
    }

    const userId = resultGetUser.result;

    const resultTradePassword = await User.TradePassword(userId, passwordEncrypted);

    if (resultTradePassword.response === false) {
        req.flash("errors", "Erro ao trocar senha.");
        req.session.save(() => {
            return res.status(500).json({ success: false });
        });
        return;
    }

    req.flash("success", "Senha alterada com sucesso!");
    req.session.save(() => {
        return res.status(200).json({ success: true, redirect: "/" });
    });
};

