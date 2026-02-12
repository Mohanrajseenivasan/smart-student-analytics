const express = require('express');
const router = express.Router();
const {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('admin', 'faculty', 'hod'), addStudent);
router.get('/', protect, authorize('admin', 'faculty', 'hod', 'counselor'), getStudents);
router.put('/:id', protect, authorize('admin', 'faculty', 'hod'), updateStudent);
router.delete('/:id', protect, authorize('admin', 'hod'), deleteStudent);

module.exports = router;
