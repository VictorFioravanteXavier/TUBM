const Role = require('../models/RoleModel');

exports.middlewareGlobal = function (req, res, next) {
    res.locals.errors = req.flash('errors')
    res.locals.success = req.flash('success')
    res.locals.user = req.session.user;
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
    const role = await Role.findOne({id: req.session.user.role});

    if (role.name == "user") {
        // TODO: Fazer as telas dos usuários
        console.log("User");
    } else if (role.name === "financeiro" || role.name === "venda") {
        // TODO: Fazer a tela de escolhas do user
        console.log("Tela escolhas");
        next()
    }

    return
}