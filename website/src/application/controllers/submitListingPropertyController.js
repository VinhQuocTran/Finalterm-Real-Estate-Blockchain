const SubmitListingProperty = require('../models/SubmitListingProperty');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllSubmitListingPropertys: factory.getAll(SubmitListingProperty),
    getSubmitListingProperty: factory.getOne(SubmitListingProperty),
    createSubmitListingProperty: factory.createOne(SubmitListingProperty),
    updateSubmitListingProperty: factory.updateOne(SubmitListingProperty),
    deleteSubmitListingProperty: factory.deleteOne(SubmitListingProperty)
};