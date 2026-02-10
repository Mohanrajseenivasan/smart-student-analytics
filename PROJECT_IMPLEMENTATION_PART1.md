# Smart Student Behavior Analytics - Complete Implementation Guide

## Project Structure

```
student-behavior-analytics/
├── backend/
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   ├── jwt.js                   # JWT configuration
│   │   └── config.js                # Environment variables
│   ├── models/
│   │   ├── User.js                  # User model (Student/Faculty)
│   │   ├── Activity.js              # Activity tracking model
│   │   ├── BehaviorData.js          # Behavior data model
│   │   ├── Alert.js                 # Alerts model
│   │   └── Report.js                # Reports model
│   ├── routes/
│   │   ├── auth.js                  # Authentication routes
│   │   ├── activity.js              # Activity tracking routes
│   │   ├── behavior.js              # Behavior data routes
│   │   ├── analytics.js             # Analytics routes
│   │   └── dashboard.js             # Dashboard routes
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification middleware
│   │   ├── roleCheck.js             # Role-based access control
│   │   └── activityLogger.js        # Activity logging middleware
│   ├── controllers/
│   │   ├── authController.js        # Auth logic
│   │   ├── activityController.js    # Activity logic
│   │   ├── behaviorController.js    # Behavior logic
│   │   └── analyticsController.js   # Analytics logic
│   ├── services/
│   │   ├── mlService.js             # Python ML integration
│   │   ├── classificationService.js # Behavior classification
│   │   └── alertService.js          # Alert generation
│   ├── utils/
│   │   ├── validators.js            # Input validation
│   │   └── helpers.js               # Helper functions
│   ├── ml/
│   │   ├── behavior_classifier.py   # ML classification model
│   │   ├── train_model.py           # Model training
│   │   └── requirements.txt         # Python dependencies
│   ├── server.js                    # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── StatsCard.jsx
│   │   │   │   └── Charts.jsx
│   │   │   ├── students/
│   │   │   │   ├── StudentList.jsx
│   │   │   │   └── StudentProfile.jsx
│   │   │   ├── reports/
│   │   │   │   └── Reports.jsx
│   │   │   └── alerts/
│   │   │       └── Alerts.jsx
│   │   ├── services/
│   │   │   └── api.js               # API service
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Auth state management
│   │   ├── App.jsx
│   │   └── index.jsx
│   └── package.json
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## STEP-BY-STEP IMPLEMENTATION

### Step 1: Project Setup

#### 1.1 Create Project Directory
```bash
mkdir student-behavior-analytics
cd student-behavior-analytics
mkdir backend frontend
```

#### 1.2 Initialize Backend
```bash
cd backend
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken cors
npm install express-validator morgan helmet
npm install --save-dev nodemon
```

#### 1.3 Initialize Frontend
```bash
cd ../frontend
npx create-react-app .
npm install axios react-router-dom chart.js react-chartjs-2
npm install @reduxjs/toolkit react-redux
```

#### 1.4 Setup Python ML Environment
```bash
cd ../backend/ml
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install scikit-learn pandas numpy flask flask-cors joblib
pip freeze > requirements.txt
```

---

### Step 2: Backend Implementation

#### File: `backend/.env`
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/student_behavior_analytics

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h

# Python ML Service
ML_SERVICE_URL=http://localhost:5001

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

#### File: `backend/config/db.js`
```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

