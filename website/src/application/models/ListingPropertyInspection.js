const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const PropertyInspectionService = require('../models/PropertyInspectionService');
const SubmitListingProperty = require('../models/SubmitListingProperty');

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
    tableName: 'ListingPropertyInspections',
    timestamps: true,
    underscored: true,
});

// Associates
ListingPropertyInspection.belongsTo(PropertyInspectionService, { foreignKey: 'property_inspection_service_id' });
ListingPropertyInspection.belongsTo(SubmitListingProperty, { foreignKey: 'submit_listing_property_id' });

// Hooks
ListingPropertyInspection.addHook('beforeCreate', async (listingPropertyInspection, options) => {
    // Generate a custom ID like "LBC_0001", "LBC_0002", ...
    const latestListingPropertyInspection = await ListingPropertyInspection.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestListingPropertyInspection) {
        const lastListingPropertyInspectionId = parseInt(latestListingPropertyInspection.id.split('_')[1], 10);
        counter = lastListingPropertyInspectionId + 1;
    }

    const listingPropertyInspectionId = `LBC_${counter.toString().padStart(4, '0')}`;
    listingPropertyInspection.id = listingPropertyInspectionId;
});

module.exports = ListingPropertyInspection;