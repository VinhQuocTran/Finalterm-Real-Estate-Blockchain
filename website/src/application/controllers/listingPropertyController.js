const ListingProperty = require('../models/ListingProperty');
const factory = require('./handlerFactory');



module.exports = {
    getAllListingProperty: factory.getAll(ListingProperty),
    createListingProperty: factory.createOne(ListingProperty),
    updateListingProperty: factory.updateOne(ListingProperty),
    getListingProperty: factory.getOne(ListingProperty)
};