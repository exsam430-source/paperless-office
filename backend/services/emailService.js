const nodemailer = require('nodemailer');
const EmailLog = require('../models/EmailLog');
const User = require('../models/User');
const File = require('../models/File');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error.message);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

// @desc    Get Users by Role
const getUsersByRole = async (role) => {
  try {
    const users = await User.find({ role, isActive: true }).select('email name');
    return users;
  } catch (error) {
    console.error('Error fetching users by role:', error.message);
    return [];
  }
};

// @desc    Send Email with Retry Logic
const sendEmailWithRetry = async (mailOptions, fileId, type, retryCount = 0) => {
  try {
    await transporter.sendMail(mailOptions);
    
    await EmailLog.create({
      to: mailOptions.to,
      subject: mailOptions.subject,
      fileId,
      type,
      status: 'SENT',
      retryCount
    });

    console.log(`✉️  Email sent to ${mailOptions.to}: ${mailOptions.subject}`);
    return true;
  } catch (error) {
    console.error(`❌ Email failed (Attempt ${retryCount + 1}):`, error.message);

    if (retryCount < 3) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return sendEmailWithRetry(mailOptions, fileId, type, retryCount + 1);
    } else {
      await EmailLog.create({
        to: mailOptions.to,
        subject: mailOptions.subject,
        fileId,
        type,
        status: 'FAILED',
        retryCount,
        error: error.message
      });
      return false;
    }
  }
};

// @desc    Send File Assignment Email
exports.sendFileAssignedEmail = async (file, nextRole) => {
  try {
    console.log(`📧 Sending assignment email to role: ${nextRole}`);
    
    const users = await getUsersByRole(nextRole);
    
    if (!users || users.length === 0) {
      console.log(`⚠️  No users found with role: ${nextRole}`);
      return false;
    }

    const dashboardLink = `${process.env.FRONTEND_URL}/dashboard/files/${file._id}`;
    
    const subject = `📄 New File Assigned - ${file.fileId}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 24px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .info { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #4CAF50; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📄 New File Assigned to You</h2>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>A new file has been assigned to your role: <strong>${nextRole}</strong></p>
            
            <div class="info">
              <p><strong>File ID:</strong> ${file.fileId}</p>
              <p><strong>Title:</strong> ${file.title}</p>
              <p><strong>File Type:</strong> ${file.fileType}</p>
              <p><strong>Priority:</strong> ${file.priorityScore}/100</p>
              <p><strong>Status:</strong> ${file.status}</p>
              <p><strong>SLA Deadline:</strong> ${new Date(file.slaDeadline).toLocaleString()}</p>
            </div>
            
            <p>Please review and take action on this file.</p>
            
            <a href="${dashboardLink}" class="button">View File Details</a>
          </div>
          <div class="footer">
            <p>Paperless Office System - Automated Notification</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailPromises = users.map(user => {
      const mailOptions = {
        from: `"Paperless Office" <${process.env.SMTP_FROM}>`,
        to: user.email,
        subject,
        html: htmlContent
      };
      return sendEmailWithRetry(mailOptions, file.fileId, 'ASSIGNED');
    });

    await Promise.all(emailPromises);
    console.log(`✅ Assignment emails sent to ${users.length} user(s) with role ${nextRole}`);
    return true;
  } catch (error) {
    console.error('Email sending error:', error.message);
    return false;
  }
};

// @desc    Send File Approved Email
exports.sendFileApprovedEmail = async (file, approvedByUser, nextRole = null) => {
  try {
    console.log(`📧 Sending approval notification for file: ${file.fileId}`);
    
    // Send to file creator
    const creator = await User.findById(file.createdBy).select('email name');
    const dashboardLink = `${process.env.FRONTEND_URL}/dashboard/files/${file._id}`;
    
    if (creator) {
      const subject = `✅ File Approved - ${file.fileId}`;
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2196F3; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 24px; background: #2196F3; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .info { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2196F3; }
            .success { color: #4CAF50; font-weight: bold; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>✅ Your File Has Been Approved</h2>
            </div>
            <div class="content">
              <p>Hello ${creator.name},</p>
              <p class="success">Good news! Your file has been approved by ${approvedByUser.name} (${approvedByUser.role}).</p>
              
              <div class="info">
                <p><strong>File ID:</strong> ${file.fileId}</p>
                <p><strong>Title:</strong> ${file.title}</p>
                <p><strong>Current Status:</strong> ${file.status}</p>
                ${nextRole ? `<p><strong>Next Approver:</strong> ${nextRole}</p>` : '<p><strong>Final Status:</strong> FULLY APPROVED ✅</p>'}
              </div>
              
              ${nextRole 
                ? '<p>Your file is now being processed by the next approval level.</p>' 
                : '<p>Your file has completed all approval steps and is now fully approved!</p>'}
              
              <a href="${dashboardLink}" class="button">View File Status</a>
            </div>
            <div class="footer">
              <p>Paperless Office System - Automated Notification</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Paperless Office" <${process.env.SMTP_FROM}>`,
        to: creator.email,
        subject,
        html: htmlContent
      };

      await sendEmailWithRetry(mailOptions, file.fileId, 'APPROVED');
    }

    // If there's a next step, send assignment email
    if (nextRole) {
      await exports.sendFileAssignedEmail(file, nextRole);
    }

    return true;
  } catch (error) {
    console.error('Approved email error:', error.message);
    return false;
  }
};

