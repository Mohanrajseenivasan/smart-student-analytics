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
            if (['faculty', 'admin', 'counselor', 'hod'].includes(user.role)) {
                const [statsRes, studentsRes, alertsRes] = await Promise.all([
                    dashboardAPI.getStats(),
                    dashboardAPI.getStudents(),
                    dashboardAPI.getAlerts({ status: 'active', limit: 10 })
                ]);

                setStats(statsRes.data.data);
                setStudents(studentsRes.data.data);
                setAlerts(alertsRes.data.data);
            } else if (user.role === 'student') {
                const res = await dashboardAPI.getStudentStats();
                // Set stats to the whole data object so we can access goals, etc.
                setStats(res.data.data);
                setAlerts(res.data.data.alerts);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error loading dashboard:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-screen">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome, {user.name}!</h1>
                <span className="role-badge">{user.role}</span>
            </div>

            {['faculty', 'admin', 'counselor', 'hod'].includes(user.role) && stats && (
                <>
                    <div className="stats-grid">
                        <StatsCard
                            title="Total Students"
                            value={stats.totalStudents}
                            icon="👥"
                            color="#667eea"
                        />
                        <StatsCard
                            title="Average Attendance"
                            value={`${stats.avgAttendance}%`}
                            icon="📅"
                            color="#17a2b8"
                        />
                        <StatsCard
                            title="Average Grade"
                            value={`${stats.avgGrade}%`}
                            icon="📊"
                            color="#28a745"
                        />
                        <StatsCard
                            title="At-Risk Students"
                            value={stats.atRiskCount}
                            icon="⚠️"
                            color="#dc3545"
                        />
                    </div>

                    {students.length > 0 && <Charts students={students} />}

                    <div className="alerts-section">
                        <h2>Recent Alerts</h2>
                        {alerts.length > 0 ? (
                            <div className="alerts-list">
                                {alerts.map((alert) => (
                                    <div
                                        key={alert._id}
                                        className={`alert-item severity-${alert.severity}`}
                                    >
                                        <div className="alert-header">
                                            <strong>{alert.title}</strong>
                                            <span className="alert-severity">{alert.severity}</span>
                                        </div>
                                        <p>{alert.message}</p>
                                        <small>
                                            Student: {alert.userId?.name || 'Unknown'} •{' '}
                                            {new Date(alert.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No active alerts</p>
                        )}
                    </div>

                    <div className="students-section">
                        <h2>Student Overview</h2>
                        <div className="students-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Student ID</th>
                                        <th>Class</th>
                                        <th>Risk Level</th>
                                        <th>Attendance</th>
                                        <th>Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.slice(0, 10).map((student) => (
                                        <tr key={student._id}>
                                            <td>{student.name}</td>
                                            <td>{student.studentId || 'N/A'}</td>
                                            <td>{student.class || 'N/A'}</td>
                                            <td>
                                                <span
                                                    className={`risk-badge ${student.behaviorData?.behaviorClass || 'average'
                                                        }`}
                                                >
                                                    {student.behaviorData?.behaviorClass || 'No Data'}
                                                </span>
                                            </td>
                                            <td>
                                                {student.behaviorData?.attendanceRate?.toFixed(1) || 'N/A'}%
                                            </td>
                                            <td>
                                                {student.behaviorData?.gradeAverage?.toFixed(1) || 'N/A'}%
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
                    {/* Welcome Banner */}
                    <div className="welcome-banner">
                        <div className="banner-content">
                            <h2>Welcome back, <span className="highlight">{user.name}</span>! 👋</h2>
                            <p>You have {alerts.length} new alerts and {stats?.assignments?.length || 0} pending assignments.</p>
                        </div>
                        <div className="banner-stats">
                            <div className="stat-pill warning">
                                <span>⚠️ {stats?.riskScore || 0} Risk Score</span>
                            </div>
                            <div className="stat-pill success">
                                <span>⭐ {stats?.engagementScore || 0} Engagement</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Stats Grid */}
                    <div className="stats-grid">
                        <StatsCard
                            title="Attendance Rate"
                            value={`${stats?.behaviorData?.attendanceRate || 0}%`}
                            icon="📅"
                            color="#17a2b8"
                        />
                        <StatsCard
                            title="Average Grade"
                            value={`${stats?.behaviorData?.gradeAverage || 0}%`}
                            icon="📊"
                            color="#28a745"
                        />
                        <StatsCard
                            title="Engagement Score"
                            value={`${stats?.behaviorData?.engagementScore || 0}`}
                            icon="💡"
                            color="#667eea"
                        />
                        <StatsCard
                            title="Class Rank"
                            value="#12"
                            icon="🏆"
                            color="#f6ad55"
                        />
                    </div>

                    <div className="dashboard-content-grid">

                        {/* Left Column: Goals & Assignments */}
                        <div className="left-column">

                            {/* Goals Section */}
                            <div className="dashboard-card goals-section">
                                <div className="card-header">
                                    <h3>🎯 Your Goals</h3>
                                    <button className="btn-icon">➕</button>
                                </div>
                                <div className="goals-list">
                                    {stats?.goals?.length > 0 ? (
                                        stats.goals.map(goal => (
                                            <div key={goal.id} className="goal-item">
                                                <div className="goal-info">
                                                    <span>{goal.title}</span>
                                                    <span className="goal-target">{goal.currentValue} / {goal.targetValue}{goal.unit}</span>
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div
                                                        className="progress-bar-fill"
                                                        style={{ width: `${(goal.currentValue / goal.targetValue) * 100}%`, backgroundColor: goal.status === 'Completed' ? '#48bb78' : '#667eea' }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="empty-state">No goals set yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Achievements Section */}
                            <div className="dashboard-card achievements-section">
                                <h3>🏆 Achievements</h3>
                                <div className="achievements-list">
                                    {stats?.achievements?.length > 0 ? (
                                        stats.achievements.map(ach => (
                                            <div key={ach.id} className="achievement-item">
                                                <div className="achievement-icon">{ach.icon === 'trophy' ? '🏆' : ach.icon === 'star' ? '⭐' : '🏅'}</div>
                                                <div className="achievement-details">
                                                    <h4>{ach.title}</h4>
                                                    <p>{ach.description}</p>
                                                    <small>Earned on {new Date(ach.dateEarned).toLocaleDateString()}</small>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="empty-state">Keep working hard to earn badges!</p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Right Column: Assignments & Events */}
                        <div className="right-column">

                            {/* Assignments */}
                            <div className="dashboard-card assignments-section">
                                <h3>📝 Upcoming Assignments</h3>
                                <div className="assignments-list">
                                    {stats?.assignments?.length > 0 ? (
                                        stats.assignments.map(ass => (
                                            <div key={ass.id} className={`assignment-item priority-${ass.priority.toLowerCase()}`}>
                                                <div className="assignment-date">
                                                    <span className="month">{new Date(ass.dueDate).toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="day">{new Date(ass.dueDate).getDate()}</span>
                                                </div>
                                                <div className="assignment-details">
                                                    <h4>{ass.title}</h4>
                                                    <span className="subject-tag">{ass.subject}</span>
                                                </div>
                                                <span className={`status-badge ${ass.status.toLowerCase()}`}>{ass.status}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="empty-state">No pending assignments.</p>
                                    )}
                                </div>
                            </div>

                            {/* Alerts */}
                            <div className="dashboard-card alerts-section">
                                <h3>🔔 Notifications</h3>
                                {alerts.length > 0 ? (
                                    <div className="alerts-list">
                                        {alerts.map((alert) => (
                                            <div key={alert.id} className={`alert-item severity-${alert.severity}`}>
                                                <strong>{alert.title}</strong>
                                                <p>{alert.message}</p>
                                                <small>{new Date(alert.createdAt).toLocaleDateString()}</small>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="empty-state">No new notifications.</p>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
