const ListingPropertyValuation = require('../models/ListingPropertyValuation');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllListingPropertyValuations: factory.getAll(ListingPropertyValuation),
    getListingPropertyValuation: factory.getOne(ListingPropertyValuation),
    createListingPropertyValuation: factory.createOne(ListingPropertyValuation),
    updateListingPropertyValuation: factory.updateOne(ListingPropertyValuation),
    deleteListingPropertyValuation: factory.deleteOne(ListingPropertyValuation)
};