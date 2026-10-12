#!/usr/bin/env python3
"""
Train all ML models for the Paperless Office AI Service
"""

import os
from services.model_trainer import ModelTrainer

def main():
    print("🤖 Paperless Office - AI Model Training")
    print("=" * 60)
    
    # Set model path
    model_path = os.getenv('MODEL_PATH', 'trained_models')
    
    # Initialize trainer
    trainer = ModelTrainer(model_path=model_path)
    
    # Train all models
    results = trainer.train_all_models()
    
    print("\n✅ All models trained and saved successfully!")
    print(f"📁 Models saved to: {model_path}/")
    print("\nYou can now start the AI service with: python app.py")

if __name__ == '__main__':
    main()