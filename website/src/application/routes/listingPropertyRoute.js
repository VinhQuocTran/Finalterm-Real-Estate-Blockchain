const router = require('express').Router();
const listingPropertyController = require('../controllers/listingPropertyController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', listingPropertyController.getAllListingPropertys);
router.get('/:id', listingPropertyController.getListingProperty);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', listingPropertyController.createListingProperty);
router.patch('/:id', listingPropertyController.updateListingProperty);
router.delete('/:id', listingPropertyController.deleteListingProperty);

module.exports = router;