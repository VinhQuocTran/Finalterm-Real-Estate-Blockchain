const ListingPropertyInspection = require('../models/ListingPropertyInspection');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllListingPropertyInspections: factory.getAll(ListingPropertyInspection),
    getListingPropertyInspection: factory.getOne(ListingPropertyInspection),
    createListingPropertyInspection: factory.createOne(ListingPropertyInspection),
    updateListingPropertyInspection: factory.updateOne(ListingPropertyInspection),
    deleteListingPropertyInspection: factory.deleteOne(ListingPropertyInspection)
};