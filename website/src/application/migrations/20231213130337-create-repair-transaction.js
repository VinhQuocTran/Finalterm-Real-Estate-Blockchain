'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RepairTransactions", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      isReplenished: {
        field: 'is_replenished',
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      transactionDate: {
        field: 'transaction_date',
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      proposalRepairId: {
        field: 'proposal_repair_id',
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
    await queryInterface.dropTable('RepairTransactions');
  }
};
