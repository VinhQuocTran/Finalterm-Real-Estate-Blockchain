const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');
const Property = require('../models/Property');

const SubmitPropertyListing = sequelize.define('', {
    createdDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    isPass: {
        type: DataTypes.ENUM('-1', '0', '1'),
        allowNull: false,
    },
    finishedDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    submitPropertyVerificationId: {
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
    tableName: 'SubmitPropertyListings',
    timestamps: true,
    underscored: true,
});

// Associates
SubmitPropertyListing.belongsTo(Property, { foreignKey: 'submitPropertyVerificationId' });

// Hooks
SubmitPropertyListing.addHook('beforeCreate', async (submitPropertyListing, options) => {
    // Generate a custom ID like "SPV_0001", "SPV_0002", ...
    const latestSubmitPropertyListing = await SubmitPropertyListing.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });
    let counter = 1;
    if (latestSubmitPropertyListing) {
        const lastSubmitPropertyListingId = parseInt(latestSubmitPropertyListing.id.split('_')[1], 10);
        counter = lastSubmitPropertyListingId + 1;
    }

    const submitPropertyListingId = `SPV_${counter.toString().padStart(4, '0')}`;
    submitPropertyListing.id = submitPropertyListingId;
});


module.exports = SubmitPropertyListing;