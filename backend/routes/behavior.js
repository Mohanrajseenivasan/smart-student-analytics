const express = require('express');
const router = express.Router();
const {
    calculateAllStudentsBehavior,
    calculateStudentBehaviorById,
    calculateBehaviorData,
    getBehaviorData,
    getLatestBehaviorData,
    getRiskSummary
} = require('../controllers/behaviorController');
const { protect, authorize } = require('../middleware/auth');

router.get('/summary', protect, authorize('faculty', 'admin', 'counselor', 'hod'), getRiskSummary);
router.get('/calculate-all', protect, authorize('admin', 'faculty'), calculateAllStudentsBehavior);
router.get('/student/:studentId', protect, authorize('faculty', 'admin', 'counselor', 'hod'), calculateStudentBehaviorById);
router.post('/calculate/:userId', protect, authorize('faculty', 'admin'), calculateBehaviorData);
router.get('/:userId', protect, getBehaviorData);
router.get('/:userId/latest', protect, getLatestBehaviorData);

module.exports = router;
