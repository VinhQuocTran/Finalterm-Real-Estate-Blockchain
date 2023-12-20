const HyperLedgerService = require('../utils/hyperLedgerService/hyperLedgerService');
const Property = require('../models/Property');
const SubmitPropertyListing = require('../models/SubmitPropertyListing');
const ListingBackgroundCheck = require('../models/ListingBackgroundCheck');
const ListingPropertyInspection = require('../models/ListingPropertyInspection');
const ListingPropertyValuation = require('../models/ListingPropertyValuation');
const SubmitPropertyVerification = require('../models/SubmitPropertyVerification');
const BackgroundCheckService = require('../models/BackgroundCheckService');
const PropertyInspectionService = require('../models/PropertyInspectionService');
const PropertyValuationService = require('../models/PropertyValuationService');
const ListingProperty = require('../models/ListingProperty');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const fabricService = new HyperLedgerService();
const cron = require('node-cron');

module.exports = {
    requestVerify: catchAsync(async (req, res, next) => {
        // update property's isVerified status to pending
        const updatedProperty = await Property.update({ isVerified: "0" }, {
            where: { id: req.params.propertyId }
        });

        if (!updatedProperty[0]) return next(new AppError("No data found with that ID", 404));

        // save record to Submit Property Verification table
        const record = await SubmitPropertyVerification.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '0',
            propertyId: req.params.propertyId,
        });

        res.status(200).json({
            status: "success",
            record
        });
    }),
    updateIsVerified: catchAsync(async (req, res, next) => {
        // check property is pending or not
        const submitPropertyVerification = await SubmitPropertyVerification.findOne({
            where: {
                propertyId: req.params.propertyId,
                isPass: '0'
            }
        });

        if (!submitPropertyVerification) return next(new AppError(`This property ${req.params.propertyId} is not pending yet.`, 404));

        // update property's verify status to:
        //  + isVerified = -1 => not accept
        //  + isVerified =  1 => accept
        await Property.update({ isVerified: req.body.isVerified }, {
            where: { id: req.params.propertyId }
        });

        // add record to SubmitPropertyVerification        
        const record = await SubmitPropertyVerification.create({
            createdDate: submitPropertyVerification.createdDate,
            finishedDate: new Date().toISOString(),
            isPass: req.body.isVerified,
            propertyId: req.params.propertyId,
        });

        res.status(200).json({
            status: "success",
            data: record
        });
    }),
    requestListingProperty: catchAsync(async (req, res, next) => {
        const { backgroundCheck, inspection, valuation } = req.body;
        const totalPrice = parseInt(req.body.totalPrice);

        // get user by id
        await fabricService.initialize();
        await fabricService.connect();
        const user = await fabricService.evaluateTransaction("queryUser", req.user.id);

        // check user's cash balance 
        if (user.cash_balance < totalPrice) return next(new AppError('Cash balance amount is not valid', 400));

        // withdraw and update
        await fabricService.submitTransaction("getWithDrawByUserId", req.user.id, totalPrice);
        const updatedUser = await fabricService.evaluateTransaction("queryUser", req.user.id);

        // update property's isListed to pending
        await Property.update({ isListed: "0" }, {
            where: { id: req.params.propertyId }
        });

        // retrieve property verification id
        const submitPropertyVerification = await SubmitPropertyVerification.findOne({
            where: { 
                propertyId: req.params.propertyId, 
                isPass: "1" 
            }
        });

        // save record to Submit Property Listing table
        const submitPropertyListingRecord = await SubmitPropertyListing.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '0',
            submitPropertyVerificationId: submitPropertyVerification.id,
        });

        // save record to Listing Background Check table
        const listingBackgroundCheckRecord = await ListingBackgroundCheck.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '-1',
            backgroundCheckServiceId: backgroundCheck,
            submitPropertyListingId: submitPropertyListingRecord.id
        });

        // save record to Listing Property Inspection table
        const listingPropertyInspectionRecord = await ListingPropertyInspection.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '-1',
            propertyInspectionServiceId: inspection,
            submitPropertyListingId: submitPropertyListingRecord.id
        });

        // add record to Listing Background Check
        const listingPropertyValuationRecord = await ListingPropertyValuation.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '-1',
            valuationAmount: 0,
            propertyValuationServiceId: valuation,
            submitPropertyListingId: submitPropertyListingRecord.id
        });

        res.status(200).json({
            status: "success",
            data: {
                account: {
                    cashBalance: updatedUser.cash_balance
                },
                submitPropertyListingRecord,
                listingBackgroundCheckRecord,
                listingPropertyInspectionRecord,
                listingPropertyValuationRecord
            }
        });
    }),
    listingProcess: catchAsync(async (req, res, next) => {
        // retrieve property 
        const property = await Property.findOne({
            where: {
                id: req.params.propertyId
            }
        });

        // retrieve property verification
        const submitPropertyVerification = await SubmitPropertyVerification.findOne({
            where: {
                isPass: "1",
                propertyId: property.id
            }
        });

        // retrieve submit listing property
        const submitPropertyListing = await SubmitPropertyListing.findOne({
            where: {
                isPass: "0",
                submitPropertyVerificationId: submitPropertyVerification.id
            }
        });

        // retrieve listing background check
        const listingBackgroundCheck = await ListingBackgroundCheck.findOne({
            where: {
                submitPropertyListingId: submitPropertyListing.id,
                isPass: "-1"
            }
        });

        const backgroundCheckService = await BackgroundCheckService.findOne({
            where: {
                id: listingBackgroundCheck.backgroundCheckServiceId
            }
        });

        // retrieve listing property inspection service
        const listingPropertyInspection = await ListingPropertyInspection.findOne({
            where: {
                submitPropertyListingId: submitPropertyListing.id,
                isPass: "-1"
            }
        });

        const propertyInspectionService = await PropertyInspectionService.findOne({
            where: {
                id: listingPropertyInspection.propertyInspectionServiceId
            }
        });

        // retrieve listing property valuation service
        const listingPropertyValuation = await ListingPropertyValuation.findOne({
            where: {
                submitPropertyListingId: submitPropertyListing.id,
                isPass: "-1"
            }
        });

        const propertyValuationService = await PropertyValuationService.findOne({
            where: {
                id: listingPropertyValuation.propertyValuationServiceId
            }
        });

        return res.status(200).json({
            status: 'success',
            data: {
                propertyId: property.id,
                userId: property.accountId,
                createdDate: submitPropertyListing.createdDate,
                backgroundCheck: {
                    serviceUsed: backgroundCheckService.name,
                    serviceUsedId: backgroundCheckService.id,
                    costOfService: backgroundCheckService.feePerTime,
                    result: listingBackgroundCheck.isPass
                },
                houseInspection: {
                    serviceUsed: propertyInspectionService.name,
                    serviceUsedId: propertyInspectionService.id,
                    costOfService: propertyInspectionService.feePerTime,
                    result: listingPropertyInspection.isPass
                },
                houseValuation: {
                    serviceUsed: propertyValuationService.name,
                    serviceUsedId: propertyValuationService.id,
                    costOfService: propertyValuationService.feePerTime,
                    valuationAmount: listingPropertyValuation.valuationAmount,
                    result: listingPropertyValuation.isPass
                }
            }
        });
    }),
    updateIsListed: catchAsync(async (req, res, next) => {
        const {
            backgroundCheckServiceId,
            isPassListingBackgroundCheck,
            propertyInspectionServiceId,
            isPassListingPropertyInspection,
            propertyValuationServiceId,
            isPassListingPropertyValuation,
            valuationAmount,
            monthlyRent
        } = req.body;

        // retrieve submit property verification that is verified
        const submitPropertyVerification = await SubmitPropertyVerification.findOne({
            where: { propertyId: req.params.propertyId, isPass: "1" }
        });

        // retrieve submit listing property that is pending
        const submitPropertyListingPending = await SubmitPropertyListing.findOne({
            where: { submitPropertyVerificationId: submitPropertyVerification.id, isPass: "0" }
        });

        // create a temp Submit Property Listing instance (will be updated isPass later)
        const submitPropertyListing = await SubmitPropertyListing.create({
            createdDate: submitPropertyListingPending.createdDate,
            finishedDate: new Date().toISOString(),
            isPass: "0",
            submitPropertyVerificationId: submitPropertyVerification.id
        });

        // save new record to Listing Background Check table
        const listingBackgroundCheck = await ListingBackgroundCheck.create({
            submitPropertyListingId: submitPropertyListing.id,
            createdDate: submitPropertyListingPending.createdDate,
            finishedDate: new Date().toISOString(),
            isPass: isPassListingBackgroundCheck,
            backgroundCheckServiceId
        });

        // save new record to Listing Property Inspection table
        const listingPropertyInspection = await ListingPropertyInspection.create({
            submitPropertyListingId: submitPropertyListing.id,
            createdDate: submitPropertyListingPending.createdDate,
            finishedDate: new Date().toISOString(),
            isPass: isPassListingPropertyInspection,
            propertyInspectionServiceId
        });

        // save new record to Listing Property Valuation table
        const listingPropertyValuation = await ListingPropertyValuation.create({
            submitPropertyListingId: submitPropertyListing.id,
            createdDate: submitPropertyListingPending.createdDate,
            finishedDate: new Date().toISOString(),
            isPass: isPassListingPropertyValuation,
            valuationAmount,
            propertyValuationServiceId
        });

        // update Submit Listing Property's isPass status
        let isPassUpdated = "1";

        if (isPassListingBackgroundCheck === "-1" || isPassListingPropertyInspection === "-1" || isPassListingPropertyValuation === "-1") {
            isPassUpdated = "-1";
        }

        submitPropertyListing.isPass = isPassUpdated;
        await submitPropertyListing.save();

        // update Property's isListed status

        const property = await Property.findOne({
            where: { id: req.params.propertyId }
        });

        property.isListed = isPassUpdated;
        await property.save();

        if(isPassUpdated === "1") {
            // create listing property
            const listingProperty = await ListingProperty.create({
                monthlyRent,
                listedDate: new Date().toISOString(),
                propertyValuation: valuationAmount,
                propertyManagerId: req.user.id,
                submitPropertyListingId: submitPropertyListing.id
            })
            // tokenize property
            await fabricService.initialize();
            await fabricService.connect();
            await fabricService.submitTransaction("getTokenizeProperty", property.accountId, listingProperty.id, valuationAmount);
            const token = await fabricService.evaluateTransaction("getTokenByListingPropertyId", listingProperty.id);
            await fabricService.disconnect();
            return res.status(200).json({
                status: 'success',
                data: {
                    submitPropertyListing: {
                        isPass: isPassUpdated
                    },
                    listingBackgroundCheck,
                    listingPropertyInspection,
                    listingPropertyValuation,
                    listingProperty,
                    token
                }
            });
        }
        
        res.status(200).json({
            status: 'success',
            data: {
                submitPropertyListing: {
                    isPass: isPassUpdated
                },
                listingBackgroundCheck,
                listingPropertyInspection,
                listingPropertyValuation
            }
        });
    }),    

    // get matching offers
    getMatchingOffers: catchAsync(async (req, res, next) => {
        const transaction_date = new Date().toISOString();
        await fabricService.initialize();
        await fabricService.connect();
        await fabricService.submitTransaction("matchingOffers",`${transaction_date}`);
        await fabricService.disconnect();
    }),
    // get payment daily rent
    getPaymentDailyRent: catchAsync(async (req, res, next) => {
            const transaction_date = new Date().toISOString();
            const getAllListingProperties = await ListingProperty.findAll();
            for(const listingProperty of getAllListingProperties){
                let listing_property_id = listingProperty.id;
                let monthly_rent = listingProperty.monthlyRent;
                await fabricService.initialize();
                await fabricService.connect();
                await fabricService.submitTransaction("getPaymentRentDaily",listing_property_id,monthly_rent,`${transaction_date}`);
                await fabricService.disconnect();
            }
    }),
    startMatchingOffersTask: (getMatchingOffers) => {
        cron.schedule('*/30 * * * * *', async () => {
            console.log('Running rent payment task every 30 seconds...');
            try {
                await getMatchingOffers();
                console.log('Rent payment task completed successfully.');
            } catch (error) {
                console.error('Error in rent payment task:', error);
            }
        });
    },
    startPaymentDailyRentTask: (getPaymentDailyRent) => {
        // 0 0 * * * 1 day
        // */30 * * * * * 30 seconds
        cron.schedule('0 0 * * *', async () => {
            console.log('Running daily rent payment task...');
            try {
                await getPaymentDailyRent();
                console.log('Daily rent payment task completed successfully.');
            } catch (error) {
                console.error('Error in daily rent payment task:', error);
            }
        });
    }
};