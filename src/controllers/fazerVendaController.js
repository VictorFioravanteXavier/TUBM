const Account = require("../models/AccountModel");
const Produto = require("../models/ProdutoModel");
const Venda = require("../models/VendaModel");

exports.index = async (req, res) => {
    const accounts = await Account.findAllNoPage()
    const produtos = await Produto.buscarProdutosEstoque()    

    res.render('fazer-venda', { accounts, produtos });
};

exports.registrar = async (req, res) => {
    const dadosVenda = req.body['enviar-back'];


    if (!dadosVenda) {
        req.flash("errors", "Erro ao enviar dados")
        req.session.save(function () {
            return res.redirect('/fazer-venda/')
        })
        return
    }

    try {
        const dados = JSON.parse(dadosVenda);
        const venda = new Venda(dados);
        await venda.registrar();

        if (venda.errors.length > 0) {
            req.flash("errors", venda.errors)
            req.session.save(function () {
                return res.redirect('/fazer-venda/')
            })
            return
        }

        req.flash("success", "Venda feita com sucesso.")
        req.session.save(function () {
            return res.redirect(`/fazer-venda/`)
        })
    } catch (e) {
        console.log(e);
        return res.render('404')
    }
};