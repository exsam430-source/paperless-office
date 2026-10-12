const mongoose = require('mongoose');

const workflowStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  role: {
    type: String,
    enum: ['CLERK', 'REGISTRAR', 'DIRECTOR', 'FINANCE', 'DEAN', 'VC'],
    required: true
  },
  slaHours: { type: Number, required: true }
});

const workflowTemplateSchema = new mongoose.Schema({
  fileType: { type: String, required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true },
  steps: [workflowStepSchema],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

workflowTemplateSchema.index({ fileType: 1, department: 1 }, { unique: true });

module.exports = mongoose.model('WorkflowTemplate', workflowTemplateSchema);