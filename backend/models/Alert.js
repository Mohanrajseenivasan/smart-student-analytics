const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Alert = sequelize.define('Alert', {
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
        }
    },
    alertType: {
        type: DataTypes.ENUM('attendance', 'grade', 'engagement', 'behavior', 'risk'),
        allowNull: false
    },
    severity: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('active', 'acknowledged', 'resolved', 'dismissed'),
        defaultValue: 'active'
    },
    triggerValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    thresholdValue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    acknowledgedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    acknowledgedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resolvedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    resolvedAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
    resolutionNotes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'alerts',
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'status']
        },
        {
            fields: ['severity', 'createdAt']
        }
    ]
});

module.exports = Alert;
