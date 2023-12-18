const router = require('express').Router();
const { requestListingProperty } = require('../controllers/customController');
const {protect, restrictTo} = require('../controllers/authController');

// user request listing their property
router.use(protect);
router.post('/:propertyId/requestListingProperty', restrictTo('user'), requestListingProperty);

module.exports = router;