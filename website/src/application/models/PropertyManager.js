const { Sequelize } = require('sequelize');
const sequelize = require('../utils/database');

const PropertyManager = sequelize.define('', {
  feePerMonth: {    
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING(128),
    allowNull: false,
  },
  createdAt: {    
    type: Sequelize.DataTypes.DATE
  },
  updatedAt: {    
    type: Sequelize.DataTypes.DATE
  } 
}, {
  tableName: 'PropertyManagers',
  timestamps: true,
  underscored: true,
});

// Hooks
PropertyManager.addHook('beforeCreate', async (propertyManager, options) => {
    // Generate a custom ID like "PM_0001", "PM_0002", ...
    const latestPropertyManager = await PropertyManager.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestPropertyManager) {
        const lastPropertyManagerId = parseInt(latestPropertyManager.id.split('_')[1], 10);
        counter = lastPropertyManagerId + 1;
    }

    const propertyManagerId = `PM_${counter.toString().padStart(4, '0')}`;
    propertyManager.id = propertyManagerId;
});

module.exports = PropertyManager;