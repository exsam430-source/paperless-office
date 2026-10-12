const AuditLog = require('../models/AuditLog');

// @desc    Get All Audit Logs
// @route   GET /api/audit
// @access  Private/Admin
exports.getAllAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, userId, action } = req.query;

    let query = {};

    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (userId) query.userId = userId;
    if (action) query.action = action;

    const logs = await AuditLog.find(query)
      .populate('userId', 'name email role')
      .populate('fileId', 'fileId title')
      .sort({ timestamp: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Audit Logs by User
// @route   GET /api/audit/user/:userId
// @access  Private/Admin
exports.getAuditLogsByUser = async (req, res) => {
  try {
    const logs = await AuditLog.find({ userId: req.params.userId })
      .populate('userId', 'name email role')
      .populate('fileId', 'fileId title')
      .sort({ timestamp: -1 });

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};