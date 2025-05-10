module.exports = function (preco) {
    preco = preco.replace(',', '.'); // Corrigido: agora retorna o valor com ponto
    preco = parseFloat(preco) * 100; // Corrigido: substitui parseDecimal por parseFloat
    return preco;
};
