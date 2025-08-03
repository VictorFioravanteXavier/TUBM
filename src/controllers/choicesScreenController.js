const User = require('../models/UserModel');
const Role = require("../models/RoleModel")

exports.index = (req, res) => {
    res.render('choicesScreen');
}

exports.financeiro = async (req, res) => {
    const user = await User.findOne({ id: req.session.user?._id });
    const role = await Role.findOne({ id: user.role });


    if (role.name === "financeiro") {
        req.flash("success", "Você logou como financeiro")

        req.session.areaSolicitada = "financeiro";

        req.session.save(function () {
            return res.redirect('/estoque/');
        });
        return;
    } else {
        req.flash("errors", "Você não tem a autorização necessária!")
        req.session.save(function () {
            return res.redirect('/escolhas')
        })
        return
    }
}

exports.venda = async (req, res) => {
    const user = await User.findOne({ id: req.session.user?._id });
    const role = await Role.findOne({ id: user.role });


    if (role.name === "venda" || role.name === "financeiro") {
        req.flash("success", "Você logou como venda")

        req.session.areaSolicitada = "venda";

        req.session.save(function () {
            return res.redirect('/estoque/');
        });
        return;
    } else {
        req.flash("errors", "Você não tem a autorização necessária!")
        req.session.save(function () {
            return res.redirect('/escolhas')
        })
        return
    }
}

exports.user = async (req, res) => {
    const user = await User.findOne({ id: req.session.user?._id });
    const role = await Role.findOne({ id: user.role });


    if (role.name === "user" || role.name === "venda" || role.name === "financeiro") {
        req.flash("success", "Você logou como usuário normal")

        req.session.areaSolicitada = "user";

        req.session.save(function () {
            return res.redirect('/minhas-compras/');
        });
        return;
    } else {
        req.flash("errors", "Você não tem a autorização necessária!")
        req.session.save(function () {
            return res.redirect('/escolhas')
        })
        return
    }
}