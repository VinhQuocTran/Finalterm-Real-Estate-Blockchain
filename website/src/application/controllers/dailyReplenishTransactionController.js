const DailyReplenishTransaction = require('../models/DailyReplenishTransaction');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllDailyReplenishTransactions: factory.getAll(DailyReplenishTransaction),
    getDailyReplenishTransaction: factory.getOne(DailyReplenishTransaction),
    createDailyReplenishTransaction: factory.createOne(DailyReplenishTransaction),
    updateDailyReplenishTransaction: factory.updateOne(DailyReplenishTransaction),
    deleteDailyReplenishTransaction: factory.deleteOne(DailyReplenishTransaction)
};