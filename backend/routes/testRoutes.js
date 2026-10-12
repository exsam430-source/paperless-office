const express = require('express');
const router = express.Router();
const { testEmail, testSocket, getEmailLogs, testSMTP } = require('../controllers/testController');
const { protect, authorize } = require('../middleware/auth');

router.get('/smtp', protect, testSMTP); // ADD THIS
router.post('/email', protect, authorize('ADMIN'), testEmail);
router.post('/socket', protect, authorize('ADMIN'), testSocket);
router.get('/email-logs', protect, authorize('ADMIN'), getEmailLogs);

module.exports = router;