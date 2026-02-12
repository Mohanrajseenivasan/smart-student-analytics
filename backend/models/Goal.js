const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Goal = sequelize.define('Goal', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'students',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    currentValue: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    targetValue: {
        type: DataTypes.INTEGER,
        defaultValue: 100
    },
    unit: {
        type: DataTypes.STRING(50),
        defaultValue: '%'
    },
    status: {
        type: DataTypes.ENUM('In Progress', 'Completed', 'Failed'),
        defaultValue: 'In Progress'
    },
    deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true
    }
}, {
    tableName: 'goals',
    timestamps: true
});

module.exports = Goal;
