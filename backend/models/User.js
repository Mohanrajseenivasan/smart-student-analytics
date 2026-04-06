const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Please provide name' }
        }
    },
    role: {
        type: DataTypes.ENUM('student', 'teacher', 'admin', 'parent'),
        defaultValue: 'student'
    },
    studentId: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: true
    },
    class: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true
    },
    profilePhoto: {
        type: DataTypes.STRING(255),
        defaultValue: ''
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    lastLogin: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true
});

module.exports = User;
