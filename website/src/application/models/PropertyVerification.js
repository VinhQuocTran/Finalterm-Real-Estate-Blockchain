const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Property = require('../models/Property');

const PropertyVerification = sequelize.define('', {
    createdDate: {        
        type: DataTypes.DATE,
        allowNull: false
    },
    finishedDate: {        
        type: DataTypes.DATE,
        allowNull: false
    },
    isPass: {        
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    propertyId: {        
        type: DataTypes.UUID,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE
    },
    updatedAt: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'PropertyVerifications',
    timestamps: true,
    underscored: true,
});

// Associates
PropertyVerification.belongsTo(Property, { foreignKey: 'property_id' });

// Hooks
PropertyVerification.addHook('beforeCreate', async (propertyVerification, options) => {
    // Generate a custom ID like "PV_0001", "PV_0002", ...
    const latestPropertVerification = await PropertyVerification.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestPropertVerification) {
        const lastPropertyVerificationId = parseInt(latestPropertVerification.id.split('_').pop(), 10);
        counter = lastPropertyVerificationId + 1;
    }

    const propertyVerificationId = `PV_${counter.toString().padStart(4, '0')}`;
    propertyVerification.id = propertyVerificationId;
});

module.exports = PropertyVerification;