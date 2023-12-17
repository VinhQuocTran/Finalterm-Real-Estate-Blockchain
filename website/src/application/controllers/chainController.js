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

    // const result  = await fabricService.evaluateTransaction("getAllByEntity","user");
    const queryResult = {
        "selector":{
            "docType": "token"
        }
    }
    const result  = await fabricService.evaluateTransaction("getQueryResultV2",JSON.stringify(queryResult));

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
module.exports = {
    getChain,
    getAllUsers,
    getUserById,
    getDepositByUserId,
    getWithDrawByUserId,
    getOwnPropertyTokenByUserId,
    getTokenizeProperty,
    createUser,
    getAllOffers
};