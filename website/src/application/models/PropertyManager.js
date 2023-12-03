const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

const PropertyManager = sequelize.define('property_manager', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  fee_per_month: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
});

module.exports = PropertyManager;