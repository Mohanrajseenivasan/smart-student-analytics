import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const TeacherPortal = ({ activeTab }) => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState(null);
    const [showAddLogModal, setShowAddLogModal] = useState(false);

    // --- INTERACTIVE STATE ---
    const [students, setStudents] = useState([
        { id: 'STU101', name: 'Nate Jacobs', avatar: '👨‍🦱', class: 'Grade 10A', score: 85, status: 'Active' },
        { id: 'STU102', name: 'Jim Halpert', avatar: '👨‍🦲', class: 'Grade 10B', score: 92, status: 'Active' },
        { id: 'STU103', name: 'Angela Martin', avatar: '👩', class: 'Grade 10A', score: 55, status: 'Risk' },
        { id: 'STU104', name: 'Alex Russo', avatar: '🧔', class: 'Grade 9B', score: 48, status: 'Risk' }
    ]);

    const [logs, setLogs] = useState([
        { id: 1, name: 'Nate Jacobs', date: '2026-05-14 09:30 AM', type: 'Participation', desc: 'Participated in class discussion', impact: '+5', color: 'text-green-400' },
        { id: 2, name: 'Angela Martin', date: '2026-05-14 11:15 AM', type: 'Discipline', desc: 'Late submission of math assignment', impact: '-10', color: 'text-red-400' },
        { id: 3, name: 'Jim Halpert', date: '2026-05-13 14:00 PM', type: 'Teamwork', desc: 'Helped teammate with project', impact: '+15', color: 'text-green-400' }
    ]);

    const [incidents, setIncidents] = useState([
        { id: 1, type: 'Misbehavior', details: 'Continuous disruption during science block', priority: 'High', priorityColor: '🔴', status: 'Open' },
        { id: 2, type: 'Low Attendance', details: 'Missed 3 consecutive days without excuse', priority: 'Medium', priorityColor: '🟡', status: 'Open' },
        { id: 3, type: 'Low Performance', details: 'Score dropped 20% in one week', priority: 'High', priorityColor: '🔴', status: 'Resolved' }
    ]);

    useEffect(() => {
        // Attempt to load from DB, fallback to UI mock data on fail
        dashboardAPI.getStudents()
            .then(res => {
                if(res.data.data && res.data.data.length > 0) {
                    setStudents(res.data.data.map(s => ({
                        id: s.id || `STU${Math.floor(Math.random()*1000)}`,
                        name: s.name,
                        avatar: '👤',
                        class: s.class || 'Unknown',
                        score: s.behaviorScore || 75,
                        status: s.behaviorScore < 60 ? 'Risk' : 'Active'
                    })));
                }
            }).catch(e => console.log('Mocking backend for now', e)).finally(() => setLoading(false));
    }, []);

    const handleAddNewLog = (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        const parsedImpact = parseInt(data.impact);

        const newLog = {
            id: Date.now(),
            name: data.studentName,
            date: new Date().toLocaleString(),
            type: data.type,
            desc: data.desc,
            impact: parsedImpact > 0 ? `+${parsedImpact}` : `${parsedImpact}`,
            color: parsedImpact > 0 ? 'text-green-400' : 'text-red-400'
        };

        setLogs([newLog, ...logs]);
        
        // Find student and update score
        setStudents(students.map(stu => {
            if (stu.name === data.studentName) {
                const newScore = Math.max(0, Math.min(100, stu.score + parsedImpact));
                return { ...stu, score: newScore, status: newScore < 60 ? 'Risk' : 'Active' };
            }
            return stu;
        }));

        setShowAddLogModal(false);
    };

    const handleLogAction = (actionType) => {
        if(actionType === 'Add Quick Behavior Log') {
            setShowAddLogModal(true);
        } else {
            alert(`${actionType} successfully generated.`);
        }
    };

    // --- SUB VIEW RENDERERS ---

    const renderOverview = () => {
        const miniChartData = {
            labels: ['M', 'T', 'W', 'T', 'F'],
            datasets: [{
                data: [65, 70, 68, 75, 82],
                borderColor: '#10B981',
                borderWidth: 2,
                tension: 0.4,
                pointRadius: 0
            }]
        };

        return (
            <div className="flex flex-col gap-8 animate-fade-in">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-semibold mb-1">Dashboard Home</h1>
                        <p className="text-sm text-gray-400">Welcome back! Here's your summary.</p>
                    </div>
                    {/* AI Insight */}
                    <div className="bg-[#6653f5]/10 border border-[#6653f5]/30 text-[#6653f5] px-4 py-3 rounded-xl flex items-center gap-3">
                        <span className="text-xl">💡</span>
                        <p className="text-sm font-semibold">AI Insight: <span className="font-normal text-white">Your focus dropped today by 12%</span></p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {/* Behavior Score */}
                    <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] shadow-lg flex flex-col justify-between">
                        <p className="text-sm text-gray-400 font-medium mb-2">📊 Behavior Score</p>
                        <h4 className="text-4xl font-bold text-white mb-2">85<span className="text-lg text-gray-400 font-normal">/100</span></h4>
                        <div className="w-full bg-[#1b1c31] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#10B981] h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                        </div>
                    </div>

                    {/* Current Streak */}
                    <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] shadow-lg flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 text-8xl opacity-10">🔥</div>
                        <p className="text-sm text-gray-400 font-medium mb-2">🔥 Current Streak</p>
                        <h4 className="text-4xl font-bold text-orange-400 mb-2">12 Days</h4>
                        <p className="text-xs text-orange-300/80 font-medium bg-orange-400/10 inline-block px-2 py-1 rounded w-fit">Top 10% in class</p>
                    </div>

                    {/* Level / XP progress */}
                    <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] shadow-lg flex flex-col justify-between relative">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm text-gray-400 font-medium">⭐ Level / XP</p>
                            <span className="text-xl">🏅 4 Badges</span>
                        </div>
                        <h4 className="text-2xl font-bold text-white mb-1"><span className="text-[#6653f5]">Lvl 4</span> Novice</h4>
                        <p className="text-xs text-gray-400 mb-2">2,450 / 3,000 XP</p>
                        <div className="w-full bg-[#1b1c31] h-2 rounded-full overflow-hidden">
                            <div className="bg-[#6653f5] h-full w-[82%] rounded-full shadow-[0_0_10px_rgba(102,83,245,0.5)]"></div>
                        </div>
                    </div>

                    {/* Mini performance chart */}
                    <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] shadow-lg flex flex-col justify-between">
                        <p className="text-sm text-gray-400 font-medium mb-2">📈 Performance Trend</p>
                        <div className="h-16 w-full mt-2">
                            <Line data={miniChartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } } }} />
                        </div>
                    </div>
                </div>

                {/* Recent Alerts */}
                <div className="bg-[#22243a] rounded-2xl border border-[#2d2f4a] p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2">⚠️ Recent Alerts</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4 bg-[#1b1c31] p-4 rounded-xl border border-red-500/20">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                            <span className="text-white text-sm font-medium flex-1">Low attention detected during Mathematics block</span>
                            <span className="text-xs text-gray-500">2 hrs ago</span>
                        </div>
                        <div className="flex items-center gap-4 bg-[#1b1c31] p-4 rounded-xl border border-yellow-500/20">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_#eab308]"></div>
                            <span className="text-white text-sm font-medium flex-1">Assignment submission is nearing deadline</span>
                            <span className="text-xs text-gray-500">Yesterday</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDirectory = () => (
        <div className="flex flex-col gap-6 animate-fade-in">
            <h1 className="text-2xl font-semibold">Student Directory</h1>
            
            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <div className="flex-1 bg-[#22243a] rounded-xl flex items-center px-4 py-2 border border-[#2d2f4a]">
                    <span className="text-gray-400 mr-2">🔍</span>
                    <input type="text" placeholder="Search by name or Roll No..." className="bg-transparent border-none text-sm text-white w-full outline-none" />
                </div>
                <select className="bg-[#22243a] border border-[#2d2f4a] text-sm text-gray-300 rounded-xl px-4 py-2 outline-none">
                    <option>All Classes</option>
                    <option>Grade 9</option>
                    <option>Grade 10</option>
                </select>
                <select className="bg-[#22243a] border border-[#2d2f4a] text-sm text-gray-300 rounded-xl px-4 py-2 outline-none">
                    <option>Score Range (All)</option>
                    <option>Above 80</option>
                    <option>Below 60</option>
                </select>
                <select className="bg-[#22243a] border border-[#2d2f4a] text-sm text-gray-300 rounded-xl px-4 py-2 outline-none">
                    <option>All Risks</option>
                    <option>🟢 Normal</option>
                    <option>🔴 At Risk</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-[#22243a] rounded-2xl border border-[#2d2f4a] overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[#272943] text-gray-400 border-b border-[#2d2f4a]">
                        <tr>
                            <th className="px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Roll No</th>
                            <th className="px-6 py-4 font-medium">Class</th>
                            <th className="px-6 py-4 font-medium">Behavior Score</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2d2f4a]">
                        {students.map((stu) => (
                            <tr key={stu.id} className="hover:bg-[#2d2f4a]/50 transition-colors">
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#1b1c31] flex items-center justify-center text-lg">{stu.avatar}</div>
                                    <span className="font-semibold text-white">{stu.name}</span>
                                </td>
                                <td className="px-6 py-4 text-gray-400 font-mono text-xs">{stu.id}</td>
                                <td className="px-6 py-4 text-gray-300">{stu.class}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-full bg-[#1b1c31] h-1.5 rounded-full overflow-hidden w-24">
                                            <div className={`h-full ${stu.score < 60 ? 'bg-red-500' : 'bg-[#10B981]'}`} style={{ width: `${stu.score}%` }}></div>
                                        </div>
                                        <span className="text-gray-300 text-xs font-semibold">{stu.score}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${stu.status === 'Active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {stu.status === 'Active' ? 'Good' : 'Warning'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => setEditingStudent(stu)} className="text-xs text-[#6653f5] hover:text-white font-semibold bg-[#6653f5]/10 hover:bg-[#6653f5] px-3 py-1.5 rounded-lg transition-colors border border-[#6653f5]/30 hover:border-transparent">View Profile</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderLogs = () => (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Behavior Logs</h1>
                <button onClick={() => setShowAddLogModal(true)} className="bg-[#6653f5] hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg">+ Log New Entry</button>
            </div>

            <div className="flex gap-4 mb-2">
                <input type="date" className="bg-[#22243a] border border-[#2d2f4a] text-sm text-gray-300 rounded-xl px-4 py-2 outline-none" />
                <select className="bg-[#22243a] border border-[#2d2f4a] text-sm text-gray-300 rounded-xl px-4 py-2 outline-none">
                    <option>Filter by Student</option>
                    <option>Nate Jacobs</option>
                    <option>Jim Halpert</option>
                </select>
                <select className="bg-[#22243a] border border-[#2d2f4a] text-sm text-gray-300 rounded-xl px-4 py-2 outline-none">
                    <option>All Behavior Types</option>
                    <option>Participation</option>
                    <option>Discipline</option>
                </select>
            </div>

            <div className="bg-[#22243a] rounded-2xl border border-[#2d2f4a] p-6 flex flex-col gap-4">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-center gap-6 p-4 rounded-xl bg-[#1b1c31] border border-[#2d2f4a] hover:border-[#6653f5]/50 transition-colors relative shadow-sm">
                        <div className={`text-xl font-bold ${log.color} w-10 text-center bg-[#272943] py-2 rounded-lg`}>{log.impact}</div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-white">{log.desc} <span className="text-xs px-2 py-0.5 rounded bg-[#272943] text-gray-400 ml-2 font-normal border border-[#2d2f4a]">{log.type}</span></h4>
                            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-2">
                                <span>👨‍🎓 <span className="text-blue-300 font-medium">{log.name}</span></span>
                                <span className="text-[#2d2f4a]">•</span>
                                <span className="font-mono">{log.date}</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderIncidents = () => (
        <div className="flex flex-col gap-6 animate-fade-in">
            <h1 className="text-2xl font-semibold flex items-center gap-3">Incidents & Alerts <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-[0_0_10px_rgba(239,68,68,0.5)]">3 Active</span></h1>

            <div className="grid grid-cols-1 gap-4">
                {incidents.map((inc) => (
                    <div key={inc.id} className={`flex items-center gap-6 p-5 rounded-2xl border transition-all ${inc.status === 'Resolved' ? 'bg-[#1b1c31]/50 border-[#2d2f4a] opacity-60' : 'bg-[#22243a] border-red-500/30 hover:border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]'}`}>
                        <div className="text-3xl bg-[#1b1c31] w-12 h-12 flex items-center justify-center rounded-full border border-[#2d2f4a]">{inc.priorityColor}</div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1.5">
                                <h4 className={`font-semibold ${inc.status === 'Resolved' ? 'line-through text-gray-500' : 'text-white'}`}>{inc.details}</h4>
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${inc.priority==='High' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'}`}>Priority: {inc.priority}</span>
                            </div>
                            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">{inc.type}</p>
                        </div>
                        <div>
                            {inc.status === 'Open' ? (
                                <button onClick={() => handleLogAction('Resolved Incident')} className="bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:text-green-300 border border-green-500/30 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm">✓ Resolve</button>
                            ) : (
                                <span className="text-gray-500 text-sm font-semibold flex items-center gap-1 bg-[#1b1c31] px-4 py-2 rounded-xl border border-[#2d2f4a]">✓ Resolved</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderGamification = () => (
        <div className="flex flex-col gap-6 animate-fade-in">
            <h1 className="text-2xl font-semibold">Gamification Engine</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] shadow-lg">
                    <h3 className="text-lg font-medium mb-6 flex items-center gap-2">🏅 Badges & Points</h3>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-[#1b1c31] p-4 rounded-xl border border-yellow-500/30 hover:border-yellow-500/80 transition-colors shadow-[0_0_15px_rgba(234,179,8,0.1)] group flex flex-col items-center justify-center text-center">
                            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">🌟</span>
                            <h4 className="text-sm font-semibold text-white">Top Performer</h4>
                            <p className="text-xs text-yellow-500/80 mt-1">Earned 2x</p>
                        </div>
                        <div className="bg-[#1b1c31] p-4 rounded-xl border border-blue-500/30 hover:border-blue-500/80 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.1)] group flex flex-col items-center justify-center text-center">
                            <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📚</span>
                            <h4 className="text-sm font-semibold text-white">Consistent Learner</h4>
                            <p className="text-xs text-blue-400/80 mt-1">Earned 1x</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-[#2d2f4a]">
                        <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-semibold text-white">Next Badge Unlock: <span className="font-normal text-gray-400">'Class Leader'</span></p>
                            <span className="text-xs text-[#6653f5] font-bold">80%</span>
                        </div>
                        <div className="w-full bg-[#1b1c31] h-3 rounded-full overflow-hidden border border-[#2d2f4a]">
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full w-[80%] rounded-full relative">
                                {/* Shimmer effect */}
                                <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 text-right tracking-widest uppercase">80% to next badge</p>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] shadow-lg flex-1">
                        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">🔥 Streak Tracker</h3>
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 flex items-center justify-center">
                                <svg className="absolute w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="#1b1c31" strokeWidth="8" fill="none" />
                                    <circle cx="48" cy="48" r="40" stroke="#f6ad55" strokeWidth="8" fill="none" strokeDasharray="250" strokeDashoffset="50" className="drop-shadow-[0_0_10px_rgba(246,173,85,0.8)]" />
                                </svg>
                                <span className="text-3xl drop-shadow-[0_0_8px_rgba(246,173,85,0.8)]">🔥</span>
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">12 Days</h4>
                                <p className="text-sm text-gray-400">Perfect attendance & focus streak</p>
                                <p className="text-xs text-orange-400 font-semibold mt-2">Personal Best: 14 Days</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] shadow-lg flex-1">
                        <h3 className="text-lg font-medium mb-6 flex items-center gap-2">🥇 Leaderboard</h3>
                        <div className="flex flex-col gap-3">
                            {['Nate Jacobs (1,240 pts)', 'Jim Halpert (1,150 pts)', 'Pam Beesly (1,080 pts)'].map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-[#1b1c31] rounded-xl border border-[#2d2f4a] hover:border-[#6653f5]/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm bg-[#272943] shadow-sm ${i===0?'text-yellow-400 border border-yellow-500/30' : i===1?'text-gray-300' : 'text-[#cd7f32]'}`}>#{i+1}</span>
                                        <span className="text-sm text-white font-medium">{p.split('(')[0].trim()}</span>
                                    </div>
                                    <span className="text-xs text-[#6653f5] font-mono bg-[#6653f5]/10 px-2 py-1 rounded border border-[#6653f5]/20">{p.split('(')[1].replace(')','')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAnalytics = () => {
        const lineData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
            datasets: [
                { label: 'Class Avg', data: [75, 78, 76, 80, 82], borderColor: '#6653f5', tension: 0.4 },
                { label: 'Student Target', data: [70, 72, 75, 85, 88], borderColor: '#f6ad55', tension: 0.4 }
            ]
        };

        return (
            <div className="flex flex-col gap-6 animate-fade-in w-full">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold">Deep Performance Analytics</h1>
                    <div className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                        <span>🤖</span> Predictive AI: Expected score next exam 78%
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                    <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] flex flex-col h-full">
                        <h3 className="text-lg font-medium mb-4">Subject-wise Trends (vs Class)</h3>
                        <div className="flex-1 relative w-full h-full min-h-0">
                            <Line data={lineData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                    
                    <div className="bg-[#22243a] p-6 rounded-2xl border border-[#2d2f4a] flex flex-col h-full">
                        <h3 className="text-lg font-medium mb-4">Behavior Heatmap Matrix</h3>
                        <div className="flex-1 bg-[#1b1c31] rounded-xl border border-[#2d2f4a] overflow-hidden flex flex-col">
                            {/* Fake Heatmap Grid */}
                            <div className="flex justify-between px-4 py-2 bg-[#272943] text-xs text-gray-400 font-medium">
                                <span>Categories</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                            </div>
                            <div className="flex-1 flex flex-col p-2 gap-1 justify-center">
                                {['Focus', 'Discipline', 'Social', 'Participation'].map((cat, i) => (
                                    <div key={i} className="flex justify-between items-center px-2 py-1">
                                        <span className="text-xs text-gray-300 w-24">{cat}</span>
                                        <div className="w-6 h-6 bg-green-500/80 rounded-sm"></div>
                                        <div className="w-6 h-6 bg-green-500/60 rounded-sm"></div>
                                        <div className="w-6 h-6 bg-yellow-500/80 rounded-sm"></div>
                                        <div className="w-6 h-6 bg-red-500/80 rounded-sm"></div>
                                        <div className="w-6 h-6 bg-green-500/90 rounded-sm"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderSettings = () => (
        <div className="flex flex-col gap-6 animate-fade-in max-w-2xl">
            <h1 className="text-2xl font-semibold">System Settings</h1>
            
            <div className="bg-[#22243a] rounded-2xl border border-[#2d2f4a] overflow-hidden divide-y divide-[#2d2f4a]">
                <div className="p-6">
                    <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2"><span>👤</span> Profile Settings</h3>
                    <div className="flex gap-4">
                        <input type="text" placeholder="Admin Name" defaultValue="Mr. Principal" className="bg-[#1b1c31] border border-[#2d2f4a] text-sm text-white rounded-xl px-4 py-3 flex-1 outline-none focus:border-[#6653f5]" />
                        <input type="email" placeholder="Email" defaultValue="admin@school.edu" className="bg-[#1b1c31] border border-[#2d2f4a] text-sm text-white rounded-xl px-4 py-3 flex-1 outline-none focus:border-[#6653f5]" />
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2"><span>🔔</span> Notification Preferences</h3>
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#6653f5]" />
                            <span className="text-sm text-gray-300">Email alerts for High Priority incidents</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#6653f5]" />
                            <span className="text-sm text-gray-300">Push notifications for AI performance drop detection</span>
                        </label>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-md font-semibold text-white mb-4 flex items-center gap-2"><span>🎨</span> UI Settings</h3>
                    <div className="flex gap-4">
                        <button className="bg-[#1b1c31] border border-[#6653f5] text-[#6653f5] px-6 py-2 rounded-xl text-sm font-semibold">Dark Mode (Active)</button>
                        <button className="bg-[#1b1c31] border border-[#2d2f4a] text-gray-400 hover:text-white px-6 py-2 rounded-xl text-sm font-semibold transition-colors">Light Theme</button>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-md font-semibold text-red-400 mb-4 flex items-center gap-2"><span>🔐</span> Security</h3>
                    <button className="bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500/20 px-6 py-2 rounded-xl text-sm font-semibold transition-colors">Reset Account Password</button>
                </div>
            </div>
        </div>
    );

    // --- MAIN RENDER ROUTER ---
    const renderActiveView = () => {
        switch (activeTab) {
            case 'directory': return renderDirectory();
            case 'logs': return renderLogs();
            case 'incidents': return renderIncidents();
            case 'gamification': return renderGamification();
            case 'analytics': return renderAnalytics();
            case 'settings': return renderSettings();
            case 'overview':
            default: return renderOverview();
        }
    };

    return (
        <div className="bg-[#1b1c31] min-h-full font-sans text-white p-4 lg:p-8 rounded-2xl w-full flex flex-col box-border">
            {renderActiveView()}

            {/* Modal Overlay for Student Edits (Accessible from Directory Tab) */}
            {editingStudent && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1b1c31] border border-[#2d2f4a] rounded-2xl w-full max-w-lg overflow-y-auto p-6 shadow-2xl relative animate-fade-in">
                        <button onClick={() => setEditingStudent(null)} className="absolute top-4 right-4 bg-[#272943] w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition-colors">✕</button>
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2d2f4a]">
                            <div className="w-16 h-16 rounded-2xl bg-[#6653f5] flex items-center justify-center font-bold text-3xl shadow-[0_0_15px_rgba(102,83,245,0.5)]">{editingStudent.avatar}</div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Full Profile: {editingStudent.name}</h2>
                                <p className="text-indigo-400 text-sm">Status: {editingStudent.status} • Score: {editingStudent.score}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <button onClick={() => handleLogAction('Add Behavior Log')} className="w-full py-3 bg-[#272943] hover:bg-[#333652] rounded-xl text-sm font-semibold transition-colors flex justify-center gap-2 border border-[#2d2f4a]">📝 Add Quick Behavior Log</button>
                            <button onClick={() => handleLogAction('Generate Detailed Report')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition-colors flex justify-center gap-2 shadow-lg">📊 Download Custom Report</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Overlay for Adding Behavior Log */}
            {showAddLogModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1b1c31] border border-[#2d2f4a] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-fade-in">
                        <button onClick={() => setShowAddLogModal(false)} className="absolute top-4 right-4 bg-[#272943] w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-white transition-colors">✕</button>
                        <h2 className="text-xl font-bold text-white mb-6">📝 Add Quick Behavior Log</h2>
                        
                        <form onSubmit={handleAddNewLog} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Select Student</label>
                                <select name="studentName" required defaultValue={editingStudent?.name || ''} className="w-full bg-[#22243a] border border-[#2d2f4a] text-sm text-white rounded-xl px-4 py-3 outline-none">
                                    <option value="" disabled>Select a student...</option>
                                    {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.class})</option>)}
                                </select>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Behavior Type</label>
                                    <select name="type" required className="w-full bg-[#22243a] border border-[#2d2f4a] text-sm text-white rounded-xl px-4 py-3 outline-none">
                                        <option value="Participation">Participation</option>
                                        <option value="Discipline">Discipline</option>
                                        <option value="Teamwork">Teamwork</option>
                                        <option value="Focus">Focus</option>
                                        <option value="Misbehavior">Misbehavior</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Score Impact</label>
                                    <select name="impact" required className="w-full bg-[#22243a] border border-[#2d2f4a] text-sm text-white rounded-xl px-4 py-3 outline-none">
                                        <option value="5">+5 (Good)</option>
                                        <option value="10">+10 (Excellent)</option>
                                        <option value="15">+15 (Outstanding)</option>
                                        <option value="-5">-5 (Minor Issue)</option>
                                        <option value="-10">-10 (Warning)</option>
                                        <option value="-15">-15 (Critical)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description / Notes</label>
                                <input type="text" name="desc" required placeholder="e.g. Skipped class, helped teammate..." className="w-full bg-[#22243a] border border-[#2d2f4a] text-sm text-white rounded-xl px-4 py-3 outline-none" />
                            </div>

                            <button type="submit" className="w-full py-3 mt-4 bg-[#6653f5] hover:bg-indigo-500 rounded-xl text-sm font-semibold text-white transition-colors shadow-lg">Submit & Update Score</button>
                        </form>
                    </div>
                </div>
            )}
            
            <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default TeacherPortal;
