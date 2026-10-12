import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
from .text_preprocessor import TextPreprocessor

class ModelTrainer:
    def __init__(self, model_path='trained_models'):
        self.model_path = model_path
        self.preprocessor = TextPreprocessor()
        self.vectorizer = None
        self.priority_model = None
        self.delay_model = None
        self.category_model = None
        
        # Create model directory if not exists
        os.makedirs(model_path, exist_ok=True)
    
    def generate_training_data(self):
        """Generate synthetic training data based on common file types"""
        
        # Training data for different file types
        data = []
        
        # Leave Applications
        leave_samples = [
            ("Annual Leave Request", "Employee requesting annual leave for family vacation", "LEAVE_APPLICATION", "HIGH", 0),
            ("Sick Leave Application", "Medical leave due to illness", "LEAVE_APPLICATION", "HIGH", 0),
            ("Maternity Leave Request", "Requesting maternity leave as per policy", "LEAVE_APPLICATION", "HIGH", 0),
            ("Casual Leave", "Short term leave for personal work", "LEAVE_APPLICATION", "MEDIUM", 0),
            ("Emergency Leave", "Urgent family emergency leave request", "LEAVE_APPLICATION", "HIGH", 1),
            ("Study Leave Application", "Leave for pursuing higher education", "LEAVE_APPLICATION", "MEDIUM", 0),
            ("Unpaid Leave Request", "Extended leave without pay", "LEAVE_APPLICATION", "LOW", 0),
            ("Sabbatical Leave", "One year sabbatical for research", "LEAVE_APPLICATION", "MEDIUM", 1),
        ]
        
        # Budget Requests
        budget_samples = [
            ("Annual Budget FY2024", "Annual budget allocation for department operations", "BUDGET_REQUEST", "HIGH", 0),
            ("Equipment Purchase Budget", "Budget for new computers and printers", "BUDGET_REQUEST", "MEDIUM", 0),
            ("Training Budget Request", "Staff development and training programs", "BUDGET_REQUEST", "MEDIUM", 0),
            ("Emergency Budget", "Urgent budget for equipment repair", "BUDGET_REQUEST", "HIGH", 1),
            ("Conference Travel Budget", "Budget for international conference attendance", "BUDGET_REQUEST", "LOW", 0),
            ("Software License Budget", "Annual software licenses renewal", "BUDGET_REQUEST", "HIGH", 0),
            ("Office Renovation Budget", "Budget for office refurbishment", "BUDGET_REQUEST", "MEDIUM", 1),
            ("Research Grant Budget", "Research project funding request", "BUDGET_REQUEST", "HIGH", 0),
        ]
        
        # Purchase Orders
        purchase_samples = [
            ("Office Supplies Purchase", "Stationery and office consumables", "PURCHASE_ORDER", "LOW", 0),
            ("Computer Equipment Purchase", "Laptops and accessories for new staff", "PURCHASE_ORDER", "MEDIUM", 0),
            ("Furniture Purchase Order", "Office furniture for new department", "PURCHASE_ORDER", "MEDIUM", 1),
            ("Software Purchase", "Enterprise software licenses", "PURCHASE_ORDER", "HIGH", 0),
            ("Urgent Equipment Purchase", "Emergency replacement of broken equipment", "PURCHASE_ORDER", "HIGH", 1),
            ("Bulk Printing Order", "Annual printing and binding services", "PURCHASE_ORDER", "MEDIUM", 0),
            ("Vehicle Purchase", "Official vehicle for department", "PURCHASE_ORDER", "HIGH", 1),
            ("Maintenance Supplies", "Cleaning and maintenance materials", "PURCHASE_ORDER", "LOW", 0),
        ]
        
        # Academic Requests
        academic_samples = [
            ("Course Approval Request", "New course curriculum approval", "ACADEMIC_REQUEST", "HIGH", 0),
            ("Examination Schedule", "Final examination timetable", "ACADEMIC_REQUEST", "HIGH", 1),
            ("Grade Change Request", "Request to modify student grades", "ACADEMIC_REQUEST", "MEDIUM", 0),
            ("Syllabus Revision", "Update course syllabus", "ACADEMIC_REQUEST", "MEDIUM", 0),
            ("Academic Calendar", "Annual academic calendar approval", "ACADEMIC_REQUEST", "HIGH", 0),
            ("Student Admission", "Special admission case", "ACADEMIC_REQUEST", "MEDIUM", 0),
            ("Faculty Hiring", "New faculty position approval", "ACADEMIC_REQUEST", "HIGH", 1),
            ("Research Proposal", "Student research proposal approval", "ACADEMIC_REQUEST", "MEDIUM", 0),
        ]
        
        # HR Documents
        hr_samples = [
            ("New Employee Onboarding", "Documentation for new hire", "HR_DOCUMENT", "HIGH", 0),
            ("Performance Appraisal", "Annual employee performance review", "HR_DOCUMENT", "MEDIUM", 0),
            ("Promotion Request", "Employee promotion recommendation", "HR_DOCUMENT", "HIGH", 0),
            ("Transfer Request", "Interdepartmental transfer", "HR_DOCUMENT", "MEDIUM", 1),
            ("Resignation Acceptance", "Employee resignation processing", "HR_DOCUMENT", "MEDIUM", 0),
            ("Contract Renewal", "Employment contract renewal", "HR_DOCUMENT", "HIGH", 0),
            ("Disciplinary Action", "Employee disciplinary proceedings", "HR_DOCUMENT", "HIGH", 1),
            ("Salary Increment", "Annual salary increment proposal", "HR_DOCUMENT", "HIGH", 0),
        ]
        
        # Combine all samples
        all_samples = (
            leave_samples + 
            budget_samples + 
            purchase_samples + 
            academic_samples + 
            hr_samples
        )
        
        # Generate more variations
        for title, description, category, priority, delay in all_samples:
            # Add original
            data.append({
                'title': title,
                'description': description,
                'category': category,
                'priority': priority,
                'delay': delay
            })
            
            # Add variations with different wording
            variations = [
                (f"Urgent: {title}", f"High priority - {description}", priority, 1 if priority == "HIGH" else delay),
                (f"Regular {title}", f"Standard process - {description}", "MEDIUM" if priority == "HIGH" else priority, 0),
                (f"Follow-up: {title}", f"Pending review - {description}", priority, delay),
            ]
            
            for var_title, var_desc, var_priority, var_delay in variations:
                data.append({
                    'title': var_title,
                    'description': var_desc,
                    'category': category,
                    'priority': var_priority,
                    'delay': var_delay
                })
        
        return pd.DataFrame(data)
    
    def train_priority_model(self, df):
        """Train priority prediction model"""
        print("Training Priority Model...")
        
        # Preprocess text
        df['processed_text'] = df.apply(
            lambda row: self.preprocessor.extract_features(row['title'], row['description']), 
            axis=1
        )
        
        # Create TF-IDF features
        self.vectorizer = TfidfVectorizer(max_features=100, ngram_range=(1, 2))
        X = self.vectorizer.fit_transform(df['processed_text'])
        
        # Priority mapping
        priority_map = {'LOW': 0, 'MEDIUM': 1, 'HIGH': 2}
        y = df['priority'].map(priority_map)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.priority_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.priority_model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.priority_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Priority Model Accuracy: {accuracy:.2%}")
        
        # Save model
        joblib.dump(self.priority_model, f'{self.model_path}/priority_model.pkl')
        joblib.dump(self.vectorizer, f'{self.model_path}/vectorizer.pkl')
        
        return accuracy
    
    def train_delay_model(self, df):
        """Train delay prediction model"""
        print("Training Delay Prediction Model...")
        
        # Preprocess text
        df['processed_text'] = df.apply(
            lambda row: self.preprocessor.extract_features(row['title'], row['description']), 
            axis=1
        )
        
        # Use same vectorizer
        X = self.vectorizer.transform(df['processed_text'])
        y = df['delay']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.delay_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
        self.delay_model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.delay_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Delay Model Accuracy: {accuracy:.2%}")
        
        # Save model
        joblib.dump(self.delay_model, f'{self.model_path}/delay_model.pkl')
        
        return accuracy
    
    def train_category_model(self, df):
        """Train category classification model"""
        print("Training Category Classification Model...")
        
        # Preprocess text
        df['processed_text'] = df.apply(
            lambda row: self.preprocessor.extract_features(row['title'], row['description']), 
            axis=1
        )
        
        # Use same vectorizer
        X = self.vectorizer.transform(df['processed_text'])
        y = df['category']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Train model
        self.category_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.category_model.fit(X_train, y_train)
        
        # Evaluate
        y_pred = self.category_model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        print(f"Category Model Accuracy: {accuracy:.2%}")
        
        # Save model
        joblib.dump(self.category_model, f'{self.model_path}/category_model.pkl')
        
        return accuracy
    
    def train_all_models(self):
        """Train all models"""
        print("=" * 50)
        print("Starting Model Training Process")
        print("=" * 50)
        
        # Generate training data
        df = self.generate_training_data()
        print(f"Generated {len(df)} training samples")
        print(f"Categories: {df['category'].unique()}")
        print(f"Priority Distribution:\n{df['priority'].value_counts()}")
        print(f"Delay Distribution:\n{df['delay'].value_counts()}")
        print("-" * 50)
        
        # Train models
        priority_acc = self.train_priority_model(df)
        delay_acc = self.train_delay_model(df)
        category_acc = self.train_category_model(df)
        
        print("=" * 50)
        print("Training Completed Successfully!")
        print(f"Priority Model Accuracy: {priority_acc:.2%}")
        print(f"Delay Model Accuracy: {delay_acc:.2%}")
        print(f"Category Model Accuracy: {category_acc:.2%}")
        print("=" * 50)
        
        return {
            'priority_accuracy': priority_acc,
            'delay_accuracy': delay_acc,
            'category_accuracy': category_acc
        }