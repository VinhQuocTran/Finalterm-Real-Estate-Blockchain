const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Account = require('../models/Account');
const ProposalRepair = require('../models/ProposalRepair');

const ProposalVoting = sequelize.define('', {
    voteDecision: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    voteDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    accountId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    proposalRepairId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE
    }
}, {
    tableName: 'ProposalVotings',
    timestamps: true,
    underscored: true,
});

// Associates
ProposalVoting.belongsTo(Account, { foreignKey: 'accountId' });
ProposalVoting.belongsTo(ProposalRepair, { foreignKey: 'proposalRepairId' });

// Hooks
ProposalVoting.addHook('beforeCreate', async (proposalVoting, options) => {
    // Generate a custom ID like "ProVo_0001", "ProVo_0002", ...
    const latestProposalVoting = await ProposalVoting.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestProposalVoting) {
        const lastProposalVotingId = parseInt(latestProposalVoting.id.split('_')[1], 10);
        counter = lastProposalVotingId + 1;
    }

    const proposalVotingId = `ProVo_${counter.toString().padStart(4, '0')}`;
    proposalVoting.id = proposalVotingId;
});

module.exports = ProposalVoting;