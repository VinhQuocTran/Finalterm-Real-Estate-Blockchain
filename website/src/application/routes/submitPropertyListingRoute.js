const router = require('express').Router();
const submitPropertyListingController = require('../controllers/submitPropertyListingController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', submitPropertyListingController.getAllSubmitPropertyListing);
router.get('/:id', submitPropertyListingController.getSubmitPropertyListing);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', submitPropertyListingController.createSubmitPropertyListing);
router.patch('/:id', submitPropertyListingController.updateSubmitPropertyListing);
router.delete('/:id', submitPropertyListingController.deleteSubmitPropertyListing);

module.exports = router;