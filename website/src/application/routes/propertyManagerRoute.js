const router = require('express').Router();
const propertyManagerController = require('../controllers/propertyManagerController');

router.post('/', propertyManagerController.createPropertyManager);
router.get('/', propertyManagerController.getAllPropertyManagers);

module.exports = router;