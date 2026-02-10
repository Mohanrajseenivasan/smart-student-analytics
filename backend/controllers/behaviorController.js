const BehaviorData = require('../models/BehaviorData');
const Activity = require('../models/Activity');
const Alert = require('../models/Alert');
const axios = require('axios');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Calculate and store behavior data
// @route   POST /api/behavior/calculate/:userId
// @access  Private (Faculty/Admin)
exports.calculateBehaviorData = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get date range (last 30 days)
        const dateFrom = new Date();
        dateFrom.setDate(dateFrom.getDate() - 30);

        // Calculate attendance metrics
        const attendanceActivities = await Activity.findAll({
            where: {
                userId,
                activityType: 'attendance',
                timestamp: {
                    [Op.gte]: dateFrom
                }
            }
        });

        const totalDays = attendanceActivities.length;
        const daysPresent = attendanceActivities.filter(a =>
            a.metadata && a.metadata.status === 'present'
        ).length;
        const daysAbsent = totalDays - daysPresent;
        const attendanceRate = totalDays > 0 ? (daysPresent / totalDays) * 100 : 0;

        // Calculate academic metrics
        const assignmentActivities = await Activity.findAll({
            where: {
                userId,
                activityType: 'assignment_submit',
                timestamp: {
                    [Op.gte]: dateFrom
                }
            }
        });

        const assignmentsCompleted = assignmentActivities.length;
        const assignmentsTotal = assignmentsCompleted + 5; // Mock total
        const assignmentCompletionRate = assignmentsTotal > 0
            ? (assignmentsCompleted / assignmentsTotal) * 100
            : 0;

        // Mock grade average (in real app, get from grades collection)
        const gradeAverage = 75 + Math.random() * 20;

        // Calculate engagement metrics
        const loginActivities = await Activity.findAll({
            where: {
                userId,
                activityType: 'login',
                timestamp: {
                    [Op.gte]: dateFrom
                }
            }
        });

        const loginFrequency = loginActivities.length;

        const timeSpentResult = await Activity.findOne({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('duration')), 'totalDuration']
            ],
            where: {
                userId,
                timestamp: {
                    [Op.gte]: dateFrom
                }
            },
            raw: true
        });

        const timeSpentOnline = timeSpentResult && timeSpentResult.totalDuration
            ? Math.round(timeSpentResult.totalDuration / 60)
            : 0;

        const forumPosts = await Activity.count({
            where: {
                userId,
                activityType: 'forum_post',
                timestamp: {
                    [Op.gte]: dateFrom
                }
            }
        });

        // Calculate engagement score
        const participationScore = Math.min(100, (loginFrequency / 30) * 100);
        const engagementScore = (
            (participationScore * 0.3) +
            (assignmentCompletionRate * 0.4) +
            ((forumPosts / 10) * 100 * 0.3)
        );

        // Calculate risk score
        const riskScore = (
            ((100 - attendanceRate) * 0.4) +
            ((100 - gradeAverage) * 0.4) +
            ((100 - engagementScore) * 0.2)
        );

        // Prepare data for ML classification
        const mlData = {
            attendance_rate: attendanceRate,
            grade_average: gradeAverage,
            assignment_completion_rate: assignmentCompletionRate,
            login_frequency: loginFrequency,
            time_spent_online: timeSpentOnline,
            forum_posts: forumPosts,
            engagement_score: engagementScore,
            risk_score: riskScore
        };

        // Call Python ML service for classification
        let behaviorClass = 'average';
        let mlConfidence = 0.5;

        try {
            const mlResponse = await axios.post(
                `${process.env.ML_SERVICE_URL}/classify`,
                mlData
            );
            behaviorClass = mlResponse.data.classification;
            mlConfidence = mlResponse.data.confidence;
        } catch (mlError) {
            console.error('ML Service error:', mlError.message);
            // Fallback classification
            if (riskScore < 20) behaviorClass = 'excellent';
            else if (riskScore < 30) behaviorClass = 'good';
            else if (riskScore < 40) behaviorClass = 'average';
            else if (riskScore < 50) behaviorClass = 'at-risk';
            else behaviorClass = 'critical';
        }

        // Determine trend
        const previousData = await BehaviorData.findOne({
            where: { userId },
            order: [['date', 'DESC']]
        });

        let trendIndicator = 'stable';
        if (previousData) {
            const scoreDiff = riskScore - previousData.riskScore;
            if (scoreDiff < -5) trendIndicator = 'improving';
            else if (scoreDiff > 5) trendIndicator = 'declining';
        }

        // Create behavior data record
        const behaviorData = await BehaviorData.create({
            userId,
            attendanceRate,
            daysPresent,
            daysAbsent,
            gradeAverage,
            assignmentsCompleted,
            assignmentsTotal,
            assignmentCompletionRate,
            loginFrequency,
            timeSpentOnline,
            participationScore,
            forumPosts,
            engagementScore,
            riskScore,
            behaviorClass,
            mlConfidence,
            trendIndicator
        });

        // Check if alert should be generated
        await checkAndGenerateAlerts(userId, behaviorData);

        res.status(201).json({
            success: true,
            data: behaviorData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to generate alerts
async function checkAndGenerateAlerts(userId, behaviorData) {
    // Check attendance alert
    if (behaviorData.attendanceRate < 75) {
        await Alert.create({
            userId,
            alertType: 'attendance',
            severity: behaviorData.attendanceRate < 60 ? 'critical' : 'high',
            title: 'Low Attendance Alert',
            message: `Attendance rate has dropped to ${parseFloat(behaviorData.attendanceRate).toFixed(1)}%`,
            triggerValue: behaviorData.attendanceRate,
            thresholdValue: 75
        });
    }

    // Check grade alert
    if (behaviorData.gradeAverage < 70) {
        await Alert.create({
            userId,
            alertType: 'grade',
            severity: behaviorData.gradeAverage < 60 ? 'critical' : 'high',
            title: 'Low Grade Alert',
            message: `Grade average has dropped to ${parseFloat(behaviorData.gradeAverage).toFixed(1)}`,
            triggerValue: behaviorData.gradeAverage,
            thresholdValue: 70
        });
    }

    // Check engagement alert
    if (behaviorData.engagementScore < 60) {
        await Alert.create({
            userId,
            alertType: 'engagement',
            severity: 'medium',
            title: 'Low Engagement Alert',
            message: `Engagement score is ${parseFloat(behaviorData.engagementScore).toFixed(1)}%`,
            triggerValue: behaviorData.engagementScore,
            thresholdValue: 60
        });
    }

    // Check risk alert
    if (behaviorData.riskScore > 40) {
        await Alert.create({
            userId,
            alertType: 'risk',
            severity: behaviorData.riskScore > 50 ? 'critical' : 'high',
            title: 'High Risk Alert',
            message: `Student classified as ${behaviorData.behaviorClass} with risk score ${parseFloat(behaviorData.riskScore).toFixed(1)}`,
            triggerValue: behaviorData.riskScore,
            thresholdValue: 40
        });
    }
}

// @desc    Get behavior data for user
// @route   GET /api/behavior/:userId
// @access  Private
exports.getBehaviorData = async (req, res) => {
    try {
        const { userId } = req.params;
        const { limit = 30 } = req.query;

        const behaviorData = await BehaviorData.findAll({
            where: { userId },
            order: [['date', 'DESC']],
            limit: parseInt(limit)
        });

        res.status(200).json({
            success: true,
            count: behaviorData.length,
            data: behaviorData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get latest behavior data for user
// @route   GET /api/behavior/:userId/latest
// @access  Private
exports.getLatestBehaviorData = async (req, res) => {
    try {
        const { userId } = req.params;

        const behaviorData = await BehaviorData.findOne({
            where: { userId },
            order: [['date', 'DESC']]
        });

        if (!behaviorData) {
            return res.status(404).json({
                success: false,
                message: 'No behavior data found'
            });
        }

        res.status(200).json({
            success: true,
            data: behaviorData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
