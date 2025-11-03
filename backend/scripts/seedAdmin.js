require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    const exists = await User.findOne({ username: 'admin' });
    if (!exists) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'Admin@12345', // will be hashed by pre-save
        role: 'admin',
      });
      console.log('✅ Admin created: admin / Admin@12345');
    } else {
      // ensure existing admin has role and a hashed password
      let changed = false;
      if (!exists.role || exists.role !== 'admin') {
        exists.role = 'admin';
        changed = true;
      }
      // if password doesn't look like a bcrypt hash, hash and save
      if (typeof exists.password === 'string' && !exists.password.startsWith('$2')) {
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        exists.password = await bcrypt.hash('Admin@12345', salt);
        changed = true;
      }
      if (changed) {
        await exists.save();
        console.log('✅ Admin updated with role and hashed password');
      } else {
        console.log('ℹ️ Admin already exists and is up-to-date');
      }
    }
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();