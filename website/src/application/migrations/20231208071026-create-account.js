'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Accounts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.DataTypes.UUIDV4
      },
      email: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
        unique: true,
        validate: {
          notNull: { msg: 'Please provide your email' },
          isEmail: { msg: 'Please provide a valid email' }
        },
        set(email) {
          this.setDataValue('email', email.toLowerCase());
        }
      },
      address: {
        type: Sequelize.DataTypes.STRING(256),
        allowNull: false,
        validate: {
          notNull: { msg: 'Please provide your address.' }
        }
      },
      phoneNumber: {
        field: 'phone_number',
        type: Sequelize.DataTypes.STRING(16),
        allowNull: false,
        validate: {
          notNull: { msg: 'Please provide your phone number.' }
        }
      },
      residentId: {
        field: 'resident_id',
        type: Sequelize.DataTypes.STRING(32),
        allowNull: false,
        validate: {
          notNull: { msg: 'Please provide your resident identity number.' }
        }
      },
      cashBalance: {
        field: 'cash_balance',
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      tokenBalance: {
        field: 'token_balance',
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      username: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notNull: { msg: 'Please tell us your name' }
        }
      },
      role: {
        type: Sequelize.DataTypes.STRING(56),
        defaultValue: 'user',
        validate: {
          isIn: {
            args: [['user', 'admin']],
            msg: 'Invalid role'
          }
        }
      },
      password: {
        type: Sequelize.DataTypes.STRING(128),
        allowNull: false,
        validate: {
          notNull: { msg: 'Please provide a password' },
          len: { args: [8], msg: 'Password must be at least 8 characters long' }
        },
        select: false
      },
      passwordConfirm: {
        field: 'password_confirm',
        type: Sequelize.DataTypes.STRING(128),
        allowNull: true,
        validate: {
          customValidator(value) {
            if (value !== this.password) {
              throw new Error('Passwords are not the same!');
            }
          }
        }
      },
      passwordChangedAt: {
        field: 'password_changed_at',
        type: Sequelize.DataTypes.DATE
      },
      passwordResetToken: {
        field: 'password_reset_token',
        type: Sequelize.DataTypes.STRING(64)
      },
      passwordResetExpires: {
        field: 'password_reset_expires',
        type: Sequelize.DataTypes.DATE
      },
      active: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: true,
        select: false
      },
      createdAt: {
        field: 'created_at',
        type: Sequelize.DataTypes.DATE
      },
      updatedAt: {
        field: 'updated_at',
        type: Sequelize.DataTypes.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Accounts');
  }
};
