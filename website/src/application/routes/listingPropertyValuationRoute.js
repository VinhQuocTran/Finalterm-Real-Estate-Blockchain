const router = require('express').Router();
const listingPropertyValuationController = require('../controllers/listingPropertyValuationController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', listingPropertyValuationController.getAllListingPropertyValuations);
router.get('/:id', listingPropertyValuationController.getListingPropertyValuation);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', listingPropertyValuationController.createListingPropertyValuation);
router.patch('/:id', listingPropertyValuationController.updateListingPropertyValuation);
router.delete('/:id', listingPropertyValuationController.deleteListingPropertyValuation);

module.exports = router;