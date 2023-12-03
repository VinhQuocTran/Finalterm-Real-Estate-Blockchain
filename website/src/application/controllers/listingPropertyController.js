const ListingProperty = require('../models/ListingProperty');
const catchAsync = require('../utils/catchAsync');

const createListingProperty = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};

module.exports = { createListingProperty };