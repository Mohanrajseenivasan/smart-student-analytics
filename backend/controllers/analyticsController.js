const { AnalyticsSummary, Attendance, Mark, Behavior, Student, User } = require('../models');
const { Op } = require('sequelize');

// Update Analytics Helper Function
const updateStudentAnalytics = async (studentId) => {
    // 1. Calculate Attendance Percentage
    const totalDays = await Attendance.count({ where: { studentId } });
    const presentDays = await Attendance.count({ where: { studentId, status: 'Present' } });
    const attendancePercentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    // 2. Calculate Average Marks
    const marks = await Mark.findAll({ where: { studentId } });
    const totalScore = marks.reduce((sum, mark) => sum + mark.score, 0);
    const averageMarks = marks.length > 0 ? totalScore / marks.length : 0;

    // 3. Calculate Behavior Score (Simple logic: Starts at 100, deduction per severity)
    const behaviors = await Behavior.findAll({ where: { studentId } });
    let behaviorScore = 100;
    behaviors.forEach(b => {
        if (b.severityLevel === 'Low') behaviorScore -= 2;
        if (b.severityLevel === 'Medium') behaviorScore -= 5;
        if (b.severityLevel === 'High') behaviorScore -= 10;
        if (b.severityLevel === 'Critical') behaviorScore -= 20;
    });
    behaviorScore = Math.max(0, behaviorScore);

    // 4. Calculate Performance Score
    // Formula: (Attendance × 0.3) + (Average Marks × 0.5) + (Behavior Score × 0.2)
    const performanceScore = (attendancePercentage * 0.3) + (averageMarks * 0.5) + (behaviorScore * 0.2);

    // 5. Classify Risk Level
    // Simple Heuristic: < 50 Performance = High Risk, < 70 = Moderate, >= 70 = Normal
    let riskLevel = 'Normal';
    if (performanceScore < 50) riskLevel = 'High Risk';
    else if (performanceScore < 75) riskLevel = 'Moderate Risk';

    // Update or Create Analytics Summary
    await AnalyticsSummary.upsert({
        studentId,
        attendancePercentage,
        averageMarks,
        behaviorScore,
        performanceScore,
        riskLevel,
        lastUpdated: new Date()
    });

    return { attendancePercentage, averageMarks, behaviorScore, performanceScore, riskLevel };
};

// @desc    Generate Dashboard Report
// @route   POST /api/analytics/generate-report/:studentId
// @access  Admin, Faculty
exports.generateDashboardReport = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const result = await updateStudentAnalytics(studentId);
        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Analytics Summary
// @route   GET /api/analytics/summary/:studentId
// @access  Admin, Faculty, Student (own)
exports.getAnalyticsSummary = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        // Auto-update if data is stale (optional, but good for "Real-time" feel)
        // await updateStudentAnalytics(studentId);

        const summary = await AnalyticsSummary.findOne({ where: { studentId } });
        if (!summary) {
            // Calculate if not exists
            const result = await updateStudentAnalytics(studentId);
            return res.status(200).json({ success: true, data: result });
        }
        res.status(200).json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Classify Risk (On-demand)
// @route   GET /api/analytics/classify-risk/:studentId
// @access  Admin, Faculty
exports.classifyRiskLevel = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        // Re-run calculation
        const result = await updateStudentAnalytics(studentId);
        res.status(200).json({
            success: true,
            data: {
                studentId,
                riskLevel: result.riskLevel,
                performanceScore: result.performanceScore
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
