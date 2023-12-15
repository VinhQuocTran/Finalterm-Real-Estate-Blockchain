const router = require('express').Router();
const propertyManagerController = require('../controllers/propertyManagerController');
const {protect, restrictTo} = require("../controllers/authController");


// router.use(protect);
// router.use(restrictTo('admin'));

router
    .route('/')
    .get(propertyManagerController.getAllPropertyManagers)
    .post(propertyManagerController.createPropertyManager);

router
    .route('/:id')
    .get(propertyManagerController.getPropertyManager)
    .patch(propertyManagerController.updatePropertyManage)
    .delete(propertyManagerController.deletePropertyManager);

module.exports = router;