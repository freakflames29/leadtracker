import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { logout } from '../../store/authSlice';
import { LayoutDashboard, PlusCircle, User, LogOut, TrendingUp } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/add-lead', label: 'Add Lead', icon: PlusCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-background-primary/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/30 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-text-primary tracking-tight">
              Lead<span className="text-brand-primary">Tracker</span>
            </span>
          </button>

          {/* Nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => navigate(path)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${active
                      ? 'bg-brand-subtle text-brand-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              );
            })}
          </nav>

          {/* User + Logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-background-elevated rounded-full border border-border-subtle">
              <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase() ?? 'U'}
                </span>
              </div>
              <span className="text-xs text-text-secondary font-medium">{user?.name ?? 'User'}</span>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 rounded-lg text-text-disabled hover:text-semantic-error hover:bg-semantic-error-bg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="flex sm:hidden items-center gap-1 pb-2 overflow-x-auto no-scrollbar">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location.pathname === path;
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200
                  ${active
                    ? 'bg-brand-subtle text-brand-primary'
                    : 'text-text-secondary hover:text-text-primary hover:bg-background-elevated'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
