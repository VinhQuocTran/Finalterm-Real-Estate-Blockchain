const router = require('express').Router();
const operatingReserveController = require('../controllers/operatingReserveController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', operatingReserveController.getAllOperatingReserves);
router.get('/:id', operatingReserveController.getOperatingReserve);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', operatingReserveController.createOperatingReserve);
router.patch('/:id', operatingReserveController.updateOperatingReserve);
router.delete('/:id', operatingReserveController.deleteOperatingReserve);

module.exports = router;