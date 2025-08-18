const Account = require("../models/AccountModel");

exports.index = async (req, res) => {
    const userData = req.session.user
    let account
    if (userData.verified) {
        account = await Account.findAccountsByUserId(req.session.user._id)
    } else {
        account = {}
    }

    res.render('shippingReporting', { userData, account })
}
