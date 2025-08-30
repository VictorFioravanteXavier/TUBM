const Account = require('../models/AccountModel');
const gerarNumeroConta = require('./accountNumber');

async function createAccountAssistencia() {
    const conta = await Account.findAllFiltred(1, true, "Assistência");

    if (!conta.accounts || conta.accounts.length === 0) {
        const account = new Account({
            name: "Assistência",
            users: []
        });

        await account.register();
        console.log("Conta de Assistência criada com sucesso!");
    } else {
        console.log("Conta de Assistência já existe.");
    }
}

module.exports = createAccountAssistencia;
