const express = require('express');
const router = express.Router();
const {
  createFile,
  getAllFiles,
  getFileById,
  processFileAction,
  getMyFiles,
  getPendingFiles,
  updateFile,     // ✅ Add this
  deleteFile,     // ✅ Add this
  archiveFile // ✅ Add this
} = require('../controllers/fileController');
const { protect } = require('../middleware/auth');
const { validateFileCreation, validateFileAction } = require('../middleware/validator');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('attachments', 5), validateFileCreation, createFile);
router.get('/', protect, getAllFiles);
router.get('/my/created', protect, getMyFiles);
router.get('/pending/me', protect, getPendingFiles);
router.get('/:id', protect, getFileById);
router.put('/:id', protect, upload.array('attachments', 5), updateFile);  // ✅ Add this
router.delete('/:id', protect, deleteFile);  // ✅ Add this
router.post('/:id/archive', protect, archiveFile); // ✅ Add this (optional, for manual 
router.post('/:id/action', protect, validateFileAction, processFileAction);

module.exports = router;