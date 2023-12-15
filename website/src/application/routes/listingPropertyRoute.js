const router = require('express').Router();
const listingPropertyController = require('../controllers/listingPropertyController');

router.post('/', listingPropertyController.createListingProperty);
router.get('/', listingPropertyController.getAllListingProperty);

module.exports = router;