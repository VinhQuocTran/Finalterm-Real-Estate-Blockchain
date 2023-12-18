const Property = require('../models/Property');
const factory = require('./handlerFactory');
const fileUploader = require('../utils/fileUploader');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { uploadFile } = require('../utils/cloudinaryStorage');
const SubmitListingProperty = require("../models/SubmitListingProperty");
const ListingProperty = require("../models/ListingProperty");
const HyperLedgerService = require('../utils/hyperLedgerService/hyperLedgerService');
const fabricService = new HyperLedgerService();
const getOneProperty = catchAsync(async (req, res, next) => {
    const property = await Property.findOne({ Id: req.params.id });
    const submitListingProperty = await SubmitListingProperty.findOne({ propertyId: property.id });
    const listingProperty = await ListingProperty.findOne({ submitListingPropertyId: submitListingProperty.id });
    await fabricService.initialize();
    await fabricService.connect();
    let result  = await fabricService.evaluateTransaction("getTokenByListingPropertyId",listingProperty.id);
    const token = JSON.parse(result);
    result = await fabricService.evaluateTransaction("getOwnPropertyTokenByUserId",property.accountId);
    const tokenOwnerShip = JSON.parse(result);
    await fabricService.disconnect();
    res.status(200).json({
        status: 'success',
        data: {
            property:property,
            token: token,
            tokenOwnerShip: tokenOwnerShip
        }
    })
});


module.exports = {
    getProperty: factory.getOne(Property),
    getAllProperties: factory.getAll(Property),    
    uploadImage: catchAsync(async (req, res, next) => {
        if (!req.file) return next(new AppError('There is no image file to upload.', 400));
        const data = await uploadFile(req.file, { folder: 'properties' });
        console.log('----- TEST -----');
        console.log(data);
        console.log('----- TEST -----');
        res.json('TEST');
    }),
    uploadSingleFile: fileUploader.single('file', 1),
    createProperty: factory.createOne(Property),
    updateProperty: factory.updateOne(Property),
    resizePropertyPhoto: catchAsync(async (req, res, next) => {
        if (!req.files) return next();

        req.file.filename = `property-${req.user.id}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(500, 500)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`public/images/properties/${req.file.filename}`);

        next();
    }),
    deleteProperty: factory.deleteOne(Property)
};