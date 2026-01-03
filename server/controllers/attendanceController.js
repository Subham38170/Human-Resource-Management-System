const Attendance = require('../models/Attendance');


// @desc    Check-in
// @route   POST /api/attendance/check-in
// @access  Private
exports.checkIn = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    // We search for attendance for this user >= today
    const existingAttendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today }
    });

    if (existingAttendance) {
      return res.status(400).json({ success: false, error: 'Already checked in for today' });
    }

    const attendance = await Attendance.create({
      user: req.user.id,
      date: today,
      checkIn: Date.now(),
      status: 'Present'
    });

    res.status(201).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Check-out
// @route   POST /api/attendance/check-out
// @access  Private
exports.checkOut = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      user: req.user.id,
      date: { $gte: today }
    });

    if (!attendance) {
      return res.status(400).json({ success: false, error: 'No check-in record found for today' });
    }

    if (attendance.checkOut) {
      return res.status(400).json({ success: false, error: 'Already checked out today' });
    }

    attendance.checkOut = Date.now();

    // Calculate duration in hours
    const durationMs = attendance.checkOut - attendance.checkIn;
    const durationHours = durationMs / (1000 * 60 * 60);
    attendance.workDuration = parseFloat(durationHours.toFixed(2));

    await attendance.save();

    res.status(200).json({
      success: true,
      data: attendance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get my attendance history
// @route   GET /api/attendance/my-history
// @access  Private
exports.getMyAttendance = async (req, res, next) => {
  try {
    const history = await Attendance.find({ user: req.user.id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all attendance (Admin)
// @route   GET /api/attendance/all
// @access  Private/Admin
exports.getAllAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find().populate('user', 'email role').sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
