const HyperLedgerService = require('../utils/hyperLedgerService/hyperLedgerService');
const catchAsync = require("../utils/catchAsync");
const fabricService = new HyperLedgerService();

const getChain =  catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    await fabricService.submitTransaction("initLedger");
    // await fabricService.submitTransaction("matchingOffers",new Date());

    // await fabricService.submitTransaction("createUser", 'ACCOUNT_0001', 1000000 , 500 * 50);
    // await fabricService.submitTransaction("createUser", 'ACCOUNT_0002', 1000000 , 500 * 50);
    // await fabricService.submitTransaction("createUser", 'ACCOUNT_0003', 1000000 , 500 * 50);
    // await fabricService.submitTransaction("createUser", 'ACCOUNT_0004', 1000000 , 500 * 50);
    // await fabricService.submitTransaction("createUser", 'ACCOUNT_0005', 1000000 , 500 * 50);
    //
    // await fabricService.submitTransaction("createToken", 'TOKEN_0001', 'LP_0001', 500);
    // await fabricService.submitTransaction("createToken", 'TOKEN_0002', 'LP_0002', 500);
    // await fabricService.submitTransaction("createToken", 'TOKEN_0003', 'LP_0003', 500);
    // await fabricService.submitTransaction("createToken", 'TOKEN_0004', 'LP_0004', 500);
    // await fabricService.submitTransaction("createToken", 'TOKEN_0005', 'LP_0005', 500);
    //

    // await fabricService.submitTransaction("createPropertyTokenOwner", 'PTO_0001', 500, 'TOKEN_0001', 'ACCOUNT_0001');
    // await fabricService.submitTransaction("createPropertyTokenOwner", 'PTO_0002', 500, 'TOKEN_0002', 'ACCOUNT_0002');
    // await fabricService.submitTransaction("createPropertyTokenOwner", 'PTO_0003', 500, 'TOKEN_0003', 'ACCOUNT_0003');
    // await fabricService.submitTransaction("createPropertyTokenOwner", 'PTO_0004', 500, 'TOKEN_0004', 'ACCOUNT_0004');
    // await fabricService.submitTransaction("createPropertyTokenOwner", 'PTO_0005', 500, 'TOKEN_0005', 'ACCOUNT_0005');
    //
    // await fabricService.submitTransaction("createOffer", 'OFFER_0001', 'ACCOUNT_0001', 'TOKEN_0001', 50, 50, false);
    // await fabricService.submitTransaction("createOffer", 'OFFER_0002', 'ACCOUNT_0002', 'TOKEN_0002', 50, 50, false);
    // await fabricService.submitTransaction("createOffer", 'OFFER_0003', 'ACCOUNT_0003', 'TOKEN_0003', 50, 50, false);
    // await fabricService.submitTransaction("createOffer", 'OFFER_0004', 'ACCOUNT_0004', 'TOKEN_0004', 50, 50, false);
    // await fabricService.submitTransaction("createOffer", 'OFFER_0005', 'ACCOUNT_0005', 'TOKEN_0005', 50, 50, false);
    // await fabricService.submitTransaction("createOffer", 'OFFER_0006', 'ACCOUNT_0001', 'TOKEN_0002', 50, 50, true);


    await fabricService.disconnect();
    res.status(200).json({
        status: 'success',
        data: "init data success"
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