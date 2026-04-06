import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatsCard from './StatsCard';

const ParentPortal = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await dashboardAPI.getChildStats();
            setStats(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading parent portal:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen">Loading Parent Portal...</div>;

    if (stats?.noChild) {
         return (
             <div className="parent-portal text-gray-800">
                 <h2 className="text-2xl font-bold mb-6">Child Overview</h2>
                 <p>No child student profiles are linked to this parent account yet.</p>
             </div>
         );
    }

    return (
        <div className="parent-portal text-gray-800">
            <h2 className="text-2xl font-bold mb-6">Child Overview</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                        {stats?.student?.name ? stats.student.name.substring(0, 2) : 'CH'}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">{stats?.student?.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500">Year {stats?.student?.year} • ID: {stats?.student?.registerNumber}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-2xl text-indigo-600">{stats?.behaviorData?.gradeAverage || 0}%</p>
                    <p className="text-xs text-gray-500 uppercase">Average Grade</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4">Attendance Alerts</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 font-semibold text-gray-600">Status</th>
                                    <th className="p-3 font-semibold text-gray-600">Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.alerts?.length > 0 ? stats.alerts.map(alert => (
                                    <tr key={alert.id} className="border-b last:border-0 hover:bg-yellow-50 text-yellow-800">
                                        <td className="p-3 font-bold">{alert.severity}</td>
                                        <td className="p-3">{alert.title}: {alert.message}</td>
                                    </tr>
                                )) : (
                                    <tr className="border-b last:border-0 hover:bg-green-50 text-green-800">
                                        <td className="p-3 font-bold">Good standing</td>
                                        <td className="p-3">No active alerts recorded.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold mb-4">Latest Incidents</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b bg-gray-50">
                                    <th className="p-3 font-semibold text-gray-600">Date</th>
                                    <th className="p-3 font-semibold text-gray-600">Incident Description</th>
                                    <th className="p-3 font-semibold text-gray-600">Severity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.incidents?.length > 0 ? stats.incidents.map(inc => (
                                    <tr key={inc.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="p-3 text-gray-500">{inc.date}</td>
                                        <td className="p-3 font-medium text-gray-800">{inc.remark}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs severity-${inc.severityLevel?.toLowerCase()} bg-red-100 text-red-800`}>
                                                {inc.severityLevel}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" className="p-3 text-center text-gray-500">No incidents reported recently.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentPortal;
