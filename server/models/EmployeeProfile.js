const mongoose = require('mongoose');

const EmployeeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One profile per user
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: [true, 'Please add a first name']
  },
  lastName: {
    type: String,
    required: [true, 'Please add a last name']
  },
  jobTitle: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  },
  profilePicture: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  contact: {
    phone: String,
    address: String
  },
  salaryStructure: {
    basic: { type: Number, default: 0 },
    hra: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('EmployeeProfile', EmployeeProfileSchema);
