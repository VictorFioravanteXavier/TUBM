const User = require('../models/UserModel');

exports.index = async (req, res) => {
    res.render('esqueciSenha');
}

exports.enviarEmail = async (req, res) => {

    const email = req.body.email
    const valid_email = await User.isEmailRegistered(email);

    const errors = [];

    if (valid_email.success === false) {
        errors.push("Ocorreu um erro inteirno tente novamente mais tarde.")
    } else if (valid_email.success === true && valid_email.response === false) {
        errors.push("Erro, email não encontado. Verifique se está escrito corretemente ou veja com alguem do financeiro o email utilizado na conta cadastrada")
    }

    if (errors.length > 0) {
        req.flash("errors", errors[0])
        req.session.save(function () {
            return res.redirect('/esqueci-senha/')
        })
        return
    }

}