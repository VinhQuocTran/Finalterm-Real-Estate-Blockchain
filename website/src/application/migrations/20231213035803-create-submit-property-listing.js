'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SubmitPropertyListings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      createdDate: {
        field: 'created_date',
        type: Sequelize.DATE,
        allowNull: false,
      },
      isPass: {
        field: 'is_pass',
        type: Sequelize.ENUM('-1', '0', '1'),
        allowNull: false,
      },
      finishedDate: {
        field: 'finished_date',
        type: Sequelize.DATE,
        allowNull: false,
      },
      submitPropertyVerificationId: {
        field: 'submit_property_verification_id',
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
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
    await queryInterface.dropTable('SubmitPropertyListings');
  }
};
