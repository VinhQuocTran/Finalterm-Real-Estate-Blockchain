const router = require('express').Router();
const listingPropertyController = require('../controllers/listingPropertyController');
const {protect,restrictTo} = require("../controllers/authController");

// router.use(protect);
// router.use(restrictTo('admin'));

router
    .route('/')
    .get(listingPropertyController.getAllListingProperty)
    .post(listingPropertyController.createListingProperty);

router
    .route('/:id')
    .get(listingPropertyController.getListingProperty)
    .patch(listingPropertyController.updateListingProperty)
module.exports = router;