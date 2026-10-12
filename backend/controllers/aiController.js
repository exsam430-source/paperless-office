const { 
  testConnection, 
  classifyFile, 
  predictPriority, 
  predictDelay, 
  predictAI 
} = require('../services/aiService');

// @desc    Test AI Service Connection
// @route   GET /api/ai/test
// @access  Private
exports.testAIConnection = async (req, res) => {
  try {
    const result = await testConnection();
    
    if (result) {
      res.status(200).json({
        success: true,
        message: 'AI Service is connected and working',
        data: result
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'AI Service is not available'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Test AI Classification
// @route   POST /api/ai/classify
// @access  Private
exports.testClassify = async (req, res) => {
  try {
    const { title, description, fileType } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await classifyFile({ title, description, fileType });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Test AI Priority Prediction
// @route   POST /api/ai/predict-priority
// @access  Private
exports.testPredictPriority = async (req, res) => {
  try {
    const { title, description, fileType, department } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await predictPriority({ 
      title, 
      description, 
      fileType, 
      department 
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Test AI Delay Prediction
// @route   POST /api/ai/predict-delay
// @access  Private
exports.testPredictDelay = async (req, res) => {
  try {
    const { title, description, fileType, department, priorityScore } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await predictDelay({ 
      title, 
      description, 
      fileType, 
      department,
      priorityScore 
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Test All AI Predictions
// @route   POST /api/ai/predict-all
// @access  Private
exports.testPredictAll = async (req, res) => {
  try {
    const { title, description, fileType, department } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const result = await predictAI({ 
      title, 
      description, 
      fileType, 
      department 
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};