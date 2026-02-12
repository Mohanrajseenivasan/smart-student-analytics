const { User, Credential, Student, Attendance, Mark, Behavior, AnalyticsSummary, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

// Helper to calculate risk
const calculateRiskAndPerformance = async (studentId) => {
    // This will be implemented in analyticsController but needed here for updates
    // For now, we just placeholder or call a shared service
    return;
};


// @desc    Add a new student (User + Credential + Student Profile)
// @route   POST /api/students
// @access  Admin, Faculty
exports.addStudent = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const {
            name, email, password, // User/Credential fields
            registerNumber, department, year, phone // Student fields
        } = req.body;

        // Check if email already exists
        const credentialExists = await Credential.findOne({ where: { email } });
        if (credentialExists) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Email already exists' });
        }

        // Check if register number exists
        const studentExists = await Student.findOne({ where: { registerNumber } });
        if (studentExists) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Register number already exists' });
        }

        // 1. Create User
        const user = await User.create({
            name,
            role: 'student',
            isActive: true
        }, { transaction: t });

        // 2. Create Credential
        await Credential.create({
            userId: user.id,
            email,
            password
        }, { transaction: t });

        // 3. Create Student Profile
        const student = await Student.create({
            userId: user.id,
            registerNumber,
            department,
            year,
            phone
        }, { transaction: t });

        // 4. Initialize Analytics Summary
        await AnalyticsSummary.create({
            studentId: student.id,
            attendancePercentage: 0,
            averageMarks: 0,
            behaviorScore: 100,
            riskLevel: 'Normal',
            lastUpdated: new Date()
        }, { transaction: t });

        await t.commit();

        res.status(201).json({
            success: true,
            data: {
                studentId: student.id,
                name: user.name,
                registerNumber: student.registerNumber,
                email: email
            }
        });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Admin, Faculty
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.findAll({
            include: [
                { model: User, as: 'user', attributes: ['name', 'isActive'] },
                { model: AnalyticsSummary, as: 'analytics' }
            ]
        });

        // Format for response
        const formatted = students.map(s => ({
            student_id: s.id,
            register_number: s.registerNumber,
            name: s.user.name,
            department: s.department,
            year: s.year,
            email: s.user.credential ? s.user.credential.email : 'N/A', // Need to include credential if we want email
            phone: s.phone,
            risk_level: s.analytics ? s.analytics.riskLevel : 'Unknown'
        }));

        res.status(200).json({ success: true, count: students.length, data: formatted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Admin, Faculty
exports.updateStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { name, department, year, phone, email } = req.body;
        const student = await Student.findByPk(req.params.id, {
            include: [{ model: User, as: 'user' }]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Update Student fields
        if (department) student.department = department;
        if (year) student.year = year;
        if (phone) student.phone = phone;
        await student.save({ transaction: t });

        // Update User fields
        if (name) {
            student.user.name = name;
            await student.user.save({ transaction: t });
        }

        // Update Email (Credential)
        if (email) {
            const credential = await Credential.findOne({ where: { userId: student.userId } });
            if (credential) {
                credential.email = email;
                await credential.save({ transaction: t });
            }
        }

        await t.commit();
        res.status(200).json({ success: true, data: student });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Admin
exports.deleteStudent = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const student = await Student.findByPk(req.params.id);

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Delete User (cascade should handle the rest, but let's be explicit if needed)
        // Since Student has ForeignKey to User, deleting User should cascade delete Student if configured, 
        // OR deleting Student should be the entry point. 
        // Our model says Student belongsTo User. User hasOne Student.
        // User is the parent. We should delete the User.

        await User.destroy({ where: { id: student.userId }, transaction: t });

        await t.commit();
        res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ success: false, message: error.message });
    }
};
