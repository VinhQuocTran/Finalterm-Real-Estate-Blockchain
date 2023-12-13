const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const PropertyInspectionService = sequelize.define('', {
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
    tableName: 'PropertyInspectionServices',
    timestamps: true,
    underscored: true,
});

// Hooks
PropertyInspectionService.addHook('beforeCreate', async (propertyInspectionService, options) => {
    // Generate a custom ID like "PIS_0001", "PIS_0002", ...
    const latestPropertyInspectionService = await PropertyInspectionService.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestPropertyInspectionService) {
        const lastPropertyInspectionId = parseInt(latestPropertyInspectionService.id.split('_')[1], 10);
        counter = lastPropertyInspectionId + 1;
    }

    const propertyInspectionServiceId = `PIS_${counter.toString().padStart(4, '0')}`;
    propertyInspectionService.id = propertyInspectionServiceId;
});

module.exports = PropertyInspectionService;