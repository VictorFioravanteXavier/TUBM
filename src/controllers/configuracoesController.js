const Conta = require("../models/ContaModel");

exports.index = async function (req, res) {
    const contas = await Conta.buscarContas();
    const conta = {}
    res.render('configuracoes', { contas, conta });
};

exports.registrar = async (req, res) => {
    try {
        const conta = new Conta(req.body)
        await conta.registrar();

        if (conta.errors.length > 0) {
            req.flash("errors", conta.errors)
            req.session.save(function () {
                return res.redirect('/configuracoes/')
            })
            return
        }

        req.flash("success", "Conta registrado com sucesso.")
        req.session.save(function () {
            return res.redirect(`/configuracoes/`)
        })
        return
    } catch (e) {
        console.log(e);
        return res.render('404')
    }
};

exports.editIndex = async (req, res) => {
    try {
        const conta = await Conta.buscarConta(req.params.id);
        res.render('configuracoes', { conta });
    } catch (e) {
        console.log(e);
        return res.render('404')
    }
};

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');

        const conta = new Conta(req.body)
        await conta.edit(req.params.id)

        if (conta.errors.length > 0) {
            req.flash("errors", conta.errors)
            req.session.save(function () {
                return res.redirect(`/configuracoes/`)
            })
            return
        }

        req.flash("success", "Conta editado com sucesso.")
        req.session.save(function () {
            return res.redirect(`/configuracoes/`)
        })
        return
    } catch (e) {
        console.log(e);
        res.render('404')
    }
}

exports.delete = async (req, res) => {
    if (!req.params.id) return res.render('404');

    const produto = await Conta.delete(req.params.id)
    if (!produto) return res.render('404');

    req.flash("success", "Produto apagado com sucesso.")
    req.session.save(function () {
        return res.redirect(`/configuracoes/`)
    })
    return
}