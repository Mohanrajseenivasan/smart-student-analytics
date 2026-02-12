const express = require('express');
const router = express.Router();
const {
    addBehaviorRemark,
    getBehaviorRemarks
} = require('../controllers/behaviorIncidentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'faculty', 'hod', 'counselor'), addBehaviorRemark);
router.get('/:studentId', protect, getBehaviorRemarks);

module.exports = router;
