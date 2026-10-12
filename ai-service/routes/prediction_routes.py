from flask import Blueprint, request, jsonify
from services.predictor import AIPredictor
import os

prediction_bp = Blueprint('prediction', __name__)

# Initialize predictor
model_path = os.getenv('MODEL_PATH', 'trained_models')
predictor = AIPredictor(model_path=model_path)

@prediction_bp.route('/classify', methods=['POST'])
def classify():
    """Classify file category"""
    try:
        data = request.get_json()
        
        title = data.get('title', '')
        description = data.get('description', '')
        
        if not title:
            return jsonify({
                'success': False,
                'message': 'Title is required'
            }), 400
        
        result = predictor.classify_category(title, description)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prediction_bp.route('/predict-priority', methods=['POST'])
def predict_priority():
    """Predict file priority"""
    try:
        data = request.get_json()
        
        title = data.get('title', '')
        description = data.get('description', '')
        file_type = data.get('fileType')
        department = data.get('department')
        
        if not title:
            return jsonify({
                'success': False,
                'message': 'Title is required'
            }), 400
        
        result = predictor.predict_priority(title, description, file_type)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prediction_bp.route('/predict-delay', methods=['POST'])
def predict_delay():
    """Predict if file will be delayed"""
    try:
        data = request.get_json()
        
        title = data.get('title', '')
        description = data.get('description', '')
        file_type = data.get('fileType')
        department = data.get('department')
        priority_score = data.get('priorityScore', 50)
        
        if not title:
            return jsonify({
                'success': False,
                'message': 'Title is required'
            }), 400
        
        result = predictor.predict_delay(title, description, file_type, priority_score)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prediction_bp.route('/predict-all', methods=['POST'])
def predict_all():
    """Get all predictions at once"""
    try:
        data = request.get_json()
        
        title = data.get('title', '')
        description = data.get('description', '')
        file_type = data.get('fileType')
        department = data.get('department')
        
        if not title:
            return jsonify({
                'success': False,
                'message': 'Title is required'
            }), 400
        
        # Get all predictions
        category = predictor.classify_category(title, description)
        priority = predictor.predict_priority(title, description, file_type)
        delay = predictor.predict_delay(title, description, file_type, priority['priorityScore'])
        
        return jsonify({
            'success': True,
            'data': {
                'category': category,
                'priority': priority,
                'delay': delay
            }
        }), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@prediction_bp.route('/health', methods=['GET'])
def health():
    """AI Service health check"""
    models_loaded = all([
        predictor.vectorizer is not None,
        predictor.priority_model is not None,
        predictor.delay_model is not None,
        predictor.category_model is not None
    ])
    
    return jsonify({
        'success': True,
        'message': 'AI Service is running',
        'models_loaded': models_loaded
    }), 200