import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler, RadialLinearScale
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, RadialLinearScale);

const cardBase = "bg-[#1E293B] bg-opacity-70 backdrop-blur-md border border-slate-700/50 rounded-2xl p-6 shadow-xl transition-all hover:bg-opacity-90";

const StudentPortal = ({ activeTab }) => {
    const { user } = useAuth();
    
    // Mock Data
    const radarData = {
        labels: ['Participation', 'Leadership', 'Focus', 'Discipline', 'Social Skills'],
        datasets: [
            { label: 'Your Score', data: [90, 85, 80, 100, 93], backgroundColor: 'rgba(99, 102, 241, 0.2)', borderColor: '#6366F1', borderWidth: 2 },
            { label: 'Class Average', data: [72, 65, 70, 85, 88], backgroundColor: 'rgba(100, 116, 139, 0.1)', borderColor: '#64748B', borderDash: [5, 5], borderWidth: 2 }
        ]
    };
    const radarOptions = { responsive: true, maintainAspectRatio: false, scales: { r: { ticks: { display: false, min: 0, max: 100 } } }, plugins: { legend: { position: 'bottom', labels: { color: '#F8FAFC' } } } };

    const trendData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{ label: 'Behavior Score', data: [60, 70, 80, 80, 90, 85, 87], borderColor: '#6366F1', backgroundColor: 'rgba(99, 102, 241, 0.1)', fill: true, tension: 0.4 }]
    };

    const renderOverview = () => (
        <div className="space-y-8 animate-fade-in">
            {/* OVERVIEW ADDITIONS: Mood, Motivation, Shortcut */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`${cardBase} flex items-center justify-between border border-blue-500/30 bg-blue-900/10`}>
                    <div>
                        <h4 className="text-sm font-bold text-blue-400 uppercase tracking-widest mb-2">Daily Check-in</h4>
                        <p className="text-sm text-slate-300">How are you feeling today?</p>
                    </div>
                    <div className="flex gap-2 text-2xl">
                        <button className="hover:scale-125 transition-transform opacity-50 hover:opacity-100">😫</button>
                        <button className="hover:scale-125 transition-transform opacity-50 hover:opacity-100">😕</button>
                        <button className="hover:scale-125 transition-transform opacity-50 hover:opacity-100">😐</button>
                        <button className="hover:scale-125 transition-transform opacity-100 scale-110 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">😊</button>
                        <button className="hover:scale-125 transition-transform opacity-50 hover:opacity-100">🤩</button>
                    </div>
                </div>

                <div className={`${cardBase} flex flex-col justify-center border border-purple-500/30 bg-purple-900/10`}>
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-1">Quote of the Day</h4>
                    <p className="text-sm text-slate-200 italic font-medium">"Success is not final, failure is not fatal: it is the courage to continue that counts."</p>
                </div>

                <div className={`${cardBase} flex items-center justify-between border border-emerald-500/30 bg-emerald-900/10`}>
                    <div>
                        <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Self-Report</h4>
                        <p className="text-xs text-slate-400">Did something great today?</p>
                    </div>
                    <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm font-bold shadow-lg transition-colors">
                        + Quick Log
                    </button>
                </div>
             </div>

            {/* HERO CARDS with Insights (vs last week) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`${cardBase} flex flex-col justify-center border-t-4 border-t-[#10B981]`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Behavior Score</span>
                        <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-4xl font-bold font-mono text-[#10B981]">87<span className="text-lg text-slate-500">/100</span></div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold w-fit">↑ +5 pts</span>
                        <span className="text-xs text-slate-500">vs last week (82)</span>
                    </div>
                </div>
                
                <div className={`${cardBase} flex flex-col justify-center border-t-4 border-t-[#F59E0B]`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Current Streak</span>
                        <span className="text-2xl">🔥</span>
                    </div>
                    <div className="text-4xl font-bold font-mono text-[#F59E0B]">12 <span className="text-lg text-slate-500 font-sans">days</span></div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-bold w-fit">↑ +3 days</span>
                        <span className="text-xs text-slate-500">vs last week (9)</span>
                    </div>
                </div>

                <div className={`${cardBase} flex flex-col justify-center border-t-4 border-t-[#6366F1]`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Experience Level</span>
                        <span className="text-2xl">⭐</span>
                    </div>
                    <div className="text-4xl font-bold font-mono text-[#6366F1]">8 <span className="text-lg text-slate-500 font-sans">Elite</span></div>
                    <div className="w-full bg-slate-700 h-2 rounded-full mt-3 overflow-hidden">
                        <div className="bg-[#6366F1] h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">850/1000 XP</p>
                </div>

                <div className={`${cardBase} flex flex-col justify-center border-t-4 border-t-[#EC4899]`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-slate-400 text-xs font-bold tracking-widest uppercase">Badges Unlocked</span>
                        <span className="text-2xl">🏆</span>
                    </div>
                    <div className="text-4xl font-bold font-mono text-[#EC4899]">15</div>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 text-xs font-bold w-fit">↑ +2 badges</span>
                        <span className="text-xs text-slate-500">vs last week</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`${cardBase} bg-gradient-to-br from-[#1E293B] to-[#2e1d5e]`}>
                    <h3 className="font-poppins font-bold text-xl mb-4 flex items-center gap-2"><span className="text-pink-400 animate-pulse">💡</span> AI Improvement Plan</h3>
                    <p className="text-sm text-slate-300 mb-6">Based on pattern analysis from the last 7 days.</p>
                    
                    <div className="space-y-4">
                        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
                            <h4 className="text-amber-400 font-bold mb-1">1. Punctuality (Score: 80/100)</h4>
                            <p className="text-xs text-slate-300 mb-2">Current: Late 2 times this week.</p>
                            <ul className="text-xs text-slate-400 list-disc pl-4 space-y-1">
                                <li>Set alarm 10 mins earlier</li>
                                <li>Prepare materials night before</li>
                            </ul>
                            <p className="text-xs text-emerald-400 mt-2 font-medium">Potential impact: +5 points</p>
                        </div>
                    </div>
                </div>

                <div className={`${cardBase}`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-emerald-400">✅</span> Personal Goals</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700">
                            <h4 className="font-semibold text-slate-200 text-sm mb-1">🎯 Reach 90+ Behavior Score</h4>
                            <p className="text-xs text-slate-400 mb-2">Current: 87 | Target: 90</p>
                            <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden mb-1"><div className="bg-emerald-500 w-[97%] h-full"></div></div>
                            <p className="text-[10px] text-right text-emerald-400">97% (15 days left)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderLogs = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl font-semibold">My Behavior Logs</h1>
                <div className="flex gap-3">
                    <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"><span>📅</span> Last 30 Days</button>
                    <button className="bg-[#6366F1] hover:bg-indigo-500 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-lg flex items-center gap-2"><span>📥</span> Export PDF</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. Daily Points Chart (Chart Addition) */}
                <div className={`${cardBase}`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-[#10B981]">📊</span> Daily Points</h3>
                    <div className="h-64 relative w-full flex items-end justify-between px-2 pb-6 border-b border-slate-700">
                        {/* Fake Bar Chart */}
                        {[30, 80, 45, 100, 60, 90, 75].map((h, i) => (
                            <div key={i} className="w-[10%] bg-gradient-to-t from-indigo-900 to-indigo-500 rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">+{h/5}</div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-slate-500">{'MTWTFSS'[i]}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Log History with Search */}
                <div className={`${cardBase}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-poppins font-bold text-xl flex items-center gap-2"><span className="text-indigo-400">⏱️</span> Log History</h3>
                        <div className="bg-slate-900/50 rounded-lg flex items-center px-3 py-1 border border-slate-700">
                            <span className="text-slate-500 text-xs mr-2">🔍</span>
                            <input type="text" placeholder="Search logs..." className="bg-transparent text-xs text-slate-300 outline-none w-24 placeholder-slate-600" />
                        </div>
                    </div>
                    
                    <div className="relative pl-4 space-y-6 border-l-2 border-slate-700 ml-2 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
                        {[
                            { t: 'Today, 8:00 AM', e: 'Arrived on time', n: 'Location: Main Gate', p: '+5 pts', icon: '✅', color: 'bg-[#10B981]' },
                            { t: 'Today, 9:00 AM', e: 'Mathematics Class - Excellent', n: 'Solved problem on board, 100% focus', p: '+10 pts', icon: '✅', color: 'bg-[#10B981]' },
                            { t: 'Yesterday', e: 'Lunch Break - Minor Issue', n: 'Stayed 5 mins late. Reminder: Watch time.', p: '-2 pts', icon: '⚠️', color: 'bg-[#F59E0B]' },
                            { t: 'Monday', e: 'English Class - Outstanding', n: 'Presented project. 🏆 Badge earned!', p: '+12 pts', icon: '✅', color: 'bg-[#10B981]' },
                        ].map((log, i) => (
                            <div key={i} className="relative pl-6">
                                <div className={`absolute -left-[1.6rem] top-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${log.color} shadow-lg ring-4 ring-[#1E293B]`}>{log.icon}</div>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-slate-200"><span className="text-slate-400 font-mono text-xs mr-2">{log.t}</span> {log.e}</h4>
                                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${log.p.includes('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{log.p}</span>
                                </div>
                                <p className="text-sm text-slate-400">{log.n}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderGamification = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Achievements & Gamification</h1>
                <button onClick={() => alert('LEVEL UP ANIMATION TRIGGERED! 🎉')} className="bg-pink-500/20 text-pink-400 border border-pink-500/50 hover:bg-pink-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all animate-pulse">Test Level Up 🎉</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* 1. Next Badge Tracker */}
                <div className={`${cardBase} flex flex-col`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-yellow-400">🎯</span> Next Badge Tracker</h3>
                    <div className="flex items-center gap-4 mb-4 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                        <div className="w-16 h-16 bg-slate-800 border-2 border-dashed border-slate-600 rounded-full flex items-center justify-center text-2xl opacity-50">👨‍🔬</div>
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-200">Science Whiz</h4>
                            <p className="text-xs text-slate-400">Participate 5 times in Science</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden mt-auto">
                        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 w-[80%] h-full relative">
                            <span className="absolute right-1 top-0 text-[8px] font-bold text-yellow-900 leading-[12px]">80%</span>
                        </div>
                    </div>
                    <p className="text-xs text-center mt-2 text-yellow-400">1 more participation needed!</p>
                </div>

                {/* 2. Weekly Challenges */}
                <div className={`${cardBase}`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-red-400">⚡</span> Weekly Challenges</h3>
                    <div className="space-y-3">
                        <div className="bg-slate-800 border border-emerald-500/30 p-3 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white">Perfect Attendance</span>
                                <span className="text-xs font-mono text-emerald-400">+500 XP</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden"><div className="bg-emerald-500 w-[70%] h-full"></div></div>
                            <p className="text-[10px] text-slate-400 mt-1">4 of 5 days</p>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl opacity-70 hover:opacity-100 transition-opacity">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white">Peer Helper</span>
                                <span className="text-xs font-mono text-indigo-400">+300 XP</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden"><div className="bg-indigo-500 w-[33%] h-full"></div></div>
                            <p className="text-[10px] text-slate-400 mt-1">1 of 3 helps</p>
                        </div>
                        <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl opacity-40">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white">Focus Master</span>
                                <span className="text-xs font-mono text-amber-400">+400 XP</span>
                            </div>
                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden"><div className="bg-amber-500 w-[0%] h-full"></div></div>
                        </div>
                    </div>
                </div>

                {/* 3. Anonymous Class Leaderboard */}
                <div className={`${cardBase} lg:row-span-2 flex flex-col`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-sky-400">👑</span> Class Leaderboard</h3>
                    <p className="text-xs text-slate-400 mb-4 px-2 bg-slate-900/50 py-2 rounded border border-slate-700">Names are anonymized for privacy.</p>
                    
                    <div className="flex-1 space-y-1">
                        {[
                            { rank: 1, name: 'Student 402', xp: '3,450', trend: 'up' },
                            { rank: 2, name: 'Student 11x', xp: '3,200', trend: 'same' },
                            { rank: 3, name: 'Student 99a', xp: '3,150', trend: 'up' },
                            { rank: 4, name: 'You', xp: '2,890', isYou: true, trend: 'up' },
                            { rank: 5, name: 'Student 88b', xp: '2,800', trend: 'down' },
                            { rank: 6, name: 'Student 71v', xp: '2,500', trend: 'same' },
                            { rank: 7, name: 'Student 33p', xp: '2,450', trend: 'down' },
                        ].map((u, i) => (
                            <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${u.isYou ? 'bg-indigo-600/30 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'hover:bg-slate-800'}`}>
                                <div className="flex items-center gap-3">
                                    <span className={`font-bold font-mono w-6 text-center ${u.rank <= 3 ? 'text-yellow-400' : 'text-slate-500'}`}>#{u.rank}</span>
                                    <span className={`text-sm font-semibold ${u.isYou ? 'text-white' : 'text-slate-300'}`}>{u.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-mono text-xs text-indigo-300">{u.xp} XP</span>
                                    <span className="w-4 text-center">
                                        {u.trend === 'up' && <span className="text-emerald-400 text-xs">▲</span>}
                                        {u.trend === 'down' && <span className="text-red-400 text-xs">▼</span>}
                                        {u.trend === 'same' && <span className="text-slate-600 text-xs">-</span>}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Badge Collection (Bottom Left Span) */}
                <div className={`${cardBase} lg:col-span-2`}>
                    <h3 className="font-poppins font-bold text-xl mb-4 flex items-center gap-2"><span className="text-purple-400">🏵️</span> Badge Collection (15/50)</h3>
                    <div className="grid grid-cols-6 md:grid-cols-8 gap-3">
                        {['🎯','⭐','📚','🤝','🔥','👑','💡','🌟','🎨','🎵','🏃‍♂️','🤝'].map((b,i) => (
                            <div key={i} className="aspect-square bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-slate-700/50 hover:border-indigo-500/50 transition-colors cursor-pointer group">
                                <span className="text-2xl group-hover:scale-110 transition-transform">{b}</span>
                            </div>
                        ))}
                        {Array.from({length: 4}).map((_,i) => (
                            <div key={`empty-${i}`} className="aspect-square bg-slate-900/50 rounded-xl flex items-center justify-center border border-slate-800 border-dashed">
                                <span className="text-slate-700">🔒</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const [showClassAvg, setShowClassAvg] = useState(true);

    const renderAnalytics = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Performance Details</h1>
                <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-xl border border-slate-700">
                    <span className="text-sm font-semibold text-slate-300">Compare Class Average</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={showClassAvg} onChange={() => setShowClassAvg(!showClassAvg)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subject Breakdown Bar Chart */}
                <div className={`${cardBase} flex flex-col`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-emerald-400">📚</span> Subject Breakdown</h3>
                    <div className="flex-1 flex flex-col gap-4">
                        {[
                            { s: 'Math', c: 85, a: 72 },
                            { s: 'Science', c: 92, a: 75 },
                            { s: 'English', c: 78, a: 80 },
                            { s: 'History', c: 88, a: 76 }
                        ].map((sub, i) => (
                            <div key={i} className="flex-1 w-full">
                                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                                    <span>{sub.s}</span>
                                    <span>{sub.c}%</span>
                                </div>
                                <div className="h-4 w-full bg-slate-800 rounded-full relative overflow-hidden group">
                                    <div className={`absolute top-0 bottom-0 left-0 bg-emerald-500 transition-all ${sub.c < sub.a ? 'bg-amber-500' : ''}`} style={{width: `${sub.c}%`}}></div>
                                    {showClassAvg && (
                                        <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_5px_white] z-10" style={{left: `${sub.a}%`}}></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Prediction Forecast Line */}
                <div className={`${cardBase} bg-gradient-to-br from-[#1E293B] to-slate-800/80`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-indigo-400">🤖</span> AI Goal Forecast</h3>
                    <div className="flex items-end gap-6 mb-4">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Target Score</p>
                            <h4 className="text-3xl font-mono font-bold text-white">95<span className="text-lg text-slate-500">/100</span></h4>
                        </div>
                        <div className="bg-indigo-500/20 border border-indigo-500/30 px-3 py-1.5 rounded-lg mb-1">
                            <p className="text-xs font-bold text-indigo-300">Projected: Oct 15</p>
                        </div>
                    </div>
                    {/* Fake Forecast Line Chart */}
                    <div className="h-32 relative border-b border-l border-slate-700/50 mt-4 flex items-end">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                            <path d="M0,40 Q25,35 50,20 T100,5" fill="none" stroke="#6366F1" strokeWidth="2" strokeDasharray="4" />
                            <path d="M0,40 Q25,35 50,20" fill="none" stroke="#10B981" strokeWidth="3" />
                            <circle cx="50" cy="20" r="3" fill="white" />
                            <circle cx="100" cy="5" r="3" fill="#6366F1" />
                        </svg>
                        <span className="absolute bottom-[-20px] left-[50%] -translate-x-[50%] text-[10px] text-emerald-400 font-bold">Today</span>
                        <span className="absolute bottom-[-20px] right-0 text-[10px] text-indigo-400 font-bold">Goal Date</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 🕸️ Dimension Analysis (Radar) */}
                <div className={`${cardBase}`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-pink-400">🕸️</span> Dimension Analysis</h3>
                    <div className="h-64 relative w-full">
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                </div>

                {/* Teacher Feedback Notes Panel */}
                <div className={`${cardBase}`}>
                    <h3 className="font-poppins font-bold text-xl mb-6 flex items-center gap-2"><span className="text-amber-400">📝</span> Pinned Teacher Feedback</h3>
                    <div className="space-y-4">
                        <div className="bg-[#B45309]/10 border-l-4 border-[#F59E0B] p-4 rounded-r-xl">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-white">Focus requires attention</span>
                                <span className="text-xs text-slate-500 font-mono">Mr. Smith • 2d ago</span>
                            </div>
                            <p className="text-xs text-slate-300">Great participation, but struggled to stay focused during silent reading block.</p>
                            <span className="mt-2 inline-block px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] uppercase font-bold border border-slate-700">Linked: Focus Metric</span>
                        </div>
                        <div className="bg-[#10B981]/10 border-l-4 border-[#10B981] p-4 rounded-r-xl">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-sm font-bold text-white">Outstanding Group Work</span>
                                <span className="text-xs text-slate-500 font-mono">Mrs. Davis • 5d ago</span>
                            </div>
                            <p className="text-xs text-slate-300">Helped a peer finish their science project unprompted. Excellent leadership!</p>
                            <span className="mt-2 inline-block px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[10px] uppercase font-bold border border-slate-700">Linked: Social Skills</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-2xl font-semibold mb-6">My Settings</h1>
            <div className={`${cardBase} p-8`}>
                <h3 className="text-md font-semibold text-white mb-4">👤 Profile Information</h3>
                <div className="space-y-4">
                    <input type="text" defaultValue={user?.name || "Student User"} className="bg-slate-900 border border-slate-700 text-sm text-white rounded-xl px-4 py-3 w-full outline-none focus:border-indigo-500" />
                    <input type="email" defaultValue={user?.email || "student@school.edu"} className="bg-slate-900 border border-slate-700 text-sm text-white rounded-xl px-4 py-3 w-full outline-none focus:border-indigo-500" />
                </div>
                
                <h3 className="text-md font-semibold text-white mb-4 mt-8">🔔 Notification Preferences</h3>
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
                        <span className="text-sm text-gray-300">Email me when my weekly report is ready</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-indigo-500" />
                        <span className="text-sm text-gray-300">Push notification for streak resets</span>
                    </label>
                </div>

                <h3 className="text-md font-semibold text-red-400 mb-4 mt-8 flex items-center gap-2"><span>🔐</span> Security</h3>
                <button className="bg-red-500/10 border border-red-500/30 text-red-500 px-6 py-2 rounded-xl text-sm font-semibold transition-colors">Reset Password</button>
            </div>
        </div>
    );

    const renderRestricted = () => (
        <div className="flex flex-col items-center justify-center p-20 text-center animate-fade-in">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
            <p className="text-slate-400 max-w-md">The directory and incidents tracker contain protected student data and are only accessible by administrative and teaching staff.</p>
        </div>
    );

    const renderActiveView = () => {
        switch (activeTab) {
            case 'logs': return renderLogs();
            case 'gamification': return renderGamification();
            case 'analytics': return renderAnalytics();
            case 'settings': return renderSettings();
            case 'directory':
            case 'incidents':
                return renderRestricted();
            case 'overview':
            default: return renderOverview();
        }
    };

    return (
        <div className="text-[#F8FAFC] font-sans pb-16 w-full max-w-[1600px] mx-auto p-4 lg:p-8 space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-slate-700/50 pb-6">
                <div>
                    <h1 className="text-4xl font-bold font-poppins mb-2">Welcome back, {user?.name || 'Student'}! 👋</h1>
                    <p className="text-slate-400">Your personalized behavior and performance analytics dashbaord.</p>
                </div>
            </header>

            {renderActiveView()}

            <style>{`
                .animate-fade-in { animation: fadeIn 0.3s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
};

export default StudentPortal;
