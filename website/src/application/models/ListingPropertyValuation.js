const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const PropertyValuationService = require('../models/PropertyValuationService');
const SubmitPropertyListing = require('../models/SubmitPropertyListing');

const ListingPropertyValuation = sequelize.define('', {
    isPass: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    valuationAmount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdDate: {        
        type: DataTypes.DATE,
        allowNull: false
    },
    finishedDate: {        
        type: DataTypes.DATE,
        allowNull: false
    },
    propertyValuationServiceId: {        
        type: DataTypes.UUID,
        allowNull: false
    },
    submitPropertyListingId: {        
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
    tableName: 'ListingPropertyValuations',
    timestamps: true,
    underscored: true,
});

// Associates
ListingPropertyValuation.belongsTo(PropertyValuationService, { foreignKey: 'propertyValuationServiceId' });
ListingPropertyValuation.belongsTo(SubmitPropertyListing, { foreignKey: 'submitPropertyListingId' });

// Hooks
ListingPropertyValuation.addHook('beforeCreate', async (listingPropertyValuation, options) => {
    // Generate a custom ID like "LPV_0001", "LPV_0002", ...
    const latestListingPropertyValuation = await ListingPropertyValuation.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestListingPropertyValuation) {
        const lastListingPropertyValuationId = parseInt(latestListingPropertyValuation.id.split('_')[1], 10);
        counter = lastListingPropertyValuationId + 1;
    }

    const listingPropertyValuationId = `LPV_${counter.toString().padStart(4, '0')}`;
    listingPropertyValuation.id = listingPropertyValuationId;
});

module.exports = ListingPropertyValuation;