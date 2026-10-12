import joblib
import numpy as np
from .text_preprocessor import TextPreprocessor
import os

class AIPredictor:
    def __init__(self, model_path='trained_models'):
        self.model_path = model_path
        self.preprocessor = TextPreprocessor()
        self.vectorizer = None
        self.priority_model = None
        self.delay_model = None
        self.category_model = None
        
        self.load_models()
    
    def load_models(self):
        """Load trained models"""
        try:
            self.vectorizer = joblib.load(f'{self.model_path}/vectorizer.pkl')
            self.priority_model = joblib.load(f'{self.model_path}/priority_model.pkl')
            self.delay_model = joblib.load(f'{self.model_path}/delay_model.pkl')
            self.category_model = joblib.load(f'{self.model_path}/category_model.pkl')
            print("✅ All models loaded successfully")
        except FileNotFoundError as e:
            print(f"⚠️ Model files not found. Please train models first.")
            print(f"Error: {e}")
    
    def predict_priority(self, title, description, file_type=None):
        """Predict priority score"""
        try:
            # Preprocess text
            processed_text = self.preprocessor.extract_features(title, description)
            
            # Vectorize
            X = self.vectorizer.transform([processed_text])
            
            # Predict
            priority_class = self.priority_model.predict(X)[0]
            priority_proba = self.priority_model.predict_proba(X)[0]
            
            # Map to priority labels
            priority_labels = {0: 'LOW', 1: 'MEDIUM', 2: 'HIGH'}
            priority_label = priority_labels[priority_class]
            
            # Calculate priority score (0-100)
            priority_score = int((priority_class / 2) * 100)
            
            # Adjust score based on keywords
            urgent_keywords = ['urgent', 'emergency', 'immediate', 'asap', 'critical']
            if any(keyword in title.lower() or keyword in description.lower() for keyword in urgent_keywords):
                priority_score = min(100, priority_score + 20)
                priority_label = 'HIGH'
            
            confidence = float(np.max(priority_proba))
            
            return {
                'priorityScore': priority_score,
                'label': priority_label,
                'confidence': round(confidence, 3)
            }
        except Exception as e:
            print(f"Priority prediction error: {e}")
            return {
                'priorityScore': 50,
                'label': 'MEDIUM',
                'confidence': 0.0
            }
    
    def predict_delay(self, title, description, file_type=None, priority_score=50):
        """Predict if file will be delayed"""
        try:
            # Preprocess text
            processed_text = self.preprocessor.extract_features(title, description)
            
            # Vectorize
            X = self.vectorizer.transform([processed_text])
            
            # Predict
            delay_prediction = self.delay_model.predict(X)[0]
            delay_proba = self.delay_model.predict_proba(X)[0]
            
            will_delay = bool(delay_prediction)
            probability = float(delay_proba[1])
            
            # Adjust based on priority
            if priority_score >= 80:
                probability = max(0.1, probability - 0.2)  # High priority less likely to delay
            elif priority_score <= 30:
                probability = min(0.9, probability + 0.2)  # Low priority more likely to delay
            
            return {
                'willDelay': will_delay,
                'probability': round(probability, 3)
            }
        except Exception as e:
            print(f"Delay prediction error: {e}")
            return {
                'willDelay': False,
                'probability': 0.0
            }
    
    def classify_category(self, title, description):
        """Classify file category"""
        try:
            # Preprocess text
            processed_text = self.preprocessor.extract_features(title, description)
            
            # Vectorize
            X = self.vectorizer.transform([processed_text])
            
            # Predict
            category = self.category_model.predict(X)[0]
            category_proba = self.category_model.predict_proba(X)[0]
            
            confidence = float(np.max(category_proba))
            
            return {
                'category': category,
                'confidence': round(confidence, 3)
            }
        except Exception as e:
            print(f"Category classification error: {e}")
            return {
                'category': 'GENERAL',
                'confidence': 0.0
            }