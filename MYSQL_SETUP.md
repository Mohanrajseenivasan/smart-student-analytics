# 🔄 MySQL Migration Guide - Student Behavior Analytics

## ✅ Migration Complete!

The project has been successfully converted from MongoDB to MySQL using Sequelize ORM.

---

## 📋 What Changed

### **Backend Changes:**
1. ✅ **ORM**: Mongoose → Sequelize
2. ✅ **Database**: MongoDB → MySQL
3. ✅ **Models**: All 4 models converted (User, Activity, BehaviorData, Alert)
4. ✅ **Controllers**: All controllers updated for Sequelize syntax
5. ✅ **Routes**: Dashboard routes updated with proper joins
6. ✅ **Middleware**: Authentication updated to use Sequelize

### **Database Schema:**
- ✅ **Primary Keys**: Changed from MongoDB ObjectId to MySQL AUTO_INCREMENT integers
- ✅ **Foreign Keys**: Proper relationships defined
- ✅ **Indexes**: Performance indexes maintained
- ✅ **Data Types**: 
  - JSON fields for metadata
  - DECIMAL for precise numeric values (scores, rates)
  - ENUM for categorical data
  - TEXT for long strings
  - DATE/DATETIME for timestamps

---

## 🚀 MySQL Setup Instructions

### **Step 1: Install MySQL**

If you don't have MySQL installed:

#### **Windows:**
1. Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Run the installer
3. Choose "Developer Default" setup
4. Set root password (remember this!)
5. Complete the installation

#### **Verify Installation:**
```powershell
mysql --version
```

Expected output: `mysql  Ver 8.0.xx`

---

### **Step 2: Create Database**

Open MySQL Command Line or use MySQL Workbench:

```powershell
# Login to MySQL
mysql -u root -p
```

Enter your root password, then run:

```sql
-- Create the database
CREATE DATABASE student_behavior_analytics;

-- Verify database was created
SHOW DATABASES;

-- Exit MySQL
EXIT;
```

---

### **Step 3: Configure Environment Variables**

The `.env` file has been updated. **Set your MySQL password:**

Open `backend\.env` and update:

```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=student_behavior_analytics
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD_HERE
```

⚠️ **Important**: Replace `YOUR_MYSQL_ROOT_PASSWORD_HERE` with your actual MySQL root password!

---

### **Step 4: Initialize Database Tables**

The tables will be created automatically when you start the backend server!

Sequelize will:
- Create all tables
- Set up relationships
- Add indexes
- Sync the schema

---

## 🎯 Running the Project with MySQL

### **Terminal 1: Start Python ML Service**

```powershell
cd "E:\Smart Student Behavior Analytics\backend\ml"
.\venv\Scripts\activate
python behavior_classifier.py
```

✅ ML Service running on port 5001

---

### **Terminal 2: Start Backend Server**

```powershell
cd "E:\Smart Student Behavior Analytics\backend"
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node server.js`
Executing (default): SELECT 1+1 AS result
MySQL Database Connected Successfully
Executing (default): CREATE TABLE IF NOT EXISTS `users`...
Executing (default): CREATE TABLE IF NOT EXISTS `activities`...
Executing (default): CREATE TABLE IF NOT EXISTS `behavior_data`...
Executing (default): CREATE TABLE IF NOT EXISTS `alerts`...
Database synchronized
Server running in development mode on port 5000
```

✅ Backend running on port 5000

---

### **Terminal 3: Start Frontend**

```powershell
cd "E:\Smart Student Behavior Analytics\frontend"
npm run dev
```

✅ Frontend running on port 3000

---

## 🔍 Verify Database Setup

### **Option 1: MySQL Command Line**

```powershell
mysql -u root -p
```

```sql
-- Use the database
USE student_behavior_analytics;

-- Show all tables
SHOW TABLES;

-- Should show:
-- users
-- activities
-- behavior_data
-- alerts

-- Check users table structure
DESCRIBE users;

-- Exit
EXIT;
```

### **Option 2: MySQL Workbench**

1. Open MySQL Workbench
2. Connect to localhost
3. Navigate to `student_behavior_analytics` database
4. View tables in the left sidebar

---

## 📊 Database Structure

### **Tables Created:**

```
student_behavior_analytics
├── users (User accounts)
│   ├── id (PRIMARY KEY, AUTO_INCREMENT)
│   ├── name, email, password
│   ├── role (ENUM: student, faculty, admin)
│   ├── studentId, class
│   └── createdAt, updatedAt
│
├── activities (Activity tracking)
│   ├── id (PRIMARY KEY)
│   ├── userId (FOREIGN KEY → users.id)
│   ├── activityType (ENUM)
│   ├── metadata (JSON)
│   └── timestamp
│
├── behavior_data (Analytics data)
│   ├── id (PRIMARY KEY)
│   ├── userId (FOREIGN KEY → users.id)
│   ├── attendanceRate, gradeAverage
│   ├── engagementScore, riskScore
│   └── behaviorClass (ENUM)
│
└── alerts (Alert notifications)
    ├── id (PRIMARY KEY)
    ├── userId (FOREIGN KEY → users.id)
    ├── alertType, severity (ENUM)
    └── status (ENUM)
