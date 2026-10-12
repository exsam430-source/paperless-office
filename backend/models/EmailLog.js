const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  fileId: String,
  type: {
    type: String,
    enum: ['ASSIGNED', 'APPROVED', 'REJECTED', 'SLA_WARNING', 'SLA_BREACH', 'ESCALATED']
  },
  status: {
    type: String,
    enum: ['SENT', 'FAILED', 'RETRYING'],
    default: 'SENT'
  },
  retryCount: { type: Number, default: 0 },
  error: String,
  sentAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmailLog', emailLogSchema);