exports.index = (req, res) => {
    const produtos = {}
    res.render('vendas', {produtos});
};