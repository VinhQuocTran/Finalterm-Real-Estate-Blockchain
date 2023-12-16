const router = require('express').Router();
const listingPropertyController = require('../controllers/listingPropertyController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', listingPropertyController.getAllListingProperty);
router.get('/:id', listingPropertyController.getListingProperty);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', listingPropertyController.createListingProperty);
router.patch('/:id', listingPropertyController.updateListingProperty);
router.delete('/:id', listingPropertyController.deleteListingProperty);

router
    .route('/')
    .get(listingPropertyController.getAllListingProperty)
    .post(listingPropertyController.createListingProperty);

router
    .route('/:id')
    .get(listingPropertyController.getListingProperty)
    .patch(listingPropertyController.updateListingProperty)
module.exports = router;