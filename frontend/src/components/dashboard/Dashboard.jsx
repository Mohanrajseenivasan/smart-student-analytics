import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { activityAPI } from '../../services/api';
import AdminPortal from './AdminPortal';
import TeacherPortal from './TeacherPortal';
import StudentPortal from './StudentPortal';
import ParentPortal from './ParentPortal';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const { tab } = useParams();

    useEffect(() => {
        logActivity();
    }, []);

    const logActivity = async () => {
        try {
            await activityAPI.log({
                activityType: 'page_view',
                description: 'Viewed dashboard',
                metadata: { page: 'dashboard', tab, role: user?.role }
            });
        } catch (error) {
            console.error('Activity logging error:', error);
        }
    };

    if (!user) return <div className="loading-screen">Loading...</div>;

    const renderPortal = () => {
        const currentTab = tab || 'overview';
        switch (user.role?.toLowerCase()) {
            case 'admin':
            case 'teacher':
            case 'faculty': // fallback
                return <TeacherPortal activeTab={currentTab} />;
            case 'student':
                return <StudentPortal activeTab={currentTab} />;
            case 'parent':
                return <ParentPortal activeTab={currentTab} />;
            default:
                // Default fallback if role is unrecognized
                return <TeacherPortal activeTab={currentTab} />;
        }
    };

    return (
        <div className="w-full h-full text-white bg-transparent p-0 m-0 border-none">
            {renderPortal()}
        </div>
    );
};

export default Dashboard;
