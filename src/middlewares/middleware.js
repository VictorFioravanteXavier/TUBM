const Role = require('../models/RoleModel');

exports.middlewareGlobal = async function (req, res, next) {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')

    res.locals.user = req.session.user;
    res.locals.role = req.session.areaSolicitada || '';

    if (res.locals.user) {
        const role = await Role.findOne({ id: req.session.user.role });
        res.locals.user["role_name"] = role.name;
    }

    res.locals.currentUrl = req.url;
    next()
}

exports.checkCsrfError = (err, req, res, next) => {
    if (err) {
        return res.render('404')
    }
}

exports.csrfMidlleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}

exports.loginRequired = (req, res, next) => {
    if (!req.session.user) {
        req.flash("errors", "Você precisa fazer login.")
        req.session.save(function () {
            return res.redirect('/')
        })
        return
    }

    next()
}


exports.roleFind = async (req, res, next) => {
    if (req.session.user.role_name == "user") {
        res.redirect("/minha-conta/")

    } else if (req.session.user.role_name === "financeiro" || req.session.user.role_name === "venda") {
        res.locals.areaSolicitada = "financeiro"
        next()
    }

    return
}

exports.activatedeAccount = async (req, res, next) => {
    if (!req.session.user.verified) {
        req.flash("errors", "Crie uma conta com o financeiro para entrar nessa página")
        return req.session.save(function () {
            return res.redirect("/minha-conta/")
        })
    } 

    next()
}
