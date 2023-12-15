const router = require('express').Router();
const propertyInspectionServiceController = require('../controllers/propertyInspectionServiceController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', propertyInspectionServiceController.getAllPropertyInspectionServices);
router.get('/:id', propertyInspectionServiceController.getPropertyInspectionService);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', propertyInspectionServiceController.createPropertyInspectionService);
router.patch('/:id', propertyInspectionServiceController.updatePropertyInspectionService);
router.delete('/:id', propertyInspectionServiceController.deletePropertyInspectionService);

module.exports = router;