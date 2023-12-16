const ProposalVoting = require('../models/ProposalVoting');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllProposalVotings: factory.getAll(ProposalVoting),
    getProposalVoting: factory.getOne(ProposalVoting),
    createProposalVoting: factory.createOne(ProposalVoting),
    updateProposalVoting: factory.updateOne(ProposalVoting),
    deleteProposalVoting: factory.deleteOne(ProposalVoting)
};