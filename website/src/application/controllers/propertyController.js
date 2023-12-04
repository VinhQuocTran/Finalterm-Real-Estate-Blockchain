const Property = require('../models/Property');
const catchAsync = require('../utils/catchAsync');

const createProperty = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

const getAllProperties = catchAsync(async (req, res) => {
    const properties = await Property.findAll();

    res.status(200).json({
        status: 'success',
        length: properties.length,
        data: properties
    })
});

module.exports = { createProperty, getAllProperties };