// @desc    Send File Rejected Email
exports.sendFileRejectedEmail = async (file, rejectedByUser, remarks) => {
  try {
    console.log(`📧 Sending rejection notification for file: ${file.fileId}`);
    
    const creator = await User.findById(file.createdBy).select('email name');
    const dashboardLink = `${process.env.FRONTEND_URL}/dashboard/files/${file._id}`;
    
    if (creator) {
      const subject = `❌ File Rejected - ${file.fileId}`;
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 24px; background: #f44336; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .info { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #f44336; }
            .remarks { background: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>❌ Your File Has Been Rejected</h2>
            </div>
            <div class="content">
              <p>Hello ${creator.name},</p>
              <p>Your file has been rejected by ${rejectedByUser.name} (${rejectedByUser.role}).</p>
              
              <div class="info">
                <p><strong>File ID:</strong> ${file.fileId}</p>
                <p><strong>Title:</strong> ${file.title}</p>
                <p><strong>Status:</strong> REJECTED</p>
                <p><strong>Rejected By:</strong> ${rejectedByUser.name} (${rejectedByUser.role})</p>
              </div>
              
              ${remarks ? `
                <div class="remarks">
                  <p><strong>Rejection Reason:</strong></p>
                  <p>${remarks}</p>
                </div>
              ` : ''}
              
              <p>Please review the feedback and take necessary action.</p>
              
              <a href="${dashboardLink}" class="button">View File Details</a>
            </div>
            <div class="footer">
              <p>Paperless Office System - Automated Notification</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Paperless Office" <${process.env.SMTP_FROM}>`,
        to: creator.email,
        subject,
        html: htmlContent
      };

      await sendEmailWithRetry(mailOptions, file.fileId, 'REJECTED');
      console.log(`✅ Rejection email sent to ${creator.email}`);
    }

    return true;
  } catch (error) {
    console.error('Rejected email error:', error.message);
    return false;
  }
};

