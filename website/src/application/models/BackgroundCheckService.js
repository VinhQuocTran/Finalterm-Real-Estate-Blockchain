const { DataTypes } = require('sequelize');
const sequelize = require('../utils/database');

const BackgroundCheckService = sequelize.define('', {
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
    tableName: 'BackgroundCheckServices',
    timestamps: true,
    underscored: true,
});

// Hooks
BackgroundCheckService.addHook('beforeCreate', async (backgroundCheckService, options) => {
    // Generate a custom ID like "BCS_0001", "BCS_0002", ...
    const latestBackgroundCheckService = await BackgroundCheckService.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestBackgroundCheckService) {
        const lastBackgroundCheckServiceId = parseInt(latestBackgroundCheckService.id.split('_')[1], 10);
        counter = lastBackgroundCheckServiceId + 1;
    }

    const backgroundCheckServiceId = `BCS_${counter.toString().padStart(4, '0')}`;
    backgroundCheckService.id = backgroundCheckServiceId;
});

module.exports = BackgroundCheckService;