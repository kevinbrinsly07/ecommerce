require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    await connectDB();
    const pwd = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const user = await User.findOne({ username: 'admin' });
    if (!user) {
      console.log('No admin user found to reset');
      await mongoose.disconnect();
      process.exit(1);
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(pwd, salt);
    user.role = 'admin';
    await user.save();
    console.log(`✅ Admin password reset to: ${pwd}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
