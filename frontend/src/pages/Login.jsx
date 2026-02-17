import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { Building2, LogIn, Loader2, AlertCircle } from 'lucide-react';

const Login = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/resources');
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      setError('Unable to load users. Please check if the backend is running.');
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error('Please select a user');
      return;
    }

    setIsLoggingIn(true);
    try {
      const selectedUser = users.find(u => u.id === parseInt(selectedUserId));
      if (selectedUser) {
        await new Promise(resolve => setTimeout(resolve, 500));
        login(selectedUser);
        toast.success(`Welcome back, ${selectedUser.name}!`);
        navigate('/resources');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
        {/* Logo and Title */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-semibold mt-4 text-slate-900">Campus Resource Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and book campus resources easily</p>
        </div>

        {error ? (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                  <button
                    onClick={fetchUsers}
                    className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Your Account
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-slate-900"
                required
                disabled={isLoggingIn}
              >
                <option value="">Choose your account...</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} • {user.role}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn || !selectedUserId}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Secure access to campus resources
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
