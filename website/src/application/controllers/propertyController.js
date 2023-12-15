const Property = require('../models/Property');
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
    updateIsVerified: catchAsync(async (req, res) => {
        const [_, updatedRow] = await Property.update({ isVerified: req.body.isVerified }, {
            where: { id: req.params.id },
            returning: true // Get the updated rows
        });

        if (!updatedRow) {
            return next(new AppError("No data found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: updatedRow
        });

    }),

    // user
    requestVerify: catchAsync(async (req, res, next) => {
        const [_, updatedRow] = await Property.update({isVerified: "0"}, {
            where: { id: req.params.id },
            returning: true // Get the updated rows
        });

        if (!updatedRow) {
            return next(new AppError("No data found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: updatedRow
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