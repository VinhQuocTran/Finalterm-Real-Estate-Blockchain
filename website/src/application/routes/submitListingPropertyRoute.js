const router = require('express').Router();
const submitListingPropertyController = require('../controllers/submitListingPropertyController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', submitListingPropertyController.getAllSubmitListingProperty);
router.get('/:id', submitListingPropertyController.getSubmitListingProperty);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', submitListingPropertyController.createSubmitListingProperty);
router.patch('/:id', submitListingPropertyController.updateSubmitListingProperty);
router.delete('/:id', submitListingPropertyController.deleteSubmitListingProperty);

module.exports = router;