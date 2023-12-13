const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Account = require('../models/Account');

const Property = sequelize.define('', {
    description: {
        type: DataTypes.STRING(1024),
        allowNull: false,
    },
    numOfBedroom: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    numOfWc: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    totalFloor: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    area: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    propertyImageUrl: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    propertyDocumentUrl: {
        type: DataTypes.STRING(256),
        allowNull: false,
    },
    isVerified: {
        type: DataTypes.ENUM('-1', '0', '1'),
        defaultValue: '-1'
    },
    accountId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'Properties',
    timestamps: true,
    underscored: true,
});

// Associates
Property.belongsTo(Account, { foreignKey: 'account_id' });

// Hooks
Property.addHook('beforeCreate', async (property, options) => {
    // Generate a custom ID like "PROPERTY_0001", "PROPERTY_0002", ...
    const latestProperty = await Property.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestProperty) {
        const lastPropertyId = parseInt(latestProperty.id.split('_')[1], 10);
        counter = lastPropertyId + 1;
    }

    const propertyId = `PROPERTY_${counter.toString().padStart(4, '0')}`;
    property.id = propertyId;
});

module.exports = Property;