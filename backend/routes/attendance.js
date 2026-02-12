const express = require('express');
const router = express.Router();
const {
    markAttendance,
    getAttendance,
    calculateAttendancePercentage
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'faculty', 'hod'), markAttendance);
router.get('/:studentId', protect, getAttendance);
router.post('/calculate/:studentId', protect, authorize('admin', 'faculty', 'hod'), calculateAttendancePercentage);

module.exports = router;
