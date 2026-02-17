import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { Spinner } from '../components/Loading';
import { UserRole } from '../context/AuthContext';
import { loginAttempts } from '../utils/security';
import { validateEmail } from '../utils/validation';

interface LoginProps {
    onLogin: (email: string, password: string, role: UserRole) => Promise<void>;
    onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('student');
    const [isLoading, setIsLoading] = useState(false);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTimer, setLockoutTimer] = useState(0);
    const [remainingAttempts, setRemainingAttempts] = useState(3);
    const [emailError, setEmailError] = useState('');

    // Check if account is locked on mount and email change
    useEffect(() => {
        if (email && validateEmail(email)) {
            const locked = loginAttempts.isLocked(email);
            setIsLocked(locked);

            if (locked) {
                const remaining = loginAttempts.getLockoutTimeRemaining(email);
                setLockoutTimer(remaining);
            } else {
                setRemainingAttempts(loginAttempts.getRemainingAttempts(email));
            }
        }
    }, [email]);

    // Countdown timer for lockout
    useEffect(() => {
        if (lockoutTimer > 0) {
            const timer = setInterval(() => {
                setLockoutTimer((prev) => {
                    if (prev <= 1) {
                        setIsLocked(false);
                        if (email) {
                            setRemainingAttempts(loginAttempts.getRemainingAttempts(email));
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [lockoutTimer, email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }
        setEmailError('');

        // Check if locked
        if (loginAttempts.isLocked(email)) {
            setIsLocked(true);
            setLockoutTimer(loginAttempts.getLockoutTimeRemaining(email));
            return;
        }

        setIsLoading(true);

        try {
            await onLogin(email, password, role);
            // Success - reset attempts
            loginAttempts.reset(email);
        } catch (error) {
            // Failed login - increment attempts
            const attempt = loginAttempts.increment(email);
            setRemainingAttempts(loginAttempts.getRemainingAttempts(email));

            if (attempt.lockedUntil) {
                setIsLocked(true);
                setLockoutTimer(loginAttempts.getLockoutTimeRemaining(email));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-xl">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
                        <p className="text-gray-600 text-sm">Sign in to your campus account</p>
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
                                    onClick={() => setRole('student')}
                                    disabled={isLoading || isLocked}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${role === 'student'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        } ${(isLoading || isLocked) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                    onClick={() => setRole('staff')}
                                    disabled={isLoading || isLocked}
                                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${role === 'staff'
                                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        } ${(isLoading || isLocked) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div className="font-medium">Staff</div>
                                </button>
                            </div>
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={role === 'student' ? 'student@campus.edu' : 'staff@campus.edu'}
                                className={`w-full h-11 px-4 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm ${emailError ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                disabled={isLoading || isLocked}
                                required
                            />
                            {emailError && (
                                <p className="mt-1 text-sm text-red-600">{emailError}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                                disabled={isLoading || isLocked}
                                required
                            />
                        </div>

                        {/* Security Messages */}
                        {isLocked && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-800">Account Temporarily Locked</p>
                                        <p className="text-sm text-red-700 mt-1">
                                            Too many failed attempts. Please wait {lockoutTimer} seconds before trying again.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isLocked && remainingAttempts < 3 && (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-sm text-yellow-800">
                                        {remainingAttempts} {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining before account lockout
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            disabled={isLoading || isLocked}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner size="sm" color="white" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'Sign in'
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={onNavigateToRegister}
                            className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                            disabled={isLoading}
                        >
                            Create account
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};
