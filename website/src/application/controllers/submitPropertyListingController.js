const SubmitPropertyListing = require('../models/SubmitPropertyListing');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllSubmitPropertyListing: factory.getAll(SubmitPropertyListing),
    createSubmitPropertyListing: factory.createOne(SubmitPropertyListing),
    updateSubmitPropertyListing: factory.updateOne(SubmitPropertyListing),
    getSubmitPropertyListing: factory.getOne(SubmitPropertyListing),
    deleteSubmitPropertyListing: factory.deleteOne(SubmitPropertyListing)
};