const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const RepairTransaction = require('../models/RepairTransaction');

const DailyReplenishTransaction = sequelize.define('', {
    replenishAmount: {        
        type: DataTypes.INTEGER,
        allowNull: false
    },
    transactionDate: {        
        type: DataTypes.DATE,
        allowNull: false
    },
    repairTransactionId: {        
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
    tableName: 'DailyReplenishTransactions',
    timestamps: true,
    underscored: true,
});

// Associates
DailyReplenishTransaction.belongsTo(RepairTransaction, { foreignKey: 'repair_transaction_id' });

// Hooks
DailyReplenishTransaction.addHook('beforeCreate', async (dailyReplenishTransaction, options) => {
    // Generate a custom ID like "DRT_0001", "DRT_0002", ...
    const latestDailyReplenishTransaction = await DailyReplenishTransaction.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestDailyReplenishTransaction) {
        const lastDailyReplenishTransactionId = parseInt(latestDailyReplenishTransaction.id.split('_')[1], 10);
        counter = lastDailyReplenishTransactionId + 1;
    }

    const dailyReplenishTransactionId = `DRT_${counter.toString().padStart(4, '0')}`;
    dailyReplenishTransaction.id = dailyReplenishTransactionId;
});

module.exports = DailyReplenishTransaction;