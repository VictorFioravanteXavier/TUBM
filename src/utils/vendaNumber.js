function gerarNumeroVenda() {
    const parte1 = Math.floor(100000 + Math.random() * 900000);
    return `P${parte1}`;
}

module.exports = gerarNumeroVenda