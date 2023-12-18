const SubmitPropertyVerification = require('../models/SubmitPropertyVerification');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllSubmitPropertyVerifications: factory.getAll(SubmitPropertyVerification),
    getSubmitPropertyVerification: factory.getOne(SubmitPropertyVerification),
    createSubmitPropertyVerification: factory.createOne(SubmitPropertyVerification),
    updateSubmitPropertyVerification: factory.updateOne(SubmitPropertyVerification),
    deleteSubmitPropertyVerification: factory.deleteOne(SubmitPropertyVerification)
};