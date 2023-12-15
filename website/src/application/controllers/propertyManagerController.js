const PropertyManager = require('../models/PropertyManager');
const catchAsync = require('../utils/catchAsync');

const createPropertyManager = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

const getAllPropertyManagers = catchAsync(async (req, res) => {
    const propertyManagers = await PropertyManager.findAll();

    res.status(200).json({
        status: 'success',
        length: propertyManagers.length,
        data: propertyManagers
    })
});

module.exports = { createPropertyManager, getAllPropertyManagers };