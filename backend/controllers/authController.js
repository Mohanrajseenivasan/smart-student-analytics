const { User, Credential, Activity, Student, AnalyticsSummary } = require('../models');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../config/db');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const t = await sequelize.transaction();

    try {
        const { name, email, password, role, studentId, class: userClass, department, year, phone } = req.body;

        // Check if user exists (by email in Credential table)
        const credentialExists = await Credential.findOne({ where: { email } });
        if (credentialExists) {
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Sanitize inputs
        const sanitizedStudentId = studentId === '' ? null : studentId;
        const sanitizedClass = userClass === '' ? null : userClass;

        // Create user profile first
        const user = await User.create({
            name,
            role: role || 'student',
            studentId: sanitizedStudentId, // Keep for backward compatibility if model has it
            class: sanitizedClass // Keep for backward compatibility
        }, { transaction: t });

        // Create credentials
        await Credential.create({
            userId: user.id,
            email,
            password
        }, { transaction: t });

        // If student, create Student profile and Analytics Summary
        if ((role || 'student') === 'student') {
            const student = await Student.create({
                userId: user.id,
                registerNumber: sanitizedStudentId || `REG-${Date.now()}`, // Fallback if not provided
                department: department || 'General',
                year: year || 1,
                phone: phone || null
            }, { transaction: t });

            // Initialize Analytics Summary
            await AnalyticsSummary.create({
                studentId: student.id,
                attendancePercentage: 0,
                averageMarks: 0,
                behaviorScore: 100,
                riskLevel: 'Normal',
                lastUpdated: new Date()
            }, { transaction: t });
        }

        await t.commit();

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: email,
                role: user.role,
                studentId: user.studentId
            }
        });
    } catch (error) {
        await t.rollback();
        console.error('Registration Error:', error);

        let message = error.message;
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            message = error.errors.map(e => e.message).join(', ');
        }

        res.status(400).json({ // Changed to 400 for validation errors
            success: false,
            message: message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check for credential
        const credential = await Credential.findOne({ where: { email } });

        if (!credential) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check password
        const isPasswordMatch = await credential.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Get user profile
        const user = await User.findByPk(credential.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User profile not found'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Log login activity
        await Activity.create({
            userId: user.id,
            activityType: 'login',
            description: 'User logged in',
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: credential.email,
                role: user.role,
                studentId: user.studentId,
                class: user.class
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            include: [{
                model: Credential,
                as: 'credential',
                attributes: ['email']
            }]
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Flatten response
        const userResponse = user.toJSON();
        if (userResponse.credential) {
            userResponse.email = userResponse.credential.email;
            delete userResponse.credential;
        }

        res.status(200).json({
            success: true,
            user: userResponse
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    try {
        // Log logout activity
        await Activity.create({
            userId: req.user.id,
            activityType: 'logout',
            description: 'User logged out'
        });

        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
