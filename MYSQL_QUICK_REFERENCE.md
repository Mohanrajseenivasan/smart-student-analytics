# 🚀 MySQL Quick Reference - Student Behavior Analytics

## 📋 One-Page Cheat Sheet

---

## 🎯 Quick Setup (New Installation)

```powershell
# 1. Install MySQL, then create database
mysql -u root -p
CREATE DATABASE student_behavior_analytics;
EXIT;

# 2. Configure .env file
# Set: DB_PASSWORD=your_mysql_password

# 3. Install backend dependencies
cd "E:\Smart Student Behavior Analytics\backend"
npm install

# 4. Start services (3 terminals)
# Terminal 1: ML Service
cd backend\ml
.\venv\Scripts\activate
python behavior_classifier.py

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
cd frontend
npm run dev
```

---

## 🔧 Essential MySQL Commands

### **Database Operations**
```sql
-- Login
mysql -u root -p

-- Show databases
SHOW DATABASES;

-- Use database
USE student_behavior_analytics;

-- Show tables
SHOW TABLES;

-- Drop database (CAUTION!)
DROP DATABASE student_behavior_analytics;
```

### **Table Operations**
```sql
-- View table structure
DESCRIBE users;
DESCRIBE activities;
DESCRIBE behavior_data;
DESCRIBE alerts;

-- View table data
SELECT * FROM users;
SELECT * FROM activities ORDER BY timestamp DESC LIMIT 10;
SELECT * FROM behavior_data ORDER BY date DESC;
SELECT * FROM alerts WHERE status = 'active';

-- Count records
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM activities WHERE userId = 1;
```

### **User Queries**
```sql
-- Find user by email
SELECT * FROM users WHERE email = 'faculty@test.com';

-- List all students
SELECT id, name, email, studentId FROM users WHERE role = 'student';

-- List all faculty
SELECT id, name, email FROM users WHERE role = 'faculty';

-- Recent logins
SELECT name, email, lastLogin FROM users ORDER BY lastLogin DESC LIMIT 10;
```

### **Activity Queries**
```sql
-- Recent activities
SELECT a.activityType, u.name, a.timestamp 
FROM activities a 
JOIN users u ON a.userId = u.id 
ORDER BY a.timestamp DESC 
LIMIT 20;

-- Activity count by type
SELECT activityType, COUNT(*) as count 
FROM activities 
GROUP BY activityType;

-- User's activities
SELECT * FROM activities WHERE userId = 1 ORDER BY timestamp DESC;
```

### **Behavior Data Queries**
```sql
-- Latest behavior for all students
SELECT u.name, b.attendanceRate, b.gradeAverage, b.behaviorClass
FROM behavior_data b
JOIN users u ON b.userId = u.id
ORDER BY b.date DESC;

-- At-risk students
SELECT u.name, u.email, b.riskScore, b.behaviorClass
FROM behavior_data b
JOIN users u ON b.userId = u.id
WHERE b.behaviorClass IN ('at-risk', 'critical')
ORDER BY b.riskScore DESC;

-- Student performance trends
SELECT date, attendanceRate, gradeAverage, engagementScore
FROM behavior_data
WHERE userId = 1
ORDER BY date DESC;
```

### **Alert Queries**
```sql
-- Active alerts
SELECT u.name, a.alertType, a.severity, a.title, a.message
FROM alerts a
JOIN users u ON a.userId = u.id
WHERE a.status = 'active'
ORDER BY a.createdAt DESC;

-- Alerts by severity
SELECT severity, COUNT(*) as count
FROM alerts
WHERE status = 'active'
GROUP BY severity;

-- Critical alerts
SELECT * FROM alerts 
WHERE severity = 'critical' AND status = 'active';
```

---

## 🔨 Troubleshooting Commands

### **Connection Issues**
```powershell
# Check if MySQL is running
Get-Service MySQL80

# Start MySQL service
net start MySQL80

# Stop MySQL service
net stop MySQL80

# Check MySQL version
mysql --version

# Check port 3306
netstat -ano | findstr :3306
```

### **Reset Everything**
```sql
-- WARNING: This deletes ALL data!
DROP DATABASE IF EXISTS student_behavior_analytics;
CREATE DATABASE student_behavior_analytics;
```

### **Check Database Size**
```sql
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'student_behavior_analytics'
ORDER BY (data_length + index_length) DESC;
```

### **Backup Database**
```powershell
# Backup
mysqldump -u root -p student_behavior_analytics > backup.sql

# Restore
mysql -u root -p student_behavior_analytics < backup.sql
```

---

