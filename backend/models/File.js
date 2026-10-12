const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  role: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: {
    type: String,
    enum: ['CREATED', 'APPROVED', 'REJECTED', 'REVISION', 'ESCALATED'],
    required: true
  },
  remarks: String,
  timestamp: { type: Date, default: Date.now },
  signatureHash: String
});

const fileSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  description: String,
  fileType: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  priorityScore: { type: Number, default: 50 },
  predictedDelay: { type: Boolean, default: false },
  aiConfidence: { type: Number, default: 0 },
  
  currentStep: { type: Number, default: 1 },
  currentHolderRole: { type: String, required: true },
  
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'REVISION', 'ESCALATED', 'ARCHIVED'], // ✅ Added ARCHIVED
    default: 'PENDING'
  },
  
  slaDeadline: { type: Date, required: true },
  attachments: [String],
  
  history: [historySchema],
  
  archivedAt: { type: Date }, // ✅ Added
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

fileSchema.index({ status: 1, currentHolderRole: 1 });
fileSchema.index({ department: 1, status: 1 });
fileSchema.index({ slaDeadline: 1 });

module.exports = mongoose.model('File', fileSchema);