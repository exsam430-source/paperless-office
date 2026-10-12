from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Import routes
from routes.prediction_routes import prediction_bp

# Initialize Flask app
app = Flask(__name__)

# Enable CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:5000", "http://localhost:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Register blueprints
app.register_blueprint(prediction_bp)

# Root endpoint
@app.route('/', methods=['GET'])
def index():
    return jsonify({
        'success': True,
        'message': 'Paperless Office - AI Service',
        'version': '1.0.0',
        'endpoints': {
            'classify': 'POST /classify',
            'predict_priority': 'POST /predict-priority',
            'predict_delay': 'POST /predict-delay',
            'predict_all': 'POST /predict-all',
            'health': 'GET /health'
        }
    }), 200

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'message': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'message': 'Internal server error'
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_DEBUG', 'True') == 'True'
    
    print("=" * 60)
    print("🤖 Paperless Office - AI Service")
    print("=" * 60)
    print(f"🚀 Starting server on port {port}")
    print(f"🌍 Environment: {os.getenv('FLASK_ENV', 'development')}")
    print(f"🔧 Debug mode: {debug}")
    print("=" * 60)
    
    app.run(
        host='0.0.0.0',
        port=port,
        debug=debug
    )