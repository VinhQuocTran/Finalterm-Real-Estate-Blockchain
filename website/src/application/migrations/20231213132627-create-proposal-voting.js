'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProposalVotings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      voteDecision: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      voteDate: {
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      accountId: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false
      },
      proposalRepairId: {
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
    await queryInterface.dropTable('ProposalVotings');
  }
};
