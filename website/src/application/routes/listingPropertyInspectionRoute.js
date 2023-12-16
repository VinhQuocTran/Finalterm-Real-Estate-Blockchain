const router = require('express').Router();
const listingPropertyInspectionController = require('../controllers/listingPropertyInspectionController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', listingPropertyInspectionController.getAllListingPropertyInspections);
router.get('/:id', listingPropertyInspectionController.getListingPropertyInspection);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', listingPropertyInspectionController.createListingPropertyInspection);
router.patch('/:id', listingPropertyInspectionController.updateListingPropertyInspection);
router.delete('/:id', listingPropertyInspectionController.deleteListingPropertyInspection);

module.exports = router;