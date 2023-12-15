const router = require('express').Router();
const submitListingPropertyController = require('../controllers/submitListingPropertyController');
const {restrictTo, protect} = require("../controllers/authController");

// router.use(protect);
// router.use(restrictTo('admin'));

router
    .route('/')
    .get(submitListingPropertyController.getAllSubmitListingProperty)
    .post(submitListingPropertyController.createSubmitListingProperty);

router
    .route('/:id')
    .get(submitListingPropertyController.getSubmitListingProperty)
    .patch(submitListingPropertyController.updateSubmitListingProperty)

module.exports = router;