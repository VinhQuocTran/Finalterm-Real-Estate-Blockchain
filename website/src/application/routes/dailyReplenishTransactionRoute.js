const router = require('express').Router();
const dailyReplenishTransactionController = require('../controllers/dailyReplenishTransactionController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', dailyReplenishTransactionController.getAllDailyReplenishTransactions);
router.get('/:id', dailyReplenishTransactionController.getDailyReplenishTransaction);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', dailyReplenishTransactionController.createDailyReplenishTransaction);
router.patch('/:id', dailyReplenishTransactionController.updateDailyReplenishTransaction);
router.delete('/:id', dailyReplenishTransactionController.deleteDailyReplenishTransaction);

module.exports = router;