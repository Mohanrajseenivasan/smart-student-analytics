const BehaviorData = require('../models/BehaviorData');
const Activity = require('../models/Activity');
const Alert = require('../models/Alert');
const { Attendance, Mark, Student, User } = require('../models');
const axios = require('axios');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

const ATTENDANCE_WEIGHT = 0.4;
const GRADE_WEIGHT = 0.4;
const ENGAGEMENT_WEIGHT = 0.2;

const RISK_THRESHOLDS = {
    LOW: 20,
    MEDIUM: 40
};

function calculateRiskScore(attendanceRate, gradeAverage, engagementScore) {
    return (
        ((100 - attendanceRate) * ATTENDANCE_WEIGHT) +
        ((100 - gradeAverage) * GRADE_WEIGHT) +
        ((100 - engagementScore) * ENGAGEMENT_WEIGHT)
    );
}

function getBehaviorClass(riskScore) {
    if (riskScore <= RISK_THRESHOLDS.LOW) return 'excellent';
    if (riskScore <= 30) return 'good';
    if (riskScore < RISK_THRESHOLDS.MEDIUM) return 'average';
    if (riskScore < 50) return 'at-risk';
    return 'critical';
}

function getTrendIndicator(previousScore, currentScore) {
    if (!previousScore) return 'stable';
    const diff = currentScore - previousScore;
    if (diff < -3) return 'improving';
    if (diff > 3) return 'declining';
    return 'stable';
}

async function getStudentUserId(studentId) {
    const student = await Student.findByPk(studentId);
    return student ? student.userId : null;
}

async function getStudentByUserId(userId) {
    return await Student.findOne({ where: { userId } });
}

function calculateAttendanceMetrics(attendanceRecords) {
    const totalDays = attendanceRecords.length;
    if (totalDays === 0) {
        return { attendanceRate: 0, daysPresent: 0, daysAbsent: 0, daysOnLeave: 0 };
    }

    const daysPresent = attendanceRecords.filter(a => a.status === 'Present').length;
    const daysAbsent = attendanceRecords.filter(a => a.status === 'Absent').length;
    const daysOnLeave = attendanceRecords.filter(a => a.status === 'Leave').length;

    const weightedScore = (
        (daysPresent * 1.0) +
        (daysOnLeave * 0.5) +
        (daysAbsent * 0)
    );
    const attendanceRate = (weightedScore / totalDays) * 100;

    return {
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        daysPresent,
        daysAbsent,
        daysOnLeave
    };
}

function calculateGradeMetrics(marks) {
    if (marks.length === 0) {
        return {
            gradeAverage: 0,
            subjectGrades: {},
            totalAssignments: 0,
            completedAssignments: 0,
            assignmentCompletionRate: 0
        };
    }

    const totalScore = marks.reduce((sum, m) => sum + (m.score || 0), 0);
    const gradeAverage = totalScore / marks.length;

    const subjectGrades = {};
    marks.forEach(mark => {
        if (!subjectGrades[mark.subject]) {
            subjectGrades[mark.subject] = { total: 0, count: 0 };
        }
        subjectGrades[mark.subject].total += mark.score || 0;
        subjectGrades[mark.subject].count += 1;
    });

    Object.keys(subjectGrades).forEach(subject => {
        subjectGrades[subject] = Math.round(
            (subjectGrades[subject].total / subjectGrades[subject].count) * 100
        ) / 100;
    });

    const examTypes = marks.reduce((acc, m) => {
        acc[m.examType] = (acc[m.examType] || 0) + 1;
        return acc;
    }, {});
    const totalAssignments = Object.values(examTypes).reduce((a, b) => a + b, 0);
    const completedAssignments = marks.filter(m => m.score !== null && m.score !== undefined).length;
    const assignmentCompletionRate = totalAssignments > 0
        ? (completedAssignments / totalAssignments) * 100
        : 0;

    return {
        gradeAverage: Math.round(gradeAverage * 100) / 100,
        subjectGrades,
        totalAssignments,
        completedAssignments,
        assignmentCompletionRate: Math.round(assignmentCompletionRate * 100) / 100
    };
}

