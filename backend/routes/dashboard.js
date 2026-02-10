const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const BehaviorData = require('../models/BehaviorData');
const Alert = require('../models/Alert');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Faculty/Admin)
router.get('/stats', protect, authorize('faculty', 'admin'), async (req, res) => {
    try {
        const totalStudents = await User.count({ where: { role: 'student' } });

        // Get latest behavior for each student
        const latestBehavior = await BehaviorData.findAll({
            attributes: [
                'userId',
                'attendanceRate',
                'gradeAverage',
                'behaviorClass',
                [sequelize.fn('MAX', sequelize.col('date')), 'latestDate']
            ],
            group: ['userId'],
            raw: true
        });

        const avgAttendance = latestBehavior.length > 0
            ? latestBehavior.reduce((sum, b) => sum + parseFloat(b.attendanceRate), 0) / latestBehavior.length
            : 0;

        const avgGrade = latestBehavior.length > 0
            ? latestBehavior.reduce((sum, b) => sum + parseFloat(b.gradeAverage), 0) / latestBehavior.length
            : 0;

        const atRiskCount = latestBehavior.filter(b =>
            b.behaviorClass === 'at-risk' || b.behaviorClass === 'critical'
        ).length;

        const activeAlerts = await Alert.count({ where: { status: 'active' } });

        res.json({
            success: true,
            data: {
                totalStudents,
                avgAttendance: avgAttendance.toFixed(1),
                avgGrade: avgGrade.toFixed(1),
                atRiskCount,
                activeAlerts
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get all students with latest behavior data
// @route   GET /api/dashboard/students
// @access  Private (Faculty/Admin)
router.get('/students', protect, authorize('faculty', 'admin'), async (req, res) => {
    try {
        const students = await User.findAll({
            where: { role: 'student' },
            attributes: { exclude: ['password'] }
        });

        const studentsWithBehavior = await Promise.all(
            students.map(async (student) => {
                const latestBehavior = await BehaviorData.findOne({
                    where: { userId: student.id },
                    order: [['date', 'DESC']]
                });

                return {
                    ...student.toJSON(),
                    behaviorData: latestBehavior || null
                };
            })
        );

        res.json({
            success: true,
            count: studentsWithBehavior.length,
            data: studentsWithBehavior
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get alerts
// @route   GET /api/dashboard/alerts
// @access  Private (Faculty/Admin)
router.get('/alerts', protect, authorize('faculty', 'admin'), async (req, res) => {
    try {
        const { status = 'active', limit = 20 } = req.query;

        const alerts = await Alert.findAll({
            where: { status },
            include: [{
                model: User,
                as: 'user',
                attributes: ['name', 'email', 'studentId']
            }],
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit)
        });

        res.json({
            success: true,
            count: alerts.length,
            data: alerts
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
