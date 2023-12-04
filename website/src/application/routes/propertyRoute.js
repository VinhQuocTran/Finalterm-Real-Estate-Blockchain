const router = require('express').Router();
const propertyController = require('../controllers/propertyController');

router.post('/', propertyController.createProperty);
router.get('/', propertyController.getAllProperties);

module.exports = router;