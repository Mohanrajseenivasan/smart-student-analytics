# Smart Student Behavior Analytics - Part 2: ML Service & Frontend

## Python ML Service

### File: `backend/ml/behavior_classifier.py`
```python
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
```

### File: `backend/ml/requirements.txt`
```txt
flask==3.0.0
flask-cors==4.0.0
numpy==1.24.3
scikit-learn==1.3.0
joblib==1.3.2
pandas==2.0.3
```

### File: `backend/ml/train_model.py`
```python
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
```

---

## Backend Routes

### File: `backend/routes/auth.js`
```javascript
const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
```

### File: `backend/routes/activity.js`
```javascript
const express = require('express');
const router = express.Router();
const { 
  logActivity, 
  getUserActivities, 
  getActivityStats 
} = require('../controllers/activityController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, logActivity);
router.get('/:userId', protect, authorize('faculty', 'admin'), getUserActivities);
router.get('/stats/:userId', protect, getActivityStats);

module.exports = router;
```

### File: `backend/routes/behavior.js`
```javascript
const express = require('express');
const router = express.Router();
const { 
  calculateBehaviorData, 
  getBehaviorData,
  getLatestBehaviorData 
} = require('../controllers/behaviorController');
const { protect, authorize } = require('../middleware/auth');

router.post('/calculate/:userId', protect, authorize('faculty', 'admin'), calculateBehaviorData);
router.get('/:userId', protect, getBehaviorData);
router.get('/:userId/latest', protect, getLatestBehaviorData);

module.exports = router;
```

### File: `backend/routes/dashboard.js`
```javascript
const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const BehaviorData = require('../models/BehaviorData');
const Alert = require('../models/Alert');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Faculty/Admin)
router.get('/stats', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    
    const latestBehavior = await BehaviorData.aggregate([
      {
        $group: {
          _id: '$userId',
          latestData: { $last: '$$ROOT' }
        }
      },
      {
        $replaceRoot: { newRoot: '$latestData' }
      }
    ]);

    const avgAttendance = latestBehavior.reduce((sum, b) => sum + b.attendanceRate, 0) / latestBehavior.length || 0;
    const avgGrade = latestBehavior.reduce((sum, b) => sum + b.gradeAverage, 0) / latestBehavior.length || 0;
    
    const atRiskCount = latestBehavior.filter(b => 
      b.behaviorClass === 'at-risk' || b.behaviorClass === 'critical'
    ).length;

    const activeAlerts = await Alert.countDocuments({ status: 'active' });

    res.json({
      success: true,
      data: {
        totalStudents,
        avgAttendance: avgAttendance.toFixed(1),
        avgGrade: avgGrade.toFixed(1),
        atRiskCount,
        activeAlerts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get all students with latest behavior data
// @route   GET /api/dashboard/students
// @access  Private (Faculty/Admin)
router.get('/students', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    
    const studentsWithBehavior = await Promise.all(
      students.map(async (student) => {
        const latestBehavior = await BehaviorData.findOne({ userId: student._id })
          .sort({ date: -1 });
        
        return {
          ...student.toObject(),
          behaviorData: latestBehavior || null
        };
      })
    );

    res.json({
      success: true,
      count: studentsWithBehavior.length,
      data: studentsWithBehavior
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get alerts
// @route   GET /api/dashboard/alerts
// @access  Private (Faculty/Admin)
router.get('/alerts', protect, authorize('faculty', 'admin'), async (req, res) => {
  try {
    const { status = 'active', limit = 20 } = req.query;
    
    const alerts = await Alert.find({ status })
      .populate('userId', 'name email studentId')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: alerts.length,
      data: alerts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
```

---

### File: `backend/server.js`
```javascript
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/activity', require('./routes/activity'));
app.use('/api/behavior', require('./routes/behavior'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
```

### File: `backend/package.json`
```json
{
  "name": "student-behavior-analytics-backend",
  "version": "1.0.0",
  "description": "Backend API for Student Behavior Analytics",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "ml": "cd ml && python behavior_classifier.py"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "dotenv": "^16.3.1",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "morgan": "^1.10.0",
    "helmet": "^7.1.0",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

---

## Frontend Implementation

### File: `frontend/src/services/api.js`
```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};

