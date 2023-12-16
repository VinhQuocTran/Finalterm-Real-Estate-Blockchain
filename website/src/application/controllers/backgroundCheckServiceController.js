const BackgroundCheckService = require('../models/BackgroundCheckService');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllBackgroundCheckServices: factory.getAll(BackgroundCheckService),
    getBackgroundCheckService: factory.getOne(BackgroundCheckService),
    createBackgroundCheckService: factory.createOne(BackgroundCheckService),
    updateBackgroundCheckService: factory.updateOne(BackgroundCheckService),
    deleteBackgroundCheckService: factory.deleteOne(BackgroundCheckService)
};