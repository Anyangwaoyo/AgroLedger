import React, { useState } from 'react';
import { 
  Sprout, 
  Lock, 
  Mail, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { authService } from '../../services/authService';

interface LoginViewProps {
  onSuccess: () => void;
  onNavigateToRegister: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onSuccess,
  onNavigateToRegister,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await authService.login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setServerError(result.error || 'Failed to sign in. Please verify your email and password.');
    }
  };

  const handleTestDemoLogin = () => {
    authService.enterGuestDemo();
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#144D34] text-[#FCD34D] shadow-md mb-1">
            <Sprout className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E2621] tracking-tight">
            Sign In to AgroLedger
          </h1>
          <p className="text-sm text-[#556059]">
            Access your transactions, customer debts, and profit summary.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-xs space-y-6">
          {serverError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Sign In Notice</span>
                <p className="mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8C9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="e.g. ibrahim@grainbusiness.ng"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                    errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7] bg-white'
                  }`}
                  autoFocus
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059]">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#6B756F] hover:text-[#1E2621] flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                    errors.password ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7] bg-white'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#144D34] hover:bg-[#0F3D29] active:bg-[#0A2D1E] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Demo Option */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleTestDemoLogin}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#144D34] hover:underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Explore Demo Mode Directly &rarr;</span>
              </button>
            </div>
          </form>

          {/* Switch to Register */}
          <div className="pt-4 border-t border-[#F0EEE6] text-center text-xs text-[#556059]">
            Don&apos;t have an AgroLedger account yet?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-[#144D34] hover:underline cursor-pointer"
            >
              Register your business
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
