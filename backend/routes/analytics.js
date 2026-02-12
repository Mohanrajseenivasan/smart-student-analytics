const express = require('express');
const router = express.Router();
const {
    getAnalyticsSummary,
    generateDashboardReport,
    classifyRiskLevel
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/summary/:studentId', protect, getAnalyticsSummary);
router.post('/report/:studentId', protect, authorize('admin', 'faculty', 'hod', 'counselor'), generateDashboardReport);
router.get('/risk/:studentId', protect, authorize('admin', 'faculty', 'hod', 'counselor'), classifyRiskLevel);

module.exports = router;
