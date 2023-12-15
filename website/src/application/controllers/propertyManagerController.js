const PropertyManager = require('../models/PropertyManager');
const factory = require("./handlerFactory");

module.exports = {
    getAllPropertyManagers: factory.getAll(PropertyManager),
    createPropertyManager: factory.createOne(PropertyManager),
    updatePropertyManage: factory.updateOne(PropertyManager),
    getPropertyManager: factory.getOne(PropertyManager),
    deletePropertyManager: factory.deleteOne(PropertyManager)
};
