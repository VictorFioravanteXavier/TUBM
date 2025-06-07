const User = require('../models/UserModel')


exports.index = async (req, res) => {
    res.render('login');
}

exports.cadastro = async(req, res) => {
    res.render('cadastrar');
}

exports.register = async (req, res) => {
    console.log(req.body)
    /* try {
        const user = new User(req.body)
        await user.register()

        if (user.errors.length > 0) {
            req.flash("errors", login.errors)
            req.session.save(function () {
                return res.redirect('/')
            })
            return
        }

        req.flash("success", "Seu usuário foi criado com sucesso!")
        req.session.save(function () {
            return res.redirect('/')
        })
    } catch (e) {
        console.log(e);
        res.render('404')
    } */
    
}

exports.login = async (req, res) => {
    try {
        const login = new Login(req.body)
        await login.login()

        if (login.errors.length > 0) {
            req.flash("errors", login.errors)
            req.session.save(function () {
                return res.redirect('/estoque/')
            })
            return
        }

        req.flash("success", "Você entrou no sistema.")
        req.session.user = login.user;
        req.session.save(function () {
            return res.redirect('/estoque/')
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