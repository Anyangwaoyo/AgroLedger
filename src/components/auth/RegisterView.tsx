import React, { useState } from 'react';
import { 
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
  Sparkles
} from 'lucide-react';
import { BusinessType, MainGrainType, RegistrationFormData } from '../../types';
import { authService } from '../../services/authService';

interface RegisterViewProps {
  onSuccess: () => void;
  onNavigateToLogin: () => void;
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

export const RegisterView: React.FC<RegisterViewProps> = ({
  onSuccess,
  onNavigateToLogin,
}) => {
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

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    }

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

    if (!formData.businessName.trim()) {
      errs.businessName = 'Business name is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await authService.register(formData);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setServerError(result.error || 'Registration failed. Please try again.');
    }
  };

  const handleQuickDemoEnter = () => {
    authService.enterGuestDemo();
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-xl w-full mx-auto space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#144D34] text-[#FCD34D] shadow-md mb-1">
            <Sprout className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#1E2621] tracking-tight">
            Create Your AgroLedger Account
          </h1>
          <p className="text-sm text-[#556059] max-w-md mx-auto">
            Digital bookkeeping for rice, maize, and soybean businesses in Nigeria.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 sm:p-8 shadow-xs space-y-6">
          {serverError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block">Registration Error</span>
                <p className="mt-0.5">{serverError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Account Credentials */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
                1. Account Credentials
              </h2>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Ibrahim Abubakar or Chinyere Okafor"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                      errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7] bg-white'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullName}</p>
                )}
              </div>

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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                      errors.email ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7] bg-white'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                        errors.password ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7] bg-white'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                        errors.confirmPassword ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7] bg-white'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Business Profile */}
            <div className="pt-4 border-t border-[#F0EEE6] space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
                2. Agricultural Business Profile
              </h2>

              {/* Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
                  Business Name *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-[#8C9690] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Al-Barakah Grain Ventures or Kemi Grains Ent."
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                      errors.businessName ? 'border-red-500 bg-red-50/20' : 'border-[#D5D1C7] bg-white'
                    }`}
                  />
                </div>
                {errors.businessName && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.businessName}</p>
                )}
              </div>

              {/* Business Type & Main Grain Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Business Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
                    Business Type *
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D1C7] bg-white text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34]"
                  >
                    {BUSINESS_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Main Grain */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5 flex items-center gap-1">
                    <Wheat className="w-3.5 h-3.5 text-[#144D34]" />
                    Main Grain *
                  </label>
                  <select
                    value={formData.mainGrain}
                    onChange={(e) => setFormData({ ...formData, mainGrain: e.target.value as MainGrainType })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D1C7] bg-white text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34]"
                  >
                    {MAIN_GRAINS.map((grain) => (
                      <option key={grain} value={grain}>
                        {grain}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* State of Operation (Optional) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8C9690]" />
                  State of Operation <span className="text-[#8C9690] font-normal">(Optional)</span>
                </label>
                <select
                  value={formData.stateOfOperation}
                  onChange={(e) => setFormData({ ...formData, stateOfOperation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D1C7] bg-white text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34]"
                >
                  <option value="">Select State (Optional)</option>
                  {NIGERIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#144D34] hover:bg-[#0F3D29] active:bg-[#0A2D1E] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Business Profile...' : 'Complete Registration & Open Ledger'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Demo Option */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleQuickDemoEnter}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#144D34] hover:underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Explore Demo Mode Directly &rarr;</span>
              </button>
            </div>
          </form>

          {/* Switch to Login */}
          <div className="pt-4 border-t border-[#F0EEE6] text-center text-xs text-[#556059]">
            Already have an AgroLedger business account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-bold text-[#144D34] hover:underline cursor-pointer"
            >
              Sign In to Your Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
