import React, { useState, useEffect } from 'react';
import { X, Sprout, ArrowRight, Sparkles } from 'lucide-react';
import { BusinessProfile } from '../../types';

interface WelcomePopupProps {
  profile: BusinessProfile | null;
}

export const WelcomePopup: React.FC<WelcomePopupProps> = ({ profile }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;

    // Check if this specific user/business has already seen the welcome popup
    const key = `agroledger_welcome_seen_${profile.id}`;
    const hasSeen = localStorage.getItem(key);

    if (!hasSeen) {
      // Small timeout for smooth appearance after login/registration
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  const handleDismiss = () => {
    if (profile) {
      const key = `agroledger_welcome_seen_${profile.id}`;
      localStorage.setItem(key, 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E6DF] overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Top Accent Banner */}
        <div className="bg-[#144D34] px-6 pt-7 pb-6 text-white relative">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-[#A7C8B7] hover:text-white p-1.5 rounded-xl hover:bg-[#1E6547] transition-colors cursor-pointer"
            aria-label="Dismiss popup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1E6547] text-[#FCD34D] border border-[#2B7D5A] flex items-center justify-center shadow-inner">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#1E6547] text-[#FCD34D] border border-[#2B7D5A] mb-1">
                <Sparkles className="w-3 h-3" />
                AgroLedger MVP
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white tracking-tight">
                Welcome to AgroLedger!
              </h2>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 space-y-4 text-sm text-[#3E4842] leading-relaxed">
          <p className="text-base text-[#1E2621] font-medium leading-relaxed">
            AgroLedger is currently in its MVP stage. We&apos;re building a simpler way for agricultural businesses to record transactions, track customer debts, and understand their estimated profit.
          </p>

          <p className="text-[#556059] bg-[#FAF9F5] p-3.5 rounded-2xl border border-[#E8E6DF]">
            Some features may still be under development. Your feedback will help us improve the platform.
          </p>

          {/* Action Button */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleDismiss}
              className="w-full sm:w-auto px-7 py-3 rounded-xl text-sm font-bold text-white bg-[#144D34] hover:bg-[#0F3D29] active:bg-[#0A2D1E] shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
