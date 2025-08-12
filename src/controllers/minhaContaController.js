const Account = require("../models/AccountModel");
const User = require("../models/UserModel");
const { validarTelefone } = require("../utils/validaTelefone");

exports.index = async (req, res) => {
    const userData = req.session.user
    let account
    if (userData.verified) {
        account = await Account.findAccountsByUserId(req.session.user._id)
    } else {
        account = {}
    }

    res.render('minhaConta', { userData, account })
}
