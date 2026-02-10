const express = require('express');
const router = express.Router();
const {
    calculateBehaviorData,
    getBehaviorData,
    getLatestBehaviorData
} = require('../controllers/behaviorController');
const { protect, authorize } = require('../middleware/auth');

router.post('/calculate/:userId', protect, authorize('faculty', 'admin'), calculateBehaviorData);
router.get('/:userId', protect, getBehaviorData);
router.get('/:userId/latest', protect, getLatestBehaviorData);

module.exports = router;
