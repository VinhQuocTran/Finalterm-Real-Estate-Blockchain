const router = require('express').Router();
const propertyController = require('../controllers/propertyController');

router.post('/', propertyController.createProperty);

module.exports = router;