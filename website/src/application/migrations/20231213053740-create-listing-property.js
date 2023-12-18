'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("ListingProperties", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      monthlyRent: {
        field: 'monthly_rent',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      listedDate: {
        field: 'listed_date',
        type: Sequelize.DATE,
        allowNull: false,
      },
      propertyValuation: {
        field: 'property_valuation',
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      propertyManagerId: {
        field: 'property_manager_id',
        type: Sequelize.UUID,
        allowNull: false,
      },
      submitPropertyListingId: {
        field: 'submit_property_listing_id',
        type: Sequelize.UUID,
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

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('ListingProperties');
  }
};
