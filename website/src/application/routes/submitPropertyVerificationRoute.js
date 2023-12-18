const router = require('express').Router();
const submitPropertyVerificationController = require('../controllers/submitPropertyVerificationController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', submitPropertyVerificationController.getAllSubmitPropertyVerifications);
router.get('/:id', submitPropertyVerificationController.getSubmitPropertyVerification);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', submitPropertyVerificationController.createSubmitPropertyVerification);
router.patch('/:id', submitPropertyVerificationController.updateSubmitPropertyVerification);
router.delete('/:id', submitPropertyVerificationController.deleteSubmitPropertyVerification);

module.exports = router;