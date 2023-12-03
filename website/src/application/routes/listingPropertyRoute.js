const router = require('express').Router();
const listingPropertyController = require('../controllers/listingPropertyController');

router.post('/', listingPropertyController.createListingProperty);

module.exports = router;