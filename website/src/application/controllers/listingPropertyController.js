const ListingProperty = require('../models/ListingProperty');
const factory = require('./handlerFactory');

const createListingProperty = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: 'Test connection'
    })
};


module.exports = {
    getAllListingProperty: factory.getAll(ListingProperty),
    createListingProperty
};