async function calculateEngagementMetrics(userId, days = 30) {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const loginActivities = await Activity.findAll({
        where: {
            userId,
            activityType: 'login',
            timestamp: { [Op.gte]: dateFrom }
        }
    });

    const loginFrequency = loginActivities.length;
    const participationScore = Math.min(100, (loginFrequency / 20) * 100);

    const assignmentActivities = await Activity.findAll({
        where: {
            userId,
            activityType: 'assignment_submit',
            timestamp: { [Op.gte]: dateFrom }
        }
    });
    const assignmentSubmissionRate = Math.min(100, (assignmentActivities.length / 10) * 100);

    const pageViews = await Activity.count({
        where: {
            userId,
            activityType: 'page_view',
            timestamp: { [Op.gte]: dateFrom }
        }
    });
    const pageViewScore = Math.min(100, (pageViews / 50) * 100);

    const forumPosts = await Activity.count({
        where: {
            userId,
            activityType: 'forum_post',
            timestamp: { [Op.gte]: dateFrom }
        }
    });
    const forumScore = Math.min(100, (forumPosts / 5) * 100);

    const engagementScore = (
        (participationScore * 0.3) +
        (assignmentSubmissionRate * 0.4) +
        (pageViewScore * 0.2) +
        (forumScore * 0.1)
    );

    return {
        engagementScore: Math.round(engagementScore * 100) / 100,
        loginFrequency,
        participationScore: Math.round(participationScore * 100) / 100,
        assignmentSubmissionRate: Math.round(assignmentSubmissionRate * 100) / 100,
        pageViews,
        forumPosts,
        forumScore: Math.round(forumScore * 100) / 100
    };
}

