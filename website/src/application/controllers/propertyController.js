const Property = require('../models/Property');
const factory = require('./handlerFactory');
const fileUploader = require('../utils/fileUploader');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

module.exports = {
    updateIsVerified: catchAsync(async (req, res) => {
        const [updatedRowsCount, updatedRows] = await Model.update({ isVerified: req.body.isVerified }, {
            where: { id: req.params.id },
            returning: true // Get the updated rows
        });

        if (updatedRowsCount === 0) {
            return next(new AppError("No data found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: updatedRows
        });

    }),
    createProperty: factory.createOne(Property),
    getProperty: factory.getOne(Property),
    getAllProperties: factory.getAll(Property),
    updateProperty: factory.updateOne(Property),
    uploadPropertyPhoto: fileUploader.single('file', 1),
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