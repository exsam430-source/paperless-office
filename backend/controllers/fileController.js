const path = require("path");
const File = require("../models/File");
const WorkflowTemplate = require("../models/WorkflowTemplate");
const { createAuditLog } = require("../middleware/audit");
const { predictAI } = require("../services/aiService");
const {
  sendEmail,
  sendFileAssignedEmail,
  sendFileApprovedEmail,
  sendFileRejectedEmail,
  sendRevisionRequestEmail,
} = require("../services/emailService");
const { emitSocketEvent, emitToRole } = require("../services/socketService");
const { stampPdfWithSignature } = require("../services/pdfSignService");
const { initiateWorkflow } = require("../services/workflowService");
const crypto = require("crypto");

// @desc    Create File
// @route   POST /api/files
// @access  Private
exports.createFile = async (req, res) => {
  try {
    const { title, description, fileType, department } = req.body;

    // Generate unique fileId
    const fileId = `FILE-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    let effectiveFileType = fileType;

    // If frontend sends AUTO, let AI decide a real fileType
    if (fileType === "AUTO") {
      try {
        const classification =
          await require("../services/aiService").classifyFile({
            title,
            description,
            fileType,
          });
        const allowed = [
          "LEAVE_APPLICATION",
          "BUDGET_REQUEST",
          "PURCHASE_ORDER",
          "ACADEMIC_REQUEST",
          "HR_DOCUMENT",
        ];
        if (
          classification?.category &&
          allowed.includes(classification.category)
        ) {
          effectiveFileType = classification.category;
        }
      } catch (e) {
        // ignore and fallback
      }
    }

    // Get workflow template
    const workflow = await WorkflowTemplate.findOne({
      fileType: effectiveFileType,
      department,
      isActive: true,
    });

    if (!workflow) {
      return res.status(404).json({
        success: false,
        message: "No workflow template found for this file type and department",
      });
    }

    // AI Predictions
    let aiPredictions = {
      priorityScore: 50,
      predictedDelay: false,
      aiConfidence: 0,
    };

    try {
      aiPredictions = await predictAI({
        title,
        description,
        fileType,
        department,
      });
    } catch (aiError) {
      console.error("AI Service Error:", aiError.message);
    }

    // Calculate SLA Deadline
    const firstStep = workflow.steps[0];
    const slaDeadline = new Date(
      Date.now() + firstStep.slaHours * 60 * 60 * 1000,
    );

    // Handle file attachments
    const attachments = req.files ? req.files.map((file) => file.filename) : [];

    // Create file
    // After file is created, around line 80-90, replace the email sending part:

    // Create file
    const file = await File.create({
      fileId,
      title,
      description,
      fileType,
      department,
      createdBy: req.user._id,
      priorityScore: aiPredictions.priorityScore,
      predictedDelay: aiPredictions.predictedDelay,
      aiConfidence: aiPredictions.aiConfidence,
      currentStep: 1,
      currentHolderRole: firstStep.role,
      slaDeadline,
      attachments,
      history: [
        {
          stepNumber: 0,
          role: req.user.role,
          userId: req.user._id,
          action: "CREATED",
          remarks: "File created",
          timestamp: new Date(),
        },
      ],
    });

    await createAuditLog(
      req.user._id,
      file._id,
      "FILE_CREATED",
      req.user.role,
      req.ip,
    );

    console.log(`\n📄 New file created: ${file.fileId}`);
    console.log(
      `📊 Priority: ${file.priorityScore}/100, Delay Risk: ${file.predictedDelay}`,
    );
    console.log(`👤 Assigned to: ${file.currentHolderRole}\n`);

    // Emit socket event
    emitSocketEvent("fileCreated", {
      fileId: file.fileId,
      currentHolderRole: file.currentHolderRole,
      status: file.status,
      createdBy: {
        name: req.user.name,
        role: req.user.role,
      },
      timestamp: new Date(),
    });

    // Emit to specific role
    emitToRole(file.currentHolderRole, "fileAssigned", {
      fileId: file.fileId,
      title: file.title,
      currentHolderRole: file.currentHolderRole,
      status: file.status,
      timestamp: new Date(),
    });

    // Send email notification to assigned role
    await sendFileAssignedEmail(file, file.currentHolderRole);

    // Send email notification
    await sendEmail({
      type: "ASSIGNED",
      fileId: file.fileId,
      title: file.title,
      department,
      role: file.currentHolderRole,
      status: file.status,
    });

    res.status(201).json({
      success: true,
      message: "File created successfully",
      data: file,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Files
// @route   GET /api/files
// @access  Private
exports.getAllFiles = async (req, res) => {
  try {
    const { status, department, currentHolderRole } = req.query;

    let query = {};

    // Role-based filtering
    if (req.user.role !== "ADMIN") {
      query.$or = [
        { createdBy: req.user._id },
        { currentHolderRole: req.user.role },
      ];
    }

    if (status) query.status = status;
    if (department) query.department = department;
    if (currentHolderRole) query.currentHolderRole = currentHolderRole;

    const files = await File.find(query)
      .populate("department")
      .populate("createdBy", "name email role")
      .populate("history.userId", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get File by ID
// @route   GET /api/files/:id
// @access  Private
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate("department")
      .populate("createdBy", "name email role")
      .populate("history.userId", "name role");

    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    res.status(200).json({ success: true, data: file });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/// @desc    Process File Action (Approve/Reject/Revision)
// @route   POST /api/files/:id/action
// @access  Private
exports.processFileAction = async (req, res) => {
  try {
    const { action, remarks, signatureData, signaturePlacement } = req.body;

    // ✅ Add logging
    console.log('📥 Action request received:', {
      action,
      fileId: req.params.id,
      hasSignature: !!signatureData,
      signatureSize: signatureData ? Math.round(signatureData.length / 1024) + 'KB' : '0KB',
      placement: signaturePlacement
    });
    const file = await File.findById(req.params.id).populate("createdBy");
    if (!file) {
      return res
        .status(404)
        .json({ success: false, message: "File not found" });
    }

    // ✅ Permission check FIRST (before writing history)
    if (file.currentHolderRole !== req.user.role) {
      return res.status(403).json({
        success: false,
        message: `You are not authorized to act on this file. Current holder: ${file.currentHolderRole}, Your role: ${req.user.role}`,
      });
    }

    // ✅ Load workflow template
    const workflow = await WorkflowTemplate.findOne({
      fileType: file.fileType,
      department: file.department,
      isActive: true,
    });

    if (!workflow) {
      return res
        .status(404)
        .json({ success: false, message: "Workflow template not found" });
    }

    // ✅ Compute signature hash (if provided)
    const signatureHash = signatureData
      ? crypto.createHash("sha256").update(signatureData).digest("hex")
      : undefined;

    console.log(
      `\n📋 Processing ${action} on ${file.fileId} by ${req.user.name} (${req.user.role})`,
    );

    // =========================
    // ACTION HANDLING (STRICT)
    // =========================
    if (action === "APPROVE") {
      // history
      file.history.push({
        stepNumber: file.currentStep,
        role: req.user.role,
        userId: req.user._id,
        action: "APPROVED",
        remarks,
        timestamp: new Date(),
        signatureHash,
      });

      // If more steps exist -> move next
      if (file.currentStep < workflow.steps.length) {
        file.currentStep += 1;
        const nextStep = workflow.steps[file.currentStep - 1];

        file.currentHolderRole = nextStep.role;
        file.status = "PENDING";
        file.slaDeadline = new Date(
          Date.now() + nextStep.slaHours * 60 * 60 * 1000,
        );

        // Email next holder + creator update
        await sendFileApprovedEmail(file, req.user, nextStep.role);

        // realtime
        emitSocketEvent("fileApproved", {
          fileId: file.fileId,
          currentHolderRole: file.currentHolderRole,
          previousRole: req.user.role,
          status: file.status,
          timestamp: new Date(),
        });

        emitToRole(nextStep.role, "fileAssigned", {
          fileId: file.fileId,
          title: file.title,
          currentHolderRole: nextStep.role,
          status: file.status,
          timestamp: new Date(),
        });
      } else {
        // last step => approved
        file.status = "APPROVED";
        file.currentHolderRole = "COMPLETED";

        await sendFileApprovedEmail(file, req.user, null);

        emitSocketEvent("fileFinalApproved", {
          fileId: file.fileId,
          currentHolderRole: file.currentHolderRole,
          status: file.status,
          timestamp: new Date(),
        });
      }
    } else if (action === "REJECT") {
      file.status = "REJECTED";

      file.history.push({
        stepNumber: file.currentStep,
        role: req.user.role,
        userId: req.user._id,
        action: "REJECTED",
        remarks,
        timestamp: new Date(),
        signatureHash,
      });

      await sendFileRejectedEmail(file, req.user, remarks);

      emitSocketEvent("fileRejected", {
        fileId: file.fileId,
        currentHolderRole: file.currentHolderRole,
        status: file.status,
        remarks,
        timestamp: new Date(),
      });
    } else if (action === "REVISION") {
      // ✅ Strict spec: return to creator (not step-1 role)
      file.status = "REVISION";
      file.currentStep = 1;
      file.currentHolderRole = file.createdBy.role; // return to creator role
      // Optional: reset SLA to first step time window
      const firstStep = workflow.steps[0];
      file.slaDeadline = new Date(
        Date.now() + firstStep.slaHours * 60 * 60 * 1000,
      );

      file.history.push({
        stepNumber: file.currentStep,
        role: req.user.role,
        userId: req.user._id,
        action: "REVISION",
        remarks,
        timestamp: new Date(),
        signatureHash,
      });

      await sendRevisionRequestEmail(file, req.user, remarks);

      emitSocketEvent("fileRevisionRequested", {
        fileId: file.fileId,
        currentHolderRole: file.currentHolderRole,
        status: file.status,
        remarks,
        timestamp: new Date(),
      });
    }

// Around line 420-450, REPLACE the end of processFileAction with this:

    // =========================
    // ✅ STAMP SIGNATURE ON PDF
    // =========================
    if (
      signatureData &&
      Array.isArray(file.attachments) &&
      file.attachments.length > 0
    ) {
      const uploadsDir = path.join(__dirname, "..", "uploads");

      const idx =
        signaturePlacement?.attachmentIndex !== undefined
          ? signaturePlacement.attachmentIndex
          : file.attachments.findIndex((f) => f.toLowerCase().endsWith(".pdf"));

      if (
        idx >= 0 &&
        file.attachments[idx] &&
        file.attachments[idx].toLowerCase().endsWith(".pdf")
      ) {
        const label = `Signed by ${req.user.role} on ${new Date().toLocaleString()}`;

        console.log('📝 Applying signature to PDF:');
        console.log('   Original file:', file.attachments[idx]);

        const signedFilename = await stampPdfWithSignature({
          uploadsDir,
          inputFilename: file.attachments[idx],
          signatureData,
          labelText: label,
          placement: signaturePlacement || {},
        });

        console.log('   Signed file:', signedFilename);

        // Replace original
        file.attachments[idx] = signedFilename;
        
        console.log('   Updated attachments:', file.attachments);
      }
    }

    // Save
    file.updatedAt = new Date();
    await file.save();

    console.log('✅ File saved to database with updated attachments');

    // Audit log
    await createAuditLog(
      req.user._id,
      file._id,
      `FILE_${action}`,
      req.user.role,
      req.ip,
    );

    // ✅ Populate file data before emitting
    await file.populate('department');
    await file.populate('createdBy', 'name email role');
    await file.populate('history.userId', 'name role');

    const fileData = {
      _id: file._id,
      fileId: file.fileId,
      currentHolderRole: file.currentHolderRole,
      status: file.status,
      attachments: file.attachments, // ✅ Critical: send updated attachments
      updatedAt: file.updatedAt,
      timestamp: new Date(),
    };

    console.log('📡 Emitting socket events with data:', fileData);

    // ✅ Emit to ALL users
    emitSocketEvent("fileUpdated", fileData);

    // ✅ Also emit specific events
    if (action === 'APPROVE') {
      emitSocketEvent("fileApproved", fileData);
    } else if (action === 'REJECT') {
      emitSocketEvent("fileRejected", fileData);
    } else if (action === 'REVISION') {
      emitSocketEvent("fileRevisionRequested", fileData);
    }

    console.log('✅ Action completed successfully');

    // ✅ Return FULL file object (critical for frontend updates)
    return res.status(200).json({
      success: true,
      message: `File ${action.toLowerCase()} successfully`,
      data: file, // Return full populated file
    });
  } catch (error) {
    console.error("❌ File action error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get My Files
// @route   GET /api/files/my/created
// @access  Private
exports.getMyFiles = async (req, res) => {
  try {
    const files = await File.find({ createdBy: req.user._id })
      .populate("department")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Pending Files for Current User Role
// @route   GET /api/files/pending/me
// @access  Private
exports.getPendingFiles = async (req, res) => {
  try {
    const files = await File.find({
      currentHolderRole: req.user.role,
      status: "PENDING",
    })
      .populate("department")
      .populate("createdBy", "name email role")
      .sort({ priorityScore: -1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update File
// @route   PUT /api/files/:id
// @access  Private (Only creator can update)
exports.updateFile = async (req, res) => {
  try {
    const { title, description, fileType, department } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // ✅ Only creator can update
    if (file.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only update files you created"
      });
    }

    // ✅ Only allow updates for PENDING or REVISION status
    if (!['PENDING', 'REVISION'].includes(file.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update file with status: ${file.status}`
      });
    }

    // Update fields
    file.title = title || file.title;
    file.description = description !== undefined ? description : file.description;

    // Handle new attachments (if uploaded)
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map((f) => f.filename);
      file.attachments = [...file.attachments, ...newAttachments];
    }

    file.updatedAt = new Date();
    await file.save();

    await createAuditLog(
      req.user._id,
      file._id,
      "FILE_UPDATED",
      req.user.role,
      req.ip
    );

    console.log(`✏️ File updated: ${file.fileId} by ${req.user.name}`);

    // Emit socket event
    emitSocketEvent("fileUpdated", {
      _id: file._id,
      fileId: file.fileId,
      title: file.title,
      updatedAt: file.updatedAt,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "File updated successfully",
      data: file,
    });
  } catch (error) {
    console.error("Update file error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete File
// @route   DELETE /api/files/:id
// @access  Private (Only creator can delete)
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // ✅ Only creator can delete
    if (file.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete files you created"
      });
    }

    // ✅ Only allow delete for PENDING or REVISION status
    if (!['PENDING', 'REVISION'].includes(file.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete file with status: ${file.status}. Only PENDING or REVISION files can be deleted.`
      });
    }

    const fileId = file.fileId;

    // Delete the file
    await file.deleteOne();

    await createAuditLog(
      req.user._id,
      file._id,
      "FILE_DELETED",
      req.user.role,
      req.ip
    );

    console.log(`🗑️ File deleted: ${fileId} by ${req.user.name}`);

    // Emit socket event
    emitSocketEvent("fileDeleted", {
      _id: file._id,
      fileId: fileId,
      timestamp: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
      data: { fileId }
    });
  } catch (error) {
    console.error("Delete file error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Archive File Manually (Admin only)
// @route   POST /api/files/:id/archive
// @access  Private (Admin only)
exports.archiveFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Only approved files can be archived
    if (file.status !== 'APPROVED') {
      return res.status(400).json({
        success: false,
        message: "Only approved files can be archived"
      });
    }

    file.status = 'ARCHIVED';
    file.archivedAt = new Date();
    await file.save();

    await createAuditLog(
      req.user._id,
      file._id,
      "FILE_ARCHIVED",
      req.user.role,
      req.ip
    );

    console.log(`📦 File archived: ${file.fileId} by ${req.user.name}`);

    res.status(200).json({
      success: true,
      message: "File archived successfully",
      data: file,
    });
  } catch (error) {
    console.error("Archive file error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};