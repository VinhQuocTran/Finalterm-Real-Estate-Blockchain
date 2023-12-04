const Account = require('../models/Account');
const catchAsync = require('../utils/catchAsync');

const createAccount = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

const getAllAccounts = catchAsync(async (req, res, next) => {
    const accounts = await Account.findAll();

    res.status(200).json({
        status: 'success',
        length: accounts.length,
        data: accounts
    })
});

module.exports = { createAccount, getAllAccounts };