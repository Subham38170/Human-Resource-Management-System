const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  getMyProfile
} = require('../controllers/employeeController');


const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/me', getMyProfile);

router
  .route('/')

  .get(authorize('Admin'), getEmployees)
  .post(authorize('Admin'), createEmployee);

router
  .route('/:id')
  .get(getEmployee)
  .put(updateEmployee);

module.exports = router;
