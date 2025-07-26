function gerarNumeroConta() {
    const parte1 = Math.floor(1000 + Math.random() * 9000); // Gera número de 4 dígitos (1000 a 9999)
    const parte2 = Math.floor(Math.random() * 10); // Gera 1 dígito (0 a 9)
    return `${parte1}-${parte2}`;
}

module.exports = gerarNumeroConta