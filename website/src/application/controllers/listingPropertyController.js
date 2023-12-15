const ListingProperty = require('../models/ListingProperty');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllListingPropertys: factory.getAll(ListingProperty),
    getListingProperty: factory.getOne(ListingProperty),
    createListingProperty: factory.createOne(ListingProperty),
    updateListingProperty: factory.updateOne(ListingProperty),
    deleteListingProperty: factory.deleteOne(ListingProperty)
};