## 📊 Sequelize Query Examples

### **Find Operations**
```javascript
// Find by primary key
await User.findByPk(1);

// Find one with condition
await User.findOne({ where: { email: 'test@example.com' } });

// Find all with condition
await User.findAll({ where: { role: 'student' } });

// Find with multiple conditions
await Activity.findAll({
  where: {
    userId: 1,
    activityType: 'login',
    timestamp: { [Op.gte]: new Date('2026-01-01') }
  }
});
```

### **Create Operations**
```javascript
// Create single record
await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  role: 'student'
});

// Bulk create
await Activity.bulkCreate([
  { userId: 1, activityType: 'login', timestamp: new Date() },
  { userId: 1, activityType: 'page_view', timestamp: new Date() }
]);
```

### **Update Operations**
```javascript
// Update by primary key
await User.update(
  { lastLogin: new Date() },
  { where: { id: 1 } }
);

// Update multiple records
await Alert.update(
  { status: 'acknowledged' },
  { where: { severity: 'low', status: 'active' } }
);
```

### **Delete Operations**
```javascript
// Delete by condition
await Activity.destroy({
  where: { 
    timestamp: { [Op.lt]: new Date('2026-01-01') }
  }
});

// Delete all (DANGEROUS!)
await Activity.destroy({ truncate: true });
```

### **Aggregations**
```javascript
// Count
await User.count({ where: { role: 'student' } });

// Sum
await Activity.sum('duration', { where: { userId: 1 } });

// Average
await BehaviorData.findAll({
  attributes: [
    [sequelize.fn('AVG', sequelize.col('gradeAverage')), 'avgGrade']
  ]
});

// Group by
await Activity.findAll({
  attributes: [
    'activityType',
    [sequelize.fn('COUNT', sequelize.col('id')), 'count']
  ],
  group: ['activityType']
});
```

### **Joins (Include)**
```javascript
// Include related data
await User.findByPk(1, {
  include: [
    { model: Activity, as: 'activities' },
    { model: BehaviorData, as: 'behaviorData' }
  ]
});

// Include with conditions
await Alert.findAll({
  include: [{
    model: User,
    as: 'user',
    attributes: ['name', 'email'],
    where: { role: 'student' }
  }]
});
```

---

## 🎯 Common Tasks

### **Register New User**
Frontend: http://localhost:3000/register
Or via API:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student",
    "studentId": "STU001"
  }'
```

### **Login**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### **Generate Behavior Data**
```bash
# Replace TOKEN and USER_ID
curl -X POST http://localhost:5000/api/behavior/calculate/USER_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_behavior_analytics
DB_USER=root
DB_PASSWORD=your_password_here

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=24h

# ML Service
ML_SERVICE_URL=http://localhost:5001
```

---

## 🔍 Health Checks

```bash
# Backend
curl http://localhost:5000/health

# ML Service
curl http://localhost:5001/health

# MySQL
mysql -u root -p -e "SELECT 1"
```

---

## 📦 NPM Commands

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Run ML service
npm run ml
```

---

## 🎓 Pro Tips

1. **Use MySQL Workbench** for visual database management
2. **Regular backups**: `mysqldump -u root -p db_name > backup.sql`
3. **Check logs**: Watch terminal output for errors
4. **Test queries**: Try in MySQL console before using in code
5. **Index usage**: Sequelize creates indexes automatically
6. **Connection pooling**: Already configured (max 5 connections)
7. **Transactions**: Use for multi-step operations

---

## 🆘 Emergency Reset

If everything breaks:

```powershell
# 1. Stop all services (Ctrl+C in each terminal)

# 2. Reset database
mysql -u root -p
DROP DATABASE student_behavior_analytics;
CREATE DATABASE student_behavior_analytics;
EXIT;

# 3. Clear node modules
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# 4. Restart services
```

---

## 📚 File Locations

- **Config**: `backend/config/db.js`
- **Models**: `backend/models/*.js`
- **Controllers**: `backend/controllers/*.js`
- **Routes**: `backend/routes/*.js`
- **Environment**: `backend/.env`
- **Setup Script**: `database_setup.sql`

---

## ✅ Success Indicators

- [ ] MySQL running (port 3306)
- [ ] Database created
- [ ] Backend starts without errors
- [ ] Tables auto-created (check logs)
- [ ] Frontend loads (port 3000)
- [ ] Can register users
- [ ] Can login
- [ ] Dashboard displays data

---

**Need more help?** See `MYSQL_SETUP.md` for detailed guide!

**Status**: ✨ Project converted to MySQL successfully!
