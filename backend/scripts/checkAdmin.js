require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    const user = await User.findOne({ username: 'admin' }).lean();
    if (!user) {
      console.log('No admin user found');
    } else {
      console.log('admin user:');
      console.log('  username:', user.username);
      console.log('  email:', user.email || '<none>');
      console.log('  role:', user.role || '<none>');
      console.log('  passwordPresent:', !!user.password);
      console.log('  passwordLooksHashed:', typeof user.password === 'string' && user.password.startsWith('$2'));
    }
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
