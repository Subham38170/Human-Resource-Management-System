const User = require('../models/User');
const EmployeeProfile = require('../models/EmployeeProfile');

// @desc    Register user (Employee only)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, employeeId } = req.body;

    // Enforce Employee role and pending status
    const role = 'Employee';
    const status = 'pending';

    // 1. Create User
    const user = await User.create({
      email,
      password,
      role,
      status
    });

    // 2. Create Employee Profile immediately
    // Note: We need minimal fields. Assuming firstName/lastName/employeeId are provided.
    // If optional, handle gracefully.
    await EmployeeProfile.create({
      user: user._id,
      firstName: firstName || 'New',
      lastName: lastName || 'User',
      employeeId: employeeId || `EMP-${Date.now()}`, // Fallback if not provided, though recommended
      email: email, // redundant but in schema
      department: 'Unassigned',
      jobTitle: 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Your account is pending HR verification.'
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, error: 'Email or Employee ID already exists' });
    }
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check Status
    if (user.role !== 'Admin') {
      if (user.status === 'pending') {
        return res.status(403).json({ success: false, error: 'Your account is pending HR verification.' });
      }
      if (user.status === 'rejected') {
        return res.status(403).json({ success: false, error: 'Your account has been rejected.' });
      }
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
};
