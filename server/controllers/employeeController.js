const EmployeeProfile = require('../models/EmployeeProfile');
const User = require('../models/User');

// @desc    Get current user's employee profile
// @route   GET /api/employees/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    const employee = await EmployeeProfile.findOne({ user: req.user.id }).populate('user', 'email role');

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Profile not found' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private/Admin
exports.getEmployees = async (req, res, next) => {
  try {
    const employees = await EmployeeProfile.find().populate('user', 'email role status');

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get single employee
// @route   GET /api/employees/:id
// @access  Private (Admin or Owner)
exports.getEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeProfile.findById(req.params.id).populate('user', 'email role');

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Make sure user is owner or admin
    if (employee.user._id.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to view this profile' });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Create new employee profile (and User account if needed)
// @route   POST /api/employees
// @access  Private/Admin
exports.createEmployee = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, jobTitle, department, employeeId } = req.body;

    // 1. Create User
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password for the new employee' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, error: 'User with this email already exists' });
    }

    user = await User.create({
      email,
      password,
      role: 'Employee'
    });

    // 2. Create Employee Profile
    req.body.user = user._id;

    // Check for existing profile (shouldn't exist if user is new, but safe to check)
    const existingProfile = await EmployeeProfile.findOne({ employeeId });
    if (existingProfile) {
      // Rollback user creation if profile creation fails? For simplicity in this hackathon, we skip complex transactions but it's a good practice.
      // For now, if profile fails, we might leave an orphan user. Robustness improvement: delete user if profile fails.
      await User.findByIdAndDelete(user._id);
      return res.status(400).json({ success: false, error: 'Employee ID already exists' });
    }

    const employee = await EmployeeProfile.create(req.body);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error(err);
    // Attempt rollback if user was created but profile failed
    // This is tricky without transaction context variables, but generic error handler catches this.
    res.status(500).json({ success: false, error: err.message || 'Server Error' });
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private (Admin or Partial update for Owner)
exports.updateEmployee = async (req, res, next) => {
  try {
    let employee = await EmployeeProfile.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Check ownership
    // Admin can update everything. Employee can update only 'contact' usually.
    // For simplicity, allowed updates will be filtered in frontend or specialized endpoint,
    // but here we enforce role checks.

    if (req.user.role !== 'Admin') {
      // If not admin, check if owner
      if (employee.user.toString() !== req.user.id) {
        return res.status(401).json({ success: false, error: 'Not authorized to update this profile' });
      }

      // Filter fields for non-admin (Only address, phone, photo)
      const allowedUpdates = ['contact', 'profilePicture'];
      const updates = {};
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) {
          updates[key] = req.body[key];
        }
      });

      // If employee tries to update restricted fields, we ignore them or error. 
      // Here we just use the filtered updates.
      employee = await EmployeeProfile.findByIdAndUpdate(req.params.id, updates, {
        new: true,
        runValidators: true
      });

    } else {
      // Admin update
      employee = await EmployeeProfile.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private/Admin
exports.deleteEmployee = async (req, res, next) => {
  try {
    const employee = await EmployeeProfile.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Delete associated user
    if (employee.user) {
      await User.findByIdAndDelete(employee.user);
    }

    await employee.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Verify user (Approve/Reject)
// @route   PUT /api/employees/:id/verify
// @access  Private/Admin
exports.verifyUser = async (req, res, next) => {
  try {
    const { status } = req.body; // 'active' or 'rejected'

    // Find EmployeeProfile
    const employee = await EmployeeProfile.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee not found' });
    }

    // Find associated User
    const user = await User.findById(employee.user);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User account not found' });
    }

    // Update status
    user.status = status;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
