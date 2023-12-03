const router = require('express').Router();
const submitListingPropertyController = require('../controllers/submitListingPropertyController');

router.post('/', submitListingPropertyController.createSubmitListingProperty);

module.exports = router;