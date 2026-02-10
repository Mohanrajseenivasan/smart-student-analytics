# 🚀 Quick Start Guide - Smart Student Behavior Analytics

## ⚡ Prerequisites Checklist

Before starting, ensure you have installed:
- ✅ Node.js (v16+) - [Download](https://nodejs.org/)
- ✅ Python (v3.8+) - [Download](https://www.python.org/)
- ✅ MongoDB (v5.0+) - [Download](https://www.mongodb.com/try/download/community)
- ✅ Git (optional) - For version control

## 📋 Installation Steps

### Step 1: Start MongoDB

#### Option A: MongoDB as Windows Service
```powershell
net start MongoDB
```

#### Option B: Manual Start
```powershell
mongod
```

Verify MongoDB is running by opening http://localhost:27017 in a browser (you should see "It looks like you are trying to access MongoDB over HTTP on the native driver port.")

### Step 2: Setup Python ML Service

Open a NEW terminal window:

```powershell
# Navigate to ML directory
cd "E:\Smart Student Behavior Analytics\backend\ml"

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train the model (first time)
python train_model.py

# Start the ML service
python behavior_classifier.py
```

**Expected Output:**
```
Train Accuracy: 1.0000
Test Accuracy: 1.0000
Model and scaler saved successfully!
 * Serving Flask app 'behavior_classifier'
 * Running on http://0.0.0.0:5001
```

✅ **ML Service is now running on port 5001** - Keep this terminal open!

### Step 3: Start Backend Server

Open a NEW terminal window:

```powershell
# Navigate to backend directory
cd "E:\Smart Student Behavior Analytics\backend"

# Start the development server
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node server.js`
MongoDB Connected: localhost
Server running in development mode on port 5000
```

✅ **Backend is now running on port 5000** - Keep this terminal open!

### Step 4: Start Frontend

Open a NEW terminal window:

```powershell
# Navigate to frontend directory
cd "E:\Smart Student Behavior Analytics\frontend"

# Start the development server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

✅ **Frontend is now running on port 3000** - Keep this terminal open!

### Step 5: Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 🎯 First Time Setup

### Create Your First Faculty Account

1. Click **"Register here"**
2. Fill in the form:
   - Name: `John Doe`
   - Email: `faculty@test.com`
   - Role: **Faculty**
   - Password: `password123`
   - Confirm Password: `password123`
3. Click **Register**

You'll be automatically logged in and redirected to the dashboard!

### Create a Student Account

1. Logout from the faculty account
2. Click **"Register here"**
3. Fill in the form:
   - Name: `Jane Student`
   - Email: `student@test.com`
   - Role: **Student**
   - Student ID: `STU001`
   - Class: `10A`
   - Password: `password123`
   - Confirm Password: `password123`
4. Click **Register**

## 🧪 Testing the System

### Test Faculty Features

Login as faculty (faculty@test.com) to access:

1. **Dashboard Statistics**
   - Total Students
   - Average Attendance
   - Average Grade
   - At-Risk Students

2. **Generate Student Behavior Data**
   
   Use this API endpoint in Postman or curl:
   ```powershell
   # Get your auth token first by logging in
   # Then use it in the Authorization header
   
   curl -X POST http://localhost:5000/api/behavior/calculate/STUDENT_USER_ID \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -H "Content-Type: application/json"
   ```

3. **View Analytics**
   - Risk Distribution Chart
   - Grade Distribution Chart
   - Student Overview Table
   - Active Alerts

### Test Student Features

Login as student (student@test.com) to access:
- Personal dashboard
- Performance tracking

## 🔧 Troubleshooting

### MongoDB Won't Start

**Problem:** MongoDB service not found
**Solution:**
```powershell
# Install MongoDB as a service
"C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --config "C:\Program Files\MongoDB\Server\5.0\bin\mongod.cfg" --install
```

**Problem:** Port 27017 already in use
**Solution:**
```powershell
# Find the process using port 27017
netstat -ano | findstr :27017
# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### ML Service Issues

**Problem:** `venv\Scripts\activate` not recognized
**Solution:**
```powershell
# Use full path
E:\Smart Student Behavior Analytics\backend\ml\venv\Scripts\activate
```

**Problem:** Python package installation fails
**Solution:**
```powershell
# Upgrade pip first
python -m pip install --upgrade pip
# Then install packages
pip install -r requirements.txt
```

**Problem:** SSL Certificate errors
**Solution:**
```powershell
pip install --trusted-host pypi.org --trusted-host files.pythonhosted.org -r requirements.txt
```

### Backend Issues

**Problem:** Port 5000 already in use
**Solution:**
Change PORT in `backend/.env`:
```env
PORT=5001
```
And update frontend `vite.config.js` proxy accordingly.

**Problem:** Cannot connect to MongoDB
**Solution:**
1. Ensure MongoDB is running
2. Check connection string in `backend/.env`
3. Try using 127.0.0.1 instead of localhost:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/student_behavior_analytics
```

### Frontend Issues

**Problem:** npm install fails
**Solution:**
```powershell
# Clear npm cache
npm cache clean --force
# Delete node_modules and package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
# Reinstall
npm install
```

**Problem:** Vite build errors
**Solution:**
```powershell
# Ensure you're using Node.js v16+
node --version
# Update npm
npm install -g npm@latest
```

**Problem:** Can't connect to backend
**Solution:**
Check that:
1. Backend is running on port 5000
2. CORS is enabled in backend
3. Browser console for specific errors

### Common Runtime Errors

**Problem:** "User already exists" during registration
**Solution:** Use a different email or clear the database:
```powershell
# Connect to MongoDB
mongosh
# Select database
use student_behavior_analytics
# Drop users collection
db.users.drop()
```

**Problem:** No data showing in dashboard
**Solution:**
1. Register some students
2. Generate behavior data using the API
3. Refresh the dashboard

## 📊 Quick Test Script

Here's a quick way to test all components:

### Test Backend Health
```powershell
curl http://localhost:5000/health
```

Expected: `{"status":"OK","timestamp":"..."}`

### Test ML Service Health
```powershell
curl http://localhost:5001/health
```

Expected: `{"status":"healthy","model_loaded":true}`

### Test Frontend
Open: http://localhost:3000

Expected: Login page with gradient background

## 🎓 Next Steps

1. **Explore the Dashboard**
   - View statistics
   - Check charts
   - Review student data

2. **Generate Sample Data**
   - Create multiple student accounts
   - Generate behavior data via API
   - Watch alerts being created

3. **Customize Settings**
   - Modify alert thresholds
   - Adjust ML model parameters
   - Update UI themes

4. **Production Deployment**
   - Change JWT_SECRET to a secure value
   - Set NODE_ENV to 'production'
   - Use environment-specific MongoDB
   - Build frontend: `npm run build`
   - Deploy to cloud platform

## ✅ Success Checklist

All services running?
- [ ] MongoDB running on port 27017
- [ ] ML Service running on port 5001  
- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000

Can you access?
- [ ] Frontend loads at http://localhost:3000
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Dashboard displays correctly

## 💡 Pro Tips

1. **Keep terminals organized**: Use a terminal multiplexer or separate windows for each service
2. **Monitor logs**: Watch for errors in each terminal window
3. **Use Postman**: Test API endpoints separately
4. **Check browser console**: For frontend debugging
5. **Database GUI**: Use MongoDB Compass for easy database viewing

## 🆘 Still Having Issues?

1. Check all prerequisites are installed
2. Verify all ports are available (27017, 5000, 5001, 3000)
3. Ensure no firewall is blocking connections
4. Review the full README.md for detailed information
5. Check MongoDB, Node.js, and Python versions

---

**Happy Coding! 🚀**

If everything is running correctly, you should now have a fully functional Student Behavior Analytics System!
