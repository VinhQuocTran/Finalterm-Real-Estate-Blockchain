const ListingBackgroundCheck = require('../models/ListingBackgroundCheck');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllListingBackgroundChecks: factory.getAll(ListingBackgroundCheck),
    getListingBackgroundCheck: factory.getOne(ListingBackgroundCheck),
    createListingBackgroundCheck: factory.createOne(ListingBackgroundCheck),
    updateListingBackgroundCheck: factory.updateOne(ListingBackgroundCheck),
    deleteListingBackgroundCheck: factory.deleteOne(ListingBackgroundCheck)
};