const PropertyVerification = require('../models/PropertyVerification');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllPropertyVerifications: factory.getAll(PropertyVerification),
    getPropertyVerification: factory.getOne(PropertyVerification),
    createPropertyVerification: factory.createOne(PropertyVerification),
    updatePropertyVerification: factory.updateOne(PropertyVerification),
    deletePropertyVerification: factory.deleteOne(PropertyVerification)
};