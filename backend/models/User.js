const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
});

// Hash password before save if it's new or modified and not already a bcrypt hash
userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();
    const pw = this.password || '';
    // if password already looks like a bcrypt hash, skip
    if (typeof pw === 'string' && pw.startsWith('$2')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(pw, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

module.exports = mongoose.model('User', userSchema);