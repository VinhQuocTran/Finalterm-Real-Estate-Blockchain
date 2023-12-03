const SubmitListingProperty = require('../models/SubmitListingProperty');
const catchAsync = require('../utils/catchAsync');

const createSubmitListingProperty = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

module.exports = { createSubmitListingProperty };