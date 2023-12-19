const router = require('express').Router();
const propertyController = require('../controllers/propertyController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getProperty);
router.get('/detail/:id', propertyController.getDetailProperty);

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('user'))
router.get('/getTokenOwnership/:user_id/:token_id', propertyController.getTokenOwnerShip);
router.post('/', propertyController.createProperty);
router.patch('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;
