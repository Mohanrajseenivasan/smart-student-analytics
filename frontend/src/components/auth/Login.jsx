import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [selectedRole, setSelectedRole] = useState('Admin');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    // Changed role updates the visual UI but not the form data
    useEffect(() => {
        // Optional role-change clear: setFormData({ email: '', password: '' });
    }, [selectedRole]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login({ email: formData.email, password: formData.password });

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex text-white bg-[#0F172A]">
            {/* Left Sidebar */}
            <div className="w-full lg:w-96 bg-[#1b1c31] border-r border-[#2d2f4a] p-8 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-16">
                        <div className="w-10 h-10 bg-[#1b1c31] border-2 border-[#f6ad55] rounded-full flex items-center justify-center p-1 shadow-[0_0_15px_rgba(246,173,85,0.4)]">
                            <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-transparent border-b-[#f6ad55]"></div>
                        </div>
                        <div>
                            <h1 className="font-bold text-xl leading-tight text-white">SmartBehavior</h1>
                            <span className="text-gray-400 text-xs">Student Intelligence System</span>
                        </div>
                    </div>

                    <div className="mb-12 border-l-2 border-[#6366F1] pl-6">
                        <h2 className="text-3xl font-semibold mb-4 text-white">Monitor.<br/>Support.<br/><span className="text-[#6366F1]">Celebrate.</span></h2>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            A unified analytical platform for tracking student behavioral vectors, incidents, and achievements.
                        </p>
                    </div>

                    <div className="flex-1 mt-8">
                        <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">Select Portal</h3>
                        <div className="space-y-3">
                            {['Admin', 'Teacher', 'Student', 'Parent'].map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                                        selectedRole === role
                                            ? 'border-[#6366F1] bg-[#6366F1]/10'
                                            : 'border-[#2d2f4a] bg-[#272943] hover:bg-[#2d2f4a] text-gray-400'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${selectedRole === role ? 'bg-[#6366F1] shadow-[0_0_8px_#6366f1]' : 'bg-gray-600'}`}></div>
                                        <span className={selectedRole === role ? 'text-white font-medium' : ''}>{role}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${selectedRole === role ? 'bg-[#6366F1]/20 text-[#6366F1]' : 'bg-transparent text-gray-500'}`}>
                                        {role === 'Admin' ? 'System' : role === 'Teacher' ? 'Class' : role === 'Student' ? 'Personal' : 'Guardian'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 bg-[#0F172A] relative flex flex-col justify-center items-center p-8 overflow-hidden">
                {/* Decorative background blurs matching dashboard */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[100px]"></div>

                <div className="w-full max-w-md bg-[#1E293B]/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-slate-700/50 z-10">
                    <h2 className="text-3xl font-bold mb-2 text-white">Welcome back</h2>
                    <p className="text-slate-400 mb-8">Sign in to your account to continue</p>

                    <div className="inline-flex items-center gap-2 bg-[#0F172A] px-4 py-2 rounded-lg border border-slate-700 mb-8">
                        <span className="text-[#10B981]">●</span>
                        <span className="font-semibold text-slate-200">{selectedRole} Portal Active</span>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0F172A] text-white rounded-lg border border-slate-700 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#0F172A] text-white rounded-lg border border-slate-700 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors mt-4 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                        >
                            {loading ? 'Authenticating...' : 'Secure Sign In'}
                        </button>
                        
                        <div className="text-center mt-6 space-y-2">
                            <a href="#" className="text-sm text-slate-400 hover:text-white block transition-colors">
                                Forgot password? <span className="underline decoration-slate-500">Reset via email</span>
                            </a>
                            <span className="text-sm text-slate-400 block pb-2 border-b border-slate-700/50">
                                Need access? <Link to="/register" className="text-[#6366F1] hover:text-indigo-400 font-medium ml-1">Register here</Link>
                            </span>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <span className="text-xs text-slate-500 tracking-widest uppercase">Select Role Demographic</span>
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {['Admin', 'Teacher', 'Student', 'Parent'].map(r => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setSelectedRole(r)}
                                    className={`py-2 border rounded-lg text-sm font-medium transition-colors ${
                                        selectedRole === r 
                                        ? 'border-[#6366F1] text-[#6366F1] bg-[#6366F1]/10' 
                                        : 'border-slate-700 text-slate-400 hover:bg-[#0F172A]'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
