'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SubmitListingProperties", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      submittedDate: {
        field: 'submitted_date',
        type: Sequelize.DATE,
        allowNull: false,
      },
      result: {
        type: Sequelize.ENUM('-1', '0', '1'),
        allowNull: false,
      },
      resultDate: {
        field: 'result_date',
        type: Sequelize.DATE,
        allowNull: false,
      },
      propertyVerificationId: {
        field: 'property_verification_id',
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
    await queryInterface.dropTable('SubmitListingProperties');
  }
};
