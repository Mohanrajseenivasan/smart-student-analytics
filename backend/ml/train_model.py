import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib

# Generate synthetic training data
def generate_training_data(n_samples=1000):
    np.random.seed(42)
    
    X = []
    y = []
    
    for i in range(n_samples):
        # Generate correlated features
        attendance = np.random.uniform(50, 100)
        grade = np.random.uniform(40, 100)
        assignment_completion = np.random.uniform(40, 100)
        login_frequency = np.random.randint(0, 60)
        time_spent = np.random.randint(0, 500)
        forum_posts = np.random.randint(0, 20)
        
        # Calculate engagement and risk
        engagement = (login_frequency/60*100 * 0.3 + 
                     assignment_completion * 0.4 + 
                     forum_posts/20*100 * 0.3)
        
        risk = ((100-attendance)*0.4 + (100-grade)*0.4 + (100-engagement)*0.2)
        
        features = [attendance, grade, assignment_completion, 
                   login_frequency, time_spent, forum_posts, engagement, risk]
        
        # Classify based on risk score
        if risk < 15:
            label = 'excellent'
        elif risk < 25:
            label = 'good'
        elif risk < 40:
            label = 'average'
        elif risk < 55:
            label = 'at-risk'
        else:
            label = 'critical'
        
        X.append(features)
        y.append(label)
    
    return np.array(X), np.array(y)

# Generate data
X, y = generate_training_data(1000)

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train scaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train_scaled, y_train)

# Evaluate
train_accuracy = model.score(X_train_scaled, y_train)
test_accuracy = model.score(X_test_scaled, y_test)

print(f"Train Accuracy: {train_accuracy:.4f}")
print(f"Test Accuracy: {test_accuracy:.4f}")

# Save model
joblib.dump(model, 'behavior_model.pkl')
joblib.dump(scaler, 'scaler.pkl')

print("Model and scaler saved successfully!")
