const express = require('express');
const router = express.Router();
const {
  testAIConnection,
  testClassify,
  testPredictPriority,
  testPredictDelay,
  testPredictAll
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.get('/test', protect, testAIConnection);
router.post('/classify', protect, testClassify);
router.post('/predict-priority', protect, testPredictPriority);
router.post('/predict-delay', protect, testPredictDelay);
router.post('/predict-all', protect, testPredictAll);

module.exports = router;