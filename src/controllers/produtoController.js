const Produto = require("../models/ProdutoModel");
const centTrasform = require("../utils/centTrasform");

exports.index = (req, res) => {
    produto = {}
    res.render('produto', {produto})
};

exports.registrar = async (req, res) => {
    try {    
        req.body.code = await Produto.searchLastCode();

        req.body.data_cadastro = new Date();
        req.body.data_atualizacao = new Date();

        req.body.custo = centTrasform(req.body.custo);
        req.body.valor_venda = centTrasform(req.body.valor_venda);

        req.body.quantidade = Number(req.body.quantidade);
        
        const produto = new Produto(req.body)
        await produto.registrar();

        if (produto.errors.length > 0) {
            req.flash("errors", produto.errors)
            req.session.save(function () {
                return res.redirect('/produto/')
            })
            return
        }

        req.flash("success", "Produto registrado com sucesso.")
        req.session.save(function () {
            return res.redirect(`/produto/`)
        })
        return
    } catch (e) {
        console.log(e);
        return res.render('404')
    }
};

exports.edit = async (req, res) => {
    try {
        if (!req.params.id) return res.render('404');

        req.body.data_atualizacao = new Date();

        req.body.custo = centTrasform(req.body.custo);
        req.body.valor_venda = centTrasform(req.body.valor_venda);

        req.body.quantidade = Number(req.body.quantidade);

        const produto = new Produto(req.body)
        await produto.edit(req.params.id)

        if (produto.errors.length > 0) {
            req.flash("errors", produto.errors)
            req.session.save(function () {
                return res.redirect(`/estoque/`)
            })
            return
        }

        req.flash("success", "Produto editado com sucesso.")
        req.session.save(function () {
            return res.redirect(`/estoque/`)
        })
        return
    } catch (e) {
        console.log(e);
        res.render('404')
    }
}


exports.editIndex = async (req, res) => {
    if (!req.params.id) return res.render('404');

    const produto = await Produto.buscaPorId(req.params.id)
    if (!produto) return res.render('404');

    res.render('produto', { produto })
}


exports.delete = async (req, res) => {
    if (!req.params.id) return res.render('404');

    const produto = await Produto.delete(req.params.id)
    if (!produto) return res.render('404');

    req.flash("success", "Produto apagado com sucesso.")
    req.session.save(function () {
        return res.redirect(`/estoque/`)
    })
    return
}