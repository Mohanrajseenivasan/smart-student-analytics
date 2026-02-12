const express = require('express');
const router = express.Router();
const {
    addMarks,
    calculateAverageMarks
} = require('../controllers/academicController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'faculty', 'hod'), addMarks);
router.post('/calculate/:studentId', protect, authorize('admin', 'faculty', 'hod'), calculateAverageMarks);

module.exports = router;
