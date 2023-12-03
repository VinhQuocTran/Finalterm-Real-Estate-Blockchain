const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');
const Account = require('../models/Account');

const Property = sequelize.define('property', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    created_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    room_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    area: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    address: {
        type: Sequelize.STRING(256),
        allowNull: false,
    },
    account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
});

Property.belongsTo(Account, { foreignKey: 'account_id' });

module.exports = Property;