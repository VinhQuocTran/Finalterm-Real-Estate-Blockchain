const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const PropertyManager = require('../models/PropertyManager');
const SubmitListingProperty = require('../models/SubmitListingProperty');

const ListingProperty = sequelize.define('', {
  monthlyRent: {    
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  listedDate: {    
    type: DataTypes.DATE,
    allowNull: false,
  },
  propertyValuation: {    
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  propertyManagerId: {    
    type: DataTypes.UUID,
    allowNull: false,
  },
  submitListingPropertyId: {    
    type: DataTypes.UUID,
    allowNull: false,
  },
  createdAt: {    
    type: DataTypes.DATE
  },
  updatedAt: {    
    type: DataTypes.DATE
  }
}, {
  tableName: 'ListingProperty',
  timestamps: true,
  underscored: true,
});

// Associates
ListingProperty.belongsTo(PropertyManager, { foreignKey: 'property_manager_id' });
ListingProperty.belongsTo(SubmitListingProperty, { foreignKey: 'submit_listing_property_id' });

// Hooks
ListingProperty.addHook('beforeCreate', async (listingProperty, options) => {
    // Generate a custom ID like "LP_0001", "LP_0002", ...
    const latestListingProperty = await ListingProperty.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestListingProperty) {
        const lastListingPropertyId = parseInt(latestListingProperty.id.split('_').pop(), 10);
        counter = lastListingPropertyId + 1;
    }

    const listingPropertyId = `LP_${counter.toString().padStart(4, '0')}`;
    listingProperty.id = listingPropertyId;
});

module.exports = ListingProperty;