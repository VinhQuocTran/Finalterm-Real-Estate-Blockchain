const PropertyManager = require('../models/PropertyManager');
const catchAsync = require('../utils/catchAsync');

const createPropertyManager = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

module.exports = { createPropertyManager };