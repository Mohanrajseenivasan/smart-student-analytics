import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const location = useLocation();
    const [formData, setFormData] = useState({
        name: '',
        email: location.state?.email || '',
        password: '',
        confirmPassword: '',
        role: 'student',
        studentId: '',
        class: '',
        department: '',
        year: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        const result = await register(formData);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    const inputClasses = "w-full px-4 py-3 bg-[#0F172A] text-white rounded-lg border border-slate-700 outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-all";
    const labelClasses = "block text-sm font-medium text-slate-300 mb-1.5";

    return (
        <div className="min-h-screen flex text-white bg-[#0F172A]">
            {/* Left Sidebar */}
            <div className="w-full lg:w-96 bg-[#1b1c31] border-r border-[#2d2f4a] p-8 flex flex-col hidden lg:flex justify-between">
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
                </div>

                <div className="flex-1 mt-auto flex items-end">
                     <p className="text-xs text-slate-500 tracking-wider">© 2026 SmartBehavior Analytics.</p>
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 bg-[#0F172A] relative flex flex-col justify-center items-center py-12 px-4 sm:px-8 overflow-y-auto">
                {/* Decorative background blurs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="w-full max-w-lg bg-[#1E293B]/80 backdrop-blur-xl p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-700/50 my-auto z-10">
                    <h2 className="text-3xl font-bold mb-2 text-white">Create an account</h2>
                    <p className="text-slate-400 mb-8">Join Student Behavior Analytics</p>

                    {error && (
                        <div className="mb-6 p-3 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col">
                            <label htmlFor="name" className={labelClasses}>Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="email" className={labelClasses}>Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label htmlFor="role" className={labelClasses}>Role Selection</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className={inputClasses}
                            >
                                <option value="student">Student</option>
                                <option value="teacher">Teacher</option>
                                <option value="parent">Parent</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        {formData.role === 'student' && (
                            <div className="bg-[#0F172A]/50 p-4 rounded-xl border border-slate-700/50 mt-4 space-y-4">
                                <h3 className="text-xs text-[#10B981] font-bold uppercase tracking-widest mb-2">Student Profile Link</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label htmlFor="studentId" className={labelClasses}>Student ID</label>
                                        <input
                                            type="text"
                                            id="studentId"
                                            name="studentId"
                                            value={formData.studentId}
                                            onChange={handleChange}
                                            required
                                            className={inputClasses}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="year" className={labelClasses}>Academic Year</label>
                                        <select
                                            id="year"
                                            name="year"
                                            value={formData.year}
                                            onChange={handleChange}
                                            required
                                            className={inputClasses}
                                        >
                                            <option value="">Select Year</option>
                                            <option value="1">1st Year</option>
                                            <option value="2">2nd Year</option>
                                            <option value="3">3rd Year</option>
                                            <option value="4">4th Year</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor="department" className={labelClasses}>Department</label>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        required
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="flex flex-col">
                                <label htmlFor="password" className={labelClasses}>Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    className={inputClasses}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="confirmPassword" className={labelClasses}>Confirm</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-[#6366F1] hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors mt-6 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                        >
                            {loading ? 'Creating account...' : 'Create Secure Profile'}
                        </button>
                        
                        <div className="text-center mt-6">
                            <span className="text-sm text-slate-400">
                                Already have an account? <Link to="/login" className="text-[#6366F1] hover:text-indigo-400 font-medium ml-1">Sign in</Link>
                            </span>
                        </div>
                    </form>

                    {/* Terms and Privacy */}
                    <div className="mt-8 text-center px-4 pt-4 border-t border-slate-700/50">
                        <p className="text-slate-500 text-xs leading-relaxed">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="hover:text-white underline decoration-slate-600 transition-colors">Terms of Service</a>{' '}
                            and{' '}
                            <a href="#" className="hover:text-white underline decoration-slate-600 transition-colors">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
