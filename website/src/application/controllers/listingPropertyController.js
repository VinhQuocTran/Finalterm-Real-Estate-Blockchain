const ListingProperty = require('../models/ListingProperty');
const catchAsync = require('../utils/catchAsync');

const createListingProperty = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

const getAllListingProperties = catchAsync(async (req, res) => {
    const listingProperties = await ListingProperty.findAll();
    res.status(200).json({
        status: 'success',
        length: listingProperties.length,
        data: listingProperties
    })
});


module.exports = { createListingProperty, getAllListingProperties };