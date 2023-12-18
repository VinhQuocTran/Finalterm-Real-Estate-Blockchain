const HyperLedgerService = require('../utils/hyperLedgerService/hyperLedgerService');
const Account = require('../models/Account');
const Property = require('../models/Property');
const SubmitListingProperty = require('../models/SubmitListingProperty');
const ListingBackgroundCheck = require('../models/ListingBackgroundCheck');
const ListingPropertyInspection = require('../models/ListingPropertyInspection');
const ListingPropertyValuation = require('../models/ListingPropertyValuation');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const PropertyVerification = require('../models/PropertyVerification');

const fabricService = new HyperLedgerService();

module.exports = {
    requestListingProperty: catchAsync(async (req, res, next) => {
        const { backgroundCheck, inspection, valuation } = req.body;
        const totalPrice = parseInt(req.body.totalPrice);

        // get user by id
        await fabricService.initialize();
        await fabricService.connect();
        const user = await fabricService.evaluateTransaction("queryUser", req.user.id);

        // check cash balance 
        if (user.cash_balance < totalPrice) return next(new AppError('Cash balance amount is not valid', 400));

        // withdraw and update
        await fabricService.submitTransaction("getWithDrawByUserId", req.user.id, totalPrice);
        const updatedUser = await fabricService.evaluateTransaction("queryUser", req.user.id);

        // update displayed data
        const account = await Account.findOne({
            where: { id: req.user.id }
        });
        account.cashBalance = updatedUser.cash_balance;

        // update property's isListed to pending
        await Property.update({ isListed: "0" }, {
            where: { id: req.params.propertyId },
            returning: true // get the updated rows
        });

        // retrieve property verification id
        console.log('before propertyVerification');
        const propertyVerification = await PropertyVerification.findOne({
            where: { propertyId: req.params.propertyId, isPass: "1" }
        });
        console.log('after propertyVerification');
        console.log('property verification id:', propertyVerification.id);

        // add record to Submit Listing Property
        const submitListingPropertyRecord = await SubmitListingProperty.create({
            submittedDate: new Date().toISOString(),
            resultDate: new Date().toISOString(),
            result: '0',
            propertyVerificationId: propertyVerification.id,
        });

        // add record to Listing Background Check
        const listingBackgroundCheckRecord = await ListingBackgroundCheck.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '-1',
            backgroundCheckServiceId: backgroundCheck,
            submitListingPropertyId: submitListingPropertyRecord.id
        });


        // add record to Listing Background Check
        const listingPropertyInspectionRecord = await ListingPropertyInspection.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '-1',
            propertyInspectionServiceId: inspection,
            submitListingPropertyId: submitListingPropertyRecord.id
        });

        // add record to Listing Background Check
        const listingPropertyValuationRecord = await ListingPropertyValuation.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '-1',
            propertyValuationServiceId: valuation,
            submitListingPropertyId: submitListingPropertyRecord.id
        });

        res.status(200).json({
            status: "success",
            data: {
                account,
                submitListingPropertyRecord,
                listingBackgroundCheckRecord,
                listingPropertyInspectionRecord,
                listingPropertyValuationRecord
            }
        });
    })
};