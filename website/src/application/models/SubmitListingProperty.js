const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const Property = require('../models/Property');

const SubmitListingProperty = sequelize.define('submit_listing_property', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    submitted_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    result: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    result_date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    property_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

SubmitListingProperty.belongsTo(Property, { foreignKey: 'property_id' });

module.exports = Property;