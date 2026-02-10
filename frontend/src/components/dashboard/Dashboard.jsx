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
                    <div className="welcome-message">
                        <h2>Student Dashboard</h2>
                        <p>
                            Your behavior analytics and performance metrics will be displayed here.
                            Check back regularly to track your progress!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
