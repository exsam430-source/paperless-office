const express = require('express');
const router = express.Router();
const {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('ADMIN'), createDepartment);
router.get('/', protect, getAllDepartments);
router.get('/:id', protect, getDepartmentById);
router.put('/:id', protect, authorize('ADMIN'), updateDepartment);
router.delete('/:id', protect, authorize('ADMIN'), deleteDepartment);

module.exports = router;