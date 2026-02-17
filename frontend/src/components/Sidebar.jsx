import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, BookOpen, Users, Building2, Calendar } from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/resources', label: 'Resources', icon: Building2 },
    { path: '/bookings', label: 'Bookings', icon: Calendar },
    { path: '/my-bookings', label: 'My Bookings', icon: BookOpen },
    { path: '/users', label: 'Users', icon: Users },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 min-h-screen p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">CRMS</h2>
            <p className="text-xs text-slate-500">Resource Manager</p>
          </div>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="text-sm">{item.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {user && (
        <div className="mt-auto pt-6 border-t border-slate-200">
          <div className="px-3 py-2">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
              Logged in as
            </p>
            <p className="text-sm font-medium text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500">{user.role}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
