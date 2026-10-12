const { 
  sendFileAssignedEmail, 
  sendFileApprovedEmail, 
  sendFileRejectedEmail,
  sendRevisionRequestEmail,
  sendSLAWarningEmail 
} = require('../services/emailService');
const { emitSocketEvent, emitToRole } = require('../services/socketService');
const File = require('../models/File');
const User = require('../models/User');

// @desc    Test Email Notifications
// @route   POST /api/test/email
// @access  Private/Admin
exports.testEmail = async (req, res) => {
  try {
    const { type, fileId } = req.body;

    console.log('\n📧 Testing email notification...');
    console.log('Type:', type);
    console.log('File ID:', fileId);

    // Find file
    const File = require('../models/File');
    const file = await File.findOne({ fileId }).populate('createdBy department');

    if (!file) {
      console.error('❌ File not found:', fileId);
      return res.status(404).json({ 
        success: false, 
        message: 'File not found',
        debug: {
          fileId,
          searched: true
        }
      });
    }

    console.log('✅ File found:', file.fileId);
    console.log('Current Holder Role:', file.currentHolderRole);
    console.log('File Creator:', file.createdBy?.email);

    // Get users for role
    const User = require('../models/User');
    const roleUsers = await User.find({ 
      role: file.currentHolderRole, 
      isActive: true 
    }).select('email name role');

    console.log(`Found ${roleUsers.length} user(s) with role ${file.currentHolderRole}`);
    roleUsers.forEach(user => {
      console.log(`  - ${user.name} (${user.email})`);
    });

    if (roleUsers.length === 0) {
      console.error('❌ No users found with role:', file.currentHolderRole);
      return res.status(400).json({
        success: false,
        message: `No users found with role: ${file.currentHolderRole}`,
        debug: {
          searchedRole: file.currentHolderRole,
          availableRoles: await User.distinct('role')
        }
      });
    }

    // Send email
    const { 
      sendFileAssignedEmail, 
      sendFileApprovedEmail, 
      sendFileRejectedEmail,
      sendRevisionRequestEmail,
      sendSLAWarningEmail 
    } = require('../services/emailService');

    let result;

    switch (type) {
      case 'ASSIGNED':
        console.log('Sending assignment email...');
        result = await sendFileAssignedEmail(file, file.currentHolderRole);
        break;
      case 'APPROVED':
        console.log('Sending approval email...');
        result = await sendFileApprovedEmail(file, req.user, 'REGISTRAR');
        break;
      case 'REJECTED':
        console.log('Sending rejection email...');
        result = await sendFileRejectedEmail(file, req.user, 'Test rejection reason');
        break;
      case 'REVISION':
        console.log('Sending revision email...');
        result = await sendRevisionRequestEmail(file, req.user, 'Test revision request');
        break;
      case 'SLA_WARNING':
        console.log('Sending SLA warning email...');
        result = await sendSLAWarningEmail(file);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email type',
          validTypes: ['ASSIGNED', 'APPROVED', 'REJECTED', 'REVISION', 'SLA_WARNING']
        });
    }

    console.log('Email result:', result ? '✅ Sent' : '❌ Failed');
    console.log('');

    res.status(200).json({
      success: true,
      message: `Test ${type} email ${result ? 'sent' : 'failed'}`,
      emailSent: result,
      debug: {
        fileId: file.fileId,
        currentHolderRole: file.currentHolderRole,
        recipientCount: roleUsers.length,
        recipients: roleUsers.map(u => u.email),
        smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
      }
    });
  } catch (error) {
    console.error('❌ Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// @desc    Test Socket Notification
// @route   POST /api/test/socket
// @access  Private/Admin
exports.testSocket = async (req, res) => {
  try {
    const { event, data } = req.body;

    emitSocketEvent(event, {
      ...data,
      testMode: true,
      timestamp: new Date()
    });

    res.status(200).json({
      success: true,
      message: `Socket event '${event}' emitted`,
      data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Email Logs
// @route   GET /api/test/email-logs
// @access  Private/Admin
exports.getEmailLogs = async (req, res) => {
  try {
    const EmailLog = require('../models/EmailLog');
    const logs = await EmailLog.find().sort({ sentAt: -1 }).limit(50);

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check Email Configuration
// @route   GET /api/test/email-config
// @access  Private/Admin
exports.checkEmailConfig = async (req, res) => {
  const User = require('../models/User');
  
  const config = {
    smtp: {
      host: process.env.SMTP_HOST || '❌ Not Set',
      port: process.env.SMTP_PORT || '❌ Not Set',
      user: process.env.SMTP_USER || '❌ Not Set',
      hasPassword: !!process.env.SMTP_PASS,
      from: process.env.SMTP_FROM || '❌ Not Set'
    },
    users: {},
    frontend: process.env.FRONTEND_URL || '❌ Not Set'
  };

  // Count users by role
  const roles = ['ADMIN', 'CLERK', 'REGISTRAR', 'DIRECTOR', 'FINANCE', 'DEAN', 'VC'];
  
  for (const role of roles) {
    const count = await User.countDocuments({ role, isActive: true });
    const users = await User.find({ role, isActive: true }).select('email name');
    config.users[role] = {
      count,
      emails: users.map(u => u.email)
    };
  }

  res.status(200).json({
    success: true,
    config,
    recommendations: {
      smtp: !process.env.SMTP_HOST ? 'Configure SMTP settings in .env file' : '✅ SMTP configured',
      users: Object.values(config.users).every(r => r.count > 0) ? '✅ All roles have users' : '⚠️ Some roles have no users',
      frontend: process.env.FRONTEND_URL ? '✅ Frontend URL set' : '⚠️ Set FRONTEND_URL in .env'
    }
  });
};
// @desc    Test SMTP Connection
// @route   GET /api/test/smtp
// @access  Private/Admin
exports.testSMTP = async (req, res) => {
  try {
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Verify connection
    await transporter.verify();

    // Send test email
    const info = await transporter.sendMail({
      from: `"Paperless Office Test" <${process.env.SMTP_FROM}>`,
      to: req.user.email,
      subject: 'Test Email from Paperless Office',
      html: '<h1>✅ SMTP is working!</h1><p>If you received this, your email configuration is correct.</p>'
    });

    res.status(200).json({
      success: true,
      message: 'SMTP test successful',
      info: {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'SMTP test failed',
      error: error.message,
      details: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER,
        hasPassword: !!process.env.SMTP_PASS
      }
    });
  }
};