const express = require('express');
const router = express.Router();
const {
    logActivity,
    getUserActivities,
    getActivityStats
} = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, logActivity);
router.get('/:userId', protect, authorize('faculty', 'admin'), getUserActivities);
router.get('/stats/:userId', protect, getActivityStats);

module.exports = router;
