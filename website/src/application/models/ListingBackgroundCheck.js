const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const BackgroundCheckService = require('../models/BackgroundCheckService');
const SubmitListingProperty = require('../models/SubmitListingProperty');

const ListingBackgroundCheck = sequelize.define('', {
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    isPass: {        
        type: DataTypes.BOOLEAN,
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
    backgroundCheckServiceId: {        
        type: DataTypes.UUID,
        allowNull: false
    },
    submitListingPropertyId: {        
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
    tableName: 'ListingBackgroundChecks',
    timestamps: true,
    underscored: true,
});

// Associates
ListingBackgroundCheck.belongsTo(BackgroundCheckService, { foreignKey: 'background_check_service_id' });
ListingBackgroundCheck.belongsTo(SubmitListingProperty, { foreignKey: 'submit_listing_property_id' });

// Hooks
ListingBackgroundCheck.addHook('beforeCreate', async (listingBackgroundCheck, options) => {
    // Generate a custom ID like "LBC_0001", "LBC_0002", ...
    const latestListingBackgroundCheck = await ListingBackgroundCheck.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestListingBackgroundCheck) {
        const lastListingBackgroundId = parseInt(latestListingBackgroundCheck.id.split('_')[1], 10);
        counter = lastListingBackgroundId + 1;
    }

    const listingBackgroundId = `LBC_${counter.toString().padStart(4, '0')}`;
    listingBackgroundCheck.id = listingBackgroundId;
});

module.exports = ListingBackgroundCheck;