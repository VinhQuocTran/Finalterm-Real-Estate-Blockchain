'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ProposalRepairs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      reason: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false
      },
      cost: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      isUrgent: {
        field: 'is_urgent',
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      createdDate: {
        field: 'created_date',
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      votingFromDate: {
        field: 'voting_from_date',
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      votingToDate: {
        field: 'voting_to_date',
        type: Sequelize.DataTypes.DATE,
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
    await queryInterface.dropTable('ProposalRepairs');
  }
};
