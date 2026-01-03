const express = require('express');
const {
  generatePayroll,
  getMyPayroll,
  getAllPayroll
} = require('../controllers/payrollController');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/generate', authorize('Admin'), generatePayroll);
router.get('/my-slips', getMyPayroll);
router.get('/all', authorize('Admin'), getAllPayroll);

module.exports = router;
