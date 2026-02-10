const Activity = require('../models/Activity');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Log user activity
// @route   POST /api/activity
// @access  Private
exports.logActivity = async (req, res) => {
    try {
        const { activityType, description, metadata, duration } = req.body;

        const activity = await Activity.create({
            userId: req.user.id,
            activityType,
            description,
            metadata,
            duration,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        res.status(201).json({
            success: true,
            data: activity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user activities
// @route   GET /api/activity/:userId
// @access  Private (Faculty/Admin)
exports.getUserActivities = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 50, page = 1, activityType } = req.query;

        const whereClause = { userId };
        if (activityType) {
            whereClause.activityType = activityType;
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const { count, rows: activities } = await Activity.findAndCountAll({
            where: whereClause,
            order: [['timestamp', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        res.status(200).json({
            success: true,
            count: activities.length,
            total: count,
            page: parseInt(page),
            pages: Math.ceil(count / parseInt(limit)),
            data: activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get activity statistics
// @route   GET /api/activity/stats/:userId
// @access  Private
exports.getActivityStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 30 } = req.query;

        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - parseInt(days));

        const stats = await Activity.findAll({
            attributes: [
                'activityType',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration']
            ],
            where: {
                userId,
                timestamp: {
                    [Op.gte]: dateFrom
                }
            },
            group: ['activityType'],
            raw: true
        });

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
