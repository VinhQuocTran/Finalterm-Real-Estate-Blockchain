const OperatingReserve = require('../models/OperatingReserve');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllOperatingReserves: factory.getAll(OperatingReserve),
    getOperatingReserve: factory.getOne(OperatingReserve),
    createOperatingReserve: factory.createOne(OperatingReserve),
    updateOperatingReserve: factory.updateOne(OperatingReserve),
    deleteOperatingReserve: factory.deleteOne(OperatingReserve)
};