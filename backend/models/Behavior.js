const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Behavior = sequelize.define('Behavior', {
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
    remark: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    severityLevel: {
        type: DataTypes.ENUM('Low', 'Medium', 'High', 'Critical'),
        defaultValue: 'Low'
    },
    date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'behavior',
    timestamps: true
});

module.exports = Behavior;
