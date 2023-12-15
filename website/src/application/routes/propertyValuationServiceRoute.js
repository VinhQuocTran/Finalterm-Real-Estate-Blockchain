const router = require('express').Router();
const propertyValuationServiceController = require('../controllers/propertyValuationServiceController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', propertyValuationServiceController.getAllPropertyValuationServices);
router.get('/:id', propertyValuationServiceController.getPropertyValuationService);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', propertyValuationServiceController.createPropertyValuationService);
router.patch('/:id', propertyValuationServiceController.updatePropertyValuationService);
router.delete('/:id', propertyValuationServiceController.deletePropertyValuationService);

module.exports = router;