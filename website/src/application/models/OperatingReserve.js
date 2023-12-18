const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const ListingProperty = require('../models/ListingProperty');

const OperatingReserve = sequelize.define('', {
    currentFund: {        
        type: DataTypes.INTEGER,
        allowNull: false
    },
    listingPropertyId: {        
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
    tableName: 'OperatingReserves',
    timestamps: true,
    underscored: true,
});

// Associates
OperatingReserve.belongsTo(ListingProperty, { foreignKey: 'listingPropertyId' });

// Hooks
OperatingReserve.addHook('beforeCreate', async (operatingReserve, options) => {
    // Generate a custom ID like "OR_0001", "OR_0002", ...
    const latestOperatingReserve = await OperatingReserve.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestOperatingReserve) {
        const lastOperatingReserveId = parseInt(latestOperatingReserve.id.split('_')[1], 10);
        counter = lastOperatingReserveId + 1;
    }

    const operatingReserveId = `OperatingReserve_${counter.toString().padStart(4, '0')}`;
    operatingReserve.id = operatingReserveId;
});

module.exports = OperatingReserve;