const router = require('express').Router();
const backgroundCheckServiceController = require('../controllers/backgroundCheckServiceController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', backgroundCheckServiceController.getAllBackgroundCheckServices);
router.get('/:id', backgroundCheckServiceController.getBackgroundCheckService);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', backgroundCheckServiceController.createBackgroundCheckService);
router.patch('/:id', backgroundCheckServiceController.updateBackgroundCheckService);
router.delete('/:id', backgroundCheckServiceController.deleteBackgroundCheckService);

module.exports = router;