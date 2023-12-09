const router = require('express').Router();
const propertyController = require('../controllers/propertyController');
const { protect } = require('../controllers/authController');

router.get('/', propertyController.getAllProperties);

// Protect all routes after this middleware
router.use(protect);
router.post('/', propertyController.createProperty);
router.patch('/uploadPhoto',
    propertyController.uploadPropertyPhoto,
    propertyController.resizePropertyPhoto,
    propertyController.updateProperty
);

module.exports = router;