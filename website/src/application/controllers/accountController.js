const Account = require('../models/Account');
const catchAsync = require('../utils/catchAsync');

const createAccount = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

module.exports = { createAccount };