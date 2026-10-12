const File = require('../models/File');
const { sendEmail } = require('./emailService');
const { emitSocketEvent } = require('./socketService');

// @desc    Check SLA Status for a File
exports.checkSLAStatus = async (file) => {
  try {
    const now = new Date();
    const deadline = new Date(file.slaDeadline);
    const timeRemaining = deadline - now;

    // Calculate time elapsed vs total SLA time
    const createdTime = new Date(file.createdAt);
    const totalSLATime = deadline - createdTime;
    const elapsedTime = now - createdTime;
    const percentageElapsed = (elapsedTime / totalSLATime) * 100;

    return {
      isBreached: timeRemaining <= 0,
      isWarning: percentageElapsed >= 80 && timeRemaining > 0,
      percentageElapsed: Math.round(percentageElapsed),
      timeRemaining: Math.max(0, timeRemaining)
    };
  } catch (error) {
    console.error('SLA Status Check Error:', error.message);
    return null;
  }
};

// @desc    Process SLA Warnings
exports.processSLAWarnings = async () => {
  try {
    const pendingFiles = await File.find({
      status: 'PENDING',
      slaDeadline: { $exists: true }
    }).populate('department');

    let warningCount = 0;
    let breachCount = 0;

    for (const file of pendingFiles) {
      const slaStatus = await exports.checkSLAStatus(file);

      if (!slaStatus) continue;

      // Handle SLA Breach
      if (slaStatus.isBreached && file.status !== 'ESCALATED') {
        file.status = 'ESCALATED';
        await file.save();

        // Send escalation email
        await sendEmail({
          type: 'ESCALATED',
          fileId: file.fileId,
          title: file.title,
          department: file.department,
          role: file.currentHolderRole,
          status: 'ESCALATED'
        });

        // Emit socket event
        emitSocketEvent('fileEscalated', {
          fileId: file.fileId,
          currentHolderRole: file.currentHolderRole,
          status: 'ESCALATED',
          timestamp: new Date()
        });

        breachCount++;
        console.log(`🚨 SLA BREACH: File ${file.fileId} escalated`);
      }
      // Handle SLA Warning (80% threshold)
      else if (slaStatus.isWarning) {
        await sendEmail({
          type: 'SLA_WARNING',
          fileId: file.fileId,
          title: file.title,
          department: file.department,
          role: file.currentHolderRole,
          status: file.status
        });

        // Emit socket event
        emitSocketEvent('slaWarning', {
          fileId: file.fileId,
          currentHolderRole: file.currentHolderRole,
          status: file.status,
          percentageElapsed: slaStatus.percentageElapsed,
          timestamp: new Date()
        });

        warningCount++;
        console.log(`⚠️ SLA WARNING: File ${file.fileId} at ${slaStatus.percentageElapsed}%`);
      }
    }

    return {
      warningCount,
      breachCount,
      totalChecked: pendingFiles.length
    };
  } catch (error) {
    console.error('SLA Warning Processing Error:', error.message);
    return null;
  }
};

// @desc    Get SLA Statistics
exports.getSLAStatistics = async () => {
  try {
    const totalFiles = await File.countDocuments();
    const breachedFiles = await File.countDocuments({ status: 'ESCALATED' });
    const onTimeFiles = await File.countDocuments({
      status: 'APPROVED',
      updatedAt: { $lte: '$slaDeadline' }
    });

    const complianceRate = totalFiles > 0 ? ((onTimeFiles / totalFiles) * 100).toFixed(2) : 0;

    return {
      totalFiles,
      breachedFiles,
      onTimeFiles,
      complianceRate: parseFloat(complianceRate)
    };
  } catch (error) {
    console.error('SLA Statistics Error:', error.message);
    return null;
  }
};