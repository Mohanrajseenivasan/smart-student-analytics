import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="w-[260px] min-w-[260px] bg-[#1a1c29] border-r border-[#2d2f4a] flex flex-col h-full overflow-y-auto font-sans pt-6">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 mb-8 cursor-pointer">
                {/* Custom multi-color logo mimicking MingCute style but distinct */}
                <div className="flex bg-transparent">
                    <div className="w-2.5 h-6 bg-[#3B82F6] rounded-sm transform skew-y-12"></div>
                    <div className="w-2.5 h-6 bg-[#10B981] rounded-sm -ml-0.5 transform -skew-y-12"></div>
                    <div className="w-2.5 h-6 bg-[#F59E0B] rounded-sm -ml-0.5 transform skew-y-12"></div>
                </div>
                <span className="text-white font-bold text-xl tracking-wide">SmartBehavior</span>
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-8">
                <div className="bg-[#11131c] rounded-xl flex items-center px-4 py-2.5 border border-transparent focus-within:border-slate-700">
                    <span className="text-slate-500 text-lg mr-3">🔍</span>
                    <input
                        type="text"
                        placeholder="Search student..."
                        className="bg-transparent text-sm text-slate-300 outline-none w-full placeholder-slate-600"
                    />
                </div>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-1 px-4 flex-1">
                <Link to="/dashboard/overview" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors group ${location.pathname.includes('/overview') ? 'bg-[#1d7afe] text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-[#232738]'}`}>
                    <span className={`text-lg ${location.pathname.includes('/overview') ? 'text-white' : ''}`}>🏠</span>
                    <span className="font-semibold text-sm">Overview</span>
                </Link>

                {user?.role?.toLowerCase() !== 'student' && (
                    <Link to="/dashboard/directory" className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors cursor-pointer group ${location.pathname.includes('/directory') ? 'bg-[#1d7afe] text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-[#232738]'}`}>
                        <div className="flex items-center gap-4">
                            <span className={`text-lg ${location.pathname.includes('/directory') ? 'text-white' : ''}`}>👥</span>
                            <span className="font-semibold text-sm">Student Directory</span>
                        </div>
                    </Link>
                )}

                <Link to="/dashboard/logs" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer group ${location.pathname.includes('/logs') ? 'bg-[#1d7afe] text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-[#232738]'}`}>
                    <span className={`text-lg ${location.pathname.includes('/logs') ? 'text-white' : ''}`}>📝</span>
                    <span className="font-semibold text-sm">Behavior Logs</span>
                </Link>

                {user?.role?.toLowerCase() !== 'student' && (
                    <Link to="/dashboard/incidents" className={`flex items-center justify-between px-4 py-3 rounded-xl transition-colors cursor-pointer group ${location.pathname.includes('/incidents') ? 'bg-[#1d7afe] text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-[#232738]'}`}>
                        <div className="flex items-center gap-4 relative">
                            <span className="text-lg relative">
                                ⚠️
                                <span className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full border-2 border-[#1a1c29]"></span>
                            </span>
                            <span className="font-semibold text-sm">Incidents & Alerts</span>
                        </div>
                        <span className={`${location.pathname.includes('/incidents') ? 'bg-white/20 text-white' : 'bg-[#2a2d40] text-slate-400'} text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center`}>3</span>
                    </Link>
                )}

                <Link to="/dashboard/gamification" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer group mb-1 ${location.pathname.includes('/gamification') ? 'bg-[#1d7afe] text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-[#232738]'}`}>
                    <span className={`text-lg ${location.pathname.includes('/gamification') ? 'text-white' : ''}`}>🏅</span>
                    <span className="font-semibold text-sm">Gamification</span>
                </Link>

                <Link to="/dashboard/analytics" className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors cursor-pointer shadow-lg ${location.pathname.includes('/analytics') ? 'bg-[#1d7afe] text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-[#232738] shadow-none'}`}>
                    <span className={`text-lg ${location.pathname.includes('/analytics') ? 'text-white' : ''}`}>📈</span>
                    <span className="font-semibold text-sm">Performance Analytics</span>
                </Link>

                <Link to="/dashboard/settings" className={`flex items-center gap-4 px-4 py-3 mt-1 rounded-xl transition-colors cursor-pointer group ${location.pathname.includes('/settings') ? 'bg-[#1d7afe] text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-[#232738]'}`}>
                    <span className={`text-lg ${location.pathname.includes('/settings') ? 'text-white' : ''}`}>⚙️</span>
                    <span className="font-semibold text-sm">System Settings</span>
                </Link>
            </div>

            {/* Logout padding at bottom */}
            <div className="p-4 mt-auto border-t border-[#2d2f4a]/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <span className="text-lg relative -rotate-90">⏻</span>
                    <span className="font-semibold text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );
};

export default Navbar;
