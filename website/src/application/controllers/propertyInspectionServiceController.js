const PropertyInspectionService = require('../models/PropertyInspectionService');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllPropertyInspectionServices: factory.getAll(PropertyInspectionService),
    getPropertyInspectionService: factory.getOne(PropertyInspectionService),
    createPropertyInspectionService: factory.createOne(PropertyInspectionService),
    updatePropertyInspectionService: factory.updateOne(PropertyInspectionService),
    deletePropertyInspectionService: factory.deleteOne(PropertyInspectionService)
};