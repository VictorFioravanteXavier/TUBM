const Produto = require("../models/ProdutoModel");

exports.index = async (req, res) => {
    const produtos = await Produto.buscarProdutos()
    
    res.render('estoque', {produtos})
};