const router = require('express').Router();
const proposalVotingController = require('../controllers/proposalVotingController');
const { protect, restrictTo } = require('../controllers/authController');

router.get('/', proposalVotingController.getAllProposalVotings);
router.get('/:id', proposalVotingController.getProposalVoting);

router.use(protect);
router.use(restrictTo('admin'));

router.post('/', proposalVotingController.createProposalVoting);
router.patch('/:id', proposalVotingController.updateProposalVoting);
router.delete('/:id', proposalVotingController.deleteProposalVoting);

module.exports = router;