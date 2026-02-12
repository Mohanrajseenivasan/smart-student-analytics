const { Attendance, Student, User } = require('../models');

// @desc    Mark attendance for a student
// @route   POST /api/attendance
// @access  Faculty
exports.markAttendance = async (req, res) => {
    try {
        const { studentId, date, status } = req.body;
        // Check if student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Create or update attendance record
        const attendance = await Attendance.upsert({
            studentId,
            date,
            status
        });

        // Trigger Analytics Update (async)
        // calculateAttendancePercentage(studentId);

        res.status(201).json({ success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get attendance for a student
// @route   GET /api/attendance/:studentId
// @access  Faculty, Student
exports.getAttendance = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const attendance = await Attendance.findAll({
            where: { studentId },
            order: [['date', 'DESC']]
        });
        res.status(200).json({ success: true, count: attendance.length, data: attendance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Calculate attendance percentage
// @route   POST /api/attendance/:studentId/percentage
// @access  Faculty, Admin
exports.calculateAttendancePercentage = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const totalDays = await Attendance.count({ where: { studentId } });
        const presentDays = await Attendance.count({ where: { studentId, status: 'Present' } });

        const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

        // Update Analytics Summary
        // await AnalyticsSummary.upsert({ studentId, attendancePercentage: percentage });

        res.status(200).json({ success: true, data: { studentId, percentage, totalDays, presentDays } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
