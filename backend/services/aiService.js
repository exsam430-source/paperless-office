const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5001';

// @desc    Test AI Service Connection
exports.testConnection = async () => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/health`, {
      timeout: 5000
    });
    console.log('✅ AI Service Connected:', response.data.message);
    return response.data;
  } catch (error) {
    console.error('❌ AI Service Connection Failed:', error.message);
    return null;
  }
};

// @desc    Classify File Category
exports.classifyFile = async (fileData) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/classify`, {
      title: fileData.title,
      description: fileData.description,
      fileType: fileData.fileType
    }, {
      timeout: 5000
    });

    if (response.data.success) {
      return response.data.data;
    }
    
    return { category: 'GENERAL', confidence: 0 };
  } catch (error) {
    console.error('AI Classification Error:', error.message);
    return { category: 'GENERAL', confidence: 0 };
  }
};

// @desc    Predict File Priority
exports.predictPriority = async (fileData) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-priority`, {
      title: fileData.title,
      description: fileData.description,
      fileType: fileData.fileType,
      department: fileData.department
    }, {
      timeout: 5000
    });

    if (response.data.success) {
      return {
        priorityScore: response.data.data.priorityScore || 50,
        label: response.data.data.label || 'MEDIUM',
        confidence: response.data.data.confidence || 0
      };
    }

    return { priorityScore: 50, label: 'MEDIUM', confidence: 0 };
  } catch (error) {
    console.error('AI Priority Prediction Error:', error.message);
    return { priorityScore: 50, label: 'MEDIUM', confidence: 0 };
  }
};

// @desc    Predict File Delay
exports.predictDelay = async (fileData) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-delay`, {
      title: fileData.title,
      description: fileData.description,
      fileType: fileData.fileType,
      department: fileData.department,
      priorityScore: fileData.priorityScore || 50
    }, {
      timeout: 5000
    });

    if (response.data.success) {
      return {
        willDelay: response.data.data.willDelay || false,
        probability: response.data.data.probability || 0
      };
    }

    return { willDelay: false, probability: 0 };
  } catch (error) {
    console.error('AI Delay Prediction Error:', error.message);
    return { willDelay: false, probability: 0 };
  }
};

// @desc    Get All AI Predictions (Combined) - OPTIMIZED
exports.predictAI = async (fileData) => {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/predict-all`, {
      title: fileData.title,
      description: fileData.description,
      fileType: fileData.fileType,
      department: fileData.department
    }, {
      timeout: 8000
    });

    if (response.data.success) {
      const predictions = response.data.data;
      
      return {
        priorityScore: predictions.priority.priorityScore,
        predictedDelay: predictions.delay.willDelay,
        aiConfidence: predictions.priority.confidence,
        category: predictions.category.category,
        delayProbability: predictions.delay.probability,
        priorityLabel: predictions.priority.label
      };
    }

    return {
      priorityScore: 50,
      predictedDelay: false,
      aiConfidence: 0,
      category: 'GENERAL',
      delayProbability: 0,
      priorityLabel: 'MEDIUM'
    };
  } catch (error) {
    console.error('AI Service Complete Prediction Error:', error.message);
    return {
      priorityScore: 50,
      predictedDelay: false,
      aiConfidence: 0,
      category: 'GENERAL',
      delayProbability: 0,
      priorityLabel: 'MEDIUM'
    };
  }
};