// @desc    Send Revision Request Email
exports.sendRevisionRequestEmail = async (file, requestedByUser, remarks) => {
  try {
    console.log(`📧 Sending revision request for file: ${file.fileId}`);
    
    const creator = await User.findById(file.createdBy).select('email name');
    const dashboardLink = `${process.env.FRONTEND_URL}/dashboard/files/${file._id}`;
    
    if (creator) {
      const subject = `🔄 Revision Requested - ${file.fileId}`;
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
            .button { display: inline-block; padding: 12px 24px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .info { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #FF9800; }
            .remarks { background: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔄 Revision Requested</h2>
            </div>
            <div class="content">
              <p>Hello ${creator.name},</p>
              <p>A revision has been requested for your file by ${requestedByUser.name} (${requestedByUser.role}).</p>
              
              <div class="info">
                <p><strong>File ID:</strong> ${file.fileId}</p>
                <p><strong>Title:</strong> ${file.title}</p>
                <p><strong>Status:</strong> REVISION REQUIRED</p>
                <p><strong>Requested By:</strong> ${requestedByUser.name} (${requestedByUser.role})</p>
              </div>
              
              ${remarks ? `
                <div class="remarks">
                  <p><strong>Revision Notes:</strong></p>
                  <p>${remarks}</p>
                </div>
              ` : ''}
              
              <p>Please make the necessary changes and resubmit.</p>
              
              <a href="${dashboardLink}" class="button">View File & Revise</a>
            </div>
            <div class="footer">
              <p>Paperless Office System - Automated Notification</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const mailOptions = {
        from: `"Paperless Office" <${process.env.SMTP_FROM}>`,
        to: creator.email,
        subject,
        html: htmlContent
      };

      await sendEmailWithRetry(mailOptions, file.fileId, 'REVISION');
      console.log(`✅ Revision request email sent to ${creator.email}`);
    }

    return true;
  } catch (error) {
    console.error('Revision email error:', error.message);
    return false;
  }
};

// @desc    Send SLA Warning Email
exports.sendSLAWarningEmail = async (file) => {
  try {
    console.log(`📧 Sending SLA warning for file: ${file.fileId}`);
    
    const users = await getUsersByRole(file.currentHolderRole);
    const dashboardLink = `${process.env.FRONTEND_URL}/dashboard/files/${file._id}`;
    
    const subject = `⚠️ SLA Warning - ${file.fileId}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF9800; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 24px; background: #FF9800; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .warning { background: #fff3cd; padding: 15px; margin: 15px 0; border-radius: 5px; border: 2px solid #FF9800; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>⚠️ SLA Deadline Approaching</h2>
          </div>
          <div class="content">
            <div class="warning">
              <p><strong>⚠️ Warning:</strong> This file is approaching its SLA deadline (80% time elapsed).</p>
            </div>
            
            <p><strong>File ID:</strong> ${file.fileId}</p>
            <p><strong>Title:</strong> ${file.title}</p>
            <p><strong>SLA Deadline:</strong> ${new Date(file.slaDeadline).toLocaleString()}</p>
            <p><strong>Current Holder:</strong> ${file.currentHolderRole}</p>
            
            <p>Please take action immediately to avoid SLA breach.</p>
            
            <a href="${dashboardLink}" class="button">Take Action Now</a>
          </div>
          <div class="footer">
            <p>Paperless Office System - Automated Notification</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailPromises = users.map(user => {
      const mailOptions = {
        from: `"Paperless Office" <${process.env.SMTP_FROM}>`,
        to: user.email,
        subject,
        html: htmlContent
      };
      return sendEmailWithRetry(mailOptions, file.fileId, 'SLA_WARNING');
    });

    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error('SLA warning email error:', error.message);
    return false;
  }
};

// @desc    Send SLA Breach/Escalation Email
exports.sendSLABreachEmail = async (file) => {
  try {
    console.log(`📧 Sending SLA breach notification for file: ${file.fileId}`);
    
    // Send to current holder, admin, and director
    const currentHolderUsers = await getUsersByRole(file.currentHolderRole);
    const adminUsers = await getUsersByRole('ADMIN');
    const directorUsers = await getUsersByRole('DIRECTOR');
    
    const allRecipients = [...currentHolderUsers, ...adminUsers, ...directorUsers];
    const dashboardLink = `${process.env.FRONTEND_URL}/dashboard/files/${file._id}`;
    
    const subject = `🚨 SLA BREACH - ${file.fileId}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #f44336; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .button { display: inline-block; padding: 12px 24px; background: #f44336; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .critical { background: #ffebee; padding: 15px; margin: 15px 0; border-radius: 5px; border: 2px solid #f44336; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚨 CRITICAL: SLA BREACH</h2>
          </div>
          <div class="content">
            <div class="critical">
              <p><strong>🚨 SLA BREACH:</strong> This file has exceeded its SLA deadline and has been escalated.</p>
            </div>
            
            <p><strong>File ID:</strong> ${file.fileId}</p>
            <p><strong>Title:</strong> ${file.title}</p>
            <p><strong>SLA Deadline:</strong> ${new Date(file.slaDeadline).toLocaleString()}</p>
            <p><strong>Current Status:</strong> ESCALATED</p>
            <p><strong>Current Holder:</strong> ${file.currentHolderRole}</p>
            
            <p><strong>IMMEDIATE ACTION REQUIRED</strong></p>
            
            <a href="${dashboardLink}" class="button">Take Immediate Action</a>
          </div>
          <div class="footer">
            <p>Paperless Office System - Automated Notification</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const emailPromises = allRecipients.map(user => {
      const mailOptions = {
        from: `"Paperless Office" <${process.env.SMTP_FROM}>`,
        to: user.email,
        subject,
        html: htmlContent
      };
      return sendEmailWithRetry(mailOptions, file.fileId, 'ESCALATED');
    });

    await Promise.all(emailPromises);
    return true;
  } catch (error) {
    console.error('SLA breach email error:', error.message);
    return false;
  }
};

// Backward compatibility wrapper
exports.sendEmail = async ({ type, fileId, title, department, role, status, remarks, approvedBy }) => {
  try {
    const file = await File.findOne({ fileId }).populate('createdBy');
    
    if (!file) {
      console.error('File not found for email:', fileId);
      return false;
    }

    switch (type) {
      case 'ASSIGNED':
        return await exports.sendFileAssignedEmail(file, role);
      
      case 'APPROVED':
        return await exports.sendFileApprovedEmail(file, approvedBy, role);
      
      case 'REJECTED':
        return await exports.sendFileRejectedEmail(file, approvedBy, remarks);
      
      case 'REVISION':
        return await exports.sendRevisionRequestEmail(file, approvedBy, remarks);
      
      case 'SLA_WARNING':
        return await exports.sendSLAWarningEmail(file);
      
      case 'SLA_BREACH':
      case 'ESCALATED':
        return await exports.sendSLABreachEmail(file);
      
      default:
        console.log('Unknown email type:', type);
        return false;
    }
  } catch (error) {
    console.error('Email service error:', error.message);
    return false;
  }
};