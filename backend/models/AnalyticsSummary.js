const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const AnalyticsSummary = sequelize.define('AnalyticsSummary', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'students',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    attendancePercentage: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: { min: 0, max: 100 }
    },
    averageMarks: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: { min: 0, max: 100 }
    },
    behaviorScore: {
        type: DataTypes.FLOAT,
        defaultValue: 100, // Starts perfect
        validate: { min: 0, max: 100 }
    },
    performanceScore: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        validate: { min: 0, max: 100 }
    },
    riskLevel: {
        type: DataTypes.ENUM('Normal', 'Moderate Risk', 'High Risk'),
        defaultValue: 'Normal'
    },
    lastUpdated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'analytics_summary',
    timestamps: false
});

module.exports = AnalyticsSummary;
