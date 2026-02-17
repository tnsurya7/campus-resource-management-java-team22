import React, { useState } from 'react';
import { Button } from '../components/Button';
import { UserRole } from '../context/AuthContext';

interface RegisterProps {
    onRegister: (data: RegisterFormData) => void;
    onBackToLogin: () => void;
}

export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    // Student fields
    department?: string;
    college?: string;
    year?: string;
    // Staff fields
    position?: string;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onBackToLogin }) => {
    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'student',
        department: '',
        college: '',
        year: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate password
        if (formData.password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }
        
        if (formData.password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        
        setPasswordError('');
        onRegister(formData);
    };

    const handleRoleChange = (role: UserRole) => {
        setFormData({
            ...formData,
            role,
            // Reset role-specific fields
            department: '',
            college: '',
            year: '',
            position: '',
        });
        setPasswordError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-600 text-sm">Join the campus resource system</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                I am a
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange('student')}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${formData.role === 'student'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        }`}
                                >
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                    </svg>
                                    <div className="font-medium">Student</div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleRoleChange('staff')}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${formData.role === 'staff'
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        }`}
                                >
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div className="font-medium">Staff</div>
                                </button>
                            </div>
                        </div>

                        {/* Common Fields */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="John Doe"
                                className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john@campus.edu"
                                className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="At least 6 characters"
                                className={`w-full h-11 px-4 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm ${passwordError ? 'border-red-300' : 'border-gray-300'}`}
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter your password"
                                className={`w-full h-11 px-4 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm ${passwordError ? 'border-red-300' : 'border-gray-300'}`}
                                required
                            />
                            {passwordError && (
                                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="1234567890"
                                className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                required
                            />
                        </div>

                        {/* Student-specific fields */}
                        {formData.role === 'student' && (
                            <>
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                        Department
                                    </label>
                                    <input
                                        id="department"
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        placeholder="Computer Science"
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-2">
                                        College
                                    </label>
                                    <input
                                        id="college"
                                        type="text"
                                        value={formData.college}
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                        placeholder="Engineering"
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                                        Year
                                    </label>
                                    <select
                                        id="year"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                        required
                                    >
                                        <option value="">Select Year</option>
                                        <option value="1st Year">1st Year</option>
                                        <option value="2nd Year">2nd Year</option>
                                        <option value="3rd Year">3rd Year</option>
                                        <option value="4th Year">4th Year</option>
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Staff-specific fields */}
                        {formData.role === 'staff' && (
                            <>
                                <div>
                                    <label htmlFor="staff-department" className="block text-sm font-medium text-gray-700 mb-2">
                                        Department
                                    </label>
                                    <input
                                        id="staff-department"
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        placeholder="Administration"
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="staff-college" className="block text-sm font-medium text-gray-700 mb-2">
                                        College/Campus
                                    </label>
                                    <input
                                        id="staff-college"
                                        type="text"
                                        value={formData.college}
                                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                        placeholder="Main Campus"
                                        className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <Button type="submit" variant="primary" size="lg" fullWidth>
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={onBackToLogin}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};
