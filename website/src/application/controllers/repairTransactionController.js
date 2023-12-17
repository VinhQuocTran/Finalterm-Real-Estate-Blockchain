const RepairTransaction = require('../models/RepairTransaction');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllRepairTransactions: factory.getAll(RepairTransaction),
    getRepairTransaction: factory.getOne(RepairTransaction),
    createRepairTransaction: factory.createOne(RepairTransaction),
    updateRepairTransaction: factory.updateOne(RepairTransaction),
    deleteRepairTransaction: factory.deleteOne(RepairTransaction)
};