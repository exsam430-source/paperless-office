const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getApprovalTimeByDepartment,
  getOfficerPerformance,
  detectBottlenecks,
  getFilesByStatus
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, getDashboardStats);
router.get('/approval-time', protect, authorize('ADMIN', 'DIRECTOR', 'VC'), getApprovalTimeByDepartment);
router.get('/officer-performance', protect, authorize('ADMIN', 'DIRECTOR', 'VC'), getOfficerPerformance);
router.get('/bottlenecks', protect, authorize('ADMIN', 'DIRECTOR', 'VC'), detectBottlenecks);
router.get('/files-by-status', protect, getFilesByStatus);

module.exports = router;