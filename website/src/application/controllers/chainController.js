const HyperLedgerService = require('../utils/hyperLedgerService/hyperLedgerService');
const catchAsync = require("../utils/catchAsync");
const fabricService = new HyperLedgerService();
const Property = require('../models/Property');

const getChain =  catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    await fabricService.submitTransaction("initLedger");

    await fabricService.disconnect();
    res.status(200).json({
        status: 'success',
        data: "init data success"
    });
});

const getAllUsers = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    // const result  = await fabricService.evaluateTransaction("getOwnPropertyTokenByUserId","ACCOUNT_0003");
    // const result  = await fabricService.evaluateTransaction("getOwnPropertyTokenByTokenAndUserId","TOKEN_0003","ACCOUNT_0003");
    const now = new Date();
    // await fabricService.submitTransaction("matchingOffers",`${now.toISOString()}`);
    // await fabricService.submitTransaction("getPaymentRentDaily","LP_0001",3000);
    
    const result  = await fabricService.evaluateTransaction("getAllByEntity","rentalIncomeWallet");
    // const queryResult = {
    //     "selector":{
    //         "docType": "token"
    //     }
    // }
    // const result  = await fabricService.evaluateTransaction("getQueryResultV2",JSON.stringify(queryResult));

    const users = JSON.parse(result);
    res.status(200).json({
        status: 'success',
        length: users.length,
        data: users
    })
    await fabricService.disconnect();
});

const createUser = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    await fabricService.submitTransaction("createUser",req.body.user_id,0,0);
    const user = await fabricService.evaluateTransaction("queryUser",req.body.user_id);
    await fabricService.disconnect();

    res.status(200).json({
        status: 'success',
        data: user
    })
});

const createOffer = catchAsync(async (req, res, next) => {

    await fabricService.initialize();
    await fabricService.connect();
    let now = new Date();
    const offer_id = "OFFER_"+now.toISOString();
    const account = fabricService.evaluateTransaction("queryUser",req.user.id);
    if(req.body.is_buy && account.cash_balance < req.body.quantity*req.body.at_price){
        res.status(200).json({
            status: 'failed',
            data: "Your cash balance not enough"
        })
        return;
    }
    console.log(req.body.is_buy);
    await fabricService.submitTransaction("createOffer",`${offer_id}`,`${req.user.id}`,
    `${req.body.token_id}`,req.body.quantity,req.body.at_price,`${req.body.is_buy}`,`${now}`);
    await fabricService.disconnect();
    res.status(200).json({
        status: 'success',
        data: "create offer successful"
    })
});

const getUserById = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    const user = await fabricService.evaluateTransaction("queryUser",req.params.id);
    await fabricService.disconnect();
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
    await fabricService.disconnect();

        res.status(200).json({
        status: 'success',
        data: user
    })
});
const getOwnPropertyTokenByUserId = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    const ownPropertyToken = await fabricService.evaluateTransaction("getOwnPropertyTokenByUserId",req.params.id);
    await fabricService.disconnect();

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
const getTokenizeProperty = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    const ownerProperty = await Property.findOne({
        where: { id: req.body.propertyId }
    });
    await fabricService.submitTransaction("getTokenizeProperty",ownerProperty.account_id,req.body.listingPropertyId,req.body.propertyValuation);
    const query = {
        docType:"token",
        listing_property_id:req.body.listingPropertyId
    }
    const result =  await fabricService.evaluateTransaction("getTokenByListingPropertyId",req.body.listingPropertyId);
    await fabricService.disconnect();
    res.status(200).json({
        status: 'success',
        data: result
    })
});

const getWithDrawRentalIncome = catchAsync(async (req, res, next) => {
    await fabricService.initialize();
    await fabricService.connect();
    await fabricService.submitTransaction("getWithDrawRentalIncome", req.params.userId, `${new Date()}`);
    await fabricService.disconnect();

    res.status(200).json({
        status: 'success',
        message: 'Withdraw successfully'
    });
});

module.exports = {
    getChain,
    getAllUsers,
    getUserById,
    getDepositByUserId,
    getWithDrawByUserId,
    getOwnPropertyTokenByUserId,
    getTokenizeProperty,
    createUser,
    createOffer,
    getAllOffers,
    getWithDrawRentalIncome
};