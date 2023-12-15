const router = require('express').Router();
const listingPropertyController = require('../controllers/listingPropertyController');

router.post('/', listingPropertyController.createListingProperty);
router.get('/', listingPropertyController.getAllListingProperties);

module.exports = router;