const User = require('../models/UserModel');

exports.index = async (req, res) => {
    const page = parseInt(req.params.page) || 1;

    const result = await User.findAll(page); // findAll com paginação
    const { users, totalPages, currentPage } = result;

    res.render('users', {
        users,
        totalPages,
        currentPage
    });
};
