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

    res.locals.areaSolicitada = ""
    res.locals.currentUrl = req.url;
    next()
}

exports.seuOutroMiddleware = function (req, res, next) {
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
        // TODO: Fazer as telas dos usuários
        res.redirect("/minhas-compras")
    } else if (req.session.user.role_name === "financeiro" || req.session.user.role_name === "venda") {
        next()
    }

    return
}