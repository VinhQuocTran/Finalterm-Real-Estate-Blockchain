const router = require('express').Router();
const propertyController = require('../controllers/propertyController');
const { protect, restrictTo } = require('../controllers/authController');


router.get('/:id/requestVerify', protect, restrictTo('user'), propertyController.requestVerify);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getProperty);

// Protect all routes after this middleware
router.use(protect);

router.patch('/:id/updateIsVerified', restrictTo('admin'), propertyController.updateIsVerified);

router.post('/', restrictTo('user'), propertyController.createProperty);
// router.post('/uploadImage', propertyController.uploadSingleFile, propertyController.uploadImage);
router.patch('/:id', restrictTo('user'), propertyController.updateProperty);
router.delete('/:id', restrictTo('user'), propertyController.deleteProperty);

module.exports = router;