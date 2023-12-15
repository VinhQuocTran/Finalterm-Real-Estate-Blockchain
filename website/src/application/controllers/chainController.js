const HyperLedgerService = require('../utils/hyperLedgerService/hyperLedgerService');
const catchAsync = require("../utils/catchAsync");
const fabricService = new HyperLedgerService();

const getChain =  catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    await fabricService.submitTransaction("initLedger");
    await fabricService.disconnect();
    res.status(200).json({
        status: 'success',
        data: 'create init initLedger successful'
    });
});


const getAllUsers = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    const result  = await fabricService.evaluateTransaction("getAllByEntity","user");
    const users = JSON.parse(result);
    await fabricService.disconnect();
    res.status(200).json({
        status: 'success',
        length: users.length,
        data: users
    })
});
const createUser = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    await fabricService.submitTransaction("createUser",req.body.user_id,0,0);
    const user = await fabricService.evaluateTransaction("queryUser",req.body.user_id);
    res.status(200).json({
        status: 'success',
        data: user
    })
});
const getUserById = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    const user = await fabricService.evaluateTransaction("queryUser",req.params.id);
    res.status(200).json({
        status: 'success',
        data: user
    })
});
const getDepositByUserId = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    await fabricService.submitTransaction("getDepositByUserId",req.body.user_id,req.body.money);
    const user = await fabricService.evaluateTransaction("queryUser",req.body.user_id);

    res.status(200).json({
        status: 'success',
        data: user
    })
});
const getWithDrawByUserId = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    await fabricService.submitTransaction("getWithDrawByUserId",req.body.user_id,req.body.money);
    const user = await fabricService.evaluateTransaction("queryUser",req.body.user_id);
        res.status(200).json({
        status: 'success',
        data: user
    })
});

const getOwnPropertyTokenByUserId = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    const ownPropertyToken = await fabricService.evaluateTransaction("getOwnPropertyTokenByUserId",req.body.id,req.body.money);
    res.status(200).json({
        status: 'success',
        data: ownPropertyToken
    })
});

const getAllOffers = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    const result  = await fabricService.evaluateTransaction("getAllByEntity","offer");
    const offers = JSON.parse(result);
    await fabricService.disconnect();
    res.status(200).json({
        status: 'success',
        length: offers.length,
        data: offers
    })
});
module.exports = {
    getChain,
    getAllUsers,
    getUserById,
    getDepositByUserId,
    getWithDrawByUserId,
    getOwnPropertyTokenByUserId,
    createUser,
    getAllOffers
};