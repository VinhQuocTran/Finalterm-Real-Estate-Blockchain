const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { DataTypes, Op } = require('sequelize');
const sequelize = require('../utils/database');

const Account = sequelize.define('', {
    id: {
        type: DataTypes.UUID,
        // defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    email: {
        type: DataTypes.STRING(128),
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
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
            notNull: { msg: 'Please provide your address.' }
        }
    },
    phoneNumber: {
        type: DataTypes.STRING(16),
        allowNull: false,
        validate: {
            notNull: { msg: 'Please provide your phone number.' }
        }
    },
    residentId: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
            notNull: { msg: 'Please provide your resident identity number.' }
        }
    },
    cashBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    tokenBalance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0
    },
    username: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
            notNull: { msg: 'Please tell us your name' }
        }
    },
    role: {
        type: DataTypes.STRING(56),
        defaultValue: 'user',
        validate: {
            isIn: {
                args: [['user', 'admin']],
                msg: 'Invalid role'
            }
        }
    },
    password: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
            notNull: { msg: 'Please provide a password' },
            len: { args: [8], msg: 'Password must be at least 8 characters long' }
        },
        select: false
    },
    passwordConfirm: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
            notNull: { msg: 'Please confirm your password' },
            customValidator(value) {
                console.log('value:', value);
                console.log('this.password:', this.password);
                if (value !== this.password) {
                    throw new Error('Confirm password is not correct!');
                }
            }
        },
        select: false
    },
    passwordChangedAt: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING(64),
    passwordResetExpires: DataTypes.DATE,
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        select: false
    }
}, {
    tableName: 'Accounts',
    timestamps: true,
    underscored: true,
    defaultScope: {
        attributes: { exclude: ['password', 'passwordConfirm', 'active'] }
    }
});

// Hooks
Account.addHook('beforeCreate', async (user, options) => {
    // Generate a custom ID like "USER_0001", "USER_0002", ...
    const latestUser = await Account.findOne({
        order: [['id', 'DESC']],
        attributes: ['id'],
    });

    let counter = 1;
    if (latestUser) {
        const lastUserId = parseInt(latestUser.id.split('_')[1], 10);
        counter = lastUserId + 1;
    }

    const customId = `USER_${counter.toString().padStart(4, '0')}`;
    user.id = customId;

    // Only run this following code if password was actually modified
    if (!user.changed('password')) return;

    // Hash the password with cost of 12
    user.password = await bcrypt.hash(user.password, 12);
});

Account.addHook('beforeUpdate', async (user, options) => {
    // Only run this function if password was actually modified
    if (!user.changed('password')) return;

    // Hash the password with cost of 12
    user.password = await bcrypt.hash(user.password, 12);

    // Set passwordChangedAt field
    user.passwordChangedAt = new Date(Date.now() - 1000);
});

Account.addHook('beforeFind', (options) => {
    if (!options.where) {
        options.where = {};
    }
    options.where.active = { [Op.ne]: false };
});


// Instance methods
Account.prototype.correctPassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

Account.prototype.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    // False means NOT changed
    return false;
};

Account.prototype.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
};

module.exports = Account;