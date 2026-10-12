const express = require('express');
const router = express.Router();
const {
  createWorkflowTemplate,
  getAllWorkflowTemplates,
  getWorkflowByTypeAndDept,
  getWorkflowsByDepartment, // Add this controller function
  updateWorkflowTemplate,
  deleteWorkflowTemplate
} = require('../controllers/workflowController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('ADMIN'), createWorkflowTemplate);
router.get('/', protect, getAllWorkflowTemplates);
router.get('/:fileType/:department', protect, getWorkflowByTypeAndDept);
router.get('/department/:departmentId', protect, getWorkflowsByDepartment); // Add this route
router.put('/:id', protect, authorize('ADMIN'), updateWorkflowTemplate);
router.delete('/:id', protect, authorize('ADMIN'), deleteWorkflowTemplate);

module.exports = router;