#### File: `backend/models/User.js`
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email']
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin'],
    default: 'student'
  },
  studentId: {
    type: String,
    unique: true,
    sparse: true // Only required for students
  },
  class: {
    type: String
  },
  dateOfBirth: {
    type: Date
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

---

#### File: `backend/models/Activity.js`
```javascript
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activityType: {
    type: String,
    enum: ['login', 'logout', 'page_view', 'assignment_submit', 'test_taken', 
           'resource_access', 'forum_post', 'quiz_attempt', 'attendance'],
    required: true
  },
  description: {
    type: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Flexible metadata storage
    default: {}
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
activitySchema.index({ userId: 1, timestamp: -1 });
activitySchema.index({ activityType: 1 });

module.exports = mongoose.model('Activity', activitySchema);
```

---

#### File: `backend/models/BehaviorData.js`
```javascript
const mongoose = require('mongoose');

const behaviorDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  
  // Attendance Metrics
  attendanceRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  daysPresent: {
    type: Number,
    default: 0
  },
  daysAbsent: {
    type: Number,
    default: 0
  },
  
  // Academic Metrics
  gradeAverage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  assignmentsCompleted: {
    type: Number,
    default: 0
  },
  assignmentsTotal: {
    type: Number,
    default: 0
  },
  assignmentCompletionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // Engagement Metrics
  loginFrequency: {
    type: Number,
    default: 0
  },
  timeSpentOnline: {
    type: Number, // minutes
    default: 0
  },
  participationScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  forumPosts: {
    type: Number,
    default: 0
  },
  
  // Calculated Scores
  engagementScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  riskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // ML Classification
  behaviorClass: {
    type: String,
    enum: ['excellent', 'good', 'average', 'at-risk', 'critical'],
    default: 'average'
  },
  mlConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  
  // Trends
  trendIndicator: {
    type: String,
    enum: ['improving', 'stable', 'declining'],
    default: 'stable'
  }
}, {
  timestamps: true
});

// Index for efficient queries
behaviorDataSchema.index({ userId: 1, date: -1 });
behaviorDataSchema.index({ behaviorClass: 1 });

module.exports = mongoose.model('BehaviorData', behaviorDataSchema);
```

---

#### File: `backend/models/Alert.js`
```javascript
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  alertType: {
    type: String,
    enum: ['attendance', 'grade', 'engagement', 'behavior', 'risk'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved', 'dismissed'],
    default: 'active'
  },
  triggerValue: {
    type: Number
  },
  thresholdValue: {
    type: Number
  },
  acknowledgedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  acknowledgedAt: {
    type: Date
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: {
    type: Date
  },
  resolutionNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

alertSchema.index({ userId: 1, status: 1 });
alertSchema.index({ severity: 1, createdAt: -1 });

module.exports = mongoose.model('Alert', alertSchema);
```

---

#### File: `backend/middleware/auth.js`
```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Role authorization
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`
      });
    }
    next();
  };
};
```

---

#### File: `backend/middleware/activityLogger.js`
```javascript
const Activity = require('../models/Activity');

