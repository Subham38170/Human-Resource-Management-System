require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // console.log('MongoDB Connected'); // Comment out to keep output clean used for JSON parsing if needed, but for now simple text is fine if I ensure newlines

    const users = await User.find({});
    // Print as JSON string for easy parsing
    console.log(JSON.stringify(users.map(u => ({ email: u.email, role: u.role })), null, 2));

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkUsers();
