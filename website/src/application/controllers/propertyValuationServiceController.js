const PropertyValuationService = require('../models/PropertyValuationService');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllPropertyValuationServices: factory.getAll(PropertyValuationService),
    getPropertyValuationService: factory.getOne(PropertyValuationService),
    createPropertyValuationService: factory.createOne(PropertyValuationService),
    updatePropertyValuationService: factory.updateOne(PropertyValuationService),
    deletePropertyValuationService: factory.deleteOne(PropertyValuationService)
};