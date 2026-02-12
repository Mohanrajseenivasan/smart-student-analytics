const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Mark = sequelize.define('Mark', {
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
    subject: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        validate: {
            min: 0,
            max: 100
        }
    },
    examType: {
        type: DataTypes.ENUM('Quiz', 'Midterm', 'Final', 'Assignment'),
        allowNull: false
    }
}, {
    tableName: 'marks',
    timestamps: true
});

module.exports = Mark;
