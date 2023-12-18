const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const PropertyManager = require('../models/PropertyManager');
const SubmitPropertyListing = require('../models/SubmitPropertyListing');

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
  submitPropertyListingId: {    
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
  tableName: 'ListingProperties',
  timestamps: true,
  underscored: true,
});

// Associates
ListingProperty.belongsTo(PropertyManager, { foreignKey: 'propertyManagerId' });
ListingProperty.belongsTo(SubmitPropertyListing, { foreignKey: 'submitPropertyListingId' });

// Hooks
ListingProperty.addHook('beforeCreate', async (listingProperty, options) => {
    // Generate a custom ID like "LP_0001", "LP_0002", ...
    const latestListingProperty = await ListingProperty.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestListingProperty) {
        const lastListingPropertyId = parseInt(latestListingProperty.id.split('_')[1], 10);
        counter = lastListingPropertyId + 1;
    }

    const listingPropertyId = `LP_${counter.toString().padStart(4, '0')}`;
    listingProperty.id = listingPropertyId;
});

module.exports = ListingProperty;