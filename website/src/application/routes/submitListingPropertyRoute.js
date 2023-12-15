const router = require('express').Router();
const submitListingPropertyController = require('../controllers/submitListingPropertyController');

router.post('/', submitListingPropertyController.createSubmitListingProperty);
router.get('/', submitListingPropertyController.getAllSubmitListingProperties);

module.exports = router;