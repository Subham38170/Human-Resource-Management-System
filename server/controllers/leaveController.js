const LeaveRequest = require('../models/LeaveRequest');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
exports.applyLeave = async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    const leave = await LeaveRequest.create({
      user: req.user.id,
      type,
      startDate,
      endDate,
      reason
    });

    res.status(201).json({
      success: true,
      data: leave
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get my leave history
// @route   GET /api/leaves/my-leaves
// @access  Private
exports.getMyLeaves = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all leave requests (Admin) (Optionally filter by pending)
// @route   GET /api/leaves/all
// @access  Private/Admin
exports.getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await LeaveRequest.find().populate('user', 'email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leaves.length,
      data: leaves
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private/Admin
exports.updateLeaveStatus = async (req, res, next) => {
  try {
    const { status, adminComments } = req.body;

    let leave = await LeaveRequest.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ success: false, error: 'Leave request not found' });
    }

    leave = await LeaveRequest.findByIdAndUpdate(req.params.id, { status, adminComments }, {
      new: true,
      runValidators: true
    });

    // TODO: Send email notification here

    res.status(200).json({
      success: true,
      data: leave
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
