const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['ADMIN', 'CLERK', 'REGISTRAR', 'DIRECTOR', 'FINANCE', 'DEAN', 'VC'],
    required: true
  },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  profilePicture: { type: String, default: null }, // ✅ Add this line
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, select: false },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving (FIXED VERSION)
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);