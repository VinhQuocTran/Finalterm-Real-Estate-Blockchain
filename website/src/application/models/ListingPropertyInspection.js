const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const PropertyInspectionService = require('../models/PropertyInspectionService');
const SubmitPropertyListing = require('../models/SubmitPropertyListing');

const ListingPropertyInspection = sequelize.define('', {
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
    propertyInspectionServiceId: {        
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
    tableName: 'ListingPropertyInspections',
    timestamps: true,
    underscored: true,
});

// Associates
ListingPropertyInspection.belongsTo(PropertyInspectionService, { foreignKey: 'propertyInspectionServiceId' });
ListingPropertyInspection.belongsTo(SubmitPropertyListing, { foreignKey: 'submitPropertyListingId' });

// Hooks
ListingPropertyInspection.addHook('beforeCreate', async (listingPropertyInspection, options) => {
    // Generate a custom ID like "LPI_0001", "LPI_0002", ...
    const latestListingPropertyInspection = await ListingPropertyInspection.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestListingPropertyInspection) {
        const lastListingPropertyInspectionId = parseInt(latestListingPropertyInspection.id.split('_')[1], 10);
        counter = lastListingPropertyInspectionId + 1;
    }

    const listingPropertyInspectionId = `LPI_${counter.toString().padStart(4, '0')}`;
    listingPropertyInspection.id = listingPropertyInspectionId;
});

module.exports = ListingPropertyInspection;