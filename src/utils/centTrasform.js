module.exports = function (preco) {
    if (typeof preco !== 'string' && typeof preco !== 'number') {
        throw new TypeError(`Preço inválido: ${preco}`);
    }

    preco = preco.toString().replace(',', '.');
    preco = parseFloat(preco) * 100;
    return preco;
};
