# Smart Student Behavior Analytics - Part 3: Frontend Components & Deployment

## Frontend Components (Continued)

### File: `frontend/src/components/dashboard/StatsCard.jsx`
```javascript
import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="stat-icon" style={{ background: `${color}20` }}>
        <span>{icon}</span>
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
};

export default StatsCard;
```

---

### File: `frontend/src/components/dashboard/Charts.jsx`
```javascript
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Charts = ({ students }) => {
  const [riskDistribution, setRiskDistribution] = useState({});
  const [gradeDistribution, setGradeDistribution] = useState({});

  useEffect(() => {
    if (students && students.length > 0) {
      calculateDistributions();
    }
  }, [students]);

  const calculateDistributions = () => {
    // Risk distribution
    const risks = { excellent: 0, good: 0, average: 0, 'at-risk': 0, critical: 0 };
    const grades = { 'A (90-100)': 0, 'B (80-89)': 0, 'C (70-79)': 0, 'D/F (<70)': 0 };

    students.forEach((student) => {
      if (student.behaviorData) {
        const riskClass = student.behaviorData.behaviorClass;
        if (risks.hasOwnProperty(riskClass)) {
          risks[riskClass]++;
        }

        const grade = student.behaviorData.gradeAverage;
        if (grade >= 90) grades['A (90-100)']++;
        else if (grade >= 80) grades['B (80-89)']++;
        else if (grade >= 70) grades['C (70-79)']++;
        else grades['D/F (<70)']++;
      }
    });

    setRiskDistribution(risks);
    setGradeDistribution(grades);
  };

  const riskChartData = {
    labels: Object.keys(riskDistribution),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(riskDistribution),
        backgroundColor: [
          '#28a745',
          '#17a2b8',
          '#ffc107',
          '#fd7e14',
          '#dc3545',
        ],
      },
    ],
  };

  const gradeChartData = {
    labels: Object.keys(gradeDistribution),
    datasets: [
      {
        label: 'Number of Students',
        data: Object.values(gradeDistribution),
        backgroundColor: ['#28a745', '#17a2b8', '#ffc107', '#dc3545'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3>Risk Level Distribution</h3>
        <div className="chart-wrapper" style={{ height: '300px' }}>
          <Pie data={riskChartData} options={chartOptions} />
        </div>
      </div>

      <div className="chart-card">
        <h3>Grade Distribution</h3>
        <div className="chart-wrapper" style={{ height: '300px' }}>
          <Bar data={gradeChartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
```

---

### File: `frontend/src/App.jsx`
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Navbar from './components/layout/Navbar';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      {isAuthenticated && <Navbar />}
      <div className={isAuthenticated ? 'main-content' : ''}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
```

---

### File: `frontend/src/components/layout/Navbar.jsx`
```javascript
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="brand-icon">🎓</span>
          <span className="brand-text">Student Analytics</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          {(user?.role === 'faculty' || user?.role === 'admin') && (
            <>
              <Link to="/students" className="nav-link">Students</Link>
              <Link to="/reports" className="nav-link">Reports</Link>
              <Link to="/alerts" className="nav-link">Alerts</Link>
            </>
          )}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

