const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Activity = sequelize.define('Activity', {
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
    activityType: {
        type: DataTypes.ENUM(
            'login', 'logout', 'page_view', 'assignment_submit',
            'test_taken', 'resource_access', 'forum_post',
            'quiz_attempt', 'attendance'
        ),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        defaultValue: {}
    },
    duration: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Duration in seconds'
    },
    ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    userAgent: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'activities',
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'timestamp']
        },
        {
            fields: ['activityType']
        }
    ]
});

module.exports = Activity;
