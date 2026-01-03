const express = require('express');
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance
} = require('../controllers/attendanceController');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/my-history', getMyAttendance);
router.get('/all', authorize('Admin'), getAllAttendance);

module.exports = router;
