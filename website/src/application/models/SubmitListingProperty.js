const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Property = require('../models/Property');

const SubmitListingProperty = sequelize.define('', {
    submittedDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    result: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    resultDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    propertyId: {
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
    tableName: 'SubmitListingProperties',
    timestamps: true,
    underscored: true,
});

// Associates
SubmitListingProperty.belongsTo(Property, { foreignKey: 'property_id' });

// Hooks
SubmitListingProperty.addHook('beforeCreate', async (submitListingProperty, options) => {
    // Generate a custom ID like "SLP_0001", "SLP_0002", ...
    const latestSubmitListingProperty = await SubmitListingProperty.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestSubmitListingProperty) {
        const lastSubmitListingPropertyId = parseInt(latestSubmitListingProperty.id.split('_')[1], 10);
        counter = lastSubmitListingPropertyId + 1;
    }

    const submitListingPropertyId = `SLP_${counter.toString().padStart(4, '0')}`;
    submitListingProperty.id = submitListingPropertyId;
});


module.exports = SubmitListingProperty;