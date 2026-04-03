import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../store/hooks';
import { login } from '../store/authSlice';
import { supabase } from '../services/supabase/supabase';
import { ensureCurrentUserProfile } from '../services/leads';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Mail, Lock, TrendingUp } from 'lucide-react';

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Enter a valid email address.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors({});
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrors({ email: error.message });
        return;
      }

      if (data.user) {
        const name = data.user.user_metadata?.full_name || email.split('@')[0];
        await ensureCurrentUserProfile();
        dispatch(login({ id: data.user.id, name, email: data.user.email || email }));
        navigate('/dashboard');
      }
    } catch (err: any) {
      setErrors({ email: err.message || 'An unexpected error occurred during sign in.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-lead-hot-accent/8 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-primary flex items-center justify-center shadow-xl shadow-brand-primary/30 mb-4">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="text-sm text-text-secondary mt-1">Sign in to your Lead Tracker account</p>
        </div>

        {/* Card */}
        <div className="bg-background-secondary border border-border-subtle rounded-2xl p-8 shadow-2xl shadow-black/40">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <Input
              id="email"
              type="email"
              label="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
              icon={<Mail className="w-4 h-4" />}
            />

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-text-secondary">
                Password
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-disabled">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className={`
                    w-full rounded-xl border px-4 pl-10 pr-10 py-3 text-sm text-text-primary placeholder:text-text-disabled
                    bg-background-elevated border-border-subtle
                    focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20
                    transition-all duration-200 outline-none
                    ${errors.password ? 'border-semantic-error focus:border-semantic-error focus:ring-semantic-error/20' : ''}
                  `}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-text-secondary transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-semantic-error flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-border-subtle text-center">
            <p className="text-xs text-text-disabled">
              Demo credentials: any valid email + 6+ character password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
