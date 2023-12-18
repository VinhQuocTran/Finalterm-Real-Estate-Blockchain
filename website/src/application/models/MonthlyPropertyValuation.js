const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const ListingProperty = require('../models/ListingProperty');
const PropertyValuationService = require('../models/PropertyValuationService');

const MonthlyPropertyValuation = sequelize.define('', {
    valuationDate: {        
        type: DataTypes.DATE,
        allowNull: false
    },
    valuationAmount: {        
        type: DataTypes.INTEGER,
        allowNull: false
    },
    listingPropertyId: {        
        type: DataTypes.UUID,
        allowNull: false
    },
    propertyValuationServiceId: {        
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
    tableName: 'MonthlyPropertyValuations',
    timestamps: true,
    underscored: true,
});

// Associates
MonthlyPropertyValuation.belongsTo(ListingProperty, { foreignKey: 'listingPropertyId' });
MonthlyPropertyValuation.belongsTo(PropertyValuationService, { foreignKey: 'propertyValuationServiceId' });

// Hooks
MonthlyPropertyValuation.addHook('beforeCreate', async (monthlyPropertyValuation, options) => {
    // Generate a custom ID like "MPV_0001", "MPV_0002", ...
    const latestMonthlyPropertyValuation = await MonthlyPropertyValuation.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestMonthlyPropertyValuation) {
        const lastMonthlyPropertyValuationId = parseInt(latestMonthlyPropertyValuation.id.split('_')[1], 10);
        counter = lastMonthlyPropertyValuationId + 1;
    }

    const monthlyPropertyValuationId = `MPV_${counter.toString().padStart(4, '0')}`;
    monthlyPropertyValuation.id = monthlyPropertyValuationId;
});

module.exports = MonthlyPropertyValuation;