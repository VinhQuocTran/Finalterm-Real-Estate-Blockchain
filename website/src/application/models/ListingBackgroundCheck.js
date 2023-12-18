const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const BackgroundCheckService = require('../models/BackgroundCheckService');
const SubmitPropertyListing = require('../models/SubmitPropertyListing');

const ListingBackgroundCheck = sequelize.define('', {
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
    tableName: 'ListingBackgroundChecks',
    timestamps: true,
    underscored: true,
});

// Associates
ListingBackgroundCheck.belongsTo(BackgroundCheckService, { foreignKey: 'backgroundCheckServiceId' });
ListingBackgroundCheck.belongsTo(SubmitPropertyListing, { foreignKey: 'submitPropertyListingId' });

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