// Activity API
export const activityAPI = {
  log: (activityData) => api.post('/activity', activityData),
  getUserActivities: (userId, params) => api.get(`/activity/${userId}`, { params }),
  getStats: (userId, params) => api.get(`/activity/stats/${userId}`, { params })
};

// Behavior API
export const behaviorAPI = {
  calculate: (userId) => api.post(`/behavior/calculate/${userId}`),
  getData: (userId) => api.get(`/behavior/${userId}`),
  getLatest: (userId) => api.get(`/behavior/${userId}/latest`)
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getStudents: () => api.get('/dashboard/students'),
  getAlerts: (params) => api.get('/dashboard/alerts', { params })
};

export default api;
```

---

### File: `frontend/src/context/AuthContext.jsx`
```javascript
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await authAPI.getMe();
        setUser(response.data.user);
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      return { success: true, user };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

### File: `frontend/src/components/auth/Login.jsx`
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎓 Student Behavior Analytics</h1>
          <h2>Login</h2>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
```

---

### File: `frontend/src/components/dashboard/Dashboard.jsx`
```javascript
import React, { useEffect, useState } from 'react';
import { dashboardAPI, activityAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatsCard from './StatsCard';
import Charts from './Charts';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    logActivity();
  }, []);

  const logActivity = async () => {
    try {
      await activityAPI.log({
        activityType: 'page_view',
        description: 'Viewed dashboard',
        metadata: { page: 'dashboard' }
      });
    } catch (error) {
      console.error('Activity logging error:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      if (user.role === 'faculty' || user.role === 'admin') {
        const [statsRes, studentsRes, alertsRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getStudents(),
          dashboardAPI.getAlerts({ status: 'active', limit: 10 })
        ]);

        setStats(statsRes.data.data);
        setStudents(studentsRes.data.data);
        setAlerts(alertsRes.data.data);
      }
    } catch (error) {
      console.error('Dashboard data error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user.name}!</h1>
        <p className="role-badge">{user.role}</p>
      </div>

      {(user.role === 'faculty' || user.role === 'admin') && stats && (
        <>
          <div className="stats-grid">
            <StatsCard
              title="Total Students"
              value={stats.totalStudents}
              icon="👥"
              color="#667eea"
            />
            <StatsCard
              title="Avg Attendance"
              value={`${stats.avgAttendance}%`}
              icon="📊"
              color="#764ba2"
            />
            <StatsCard
              title="Avg Grade"
              value={stats.avgGrade}
              icon="📝"
              color="#f093fb"
            />
            <StatsCard
              title="At-Risk Students"
              value={stats.atRiskCount}
              icon="⚠️"
              color="#ff6b6b"
            />
          </div>

          <Charts students={students} />

          <div className="alerts-section">
            <h2>🔔 Recent Alerts</h2>
            {alerts.length === 0 ? (
              <p className="no-data">No active alerts</p>
            ) : (
              <div className="alerts-list">
                {alerts.map((alert) => (
                  <div key={alert._id} className={`alert-item severity-${alert.severity}`}>
                    <div className="alert-header">
                      <span className="alert-type">{alert.alertType}</span>
                      <span className="alert-severity">{alert.severity}</span>
                    </div>
                    <h4>{alert.title}</h4>
                    <p>{alert.message}</p>
                    <small>Student: {alert.userId?.name || 'Unknown'}</small>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="students-section">
            <h2>👨‍🎓 Students Overview</h2>
            <div className="students-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Student ID</th>
                    <th>Class</th>
                    <th>Attendance</th>
                    <th>Grade</th>
                    <th>Risk Level</th>
                  </tr>
                </thead>
                <tbody>
                  {students.slice(0, 10).map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.studentId}</td>
                      <td>{student.class}</td>
                      <td>
                        {student.behaviorData
                          ? `${student.behaviorData.attendanceRate.toFixed(1)}%`
                          : 'N/A'}
                      </td>
                      <td>
                        {student.behaviorData
                          ? student.behaviorData.gradeAverage.toFixed(1)
                          : 'N/A'}
                      </td>
                      <td>
                        <span className={`risk-badge ${student.behaviorData?.behaviorClass || 'average'}`}>
                          {student.behaviorData?.behaviorClass || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {user.role === 'student' && (
        <div className="student-dashboard">
          <h2>Your Performance Overview</h2>
          <p>Student-specific dashboard coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
```

---

I'll create the remaining frontend components and the complete setup instructions in the next file.

