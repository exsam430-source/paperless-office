const User = require('../models/User');
const path = require('path');
const fs = require('fs').promises;
const { createAuditLog } = require('../middleware/audit');

// @desc    Upload Profile Picture
// @route   POST /api/auth/profile/picture
// @access  Private
exports.uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const user = await User.findById(req.user._id);
    
    // Delete old profile picture if exists
    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, '..', 'uploads', user.profilePicture);
      try {
        await fs.unlink(oldImagePath);
      } catch (err) {
        console.log('Old image not found or already deleted');
      }
    }

    // Save new profile picture filename
    user.profilePicture = req.file.filename;
    await user.save();

    await createAuditLog(
      req.user._id,
      null,
      'PROFILE_PICTURE_UPDATED',
      req.user.role,
      req.ip
    );

    console.log(`📸 Profile picture updated for user: ${user.name}`);

    res.status(200).json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete Profile Picture
// @route   DELETE /api/auth/profile/picture
// @access  Private
exports.deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.profilePicture) {
      return res.status(400).json({ 
        success: false, 
        message: 'No profile picture to delete' 
      });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', 'uploads', user.profilePicture);
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.log('Image file not found');
    }

    // Remove from database
    user.profilePicture = null;
    await user.save();

    await createAuditLog(
      req.user._id,
      null,
      'PROFILE_PICTURE_DELETED',
      req.user.role,
      req.ip
    );

    console.log(`🗑️ Profile picture deleted for user: ${user.name}`);

    res.status(200).json({
      success: true,
      message: 'Profile picture deleted successfully'
    });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};