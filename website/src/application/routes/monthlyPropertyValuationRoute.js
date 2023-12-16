const router = require('express').Router();
const monthlyPropertyValuationController = require('../controllers/monthlyPropertyValuationController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', monthlyPropertyValuationController.getAllMonthlyPropertyValuations);
router.get('/:id', monthlyPropertyValuationController.getMonthlyPropertyValuation);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', monthlyPropertyValuationController.createMonthlyPropertyValuation);
router.patch('/:id', monthlyPropertyValuationController.updateMonthlyPropertyValuation);
router.delete('/:id', monthlyPropertyValuationController.deleteMonthlyPropertyValuation);

module.exports = router;