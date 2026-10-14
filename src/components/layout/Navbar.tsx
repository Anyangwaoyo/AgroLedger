import React from 'react';
import { 
  Sprout, 
  ArrowLeftRight, 
  Users, 
  PieChart, 
  LayoutDashboard, 
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
  hasRecords: boolean;
  profile: BusinessProfile | null;
  onSignOut: () => void;
  onOpenAuth: (mode?: 'register' | 'login', prompt?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onSignOut,
  onOpenAuth,
}) => {
  return (
    <>
      {/* Guest Mode Notice Banner */}
      {!profile && (
        <div className="bg-[#EBF4EE] border-b border-[#C7E2D1] text-[#144D34] px-3 sm:px-4 py-2 text-xs font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-[#144D34] text-[#FCD34D] shrink-0">
                <Eye className="w-3 h-3" />
                GUEST PREVIEW
              </span>
              <span className="truncate text-[11px] sm:text-xs">
                Register your business to record and save your grain transactions.
              </span>
            </div>
            <button
              onClick={() => onOpenAuth('register', 'Register your grain business to record entries.')}
              className="shrink-0 font-bold underline text-[#144D34] hover:text-[#0C3B27] cursor-pointer text-xs"
            >
              Register &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <header className="sticky top-0 z-30 bg-[#144D34] text-white shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-20">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#1E6547] border border-[#2B7D5A] flex items-center justify-center text-[#FCD34D] shadow-inner shrink-0">
                <Sprout className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-display text-lg sm:text-2xl font-bold tracking-tight text-white truncate">
                    AgroLedger
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-[#1E6547] text-[#FCD34D] rounded-full border border-[#2B7D5A] shrink-0">
                    NGN ₦
                  </span>
                </div>
                <p className="text-[11px] text-[#A7C8B7] hidden sm:block truncate">
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
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              {profile ? (
                /* Authenticated state */
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="text-right hidden sm:block max-w-[150px] lg:max-w-[200px]">
                    <span className="text-xs font-bold text-white block truncate leading-tight">
                      {profile.businessName}
                    </span>
                    <span className="text-[10px] text-[#A7C8B7] block truncate leading-tight">
                      {profile.businessType} {profile.stateOfOperation ? `• ${profile.stateOfOperation}` : ''}
                    </span>
                  </div>

                  <div 
                    className="w-8 h-8 rounded-lg bg-[#1E6547] text-[#FCD34D] border border-[#2B7D5A] flex items-center justify-center font-bold text-xs shadow-inner shrink-0"
                    title={`${profile.fullName} (${profile.businessName})`}
                  >
                    {profile.fullName.charAt(0).toUpperCase()}
                  </div>

                  <button
                    onClick={onSignOut}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl text-xs font-medium text-[#D0E3D8] hover:text-white hover:bg-[#1A5C3F] transition-colors cursor-pointer flex items-center gap-1"
                    title="Sign out of AgroLedger"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                /* Guest state */
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <button
                    onClick={() => onOpenAuth('login', 'Sign in to access your business ledger.')}
                    className="px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-semibold text-[#D0E3D8] hover:text-white hover:bg-[#1A5C3F] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => onOpenAuth('register', 'Register your business to start recording transactions.')}
                    className="px-2.5 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold bg-[#FCD34D] text-[#144D34] hover:bg-[#FDE047] active:bg-[#FACC15] shadow-xs transition-all cursor-pointer flex items-center gap-1"
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

      {/* Mobile Bottom Navigation Bar with Safe Area support */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E6DF] px-2 pt-1 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] shadow-lg"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-semibold transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'overview'
                ? 'text-[#144D34] font-bold bg-[#EBF4EE]'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mb-0.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-semibold transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'transactions'
                ? 'text-[#144D34] font-bold bg-[#EBF4EE]'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            <ArrowLeftRight className="w-5 h-5 mb-0.5" />
            <span>Records</span>
          </button>

          <button
            onClick={() => setActiveTab('debts')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-semibold transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'debts'
                ? 'text-[#144D34] font-bold bg-[#EBF4EE]'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span>Debts</span>
          </button>

          <button
            onClick={() => setActiveTab('profit')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] sm:text-xs font-semibold transition-colors min-h-[44px] cursor-pointer ${
              activeTab === 'profit'
                ? 'text-[#144D34] font-bold bg-[#EBF4EE]'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            <PieChart className="w-5 h-5 mb-0.5" />
            <span>Profit</span>
          </button>
        </div>
      </nav>
    </>
  );
};
