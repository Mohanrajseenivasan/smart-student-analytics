const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Student = require('../models/Student');
const BehaviorData = require('../models/BehaviorData');
const Alert = require('../models/Alert');
const Goal = require('../models/Goal');
const Achievement = require('../models/Achievement');
const Assignment = require('../models/Assignment');
const Event = require('../models/Event');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Faculty/Admin)
router.get('/stats', protect, authorize('faculty', 'admin', 'counselor', 'hod'), async (req, res) => {
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
// @access  Private (Faculty/Admin/Counselor/HOD)
router.get('/students', protect, authorize('faculty', 'admin', 'counselor', 'hod'), async (req, res) => {
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
// @access  Private (Faculty/Admin/Counselor/HOD)
router.get('/alerts', protect, authorize('faculty', 'admin', 'counselor', 'hod'), async (req, res) => {
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

// @desc    Get specific student stats (For Student Dashboard)
// @route   GET /api/dashboard/student-stats
// @access  Private (Student)
// @desc    Get specific student stats (For Student Dashboard)
// @route   GET /api/dashboard/student-stats
// @access  Private (Student)
router.get('/student-stats', protect, authorize('student'), async (req, res) => {
    try {
        // 1. Get Student Profile ID
        const student = await Student.findOne({ where: { userId: req.user.id } });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        // 2. Parallel Fetch of all dashboard components
        const [
            behaviorData,
            alerts,
            goals,
            achievements,
            assignments,
            events
        ] = await Promise.all([
            // Behavior Metrics
            BehaviorData.findOne({
                where: { userId: req.user.id },
                order: [['date', 'DESC']]
            }),
            // Active Alerts
            Alert.findAll({
                where: { userId: req.user.id, status: 'active' },
                order: [['createdAt', 'DESC']],
                limit: 5
            }),
            // Goals
            Goal.findAll({
                where: { studentId: student.id },
                order: [['deadline', 'ASC']]
            }),
            // Achievements
            Achievement.findAll({
                where: { studentId: student.id },
                order: [['dateEarned', 'DESC']],
                limit: 5
            }),
            // Upcoming Assignments
            Assignment.findAll({
                where: {
                    studentId: student.id,
                    status: { [Op.ne]: 'submitted' }
                },
                order: [['dueDate', 'ASC']],
                limit: 5
            }),
            // College Events (Global)
            Event.findAll({
                where: {
                    eventDate: { [Op.gte]: new Date() }
                },
                order: [['eventDate', 'ASC']],
                limit: 3
            })
        ]);

        res.json({
            success: true,
            data: {
                studentId: student.id,
                behaviorData,
                alerts,
                goals,
                achievements,
                assignments,
                events
            }
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
