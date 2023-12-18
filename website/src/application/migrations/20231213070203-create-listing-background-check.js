'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("ListingBackgroundChecks", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      isPass: {
        field: 'is_pass',
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      createdDate: {
        field: 'created_date',
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      finishedDate: {
        field: 'finished_date',
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      backgroundCheckServiceId: {
        field: 'background_check_service_id',
        type: Sequelize.DataTypes.UUID,
        allowNull: false
      },
      submitPropertyListingId: {
        field: 'submit_property_listing_id',
        type: Sequelize.DataTypes.UUID,
        allowNull: false
      },
      createdAt: {
        field:  'created_at',
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DataTypes.DATE
      }      
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ListingBackgroundChecks');
  }
};
