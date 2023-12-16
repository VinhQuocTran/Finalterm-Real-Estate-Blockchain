const MonthlyPropertyValuation = require('../models/MonthlyPropertyValuation');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllMonthlyPropertyValuations: factory.getAll(MonthlyPropertyValuation),
    getMonthlyPropertyValuation: factory.getOne(MonthlyPropertyValuation),
    createMonthlyPropertyValuation: factory.createOne(MonthlyPropertyValuation),
    updateMonthlyPropertyValuation: factory.updateOne(MonthlyPropertyValuation),
    deleteMonthlyPropertyValuation: factory.deleteOne(MonthlyPropertyValuation)
};