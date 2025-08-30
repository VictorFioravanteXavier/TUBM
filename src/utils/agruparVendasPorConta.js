module.exports = (vendas) => {
    const vendasPorConta = {};

    vendas.forEach(venda => {
        const accountId = venda.account_id._id.toString();

        if (!vendasPorConta[accountId]) {
            vendasPorConta[accountId] = [];
        }

        vendasPorConta[accountId].push(venda);
    });

    return vendasPorConta;
}