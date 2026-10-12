const express = require('express');
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  getMe
} = require('../controllers/authController');

const { 
  uploadProfilePicture, 
  deleteProfilePicture 
} = require('../controllers/profileController'); // ✅ Add this

const { protect, authorize } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validator');
const { loginLimiter } = require('../middleware/rateLimiter');
const uploadImage = require('../middleware/imageUpload'); // ✅ Add this

router.post('/register', protect, authorize('ADMIN'), validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/refresh', refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

router.post('/profile/picture', protect, uploadImage.single('profilePicture'), uploadProfilePicture);
router.delete('/profile/picture', protect, deleteProfilePicture);

module.exports = router;