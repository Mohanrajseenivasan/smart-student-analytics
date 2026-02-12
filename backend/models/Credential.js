const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

const Credential = sequelize.define('Credential', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: 'Please provide valid email' }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: {
                args: [6],
                msg: 'Password must be at least 6 characters'
            }
        }
    }
}, {
    tableName: 'credentials',
    timestamps: true,
    hooks: {
        beforeCreate: async (credential) => {
            if (credential.password) {
                const salt = await bcrypt.genSalt(12);
                credential.password = await bcrypt.hash(credential.password, salt);
            }
        },
        beforeUpdate: async (credential) => {
            if (credential.changed('password')) {
                const salt = await bcrypt.genSalt(12);
                credential.password = await bcrypt.hash(credential.password, salt);
            }
        }
    }
});

// Instance method to compare password
Credential.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Don't select password by default
Credential.prototype.toJSON = function () {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
};

module.exports = Credential;
