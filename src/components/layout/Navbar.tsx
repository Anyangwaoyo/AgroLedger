import React from 'react';
import { 
  Sprout, 
  ArrowLeftRight, 
  Users, 
  PieChart, 
  LayoutDashboard, 
  RotateCcw,
  Sparkles,
  LogOut,
  UserPlus,
  LogIn,
  Eye
} from 'lucide-react';
import { BusinessProfile } from '../../types';

export type ActiveTab = 'overview' | 'transactions' | 'debts' | 'profit';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isDemo: boolean;
  hasRecords: boolean;
  profile: BusinessProfile | null;
  onLoadDemo: () => void;
  onReset: () => void;
  onSignOut: () => void;
  onOpenAuth: (mode?: 'register' | 'login', prompt?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDemo,
  hasRecords,
  profile,
  onLoadDemo,
  onReset,
  onSignOut,
  onOpenAuth,
}) => {
  return (
    <>
      {/* Top Banner */}
      {isDemo ? (
        <div className="bg-[#FEF3C7] border-b border-[#FDE68A] text-[#92400E] px-4 py-2 text-xs md:text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-[#F59E0B] text-white">
              DEMO MODE
            </span>
            <span>Sample Nigerian grain trading records loaded. Real records are not mixed.</span>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-white border border-[#FCD34D] text-[#78350F] hover:bg-[#FEF9C3] transition-colors shadow-2xs cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear to Empty
          </button>
        </div>
      ) : !profile ? (
        <div className="bg-[#EBF4EE] border-b border-[#C7E2D1] text-[#144D34] px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-[#144D34] text-[#FCD34D]">
              <Eye className="w-3 h-3" />
              GUEST PREVIEW
            </span>
            <span className="hidden sm:inline">You are viewing AgroLedger. Please register your business before recording transactions or customer debts.</span>
            <span className="sm:hidden">Register your business before recording entries.</span>
          </div>
          <button
            onClick={() => onOpenAuth('register', 'Register your grain business to record entries.')}
            className="font-bold underline text-[#144D34] hover:text-[#0C3B27] cursor-pointer"
          >
            Register Free &rarr;
          </button>
        </div>
      ) : null}

      {/* Main Top Header */}
      <header className="sticky top-0 z-30 bg-[#144D34] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#1E6547] border border-[#2B7D5A] flex items-center justify-center text-[#FCD34D] shadow-inner">
                <Sprout className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                    AgroLedger
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#1E6547] text-[#FCD34D] rounded-full border border-[#2B7D5A]">
                    NGN ₦
                  </span>
                </div>
                <p className="text-xs text-[#A7C8B7] hidden sm:block">
                  Record every transaction. Know your profit.
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#1E6547] text-[#FCD34D] shadow-inner'
                    : 'text-[#D0E3D8] hover:text-white hover:bg-[#1A5C3F]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Overview
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'transactions'
                    ? 'bg-[#1E6547] text-[#FCD34D] shadow-inner'
                    : 'text-[#D0E3D8] hover:text-white hover:bg-[#1A5C3F]'
                }`}
              >
                <ArrowLeftRight className="w-4 h-4" />
                Transactions
              </button>

              <button
                onClick={() => setActiveTab('debts')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'debts'
                    ? 'bg-[#1E6547] text-[#FCD34D] shadow-inner'
                    : 'text-[#D0E3D8] hover:text-white hover:bg-[#1A5C3F]'
                }`}
              >
                <Users className="w-4 h-4" />
                Debts
              </button>

              <button
                onClick={() => setActiveTab('profit')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'profit'
                    ? 'bg-[#1E6547] text-[#FCD34D] shadow-inner'
                    : 'text-[#D0E3D8] hover:text-white hover:bg-[#1A5C3F]'
                }`}
              >
                <PieChart className="w-4 h-4" />
                Profit Summary
              </button>
            </nav>

            {/* Right Action / Profile & Sign Out or Register/Login */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {!isDemo && !hasRecords && (
                <button
                  onClick={onLoadDemo}
                  className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#1E6547] text-[#FCD34D] border border-[#2B7D5A] hover:bg-[#247552] transition-colors shadow-2xs cursor-pointer"
                  title="Populate realistic Nigerian grain business records for testing"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sample Data</span>
                </button>
              )}

              {/* Logged in state: Show business profile and sign out */}
              {profile ? (
                <>
                  <div className="flex items-center gap-2 pl-2 border-l border-[#1E6547]">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-bold text-white block max-w-[160px] truncate leading-tight">
                        {profile.businessName}
                      </span>
                      <span className="text-[10px] text-[#A7C8B7] block leading-tight">
                        {profile.businessType} {profile.stateOfOperation ? `• ${profile.stateOfOperation}` : ''}
                      </span>
                    </div>

                    <div 
                      className="w-8 h-8 rounded-lg bg-[#1E6547] text-[#FCD34D] border border-[#2B7D5A] flex items-center justify-center font-bold text-xs shadow-inner"
                      title={`${profile.fullName} (${profile.businessName})`}
                    >
                      {profile.fullName.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <button
                    onClick={onSignOut}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-[#D0E3D8] hover:text-white hover:bg-[#1A5C3F] transition-colors cursor-pointer"
                    title="Sign out of AgroLedger"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </>
              ) : (
                /* Guest state: Show Register and Sign In buttons */
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenAuth('login', 'Sign in to access your business ledger.')}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#D0E3D8] hover:text-white hover:bg-[#1A5C3F] transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => onOpenAuth('register', 'Register your business to start recording transactions.')}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FCD34D] text-[#144D34] hover:bg-[#FDE047] active:bg-[#FACC15] shadow-sm transition-all cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E6DF] py-1.5 px-2 shadow-lg">
        <div className="grid grid-cols-4 gap-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-[#144D34] font-bold bg-[#EBF4EE]'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            Overview
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'transactions'
                ? 'text-[#144D34] font-bold bg-[#EBF4EE]'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5 mb-0.5" />
            Transactions
          </button>

          <button
            onClick={() => setActiveTab('debts')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'debts'
                ? 'text-[#144D34] font-bold bg-[#EBF4EE]'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            Debts
          </button>

          <button
            onClick={() => setActiveTab('profit')}
            className={`flex flex-col items-center justify-center py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'profit'
                ? 'text-[#144D34] font-bold bg-[#EBF4EE]'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            <PieChart className="w-5 h-5 mb-0.5" />
            Profit
          </button>
        </div>
      </div>
    </>
  );
};
