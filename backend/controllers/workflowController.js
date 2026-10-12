const WorkflowTemplate = require('../models/WorkflowTemplate');
const { createAuditLog } = require('../middleware/audit');

// @desc    Create Workflow Template
// @route   POST /api/workflows
// @access  Private/Admin
exports.createWorkflowTemplate = async (req, res) => {
  try {
    const { fileType, department, steps } = req.body;

    const workflow = await WorkflowTemplate.create({
      fileType,
      department,
      steps
    });

    await createAuditLog(req.user._id, null, 'WORKFLOW_CREATED', req.user.role, req.ip);

    res.status(201).json({
      success: true,
      message: 'Workflow template created successfully',
      data: workflow
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Workflow template already exists for this file type and department'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Workflow Templates
// @route   GET /api/workflows
// @access  Private
exports.getAllWorkflowTemplates = async (req, res) => {
  try {
    const workflows = await WorkflowTemplate.find().populate('department');
    
    res.status(200).json({
      success: true,
      count: workflows.length,
      data: workflows
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Workflow Template by FileType and Department
// @route   GET /api/workflows/:fileType/:department
// @access  Private
exports.getWorkflowByTypeAndDept = async (req, res) => {
  try {
    const workflow = await WorkflowTemplate.findOne({
      fileType: req.params.fileType,
      department: req.params.department,
      isActive: true
    }).populate('department');

    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow template not found' });
    }

    res.status(200).json({ success: true, data: workflow });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Workflow Template
// @route   PUT /api/workflows/:id
// @access  Private/Admin
exports.updateWorkflowTemplate = async (req, res) => {
  try {
    const { steps, isActive } = req.body;

    const workflow = await WorkflowTemplate.findByIdAndUpdate(
      req.params.id,
      { steps, isActive },
      { new: true, runValidators: true }
    );

    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow template not found' });
    }

    await createAuditLog(req.user._id, null, 'WORKFLOW_UPDATED', req.user.role, req.ip);

    res.status(200).json({
      success: true,
      message: 'Workflow template updated successfully',
      data: workflow
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Workflow Template
// @route   DELETE /api/workflows/:id
// @access  Private/Admin
exports.deleteWorkflowTemplate = async (req, res) => {
  try {
    const workflow = await WorkflowTemplate.findByIdAndDelete(req.params.id);
    
    if (!workflow) {
      return res.status(404).json({ success: false, message: 'Workflow template not found' });
    }

    await createAuditLog(req.user._id, null, 'WORKFLOW_DELETED', req.user.role, req.ip);

    res.status(200).json({ success: true, message: 'Workflow template deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add this function to your workflowController.js file
exports.getWorkflowsByDepartment = async (req, res) => {
  try {
    const departmentId = req.params.departmentId;
    const workflows = await Workflow.find({ department: departmentId })
      .populate('department')
      .sort({ createdAt: -1 });
    
    res.status(200).json(workflows);
  } catch (error) {
    console.error('Error fetching workflows by department:', error);
    res.status(500).json({ message: 'Error fetching workflows', error: error.message });
  }
};