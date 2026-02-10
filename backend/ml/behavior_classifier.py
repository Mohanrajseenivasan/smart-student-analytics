from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)
CORS(app)

# Load or create model
MODEL_PATH = 'behavior_model.pkl'
SCALER_PATH = 'scaler.pkl'

if os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH):
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("Model loaded successfully")
else:
    # Create and train a simple model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    scaler = StandardScaler()
    print("New model created - needs training")

@app.route('/classify', methods=['POST'])
def classify():
    try:
        data = request.json
        
        # Extract features
        features = [
            data.get('attendance_rate', 0),
            data.get('grade_average', 0),
            data.get('assignment_completion_rate', 0),
            data.get('login_frequency', 0),
            data.get('time_spent_online', 0),
            data.get('forum_posts', 0),
            data.get('engagement_score', 0),
            data.get('risk_score', 0)
        ]
        
        # Rule-based classification (fallback if model not trained)
        risk_score = data.get('risk_score', 50)
        
        if risk_score < 15:
            classification = 'excellent'
            confidence = 0.95
        elif risk_score < 25:
            classification = 'good'
            confidence = 0.85
        elif risk_score < 40:
            classification = 'average'
            confidence = 0.75
        elif risk_score < 55:
            classification = 'at-risk'
            confidence = 0.80
        else:
            classification = 'critical'
            confidence = 0.90
        
        # If model is trained, use it
        try:
            features_array = np.array([features])
            features_scaled = scaler.transform(features_array)
            prediction = model.predict(features_scaled)[0]
            probabilities = model.predict_proba(features_scaled)[0]
            confidence = float(max(probabilities))
            classification = prediction
        except:
            pass  # Use rule-based classification
        
        return jsonify({
            'classification': classification,
            'confidence': confidence,
            'features': features
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/train', methods=['POST'])
def train():
    try:
        data = request.json
        training_data = data.get('training_data', [])
        
        if len(training_data) < 10:
            return jsonify({'error': 'Need at least 10 training samples'}), 400
        
        # Prepare training data
        X = []
        y = []
        
        for sample in training_data:
            features = [
                sample.get('attendance_rate', 0),
                sample.get('grade_average', 0),
                sample.get('assignment_completion_rate', 0),
                sample.get('login_frequency', 0),
                sample.get('time_spent_online', 0),
                sample.get('forum_posts', 0),
                sample.get('engagement_score', 0),
                sample.get('risk_score', 0)
            ]
            X.append(features)
            y.append(sample.get('label', 'average'))
        
        X = np.array(X)
        y = np.array(y)
        
        # Train scaler
        global scaler
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train model
        global model
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        # Save model and scaler
        joblib.dump(model, MODEL_PATH)
        joblib.dump(scaler, SCALER_PATH)
        
        return jsonify({
            'success': True,
            'message': f'Model trained with {len(training_data)} samples',
            'accuracy': model.score(X_scaled, y)
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': os.path.exists(MODEL_PATH)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