exports.calculateAllStudentsBehavior = async (req, res) => {
    try {
        console.log('Calculating behavior for all students...');
        const students = await Student.findAll({
            include: [{ model: User, as: 'user', attributes: ['id', 'name'] }]
        });
        console.log('Found students:', students.length);

        const results = [];
        for (const student of students) {
            if (student.userId) {
                const behaviorData = await calculateStudentBehavior(student.userId);
                results.push({
                    studentId: student.id,
                    userId: student.userId,
                    studentName: student.user ? student.user.name : 'Unknown',
                    registerNumber: student.registerNumber,
                    ...behaviorData
                });
            }
        }

        console.log('Results:', results.length);
        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

async function calculateStudentBehavior(userId, days = 30) {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const student = await getStudentByUserId(userId);
    const attendanceMetrics = {
        attendanceRate: 0,
        daysPresent: 0,
        daysAbsent: 0,
        daysOnLeave: 0
    };
    const gradeMetrics = {
        gradeAverage: 0,
        subjectGrades: {},
        totalAssignments: 0,
        completedAssignments: 0,
        assignmentCompletionRate: 0
    };

    if (student) {
        const attendanceRecords = await Attendance.findAll({
            where: {
                studentId: student.id,
                date: { [Op.gte]: dateFrom }
            }
        });
        attendanceMetrics = calculateAttendanceMetrics(attendanceRecords);

        const marks = await Mark.findAll({
            where: {
                studentId: student.id
            }
        });
        gradeMetrics = calculateGradeMetrics(marks);
    }

    const engagementMetrics = await calculateEngagementMetrics(userId, days);

    const riskScore = calculateRiskScore(
        attendanceMetrics.attendanceRate,
        gradeMetrics.gradeAverage,
        engagementMetrics.engagementScore
    );

    const previousBehavior = await BehaviorData.findOne({
        where: { userId },
        order: [['date', 'DESC']]
    });

    const trendIndicator = getTrendIndicator(
        previousBehavior?.riskScore,
        riskScore
    );
    const behaviorClass = getBehaviorClass(riskScore);

    return {
        attendance: attendanceMetrics,
        grades: gradeMetrics,
        engagement: engagementMetrics,
        riskScore: Math.round(riskScore * 100) / 100,
        behaviorClass,
        trendIndicator,
        riskLevel: riskScore <= RISK_THRESHOLDS.LOW ? 'Low' :
                   riskScore < RISK_THRESHOLDS.MEDIUM ? 'Medium' : 'High'
    };
}

exports.calculateStudentBehaviorById = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { days = 30 } = req.query;

        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const behaviorData = await calculateStudentBehavior(student.userId, parseInt(days));

        res.status(200).json({
            success: true,
            data: behaviorData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.calculateBehaviorData = async (req, res) => {
    try {
        const { userId } = req.params;
        const { days = 30 } = req.query;

        const behaviorData = await calculateStudentBehavior(userId, parseInt(days));

        const existingRecord = await BehaviorData.findOne({
            where: { userId },
            order: [['date', 'DESC']]
        });

        let savedRecord;
        if (existingRecord) {
            savedRecord = await existingRecord.update({
                date: new Date(),
                attendanceRate: behaviorData.attendance.attendanceRate,
                daysPresent: behaviorData.attendance.daysPresent,
                daysAbsent: behaviorData.attendance.daysAbsent,
                gradeAverage: behaviorData.grades.gradeAverage,
                assignmentsCompleted: behaviorData.grades.completedAssignments,
                assignmentsTotal: behaviorData.grades.totalAssignments,
                assignmentCompletionRate: behaviorData.grades.assignmentCompletionRate,
                loginFrequency: behaviorData.engagement.loginFrequency,
                participationScore: behaviorData.engagement.participationScore,
                forumPosts: behaviorData.engagement.forumPosts,
                engagementScore: behaviorData.engagement.engagementScore,
                riskScore: behaviorData.riskScore,
                behaviorClass: behaviorData.behaviorClass,
                trendIndicator: behaviorData.trendIndicator
            });
        } else {
            savedRecord = await BehaviorData.create({
                userId,
                date: new Date(),
                attendanceRate: behaviorData.attendance.attendanceRate,
                daysPresent: behaviorData.attendance.daysPresent,
                daysAbsent: behaviorData.attendance.daysAbsent,
                gradeAverage: behaviorData.grades.gradeAverage,
                assignmentsCompleted: behaviorData.grades.completedAssignments,
                assignmentsTotal: behaviorData.grades.totalAssignments,
                assignmentCompletionRate: behaviorData.grades.assignmentCompletionRate,
                loginFrequency: behaviorData.engagement.loginFrequency,
                participationScore: behaviorData.engagement.participationScore,
                forumPosts: behaviorData.engagement.forumPosts,
                engagementScore: behaviorData.engagement.engagementScore,
                riskScore: behaviorData.riskScore,
                behaviorClass: behaviorData.behaviorClass,
                trendIndicator: behaviorData.trendIndicator
            });
        }

        await checkAndGenerateAlerts(userId, behaviorData);

        res.status(201).json({
            success: true,
            data: savedRecord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

async function checkAndGenerateAlerts(userId, behaviorData) {
    const existingActiveAlerts = await Alert.findAll({
        where: { userId, status: 'active' }
    });

    const activeAlertTypes = existingActiveAlerts.map(a => a.alertType);

    if (behaviorData.attendance.attendanceRate < 75 && !activeAlertTypes.includes('attendance')) {
        await Alert.create({
            userId,
            alertType: 'attendance',
            severity: behaviorData.attendance.attendanceRate < 60 ? 'critical' : 'high',
            title: 'Low Attendance Alert',
            message: `Attendance rate has dropped to ${behaviorData.attendance.attendanceRate}% (${behaviorData.attendance.daysPresent}/${behaviorData.attendance.daysPresent + behaviorData.attendance.daysAbsent} days)`,
            triggerValue: behaviorData.attendance.attendanceRate,
            thresholdValue: 75
        });
    }

    if (behaviorData.grades.gradeAverage < 70 && !activeAlertTypes.includes('grade')) {
        await Alert.create({
            userId,
            alertType: 'grade',
            severity: behaviorData.grades.gradeAverage < 60 ? 'critical' : 'high',
            title: 'Low Grade Alert',
            message: `Grade average has dropped to ${behaviorData.grades.gradeAverage}%`,
            triggerValue: behaviorData.grades.gradeAverage,
            thresholdValue: 70
        });
    }

    if (behaviorData.engagement.engagementScore < 60 && !activeAlertTypes.includes('engagement')) {
        await Alert.create({
            userId,
            alertType: 'engagement',
            severity: 'medium',
            title: 'Low Engagement Alert',
            message: `Engagement score is ${behaviorData.engagement.engagementScore}%`,
            triggerValue: behaviorData.engagement.engagementScore,
            thresholdValue: 60
        });
    }

    if (behaviorData.riskScore >= 40 && !activeAlertTypes.includes('risk')) {
        await Alert.create({
            userId,
            alertType: 'risk',
            severity: behaviorData.riskScore >= 50 ? 'critical' : 'high',
            title: 'High Risk Alert',
            message: `Student classified as ${behaviorData.behaviorClass} with risk score ${behaviorData.riskScore}`,
            triggerValue: behaviorData.riskScore,
            thresholdValue: 40
        });
    }
}

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

exports.getRiskSummary = async (req, res) => {
    try {
        const students = await Student.findAll();
        const summary = {
            excellent: 0,
            good: 0,
            average: 0,
            atRisk: 0,
            critical: 0
        };

        for (const student of students) {
            const behavior = await BehaviorData.findOne({
                where: { userId: student.userId },
                order: [['date', 'DESC']]
            });

            if (behavior) {
                summary[behavior.behaviorClass] = (summary[behavior.behaviorClass] || 0) + 1;
            }
        }

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