### File: `frontend/src/components/auth/Register.jsx`
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    studentId: '',
    class: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register(formData);

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
          <h2>Register</h2>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

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
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {formData.role === 'student' && (
            <>
              <div className="form-group">
                <label htmlFor="studentId">Student ID</label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  required
                  placeholder="Enter your student ID"
                />
              </div>

              <div className="form-group">
                <label htmlFor="class">Class</label>
                <input
                  type="text"
                  id="class"
                  name="class"
                  value={formData.class}
                  onChange={handleChange}
                  placeholder="e.g., 10A, 11B"
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
```

---

## CSS Styles

### File: `frontend/src/components/auth/Auth.css`
```css
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  width: 100%;
  max-width: 450px;
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.auth-header h1 {
  font-size: 2em;
  margin-bottom: 10px;
  color: #333;
}

.auth-header h2 {
  font-size: 1.5em;
  color: #667eea;
  margin: 0;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 0.9em;
}

.alert-error {
  background: #fee;
  color: #c33;
  border-left: 4px solid #c33;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
  font-size: 0.9em;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1em;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.btn {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
```

---

### File: `frontend/src/components/layout/Navbar.css`
```css
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  font-size: 1.3em;
  font-weight: bold;
}

.brand-icon {
  font-size: 1.5em;
}

.navbar-menu {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.nav-link:hover {
  opacity: 0.8;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 600;
}

.user-role {
  font-size: 0.85em;
  opacity: 0.9;
  text-transform: capitalize;
}

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: white;
  color: #667eea;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    gap: 15px;
  }

  .navbar-menu {
    gap: 15px;
  }
}
```

---

### File: `frontend/src/components/dashboard/Dashboard.css`
```css
.dashboard {
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.dashboard-header h1 {
  color: #333;
  font-size: 2em;
}

.role-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 8px 20px;
  border-radius: 20px;
  font-weight: 600;
  text-transform: capitalize;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
}

.stat-content h3 {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 8px;
  font-weight: 500;
}

.stat-value {
  font-size: 2em;
  font-weight: bold;
  color: #333;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.chart-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 1.2em;
}

.alerts-section,
.students-section {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.alerts-section h2,
.students-section h2 {
  color: #333;
  margin-bottom: 20px;
}

.alerts-list {
  display: grid;
  gap: 15px;
}

.alert-item {
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid;
}

.alert-item.severity-low {
  background: #e8f5e9;
  border-color: #4caf50;
}

.alert-item.severity-medium {
  background: #fff3e0;
  border-color: #ff9800;
}

.alert-item.severity-high {
  background: #ffebee;
  border-color: #f44336;
}

.alert-item.severity-critical {
  background: #f3e5f5;
  border-color: #9c27b0;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.alert-type {
  font-weight: 600;
  text-transform: capitalize;
}

.alert-severity {
  background: rgba(0, 0, 0, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  text-transform: uppercase;
  font-weight: 600;
}

.students-table {
  overflow-x: auto;
}

.students-table table {
  width: 100%;
  border-collapse: collapse;
}

.students-table th {
  background: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.students-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.risk-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: 600;
  text-transform: capitalize;
}

.risk-badge.excellent {
  background: #d4edda;
  color: #155724;
}

.risk-badge.good {
  background: #d1ecf1;
  color: #0c5460;
}

.risk-badge.average {
  background: #fff3cd;
  color: #856404;
}

.risk-badge.at-risk {
  background: #f8d7da;
  color: #721c24;
}

.risk-badge.critical {
  background: #f5c6cb;
  color: #491217;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40px;
}

.loading {
  text-align: center;
  padding: 60px;
  font-size: 1.2em;
  color: #666;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }
}
```

---

### File: `frontend/src/App.css`
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f7fa;
  color: #333;
}

.main-content {
  min-height: calc(100vh - 70px);
}

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.5em;
  color: #667eea;
}
```

---

## Docker Setup

### File: `docker-compose.yml`
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: student_analytics_db
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    container_name: student_analytics_backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://admin:password123@mongodb:27017/student_behavior_analytics?authSource=admin
      - JWT_SECRET=your_super_secret_jwt_key_change_this
      - ML_SERVICE_URL=http://ml_service:5001
    depends_on:
      - mongodb
    volumes:
      - ./backend:/app
      - /app/node_modules

  ml_service:
    build: ./backend/ml
    container_name: student_analytics_ml
    restart: always
    ports:
      - "5001:5001"
    volumes:
      - ./backend/ml:/app

  frontend:
    build: ./frontend
    container_name: student_analytics_frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### File: `backend/Dockerfile`
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### File: `backend/ml/Dockerfile`
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python", "behavior_classifier.py"]
```

### File: `frontend/Dockerfile`
```dockerfile
FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### File: `frontend/nginx.conf`
```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Complete Setup Instructions

### File: `README.md`
```markdown
# Smart Student Behavior Analytics System

Complete implementation following the specified flow:
Student/Faculty Login → JWT Auth → Activity Tracking → Data Collection → MongoDB → Python ML → Classification → Dashboard → Reports

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ 
- Python 3.11+
- MongoDB 7.0+
- Docker & Docker Compose (optional)

### Option 1: Docker Setup (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd student-behavior-analytics

# Start all services
docker-compose up -d

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# ML Service: http://localhost:5001
```

### Option 2: Manual Setup

#### 1. Setup MongoDB
```bash
# Install MongoDB and start service
mongod --dbpath /data/db
```

#### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your settings

# Start server
npm run dev
```

#### 3. Setup ML Service
```bash
cd backend/ml

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train initial model
python train_model.py

# Start ML service
python behavior_classifier.py
```

#### 4. Setup Frontend
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env

# Start development server
npm start
```

## 📊 System Flow

```
1. User Login (Student/Faculty)
   ↓
2. JWT Authentication
   ↓
3. User Activity Tracking (automatic)
   ↓
4. Behavior Data Collection
   ↓
5. Store in MongoDB
   ↓
6. Python ML Analytics Engine
   ↓
7. Behavior Classification (excellent/good/average/at-risk/critical)
   ↓
8. Dashboard Visualization
   ↓
9. Reports & Alerts Generation
```

## 🔑 Default Credentials

After first run, create users via register endpoint or use:

**Faculty Account:**
- Email: faculty@test.com
- Password: password123

**Student Account:**
- Email: student@test.com
- Password: password123

## 📁 Project Structure

```
student-behavior-analytics/
├── backend/
│   ├── config/         # Configuration files
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── controllers/    # Business logic
│   ├── middleware/     # Auth & logging
│   ├── ml/            # Python ML service
│   └── server.js      # Express server
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   └── context/    # State management
│   └── public/
└── docker-compose.yml
```

## 🧪 Testing

### Backend API Tests
```bash
cd backend
npm test
```

### ML Service Test
```bash
curl -X POST http://localhost:5001/classify \
  -H "Content-Type: application/json" \
  -d '{
    "attendance_rate": 85,
    "grade_average": 78,
    "assignment_completion_rate": 90,
    "login_frequency": 25,
    "time_spent_online": 180,
    "forum_posts": 5,
    "engagement_score": 82,
    "risk_score": 22
  }'
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Activity Tracking
- `POST /api/activity` - Log activity
- `GET /api/activity/:userId` - Get user activities
- `GET /api/activity/stats/:userId` - Get activity stats

### Behavior Analytics
- `POST /api/behavior/calculate/:userId` - Calculate behavior data
- `GET /api/behavior/:userId` - Get behavior data
- `GET /api/behavior/:userId/latest` - Get latest behavior data

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/students` - Get all students with behavior data
- `GET /api/dashboard/alerts` - Get alerts

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/student_behavior_analytics
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h
ML_SERVICE_URL=http://localhost:5001
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎯 Features

✅ Student/Faculty Login with JWT Authentication
✅ Automatic Activity Tracking
✅ Behavior Data Collection
✅ MongoDB Data Storage
✅ Python ML Classification Engine
✅ Risk Assessment Algorithm
✅ Real-time Dashboard
✅ Automated Alerts
✅ Interactive Charts
✅ Role-based Access Control

## 📈 ML Classification

The system uses Random Forest Classifier with 8 features:
1. Attendance Rate
2. Grade Average
3. Assignment Completion Rate
4. Login Frequency
5. Time Spent Online
6. Forum Posts
7. Engagement Score
8. Risk Score

**Output Classes:**
- Excellent (Risk < 15)
- Good (Risk 15-25)
- Average (Risk 25-40)
- At-Risk (Risk 40-55)
- Critical (Risk > 55)

## 🛠️ Troubleshooting

**MongoDB Connection Error:**
```bash
# Check if MongoDB is running
mongod --version
sudo systemctl start mongod
```

**ML Service Error:**
```bash
# Reinstall Python dependencies
pip install --upgrade -r requirements.txt

# Retrain model
python train_model.py
```

**Frontend Not Loading:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📝 License

MIT License

## 👥 Contributors

Your Name - Developer

## 📞 Support

For issues or questions, please open an issue on GitHub.
```

---

This completes the full implementation! The system now has all components following your specified flow. Would you like me to create a deployment guide or add any additional features?
