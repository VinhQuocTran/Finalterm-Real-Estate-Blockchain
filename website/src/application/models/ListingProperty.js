const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const PropertyManager = require('../models/PropertyManager');
const SubmitListingProperty = require('../models/SubmitListingProperty');

const ListingProperty = sequelize.define('listing_property', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  monthly_rent: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  listed_date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  property_valuation: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  property_manager_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  submit_listing_property_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

ListingProperty.belongsTo(PropertyManager, { foreignKey: 'property_manager_id' });
ListingProperty.belongsTo(SubmitListingProperty, { foreignKey: 'submit_listing_property_id' });

module.exports = ListingProperty;