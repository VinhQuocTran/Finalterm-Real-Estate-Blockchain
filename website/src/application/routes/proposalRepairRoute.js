const router = require('express').Router();
const proposalRepairController = require('../controllers/proposalRepairController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', proposalRepairController.getAllProposalRepairs);
router.get('/:id', proposalRepairController.getProposalRepair);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', proposalRepairController.createProposalRepair);
router.patch('/:id', proposalRepairController.updateProposalRepair);
router.delete('/:id', proposalRepairController.deleteProposalRepair);

module.exports = router;