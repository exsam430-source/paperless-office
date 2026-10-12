const express = require('express');
const router = express.Router();
const {
  getAllAuditLogs,
  getAuditLogsByUser
} = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('ADMIN'), getAllAuditLogs);
router.get('/user/:userId', protect, authorize('ADMIN'), getAuditLogsByUser);

module.exports = router;