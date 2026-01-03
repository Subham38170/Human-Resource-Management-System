require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const email = 'admin@dayflow.com';
    const newPassword = 'password123';

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      console.log(`User with email ${email} not found.`);
    } else {
      user.password = newPassword;
      // Fix case sensitivity issue found in validation
      if (user.role === 'admin') {
        user.role = 'Admin';
      }
      try {
        await user.save();
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        console.log(`Role updated to: ${user.role}`);
      } catch (saveError) {
        console.error('Save Error:', JSON.stringify(saveError, null, 2));
      }
    }

    process.exit();
  } catch (error) {
    console.error('General Error:', error);
    process.exit(1);
  }
};

resetAdmin();
