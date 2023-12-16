const PropertyManager = require('../models/PropertyManager');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllPropertyManagers: factory.getAll(PropertyManager),
    getPropertyManager: factory.getOne(PropertyManager),
    createPropertyManager: factory.createOne(PropertyManager),
    updatePropertyManager: factory.updateOne(PropertyManager),
    deletePropertyManager: factory.deleteOne(PropertyManager)
};
