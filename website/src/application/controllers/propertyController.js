const Property = require('../models/Property');
const PropertyVerification = require('../models/PropertyVerification');
const factory = require('./handlerFactory');
const fileUploader = require('../utils/fileUploader');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { uploadFile } = require('../utils/cloudinaryStorage');

module.exports = {
    // both
    getProperty: factory.getOne(Property),
    getAllProperties: factory.getAll(Property),

    // admin
    updateIsVerified: catchAsync(async (req, res, next) => {
        // check property is pending or not
        const propertyVerification = await PropertyVerification.findOne({
            where: {
                propertyId: req.params.id,
                isPass: '0'
            }
        });

        if (!propertyVerification) return next(new AppError('This property is not pending yet.', 404));

        // update property's verify status
        // isVerified = -1 => not accept
        // isVerified =  1 => accept
        const [_, updatedRow] = await Property.update({ isVerified: req.body.isVerified }, {
            where: { id: req.params.id },
            returning: true // Get the updated rows
        });

        if (!updatedRow) return next(new AppError("No data found with that ID", 404));

        // add record to PropertyVerification        
        const record = await PropertyVerification.create({
            createdDate: propertyVerification.createdDate,
            finishedDate: new Date().toISOString(),
            isPass: req.body.isVerified === "1" ? "1" : "-1",
            propertyId: req.params.id,
        });

        res.status(200).json({
            status: "success",
            data: record
        });
    }),

    updateIsListed: catchAsync(async (req, res, next) => {
        // retrieve property verification id
        const propertyVerification = await PropertyVerification.findOne({
            where: {
                propertyId: req.params.id,
                isPass: "1"
            }
        });

        // check submit listing property is pending or not
        const submitListingProperty = await SubmitListingProperty.findOne({
            where: {
                propertyVerificationId: propertyVerification.id,
                isPass: '0'
            }
        });

        if (!submitListingProperty) return next(new AppError('This submit listing property is not pending yet.', 404));

        // update property's isListed status
        // isListed = -1 => not accept
        // isListed =  1 => accept
        await Property.update({ isVerified: req.body.isListed }, {
            where: { id: req.params.id },
            returning: true // Get the updated rows
        });

        // add record to PropertyVerification        
        const record = await SubmitListingProperty.create({
            submittedDate: submitListingProperty.submittedDate,
            resultDate: new Date().toISOString(),
            result: req.body.isListed === "1" ? "1" : "-1",
            propertyVerificationId: propertyVerification.id,
        });

        res.status(200).json({
            status: "success",
            data: record
        });
    }),

    // user
    requestVerify: catchAsync(async (req, res, next) => {
        const [_, updatedRow] = await Property.update({ isVerified: "0" }, {
            where: { id: req.params.id },
            returning: true // get the updated rows
        });

        if (!updatedRow) {
            return next(new AppError("No data found with that ID", 404));
        }

        // add record to PropertyVerification
        const record = await PropertyVerification.create({
            createdDate: new Date().toISOString(),
            finishedDate: new Date().toISOString(),
            isPass: '0',
            propertyId: req.params.id,
        });

        res.status(200).json({
            status: "success",
            record
        });
    }),
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