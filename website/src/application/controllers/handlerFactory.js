const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

const deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.destroy({
            where: { id: req.params.id },
        });

        if (!doc) {
            return next(new AppError("No data found with that ID", 404));
        }

        res.status(204).json({
            status: "success",
            data: null
        });
    });

const updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const [_, updatedRow] = await Model.update(req.body, {
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
    });

const createOne = Model =>
    catchAsync(async (req, res, next) => {
        const doc = await Model.create(req.body);

        res.status(201).json({
            status: "success",
            data: doc
        });
    });

const getOne = (Model, includeOptions) =>
    catchAsync(async (req, res, next) => {
        let options = {};
        if (includeOptions) options.include = includeOptions;

        const doc = await Model.findOne({
            where: { id: req.params.id },
            ...options,
        });

        if (!doc) {
            return next(new AppError("No data found with that ID", 404));
        }

        res.status(200).json({
            status: "success",
            data: doc,
        });
    });


const getAll = Model =>
    catchAsync(async (req, res, next) => {
        // EXECUTE QUERY
        const features = new APIFeatures(Model, req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const docs = await features.execute();

        // SEND RESPONSE
        res.status(200).json({
            status: "success",
            length: docs.length,
            data: docs
        });
    });

module.exports = { getAll, getOne, createOne, updateOne, deleteOne };