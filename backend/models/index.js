const User = require('./User');
const Activity = require('./Activity');
const BehaviorData = require('./BehaviorData');
const Alert = require('./Alert');

const Credential = require('./Credential');
const Student = require('./Student');
const Attendance = require('./Attendance');
const Mark = require('./Mark');
const Behavior = require('./Behavior');
const AnalyticsSummary = require('./AnalyticsSummary');

const Goal = require('./Goal');
const Achievement = require('./Achievement');
const Assignment = require('./Assignment');
const Event = require('./Event');

// Define associations
User.hasOne(Credential, { foreignKey: 'userId', as: 'credential' });
Credential.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> Student relationship
User.hasOne(Student, { foreignKey: 'userId', as: 'studentProfile' });
Student.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Parent -> Student relationship
User.hasMany(Student, { foreignKey: 'parentId', as: 'children' });
Student.belongsTo(User, { foreignKey: 'parentId', as: 'parent' });

// Student -> Attendance
Student.hasMany(Attendance, { foreignKey: 'studentId', as: 'attendanceRecords' });
Attendance.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Marks
Student.hasMany(Mark, { foreignKey: 'studentId', as: 'marks' });
Mark.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Behavior
Student.hasMany(Behavior, { foreignKey: 'studentId', as: 'behaviorIncidents' });
Behavior.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> AnalyticsSummary
Student.hasOne(AnalyticsSummary, { foreignKey: 'studentId', as: 'analytics' });
AnalyticsSummary.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Goals
Student.hasMany(Goal, { foreignKey: 'studentId', as: 'goals' });
Goal.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Achievements
Student.hasMany(Achievement, { foreignKey: 'studentId', as: 'achievements' });
Achievement.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Student -> Assignments
Student.hasMany(Assignment, { foreignKey: 'studentId', as: 'assignments' });
Assignment.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });
Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(BehaviorData, { foreignKey: 'userId', as: 'behaviorData' });
BehaviorData.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Alert, { foreignKey: 'userId', as: 'alerts' });
Alert.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Alert.belongsTo(User, { foreignKey: 'acknowledgedBy', as: 'acknowledger' });
Alert.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolver' });

module.exports = {
    User,
    Credential,
    Student,
    Attendance,
    Mark,
    Behavior,
    AnalyticsSummary,
    Activity,
    BehaviorData,
    Alert,
    Goal,
    Achievement,
    Assignment,
    Event
};
