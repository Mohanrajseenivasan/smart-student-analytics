const { Mark, Student } = require('../models');

// @desc    Add marks for a student
// @route   POST /api/marks
// @access  Faculty
exports.addMarks = async (req, res) => {
    try {
        const { studentId, subject, score, examType } = req.body;
        // Check if student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const mark = await Mark.create({
            studentId,
            subject,
            score,
            examType
        });

        // Trigger Analytics Update
        // calculateAverageMarks(studentId);

        res.status(201).json({ success: true, data: mark });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Calculate average marks
// @route   POST /api/marks/:studentId/average
// @access  Faculty, Admin
exports.calculateAverageMarks = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const marks = await Mark.findAll({ where: { studentId } });

        if (marks.length === 0) {
            return res.status(200).json({ success: true, average: 0, count: 0 });
        }

        const totalScore = marks.reduce((sum, mark) => sum + mark.score, 0);
        const average = totalScore / marks.length;

        // Update Analytics Summary
        // await AnalyticsSummary.update({ averageMarks: average }, { where: { studentId } });

        res.status(200).json({ success: true, average, count: marks.length });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
