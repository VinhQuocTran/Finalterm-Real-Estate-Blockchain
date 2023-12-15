const router = require('express').Router();
const listingBackgroundCheckController = require('../controllers/listingBackgroundCheckController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', listingBackgroundCheckController.getAllListingBackgroundChecks);
router.get('/:id', listingBackgroundCheckController.getListingBackgroundCheck);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', listingBackgroundCheckController.createListingBackgroundCheck);
router.patch('/:id', listingBackgroundCheckController.updateListingBackgroundCheck);
router.delete('/:id', listingBackgroundCheckController.deleteListingBackgroundCheck);

module.exports = router;