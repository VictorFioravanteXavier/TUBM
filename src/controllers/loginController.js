const User = require('../models/UserModel')


exports.index = async (req, res) => {
    res.render('login');
}

exports.cadastro = async(req, res) => {
    res.render('cadastrar');
}

exports.register = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.register()

        if (user.errors.length > 0) {
            req.flash("errors", user.errors)
            req.session.save(function () {
                return res.redirect('/cadastro')
            })
            return
        }

        req.flash("success", "Seu cadastro foi feito com sucesso!")
        req.session.save(function () {
            return res.redirect('/')
        })
    } catch (e) {
        console.log(e);
        res.render('404')
    }
    
}

exports.login = async (req, res) => {
    try {
        const login = new User(req.body)
        await login.login()

        if (login.errors.length > 0) {  
            req.flash("errors", login.errors)
            req.session.save(function () {
                return res.redirect('/')
            })
            return
        }

        req.flash("success", "Você entrou no sistema.")
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('/escolha/')
        })
    } catch (e) {
        console.log(e);
        res.render('404')
    }
}

exports.logout = (req, res) => {
    req.session.destroy()
    return res.redirect('/')
}