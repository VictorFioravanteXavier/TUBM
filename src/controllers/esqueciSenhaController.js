const User = require('../models/UserModel');
const TokenForgottenPassword = require('../models/TokenForgottenPasswordModel');

const sendEmailUtils = require("../utils/sendEmail").default;
const resetEmail = require('../utils/htmlEmailEsqueciSenha');

exports.index = async (req, res) => {
    res.render('esqueciSenha');
}

exports.enviarEmail = async (req, res) => {
    const email = req.body.email;
    const errors = [];

    // Verifica se o email existe no banco
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

    // Cria token UUID
    const GeratedUuid = await TokenForgottenPassword.GerateUUID(valid_email.user);

    if (!GeratedUuid.response) {
        req.flash("errors", "Erro ao criar token para recuperação de senha.");
        req.session.save(() => res.redirect('/esqueci-senha/'));
        return;
    }

    // Gera URL segura no backend
    const origin = `${req.protocol}://${req.get('host')}`;
    const link = `${origin}/trocar-senha/${GeratedUuid.result}`;

    console.log("🔗 Link gerado:", link);

    // Gera HTML do email já com o link
    const html = resetEmail({ reset_link: link });

    // Envia email
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
    const uuid = req.body.code

    res.render('trocarSenha');
}

exports.sendTrocarSenha = async (req, res) => {
    console.log("Enviado");
}
