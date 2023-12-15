const SubmitListingProperty = require('../models/SubmitListingProperty');
const factory = require("./handlerFactory");


module.exports = {
    getAllSubmitListingProperty: factory.getAll(SubmitListingProperty),
    createSubmitListingProperty: factory.createOne(SubmitListingProperty),
    updateSubmitListingProperty: factory.updateOne(SubmitListingProperty),
    getSubmitListingProperty: factory.getOne(SubmitListingProperty)
};

