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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#667eea] to-[#764ba2] p-5">
            <div className="w-full max-w-[500px] flex flex-col gap-4">
                {/* Card */}
                <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] animate-[slideUp_0.5s_ease]">
                    {/* Card Header */}
                    <div className="text-center px-8 pt-8 pb-6 border-b border-gray-100">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create an account</h1>
                        <p className="text-sm text-gray-600">
                            Join Student Behavior Analytics
                        </p>
                    </div>

                    {/* Card Content */}
                    <div className="p-8">
                        {error && (
                            <div className="px-4 py-3 rounded-lg mb-5 text-sm bg-red-50 text-red-600 border-l-4 border-red-600 animate-[fadeIn_0.3s_ease]">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Full Name */}
                            <div className="flex flex-col">
                                <label htmlFor="name" className="mb-2 font-semibold text-gray-800 text-sm">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your full name"
                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <label htmlFor="email" className="mb-2 font-semibold text-gray-800 text-sm">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="m@example.com"
                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
                                />
                            </div>

                            {/* Role */}
                            <div className="flex flex-col">
                                <label htmlFor="role" className="mb-2 font-semibold text-gray-800 text-sm">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
                                >
                                    <option value="student">Student</option>
                                    <option value="faculty">Faculty</option>
                                    <option value="counselor">Counselor</option>
                                    <option value="hod">Head of Department (HOD)</option>
                                </select>
                            </div>

                            {/* Student-specific fields */}
                            {formData.role === 'student' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <label htmlFor="studentId" className="mb-2 font-semibold text-gray-800 text-sm">
                                                Student ID
                                            </label>
                                            <input
                                                type="text"
                                                id="studentId"
                                                name="studentId"
                                                value={formData.studentId}
                                                onChange={handleChange}
                                                required
                                                placeholder="ID Number"
                                                className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label htmlFor="year" className="mb-2 font-semibold text-gray-800 text-sm">
                                                Year
                                            </label>
                                            <select
                                                id="year"
                                                name="year"
                                                value={formData.year}
                                                onChange={handleChange}
                                                required
                                                className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
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
                                        <label htmlFor="department" className="mb-2 font-semibold text-gray-800 text-sm">
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            id="department"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g., Computer Science"
                                            className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label htmlFor="phone" className="mb-2 font-semibold text-gray-800 text-sm">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="e.g., +1 234 567 8900"
                                            className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Password */}
                            <div className="flex flex-col">
                                <label htmlFor="password" className="mb-2 font-semibold text-gray-800 text-sm">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength="6"
                                    placeholder="••••••••"
                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col">
                                <label htmlFor="confirmPassword" className="mb-2 font-semibold text-gray-800 text-sm">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    placeholder="••••••••"
                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-base transition-all focus:outline-none focus:border-[#667eea] focus:ring-4 focus:ring-[#667eea]/10"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3.5 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(102,126,234,0.4)] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>

                            {/* Login link */}
                            <p className="text-center mt-1 text-gray-600 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-[#667eea] font-semibold hover:underline">
                                    Login
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>

                {/* Terms and Privacy */}
                <p className="text-center px-6 text-white/90 text-xs leading-relaxed">
                    By clicking continue, you agree to our{' '}
                    <a href="#" className="underline decoration-1 underline-offset-2 hover:decoration-2">
                        Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="underline decoration-1 underline-offset-2 hover:decoration-2">
                        Privacy Policy
                    </a>.
                </p>
            </div>

            {/* Add keyframes for animations */}
            <style>{`
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Register;
