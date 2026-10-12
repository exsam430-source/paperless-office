const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  action: { type: String, required: true },
  role: { type: String, required: true },
  ipAddress: String,
  timestamp: { type: Date, default: Date.now }
});

auditLogSchema.index({ timestamp: -1 });
auditLogSchema.index({ userId: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);