const AuditLog = require('../models/AuditLog');

exports.createAuditLog = async (userId, fileId, action, role, ipAddress) => {
  try {
    await AuditLog.create({
      userId,
      fileId,
      action,
      role,
      ipAddress
    });
  } catch (error) {
    console.error('Audit log creation failed:', error.message);
  }
};

exports.auditMiddleware = (action) => {
  return async (req, res, next) => {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      await exports.createAuditLog(
        req.user._id,
        req.params.id || req.body.fileId,
        action,
        req.user.role,
        ipAddress
      );
      next();
    } catch (error) {
      next();
    }
  };
};