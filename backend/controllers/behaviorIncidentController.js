const { Behavior, Student } = require('../models');

// @desc    Add behavior remark for a student
// @route   POST /api/behavior/remarks
// @access  Faculty
exports.addBehaviorRemark = async (req, res) => {
    try {
        const { studentId, remark, severityLevel, date } = req.body;
        // Check if student exists
        const student = await Student.findByPk(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const behavior = await Behavior.create({
            studentId,
            remark,
            severityLevel,
            date
        });

        // Trigger Analytics Update (recalculate behavior score)
        // calculateBehaviorScore(studentId);

        res.status(201).json({ success: true, data: behavior });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get behavior remarks for a student
// @route   GET /api/behavior/remarks/:studentId
// @access  Faculty, Admin, Student
exports.getBehaviorRemarks = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const remarks = await Behavior.findAll({
            where: { studentId },
            order: [['date', 'DESC']]
        });
        res.status(200).json({ success: true, count: remarks.length, data: remarks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
