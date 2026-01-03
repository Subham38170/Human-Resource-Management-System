const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  checkIn: {
    type: Date,
    default: Date.now
  },
  checkOut: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Present', 'Absent', 'Half-day', 'Leave'],
    default: 'Present'
  },
  workDuration: {
    type: Number, // In Hours or Minutes
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent multiple check-ins on the same day for the same user (Simplified logic)
// A compound index can enforce unique user + date (without time component)
// For simplicity, we handle this in controller or use a stringified date field for unique index.
AttendanceSchema.index({ user: 1, date: 1 }, { unique: false });

module.exports = mongoose.model('Attendance', AttendanceSchema);
