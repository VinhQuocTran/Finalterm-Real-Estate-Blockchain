const router = require('express').Router();
const propertyManagerController = require('../controllers/propertyManagerController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', propertyManagerController.getAllPropertyManagers);
router.get('/:id', propertyManagerController.getPropertyManager);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', propertyManagerController.createPropertyManager);
router.patch('/:id', propertyManagerController.updatePropertyManager);
router.delete('/:id', propertyManagerController.deletePropertyManager);

module.exports = router;