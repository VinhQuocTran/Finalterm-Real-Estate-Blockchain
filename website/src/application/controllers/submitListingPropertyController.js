const SubmitListingProperty = require('../models/SubmitListingProperty');
const catchAsync = require('../utils/catchAsync');

const createSubmitListingProperty = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

const getAllSubmitListingProperties = catchAsync(async (req, res) => {
    const submitListingProperties = await SubmitListingProperty.findAll();

    res.status(200).json({
        status: 'success',
        length: submitListingProperties.length,
        data: submitListingProperties
    })
});


module.exports = { createSubmitListingProperty, getAllSubmitListingProperties };