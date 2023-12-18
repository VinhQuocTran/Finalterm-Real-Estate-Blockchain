const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const ProposalRepair = require('../models/ProposalRepair');

const RepairTransaction = sequelize.define('', {
    isReplenished: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    transactionDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    proposalRepairId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'RepairTransactions',
    timestamps: true,
    underscored: true,
});

// Associates
RepairTransaction.belongsTo(ProposalRepair, { foreignKey: 'proposalRepairId' });

// Hooks
RepairTransaction.addHook('beforeCreate', async (repairTransaction, options) => {
    // Generate a custom ID like "RT_0001", "RT_0002", ...
    const latestRepairTransaction = await RepairTransaction.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestRepairTransaction) {
        const lastRepairTransactionId = parseInt(latestRepairTransaction.id.split('_')[1], 10);
        counter = lastRepairTransactionId + 1;
    }

    const repairTransactionId = `RT_${counter.toString().padStart(4, '0')}`;
    repairTransaction.id = repairTransactionId;
});

module.exports = RepairTransaction;