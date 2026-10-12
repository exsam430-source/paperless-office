const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUsersByRole
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, authorize('ADMIN'), getAllUsers);
router.get('/role/:role', protect, getUsersByRole);
router.get('/:id', protect, authorize('ADMIN'), getUserById);
router.put('/:id', protect, authorize('ADMIN'), updateUser);
router.delete('/:id', protect, authorize('ADMIN'), deleteUser);

module.exports = router;