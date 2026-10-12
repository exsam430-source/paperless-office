const WorkflowTemplate = require('../models/WorkflowTemplate');
const File = require('../models/File');
const { sendEmail } = require('./emailService');
const { emitSocketEvent } = require('./socketService');

// @desc    Initiate Workflow for New File
exports.initiateWorkflow = async (file) => {
  try {
    const workflow = await WorkflowTemplate.findOne({
      fileType: file.fileType,
      department: file.department,
      isActive: true
    });

    if (!workflow) {
      throw new Error('No workflow template found');
    }

    const firstStep = workflow.steps[0];
    
    file.currentStep = 1;
    file.currentHolderRole = firstStep.role;
    file.slaDeadline = new Date(Date.now() + firstStep.slaHours * 60 * 60 * 1000);

    await file.save();

    // Emit socket event
    emitSocketEvent('fileCreated', {
      fileId: file.fileId,
      currentHolderRole: file.currentHolderRole,
      status: file.status,
      timestamp: new Date()
    });

    // Send email notification
    await sendEmail({
      type: 'ASSIGNED',
      fileId: file.fileId,
      title: file.title,
      department: file.department,
      role: file.currentHolderRole,
      status: file.status
    });

    return file;
  } catch (error) {
    console.error('Workflow initiation error:', error.message);
    throw error;
  }
};

// @desc    Move to Next Step
exports.moveToNextStep = async (file) => {
  try {
    const workflow = await WorkflowTemplate.findOne({
      fileType: file.fileType,
      department: file.department,
      isActive: true
    });

    if (!workflow) {
      throw new Error('Workflow template not found');
    }

    if (file.currentStep < workflow.steps.length) {
      file.currentStep += 1;
      const nextStep = workflow.steps[file.currentStep - 1];
      
      file.currentHolderRole = nextStep.role;
      file.slaDeadline = new Date(Date.now() + nextStep.slaHours * 60 * 60 * 1000);
      file.status = 'PENDING';

      await file.save();

      // Emit socket event
      emitSocketEvent('fileUpdated', {
        fileId: file.fileId,
        currentHolderRole: file.currentHolderRole,
        status: file.status,
        timestamp: new Date()
      });

      // Send email
      await sendEmail({
        type: 'ASSIGNED',
        fileId: file.fileId,
        title: file.title,
        department: file.department,
        role: file.currentHolderRole,
        status: file.status
      });

      return file;
    } else {
      // Final approval
      file.status = 'APPROVED';
      file.currentHolderRole = 'COMPLETED';
      await file.save();

      emitSocketEvent('fileApproved', {
        fileId: file.fileId,
        currentHolderRole: file.currentHolderRole,
        status: file.status,
        timestamp: new Date()
      });

      return file;
    }
  } catch (error) {
    console.error('Move to next step error:', error.message);
    throw error;
  }
};

// @desc    Calculate SLA Deadline
exports.calculateSLADeadline = (slaHours) => {
  return new Date(Date.now() + slaHours * 60 * 60 * 1000);
};

// @desc    Get Workflow Progress Percentage
exports.getWorkflowProgress = async (file) => {
  try {
    const workflow = await WorkflowTemplate.findOne({
      fileType: file.fileType,
      department: file.department,
      isActive: true
    });

    if (!workflow) {
      return 0;
    }

    const totalSteps = workflow.steps.length;
    const completedSteps = file.currentStep - 1;

    return Math.round((completedSteps / totalSteps) * 100);
  } catch (error) {
    console.error('Workflow progress calculation error:', error.message);
    return 0;
  }
};