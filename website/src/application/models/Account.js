const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

const Account = sequelize.define('account', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    cash_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    token_balance: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
    },
    username: {
        type: Sequelize.STRING(128),
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING(128),
        allowNull: false,
    },
    role: {
        type: Sequelize.STRING(56),
        allowNull: false,
    },
});

module.exports = Account;