'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DailyReplenishTransactions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      replenishAmount: {
        field: 'replenish_amount',
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      transactionDate: {
        field: 'transaction_date',
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      repairTransactionId: {
        field: 'repair_transaction_id',
        type: Sequelize.DataTypes.UUID,
        allowNull: false
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DataTypes.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DailyReplenishTransactions');
  }
};
