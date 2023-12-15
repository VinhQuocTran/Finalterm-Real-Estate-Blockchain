const router = require('express').Router();
const propertyVerificationController = require('../controllers/propertyVerificationController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', propertyVerificationController.getAllPropertyVerifications);
router.get('/:id', propertyVerificationController.getPropertyVerification);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', propertyVerificationController.createPropertyVerification);
router.patch('/:id', propertyVerificationController.updatePropertyVerification);
router.delete('/:id', propertyVerificationController.deletePropertyVerification);

module.exports = router;