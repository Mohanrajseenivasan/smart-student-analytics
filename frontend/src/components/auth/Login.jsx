import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login({ email: formData.email, password: formData.password });

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.message);
        }

        setLoading(false);
    };

    const handleSocialLogin = (provider) => {
        setError(`${provider} login is not yet implemented. Please use email/password.`);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between bg-white p-8 lg:p-12">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-gray-900">Student Analytics</span>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-600">Enter your email and password to access your account.</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="student@university.edu"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-base transition-all focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">Remember Me</span>
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-purple-600 hover:text-purple-700 font-medium hover:underline"
                            >
                                Forgot Your Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3.5 bg-purple-600 text-white rounded-lg font-semibold transition-all hover:bg-purple-700 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </button>

                        {/* Divider */}
                        <div className="relative text-center my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <span className="relative bg-white px-4 text-sm text-gray-500">
                                Or Login With
                            </span>
                        </div>

                        {/* Social Login Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Google')}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Google
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSocialLogin('Apple')}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-400"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                                </svg>
                                Apple
                            </button>
                        </div>

                        {/* Register Link */}
                        <p className="text-center text-sm text-gray-600 mt-6">
                            Don't Have An Account?{' '}
                            <Link to="/register" className="text-purple-600 font-semibold hover:underline">
                                Register Now.
                            </Link>
                        </p>
                    </form>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-xs text-gray-500">
                    Copyright © 2025 Student Analytics Inc.
                    <span className="mx-2">·</span>
                    <a href="#" className="hover:text-purple-600">Privacy Policy</a>
                </div>
            </div>

            {/* Right Side - Purple Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
                    <div className="max-w-lg text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 leading-tight">
                            Effortlessly manage your academic journey.
                        </h2>
                        <p className="text-lg text-purple-100">
                            Log in to access your student dashboard, track grades, and manage your courses.
                        </p>
                    </div>

                    {/* Dashboard Preview */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl max-w-2xl w-full">
                        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl">
                            {/* Mock Dashboard */}
                            <div className="space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                                    <h3 className="text-white font-semibold">Dashboard</h3>
                                    <div className="flex gap-2">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    </div>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-purple-600/30 rounded-lg p-3">
                                        <div className="text-purple-300 text-xs mb-1">GPA</div>
                                        <div className="text-white text-xl font-bold">3.8</div>
                                    </div>
                                    <div className="bg-blue-600/30 rounded-lg p-3">
                                        <div className="text-blue-300 text-xs mb-1">Courses</div>
                                        <div className="text-white text-xl font-bold">5</div>
                                    </div>
                                    <div className="bg-green-600/30 rounded-lg p-3">
                                        <div className="text-green-300 text-xs mb-1">Credits</div>
                                        <div className="text-white text-xl font-bold">15</div>
                                    </div>
                                </div>

                                {/* Chart Area */}
                                <div className="bg-gray-800/50 rounded-lg p-4 h-32 flex items-end justify-around">
                                    <div className="w-8 bg-purple-500 rounded-t" style={{ height: '60%' }}></div>
                                    <div className="w-8 bg-purple-500 rounded-t" style={{ height: '80%' }}></div>
                                    <div className="w-8 bg-purple-500 rounded-t" style={{ height: '45%' }}></div>
                                    <div className="w-8 bg-purple-500 rounded-t" style={{ height: '90%' }}></div>
                                    <div className="w-8 bg-purple-500 rounded-t" style={{ height: '70%' }}></div>
                                    <div className="w-8 bg-purple-500 rounded-t" style={{ height: '85%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
