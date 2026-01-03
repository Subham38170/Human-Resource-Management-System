const Payroll = require('../models/Payroll');
const EmployeeProfile = require('../models/EmployeeProfile');

// @desc    Generate Payroll for a user (Admin)
// @route   POST /api/payroll/generate
// @access  Private/Admin
exports.generatePayroll = async (req, res, next) => {
  try {
    const { userId, month, year } = req.body;

    // Check if payroll already exists for this user/month/year
    const existingPayroll = await Payroll.findOne({ user: userId, month, year });
    if (existingPayroll) {
      return res.status(400).json({ success: false, error: 'Payroll already generated for this period' });
    }

    // Get Employee Structure
    const employee = await EmployeeProfile.findOne({ user: userId });
    if (!employee) {
      return res.status(404).json({ success: false, error: 'Employee profile found' });
    }

    const { basic, hra, allowances, deductions } = employee.salaryStructure;

    // Simplified Net Salary Calc
    const totalAllowances = (allowances || 0) + (hra || 0);
    const totalDeductions = deductions || 0;
    const netSalary = (basic || 0) + totalAllowances - totalDeductions;

    const payroll = await Payroll.create({
      user: userId,
      month,
      year,
      basicSalary: basic,
      allowances: totalAllowances,
      deductions: totalDeductions,
      netSalary,
      status: 'Pending'
    });

    res.status(201).json({
      success: true,
      data: payroll
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get my payroll history
// @route   GET /api/payroll/my-slips
// @access  Private
exports.getMyPayroll = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find({ user: req.user.id }).sort({ year: -1, month: -1 });

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get all payrolls (Admin)
// @route   GET /api/payroll/all
// @access  Private/Admin
exports.getAllPayroll = async (req, res, next) => {
  try {
    const payrolls = await Payroll.find().populate('user', 'email').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server Error' });
  }
};
