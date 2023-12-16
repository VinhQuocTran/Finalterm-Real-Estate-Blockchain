const ProposalRepair = require('../models/ProposalRepair');
const factory = require('../controllers/handlerFactory');

module.exports = {
    getAllProposalRepairs: factory.getAll(ProposalRepair),
    getProposalRepair: factory.getOne(ProposalRepair),
    createProposalRepair: factory.createOne(ProposalRepair),
    updateProposalRepair: factory.updateOne(ProposalRepair),
    deleteProposalRepair: factory.deleteOne(ProposalRepair)
};