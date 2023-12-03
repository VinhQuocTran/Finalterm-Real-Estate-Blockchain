const router = require('express').Router();
const propertyManagerController = require('../controllers/propertyManagerController');

router.post('/', propertyManagerController.createPropertyManager);

module.exports = router;