```

---

## 🔧 Troubleshooting

### **Problem: Can't connect to MySQL**

**Error**: `Error: Access denied for user 'root'@'localhost'`

**Solution**:
1. Check your password in `.env` file
2. Verify MySQL is running:
   ```powershell
   # Windows
   net start MySQL80
   ```

---

### **Problem: Database doesn't exist**

**Error**: `Unknown database 'student_behavior_analytics'`

**Solution**:
```sql
mysql -u root -p
CREATE DATABASE student_behavior_analytics;
EXIT;
```

---

### **Problem: Port 3306 already in use**

**Solution**:
```powershell
# Find process using port 3306
netstat -ano | findstr :3306

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change MySQL port in .env:
DB_PORT=3307
```

---

### **Problem: Tables not created**

**Solution**:
Check backend console for errors. If needed, force sync:

Temporarily add to `backend/config/db.js`:
```javascript
await sequelize.sync({ force: true }); // This will DROP and RECREATE tables!
```

⚠️ **Warning**: `force: true` will delete all data!

---

### **Problem: Foreign key constraint fails**

This shouldn't happen on first run, but if you see this error:

**Solution**:
```sql
-- Drop all tables and let Sequelize recreate them
USE student_behavior_analytics;
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS behavior_data;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;
```

Then restart the backend server.

---

## 🎓 Testing the MySQL Setup

### **1. Register a Test User**

Navigate to http://localhost:3000 and register:
- Name: Test Faculty
- Email: faculty@test.com
- Password: password123
- Role: Faculty

### **2. Verify in Database**

```sql
mysql -u root -p
USE student_behavior_analytics;

-- Check user was created
SELECT id, name, email, role FROM users;

-- Check activities were logged
SELECT * FROM activities ORDER BY id DESC LIMIT 5;
```

You should see the user and login activities!

---

## 📝 Key Differences from MongoDB

### **Query Syntax:**

**MongoDB (Mongoose):**
```javascript
await User.findById(id);
await User.find({ role: 'student' });
await Activity.countDocuments({ userId });
```

**MySQL (Sequelize):**
```javascript
await User.findByPk(id);
await User.findAll({ where: { role: 'student' } });
await Activity.count({ where: { userId } });
```

### **Relationships:**

**MongoDB:** Manual population
```javascript
await User.findById(id).populate('activities');
```

**MySQL:** Built-in joins
```javascript
await User.findByPk(id, { include: ['activities'] });
```

### **IDs:**

- **MongoDB**: ObjectId strings (e.g., "507f1f77bcf86cd799439011")
- **MySQL**: Integer AUTO_INCREMENT (e.g., 1, 2, 3)

---

## 🔄 Migration Benefits

✅ **ACID Compliance**: Better data consistency
✅ **Foreign Keys**: Enforced referential integrity
✅ **Complex Queries**: Better support for joins and aggregations
✅ **Standard SQL**: More familiar to many developers
✅ **Tools**: Excellent GUI tools (MySQL Workbench, phpMyAdmin)
✅ **Transactions**: Better support for multi-step operations

---

## 📈 Performance Tips

1. **Indexes are automatically created** for:
   - Primary keys
   - Foreign keys
   - Frequently queried fields (userId, timestamp, behaviorClass)

2. **Connection Pooling** is configured:
   - Max: 5 connections
   - Min: 0 connections
   - Auto-reconnect enabled

3. **Query Optimization**:
   - Use `raw: true` for read-only queries
   - Specify only needed columns with `attributes`
   - Use `limit` for large datasets

---

## 🎉 Success Checklist

- [ ] MySQL installed and running
- [ ] Database `student_behavior_analytics` created
- [ ] `.env` file updated with MySQL password
- [ ] Backend starts without errors
- [ ] Tables automatically created
- [ ] Can register new users
- [ ] Login works correctly
- [ ] Dashboard displays data

---

## 📚 Additional Resources

- **Sequelize Docs**: https://sequelize.org/docs/v6/
- **MySQL Docs**: https://dev.mysql.com/doc/
- **MySQL Workbench**: GUI for database management
- **DBeaver**: Alternative universal database tool

---

**🎊 Congratulations! Your project is now running on MySQL!**

All MongoDB functionality has been preserved while gaining the benefits of a relational database structure.
