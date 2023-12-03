const Property = require('../models/Property');
const catchAsync = require('../utils/catchAsync');

const createProperty = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

module.exports = { createProperty };