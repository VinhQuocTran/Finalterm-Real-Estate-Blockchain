const router = require('express').Router();
const repairTransactionController = require('../controllers/repairTransactionController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', repairTransactionController.getAllRepairTransactions);
router.get('/:id', repairTransactionController.getRepairTransaction);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', repairTransactionController.createRepairTransaction);
router.patch('/:id', repairTransactionController.updateRepairTransaction);
router.delete('/:id', repairTransactionController.deleteRepairTransaction);

module.exports = router;