const File = require('../models/File');
const Department = require('../models/Department');
const AuditLog = require('../models/AuditLog');

// @desc    Get Dashboard Statistics
// @route   GET /api/dashboard/stats
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    const totalFiles = await File.countDocuments();
    const pendingFiles = await File.countDocuments({ status: 'PENDING' });
    const approvedFiles = await File.countDocuments({ status: 'APPROVED' });
    const rejectedFiles = await File.countDocuments({ status: 'REJECTED' });
    const escalatedFiles = await File.countDocuments({ status: 'ESCALATED' });

    const delayedFiles = await File.countDocuments({ predictedDelay: true });
    const delayRate = totalFiles > 0 ? ((delayedFiles / totalFiles) * 100).toFixed(2) : 0;

    res.status(200).json({
      success: true,
      data: {
        totalFiles,
        pendingFiles,
        approvedFiles,
        rejectedFiles,
        escalatedFiles,
        delayRate: parseFloat(delayRate)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Average Approval Time by Department
// @route   GET /api/dashboard/approval-time
// @access  Private/Admin
exports.getApprovalTimeByDepartment = async (req, res) => {
  try {
    const approvalTimes = await File.aggregate([
      { $match: { status: 'APPROVED' } },
      {
        $addFields: {
          approvalTime: {
            $subtract: ['$updatedAt', '$createdAt']
          }
        }
      },
      {
        $group: {
          _id: '$department',
          avgApprovalTime: { $avg: '$approvalTime' },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'departmentInfo'
        }
      },
      { $unwind: '$departmentInfo' },
      {
        $project: {
          department: '$departmentInfo.name',
          avgApprovalTimeHours: {
            $divide: ['$avgApprovalTime', 1000 * 60 * 60]
          },
          count: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: approvalTimes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Officer Performance
// @route   GET /api/dashboard/officer-performance
// @access  Private/Admin
exports.getOfficerPerformance = async (req, res) => {
  try {
    const performance = await File.aggregate([
      { $unwind: '$history' },
      {
        $match: {
          'history.action': { $in: ['APPROVED', 'REJECTED'] }
        }
      },
      {
        $group: {
          _id: {
            userId: '$history.userId',
            role: '$history.role'
          },
          totalActions: { $sum: 1 },
          approvals: {
            $sum: { $cond: [{ $eq: ['$history.action', 'APPROVED'] }, 1, 0] }
          },
          rejections: {
            $sum: { $cond: [{ $eq: ['$history.action', 'REJECTED'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.userId',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $project: {
          name: '$userInfo.name',
          role: '$_id.role',
          totalActions: 1,
          approvals: 1,
          rejections: 1,
          performanceScore: {
            $multiply: [
              { $divide: ['$approvals', '$totalActions'] },
              100
            ]
          }
        }
      },
      { $sort: { performanceScore: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: performance
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Detect Bottlenecks
// @route   GET /api/dashboard/bottlenecks
// @access  Private/Admin
exports.detectBottlenecks = async (req, res) => {
  try {
    const bottlenecks = await File.aggregate([
      { $match: { status: 'PENDING' } },
      {
        $group: {
          _id: '$currentHolderRole',
          count: { $sum: 1 },
          avgPriority: { $avg: '$priorityScore' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: bottlenecks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Files by Status
// @route   GET /api/dashboard/files-by-status
// @access  Private
exports.getFilesByStatus = async (req, res) => {
  try {
    const filesByStatus = await File.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: filesByStatus
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};