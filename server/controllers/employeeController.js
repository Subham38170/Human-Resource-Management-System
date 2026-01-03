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
    const employees = await EmployeeProfile.find().populate('user', 'email role');

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

// @desc    Create new employee profile
// @route   POST /api/employees
// @access  Private/Admin (Usually)
exports.createEmployee = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.user = req.body.userId; // Expecting userId in body or created via Admin flow

    // Check for existing profile
    const existingProfile = await EmployeeProfile.findOne({ user: req.body.userId });

    if (existingProfile) {
      return res.status(400).json({ success: false, error: 'Employee profile already exists for this user' });
    }

    const employee = await EmployeeProfile.create(req.body);

    res.status(201).json({
      success: true,
      data: employee
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
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
