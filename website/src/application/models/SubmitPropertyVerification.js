const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Property = require('../models/Property');

const SubmitPropertyVerification = sequelize.define('', {
    createdDate: {        
        type: DataTypes.DATE,
        allowNull: false
    },
    finishedDate: {        
        type: DataTypes.DATE,
        allowNull: false
    },
    isPass: {        
        type: DataTypes.ENUM('-1', '0', '1'),
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
    tableName: 'SubmitPropertyVerifications',
    timestamps: true,
    underscored: true,
});

// Associates
SubmitPropertyVerification.belongsTo(Property, { foreignKey: 'propertyId' });

// Hooks
SubmitPropertyVerification.addHook('beforeCreate', async (submitPropertyVerification, options) => {
    // Generate a custom ID like "SPV_0001", "SPV_0002", ...
    const latestPropertVerification = await SubmitPropertyVerification.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestPropertVerification) {
        const lastSubmitPropertyVerificationId = parseInt(latestPropertVerification.id.split('_')[1], 10);
        counter = lastSubmitPropertyVerificationId + 1;
    }

    const submitPropertyVerificationId = `SPV_${counter.toString().padStart(4, '0')}`;
    submitPropertyVerification.id = submitPropertyVerificationId;
});

module.exports = SubmitPropertyVerification;