exports.logActivity = (activityType) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        await Activity.create({
          userId: req.user._id,
          activityType: activityType,
          description: `${activityType} action`,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
          metadata: {
            route: req.originalUrl,
            method: req.method
          }
        });
      }
    } catch (error) {
      console.error('Activity logging error:', error);
    }
    next();
  };
};
```

---

#### File: `backend/controllers/authController.js`
```javascript
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, studentId, class: userClass } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      studentId,
      class: userClass
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user (include password field)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log login activity
    await Activity.create({
      userId: user._id,
      activityType: 'login',
      description: 'User logged in',
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        class: user.class
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    // Log logout activity
    await Activity.create({
      userId: req.user._id,
      activityType: 'logout',
      description: 'User logged out'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

#### File: `backend/controllers/activityController.js`
```javascript
const Activity = require('../models/Activity');

// @desc    Log user activity
// @route   POST /api/activity
// @access  Private
exports.logActivity = async (req, res) => {
  try {
    const { activityType, description, metadata, duration } = req.body;

    const activity = await Activity.create({
      userId: req.user._id,
      activityType,
      description,
      metadata,
      duration,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user activities
// @route   GET /api/activity/:userId
// @access  Private (Faculty/Admin)
exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50, page = 1, activityType } = req.query;

    const query = { userId };
    if (activityType) {
      query.activityType = activityType;
    }

    const activities = await Activity.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Activity.countDocuments(query);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get activity statistics
// @route   GET /api/activity/stats/:userId
// @access  Private
exports.getActivityStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(days));

    const stats = await Activity.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(userId),
          timestamp: { $gte: dateFrom }
        }
      },
      {
        $group: {
          _id: '$activityType',
          count: { $sum: 1 },
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

#### File: `backend/controllers/behaviorController.js`
```javascript
const BehaviorData = require('../models/BehaviorData');
const Activity = require('../models/Activity');
const axios = require('axios');

// @desc    Calculate and store behavior data
// @route   POST /api/behavior/calculate/:userId
// @access  Private (Faculty/Admin)
exports.calculateBehaviorData = async (req, res) => {
  try {
    const { userId } = req.params;

    // Get date range (last 30 days)
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - 30);

    // Calculate attendance metrics
    const attendanceActivities = await Activity.find({
      userId,
      activityType: 'attendance',
      timestamp: { $gte: dateFrom }
    });

    const totalDays = attendanceActivities.length;
    const daysPresent = attendanceActivities.filter(a => 
      a.metadata && a.metadata.status === 'present'
    ).length;
    const daysAbsent = totalDays - daysPresent;
    const attendanceRate = totalDays > 0 ? (daysPresent / totalDays) * 100 : 0;

    // Calculate academic metrics
    const assignmentActivities = await Activity.find({
      userId,
      activityType: 'assignment_submit',
      timestamp: { $gte: dateFrom }
    });

    const assignmentsCompleted = assignmentActivities.length;
    const assignmentsTotal = assignmentsCompleted + 5; // Mock total
    const assignmentCompletionRate = assignmentsTotal > 0 
      ? (assignmentsCompleted / assignmentsTotal) * 100 
      : 0;

    // Mock grade average (in real app, get from grades collection)
    const gradeAverage = 75 + Math.random() * 20;

    // Calculate engagement metrics
    const loginActivities = await Activity.find({
      userId,
      activityType: 'login',
      timestamp: { $gte: dateFrom }
    });

    const loginFrequency = loginActivities.length;

    const timeSpentActivities = await Activity.aggregate([
      {
        $match: {
          userId: require('mongoose').Types.ObjectId(userId),
          timestamp: { $gte: dateFrom }
        }
      },
      {
        $group: {
          _id: null,
          totalDuration: { $sum: '$duration' }
        }
      }
    ]);

    const timeSpentOnline = timeSpentActivities.length > 0 
      ? Math.round(timeSpentActivities[0].totalDuration / 60) 
      : 0;

    const forumPosts = await Activity.countDocuments({
      userId,
      activityType: 'forum_post',
      timestamp: { $gte: dateFrom }
    });

    // Calculate engagement score
    const participationScore = Math.min(100, (loginFrequency / 30) * 100);
    const engagementScore = (
      (participationScore * 0.3) +
      (assignmentCompletionRate * 0.4) +
      ((forumPosts / 10) * 100 * 0.3)
    );

    // Calculate risk score
    const riskScore = (
      ((100 - attendanceRate) * 0.4) +
      ((100 - gradeAverage) * 0.4) +
      ((100 - engagementScore) * 0.2)
    );

    // Prepare data for ML classification
    const mlData = {
      attendance_rate: attendanceRate,
      grade_average: gradeAverage,
      assignment_completion_rate: assignmentCompletionRate,
      login_frequency: loginFrequency,
      time_spent_online: timeSpentOnline,
      forum_posts: forumPosts,
      engagement_score: engagementScore,
      risk_score: riskScore
    };

    // Call Python ML service for classification
    let behaviorClass = 'average';
    let mlConfidence = 0.5;

    try {
      const mlResponse = await axios.post(
        `${process.env.ML_SERVICE_URL}/classify`,
        mlData
      );
      behaviorClass = mlResponse.data.classification;
      mlConfidence = mlResponse.data.confidence;
    } catch (mlError) {
      console.error('ML Service error:', mlError.message);
      // Fallback classification
      if (riskScore < 20) behaviorClass = 'excellent';
      else if (riskScore < 30) behaviorClass = 'good';
      else if (riskScore < 40) behaviorClass = 'average';
      else if (riskScore < 50) behaviorClass = 'at-risk';
      else behaviorClass = 'critical';
    }

    // Determine trend
    const previousData = await BehaviorData.findOne({
      userId
    }).sort({ date: -1 });

    let trendIndicator = 'stable';
    if (previousData) {
      const scoreDiff = riskScore - previousData.riskScore;
      if (scoreDiff < -5) trendIndicator = 'improving';
      else if (scoreDiff > 5) trendIndicator = 'declining';
    }

    // Create behavior data record
    const behaviorData = await BehaviorData.create({
      userId,
      attendanceRate,
      daysPresent,
      daysAbsent,
      gradeAverage,
      assignmentsCompleted,
      assignmentsTotal,
      assignmentCompletionRate,
      loginFrequency,
      timeSpentOnline,
      participationScore,
      forumPosts,
      engagementScore,
      riskScore,
      behaviorClass,
      mlConfidence,
      trendIndicator
    });

    // Check if alert should be generated
    await checkAndGenerateAlerts(userId, behaviorData);

    res.status(201).json({
      success: true,
      data: behaviorData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to generate alerts
async function checkAndGenerateAlerts(userId, behaviorData) {
  const Alert = require('../models/Alert');
  
  // Check attendance alert
  if (behaviorData.attendanceRate < 75) {
    await Alert.create({
      userId,
      alertType: 'attendance',
      severity: behaviorData.attendanceRate < 60 ? 'critical' : 'high',
      title: 'Low Attendance Alert',
      message: `Attendance rate has dropped to ${behaviorData.attendanceRate.toFixed(1)}%`,
      triggerValue: behaviorData.attendanceRate,
      thresholdValue: 75
    });
  }

  // Check grade alert
  if (behaviorData.gradeAverage < 70) {
    await Alert.create({
      userId,
      alertType: 'grade',
      severity: behaviorData.gradeAverage < 60 ? 'critical' : 'high',
      title: 'Low Grade Alert',
      message: `Grade average has dropped to ${behaviorData.gradeAverage.toFixed(1)}`,
      triggerValue: behaviorData.gradeAverage,
      thresholdValue: 70
    });
  }

  // Check engagement alert
  if (behaviorData.engagementScore < 60) {
    await Alert.create({
      userId,
      alertType: 'engagement',
      severity: 'medium',
      title: 'Low Engagement Alert',
      message: `Engagement score is ${behaviorData.engagementScore.toFixed(1)}%`,
      triggerValue: behaviorData.engagementScore,
      thresholdValue: 60
    });
  }

  // Check risk alert
  if (behaviorData.riskScore > 40) {
    await Alert.create({
      userId,
      alertType: 'risk',
      severity: behaviorData.riskScore > 50 ? 'critical' : 'high',
      title: 'High Risk Alert',
      message: `Student classified as ${behaviorData.behaviorClass} with risk score ${behaviorData.riskScore.toFixed(1)}`,
      triggerValue: behaviorData.riskScore,
      thresholdValue: 40
    });
  }
}

// @desc    Get behavior data for user
// @route   GET /api/behavior/:userId
// @access  Private
exports.getBehaviorData = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 30 } = req.query;

    const behaviorData = await BehaviorData.find({ userId })
      .sort({ date: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: behaviorData.length,
      data: behaviorData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get latest behavior data for user
// @route   GET /api/behavior/:userId/latest
// @access  Private
exports.getLatestBehaviorData = async (req, res) => {
  try {
    const { userId } = req.params;

    const behaviorData = await BehaviorData.findOne({ userId })
      .sort({ date: -1 });

    if (!behaviorData) {
      return res.status(404).json({
        success: false,
        message: 'No behavior data found'
      });
    }

    res.status(200).json({
      success: true,
      data: behaviorData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

---

Let me continue with the remaining backend files and then create the Python ML service and frontend components.

