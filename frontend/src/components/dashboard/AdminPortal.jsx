import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const glassProps = "bg-[#ffffff08] backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all";

const AdminPortal = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [students, setStudents] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [statsRes, studentsRes, alertsRes] = await Promise.all([
                dashboardAPI.getStats(),
                dashboardAPI.getStudents(),
                dashboardAPI.getAlerts({ status: 'active', limit: 10 })
            ]);
            setStats(statsRes.data.data);
            setStudents(studentsRes.data.data || []);
            setAlerts(alertsRes.data.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error loading admin portal:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading-screen text-white flex justify-center items-center h-full">Loading Admin Portal...</div>;

    // Chart Data
    const riskData = {
        labels: ['High Risk', 'Medium Risk', 'Stable'],
        datasets: [{
            data: [stats?.atRiskCount || 10, 25, 65],
            backgroundColor: ['rgba(239, 68, 68, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(34, 197, 94, 0.8)'],
            borderWidth: 0,
        }]
    };

    const [editingStudent, setEditingStudent] = useState(null);

    const handleLogAction = (actionType) => {
        alert(`${actionType} action successfully logged for ${editingStudent.name}. Behavioral database updated.`);
        setEditingStudent(null);
    };

    return (
        <div className="text-gray-100 font-sans pb-10 fade-in w-full max-w-[1600px] mx-auto p-4 lg:p-8">
            <header className="mb-8 p-4">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400 mb-2">School Administration Dashboard</h2>
                <p className="text-gray-400 text-sm">System-wide behavior and performance metrics</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`${glassProps} p-6`}>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Total Population</span>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-2xl">👥</span>
                        <span className="text-3xl font-bold text-white">{stats?.totalStudents || 0}</span>
                    </div>
                </div>
                <div className={`${glassProps} p-6`}>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Global Attendance</span>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-2xl">📅</span>
                        <span className="text-3xl font-bold text-teal-300">{stats?.avgAttendance || 90}%</span>
                    </div>
                </div>
                <div className={`${glassProps} p-6`}>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Average Grade</span>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-2xl">📊</span>
                        <span className="text-3xl font-bold text-blue-300">{stats?.avgGrade || 78}%</span>
                    </div>
                </div>
                <div className={`${glassProps} p-6 border-red-500/30`}>
                    <span className="text-gray-400 text-xs font-semibold uppercase">Critical Cases</span>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-2xl">⚠️</span>
                        <span className="text-3xl font-bold text-red-500">{stats?.atRiskCount || 0}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className={`${glassProps} p-6 h-80 flex flex-col items-center justify-center`}>
                    <h3 className="text-lg font-bold mb-4 w-full text-left">Campus Risk Distribution</h3>
                    <div className="w-full max-w-[250px]">
                        <Doughnut data={riskData} options={{ responsive: true, plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }} />
                    </div>
                </div>

                <div className={`${glassProps} p-6 overflow-y-auto h-80`}>
                    <h3 className="text-lg font-bold mb-4 text-red-400">Urgent Intervention Required</h3>
                    <div className="space-y-4">
                        {alerts.length > 0 ? alerts.map((alert) => (
                            <div key={alert._id || alert.id} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex flex-col">
                                <strong className="text-red-400 mb-1">{alert.title}</strong>
                                <span className="text-sm text-gray-300">{alert.message}</span>
                            </div>
                        )) : (
                            <div className="text-gray-500 h-full flex items-center justify-center">No active critical alerts campus-wide.</div>
                        )}
                    </div>
                </div>
            </div>

            <div className={`${glassProps} p-6`}>
                <h3 className="text-lg font-bold mb-4">Master Student Database</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400">
                                <th className="p-4 font-semibold">Student Name</th>
                                <th className="p-4 font-semibold">Year/Class</th>
                                <th className="p-4 font-semibold">Risk Level</th>
                                <th className="p-4 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.slice(0, 5).map(s => (
                                <tr key={s.id || s._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{s.name}</td>
                                    <td className="p-4 text-gray-400">{s.class || 'N/A'}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs border ${
                                            s.behaviorData?.behaviorClass === 'at-risk' 
                                            ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                                            : 'bg-green-500/20 text-green-400 border-green-500/30'
                                        }`}>
                                            {s.behaviorData?.behaviorClass || 'normal'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button onClick={() => setEditingStudent({...s, avatar: '👤'})} className="text-teal-400 hover:text-white bg-teal-500/20 hover:bg-teal-500 px-3 py-1.5 rounded-lg text-xs transition-colors">Manage Record</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Teacher/Admin Editing the Student Gamification Profile */}
            {editingStudent && (
                <div className="fixed inset-0 bg-[#0b0f19]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1b1c31] border border-[#2d2f4a] rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto p-6 shadow-2xl relative fade-in">
                        <button onClick={() => setEditingStudent(null)} className="absolute top-4 right-4 bg-[#272943] w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition-colors">✕</button>
                        
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2d2f4a]">
                            <div className="w-16 h-16 rounded-2xl bg-[#6653f5] flex items-center justify-center font-bold text-3xl shadow-[0_0_15px_rgba(102,83,245,0.5)]">{editingStudent.avatar}</div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Manage Student Profile: {editingStudent.name}</h2>
                                <p className="text-emerald-400 text-sm">Status: Excellent (87/100) • Active Streak: 12 days</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Form Column 1: Core Modifiers */}
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">🏅 Award Badges & Achievements</h3>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <button className="bg-[#272943] hover:bg-[#ff7b52]/20 border border-[#2d2f4a] hover:border-[#ff7b52] rounded-xl p-3 text-left transition-colors flex items-center gap-3">
                                            <span className="text-2xl">🏆</span> <div className="flex-1"><p className="text-sm text-white font-medium">Public Speaker</p><p className="text-[10px] text-gray-400">+50 XP / +10 Pts</p></div>
                                        </button>
                                        <button className="bg-[#272943] hover:bg-[#6653f5]/20 border border-[#2d2f4a] hover:border-[#6653f5] rounded-xl p-3 text-left transition-colors flex items-center gap-3">
                                            <span className="text-2xl">🌟</span> <div className="flex-1"><p className="text-sm text-white font-medium">Star Student</p><p className="text-[10px] text-gray-400">+100 XP / +20 Pts</p></div>
                                        </button>
                                    </div>
                                    <button onClick={() => handleLogAction('Badge Awarded')} className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors shadow-lg">Confirm Badge Award</button>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">📝 Log Daily Incident</h3>
                                    <select className="w-full bg-[#272943] border border-[#2d2f4a] text-white rounded-lg p-3 outline-none text-sm mb-3">
                                        <option>🟢 Positive Behavior (+10 pts)</option>
                                        <option>🟡 Minor Issue (-2 pts)</option>
                                        <option>🔴 Major Infraction (-10 pts)</option>
                                    </select>
                                    <textarea placeholder="Add faculty notes (e.g. Completed experiment early, good teamwork)..." className="w-full bg-[#272943] border border-[#2d2f4a] text-white rounded-lg p-3 outline-none text-sm h-24 resize-none mb-3"></textarea>
                                    <button onClick={() => handleLogAction('Incident Logged')} className="w-full py-2 bg-[#ff7b52] hover:bg-[#ff9877] rounded-lg text-sm font-semibold transition-colors shadow-lg">Log Timeline Event</button>
                                </div>
                            </div>

                            {/* Form Column 2: Dashboard Dimensions */}
                            <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a]">
                                <h3 className="text-lg font-semibold text-[#6653f5] mb-4">🕸️ Adjust Radar Dimensions</h3>
                                <p className="text-xs text-gray-400 mb-6">These sliders directly manipulate the student's multi-dimensional behavior map across the 5 core behavioral vectors.</p>
                                
                                <div className="space-y-5">
                                    {[
                                        { l: 'Class Participation', v: 90 },
                                        { l: 'Leadership', v: 85 },
                                        { l: 'Focus & Attention', v: 80 },
                                        { l: 'Discipline', v: 100 },
                                        { l: 'Social Skills', v: 93 }
                                    ].map((dim, idx) => (
                                        <div key={idx} className="flex flex-col">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="text-sm text-gray-300 font-medium">{dim.l}</label>
                                                <span className="text-xs font-mono text-emerald-400">{dim.v}%</span>
                                            </div>
                                            <input type="range" min="0" max="100" defaultValue={dim.v} className="w-full h-1 bg-[#272943] rounded-lg appearance-none cursor-pointer accent-[#6653f5]" />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-[#2d2f4a] flex gap-3">
                                    <button onClick={() => setEditingStudent(null)} className="flex-1 py-2.5 bg-transparent border border-[#6653f5] text-[#6653f5] hover:bg-[#6653f5]/10 rounded-lg text-sm font-bold transition-colors">Cancel</button>
                                    <button onClick={() => handleLogAction('Radar Metrics Updated')} className="flex-[2] py-2.5 bg-[#6653f5] hover:bg-indigo-500 rounded-lg text-white text-sm font-bold transition-colors shadow-lg">Save Profile Metrics</button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}

            <style>{`
                .fade-in { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default AdminPortal;
