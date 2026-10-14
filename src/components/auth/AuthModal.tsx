import React, { useState } from 'react';
import { 
  X, 
  Sprout, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  MapPin, 
  Wheat, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import { BusinessType, MainGrainType, RegistrationFormData } from '../../types';
import { authService } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'register' | 'login';
  actionPrompt?: string;
}

const BUSINESS_TYPES: BusinessType[] = [
  'Grain Trader',
  'Retailer',
  'Aggregator',
  'Agro-dealer',
  'Other',
];

const MAIN_GRAINS: MainGrainType[] = [
  'Rice',
  'Maize',
  'Soybean',
  'Multiple',
];

const NIGERIAN_STATES = [
  'Kano',
  'Kaduna',
  'Benue',
  'Niger',
  'Taraba',
  'Plateau',
  'Oyo',
  'Ogun',
  'Lagos',
  'Kebbi',
  'Sokoto',
  'Gombe',
  'Adamawa',
  'Bauchi',
  'Kogi',
  'Katsina',
  'Jigawa',
  'Nasarawa',
  'Enugu',
  'Edo',
  'Other State',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'register',
  actionPrompt,
}) => {
  const [mode, setMode] = useState<'register' | 'login'>(initialMode);
  
  // Registration form state
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    businessType: 'Grain Trader',
    mainGrain: 'Rice',
    stateOfOperation: '',
  });

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validateRegister = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) errs.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      errs.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!formData.businessName.trim()) errs.businessName = 'Business name is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateLogin = (): boolean => {
    const errs: Record<string, string> = {};
    if (!loginEmail.trim()) {
      errs.loginEmail = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      errs.loginEmail = 'Please enter a valid email address';
    }
    if (!loginPassword) errs.loginPassword = 'Password is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateRegister()) return;

    setIsSubmitting(true);
    const result = await authService.register(formData);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setServerError(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateLogin()) return;

    setIsSubmitting(true);
    const result = await authService.login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
      onClose();
    } else {
      setServerError(result.error || 'Failed to sign in. Please verify your email.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E8E6DF] overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#144D34] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#1E6547] text-[#FCD34D] flex items-center justify-center">
              <Sprout className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {mode === 'register' ? 'Register Your Grain Business' : 'Sign In to AgroLedger'}
              </h2>
              <p className="text-xs text-[#A7C8B7]">
                Record every transaction. Know your profit.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#A7C8B7] hover:text-white p-1 rounded-lg hover:bg-[#1E6547] transition-colors"
            aria-label="Close auth dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Prompt Banner if triggered by a user action */}
        {actionPrompt && (
          <div className="bg-[#FEF9EE] border-b border-[#FDE68A] px-6 py-2.5 text-xs text-[#92400E] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D97706] shrink-0" />
            <span>{actionPrompt}</span>
          </div>
        )}

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 bg-[#F4F2EB] p-1 border-b border-[#E8E6DF]">
          <button
            type="button"
            onClick={() => { setMode('register'); setServerError(null); setErrors({}); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-white text-[#144D34] shadow-xs'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            Register Business
          </button>
          <button
            type="button"
            onClick={() => { setMode('login'); setServerError(null); setErrors({}); }}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-white text-[#144D34] shadow-xs'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            Existing User Sign In
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4">
          {serverError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="flex-1">{serverError}</p>
            </div>
          )}

          {mode === 'register' ? (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Ibrahim Abubakar"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                      errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7]'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="e.g. ibrahim@grainbusiness.ng"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                      errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7]'
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#556059]">
                      Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] text-[#6B756F] flex items-center gap-1 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 chars"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                        errors.password ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7]'
                      }`}
                    />
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                        errors.confirmPassword ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7]'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                </div>
              </div>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1">
                  Business Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Al-Barakah Grain Ventures"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                      errors.businessName ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7]'
                    }`}
                  />
                </div>
                {errors.businessName && <p className="mt-1 text-xs text-red-600">{errors.businessName}</p>}
              </div>

              {/* Business Type & Main Grain Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1">
                    Business Type *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5D1C7] bg-white text-xs text-[#1E2621]"
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1 flex items-center gap-1">
                    <Wheat className="w-3 h-3 text-[#144D34]" />
                    Main Grain *
                  </label>
                  <select
                    value={formData.mainGrain}
                    onChange={(e) => setFormData({ ...formData, mainGrain: e.target.value as MainGrainType })}
                    className="w-full px-3 py-2 rounded-xl border border-[#D5D1C7] bg-white text-xs text-[#1E2621]"
                  >
                    {MAIN_GRAINS.map((grain) => (
                      <option key={grain} value={grain}>
                        {grain}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* State of Operation */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#8C9690]" />
                  State of Operation (Optional)
                </label>
                <select
                  value={formData.stateOfOperation}
                  onChange={(e) => setFormData({ ...formData, stateOfOperation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#D5D1C7] bg-white text-xs text-[#1E2621]"
                >
                  <option value="">Select State (Optional)</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#144D34] hover:bg-[#0F3D29] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Registering...' : 'Complete Registration & Open Ledger'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="e.g. ibrahim@grainbusiness.ng"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                      errors.loginEmail ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7]'
                    }`}
                  />
                </div>
                {errors.loginEmail && <p className="mt-1 text-xs text-red-600">{errors.loginEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                      errors.loginPassword ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7]'
                    }`}
                  />
                </div>
                {errors.loginPassword && <p className="mt-1 text-xs text-red-600">{errors.loginPassword}</p>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#144D34] hover:bg-[#0F3D29] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Signing in...' : 'Sign In to Dashboard'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
