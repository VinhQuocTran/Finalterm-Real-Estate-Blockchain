'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MonthlyPropertyValuations", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      valuationDate: {
        field: 'valuation_date',
        type: Sequelize.DataTypes.DATE,
        allowNull: false
      },
      valuationAmount: {
        field: 'valuation_amount',
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false
      },
      listingPropertyId: {
        field: 'listing_property_id',
        type: Sequelize.DataTypes.UUID,
        allowNull: false
      },
      propertyValuationServiceId: {
        field: 'property_valuation_service_id',
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
    await queryInterface.dropTable('MonthlyPropertyValuations');
  }
};
