const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const PropertyValuationService = sequelize.define('', {
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    phoneNumber: {
        field: 'phone_number',
        type: DataTypes.STRING(16),
        allowNull: false
    },
    feePerTime: {
        field: 'fee_per_time',
        type: DataTypes.INTEGER,
        allowNull: false
    },
    createdAt: {
        field: 'created_at',
        type: DataTypes.DATE
    },
    updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE
    }
}, {
    tableName: 'PropertyValuationServices',
    timestamps: true,
    underscored: true,
});

// Hooks
PropertyValuationService.addHook('beforeCreate', async (propertyValuationService, options) => {
    // Generate a custom ID like "PVS_0001", "PVS_0002", ...
    const latestPropertyValuationService = await PropertyValuationService.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestPropertyValuationService) {
        const lastPropertyInspectionId = parseInt(latestPropertyValuationService.id.split('_')[1], 10);
        counter = lastPropertyInspectionId + 1;
    }

    const propertyValuationServiceId = `PVS_${counter.toString().padStart(4, '0')}`;
    propertyValuationService.id = propertyValuationServiceId;
});

module.exports = PropertyValuationService;