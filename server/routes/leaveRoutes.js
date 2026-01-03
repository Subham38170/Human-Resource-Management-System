const express = require('express');
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus
} = require('../controllers/leaveController');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', applyLeave);
router.get('/my-leaves', getMyLeaves);
router.get('/all', authorize('Admin'), getAllLeaves);
router.put('/:id', authorize('Admin'), updateLeaveStatus);

module.exports = router;
