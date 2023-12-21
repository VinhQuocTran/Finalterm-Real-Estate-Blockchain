const router = require('express').Router();
const { requestListingProperty, updateIsListed, listingProcess, requestVerify, updateIsVerified } = require('../controllers/customController');
const {protect, restrictTo} = require('../controllers/authController');

// user request listing their property
router.use(protect);

// verify property
router.get('/:propertyId/requestVerify', restrictTo('user'), requestVerify);
router.patch('/:propertyId/updateIsVerified', restrictTo('admin'), updateIsVerified);

// listing property
router.post('/:propertyId/requestListingProperty', restrictTo('user'), requestListingProperty);
router.get('/:propertyId/listingProcess', restrictTo('admin'), listingProcess);
router.post('/:propertyId/updateIsListed', restrictTo('admin'), updateIsListed);

module.exports = router;