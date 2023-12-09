'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Properties", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      description: {
        type: Sequelize.DataTypes.STRING(1024),
        allowNull: false,
      },
      numOfBedroom: {
        field: 'num_of_bedroom',
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      numOfWc: {
        field: 'num_of_wc',
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      totalFloor: {
        field: 'total_floor',
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      area: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false,
      },
      propertyImageUrl: {
        field: 'property_image_url',
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false,
      },
      propertyDocumentUrl: {
        field: 'property_document_url',
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false,
      },
      isVerified: {
        field: 'is_verified',
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: false
      },
      accountId: {
        field: 'account_id',
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Properties');
  }
};
