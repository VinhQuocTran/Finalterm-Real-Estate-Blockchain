const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const ProposalRepair = sequelize.define('', {
    reason: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    cost: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isUrgent: {
        field: 'is_urgent',
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    createdDate: {
        field: 'created_date',
        type: DataTypes.DATE,
        allowNull: false
    },
    votingFromDate: {
        field: 'voting_from_date',
        type: DataTypes.DATE,
        allowNull: false
    },
    votingToDate: {
        field: 'voting_to_date',
        type: DataTypes.DATE,
        allowNull: false
    },
}, {
    tableName: 'ProposalRepairs',
    timestamps: true,
    underscored: true,
});

// Hooks
ProposalRepair.addHook('beforeCreate', async (proposalRepair, options) => {
    // Generate a custom ID like "PR_0001", "PR_0002", ...
    const latestProposalRepair = await ProposalRepair.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestProposalRepair) {
        const lastProposalRepair = parseInt(latestProposalRepair.id.split('_')[1], 10);
        counter = lastProposalRepair + 1;
    }

    const proposalRepairId = `PR_${counter.toString().padStart(4, '0')}`;
    proposalRepair.id = proposalRepairId;
});

module.exports = ProposalRepair;