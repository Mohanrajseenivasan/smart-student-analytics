const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const BehaviorData = sequelize.define('BehaviorData', {
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
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    // Attendance Metrics
    attendanceRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    daysPresent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    daysAbsent: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    // Academic Metrics
    gradeAverage: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    assignmentsCompleted: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    assignmentsTotal: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    assignmentCompletionRate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },

    // Engagement Metrics
    loginFrequency: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    timeSpentOnline: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Time in minutes'
    },
    participationScore: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    forumPosts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    // Calculated Scores
    engagementScore: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    riskScore: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },

    // ML Classification
    behaviorClass: {
        type: DataTypes.ENUM('excellent', 'good', 'average', 'at-risk', 'critical'),
        defaultValue: 'average'
    },
    mlConfidence: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        validate: {
            min: 0,
            max: 1
        }
    },

    // Trends
    trendIndicator: {
        type: DataTypes.ENUM('improving', 'stable', 'declining'),
        defaultValue: 'stable'
    }
}, {
    tableName: 'behavior_data',
    timestamps: true,
    indexes: [
        {
            fields: ['userId', 'date']
        },
        {
            fields: ['behaviorClass']
        }
    ]
});

module.exports = BehaviorData;
