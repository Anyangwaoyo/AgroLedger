import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WhatsAppRecordButton } from './WhatsAppRecordButton';
import { WHATSAPP_CONFIG } from '../../config/whatsapp';
import { MessageSquareText, ShieldAlert } from 'lucide-react';

export const WhatsAppQuickAccessCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-[#F0FDF4] via-[#F7FCF8] to-[#FFFFFF] rounded-2xl border border-[#BBF7D0] p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Brand, Description, & Helper Text */}
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
            <WhatsAppIcon className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-[#1E2621]">
                Record via WhatsApp
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#166534] border border-[#86EFAC]">
                Official Line: {WHATSAPP_CONFIG.displayPhoneNumber}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#2E7D32]">
              {WHATSAPP_CONFIG.helperText}
            </p>

            <p className="text-xs text-[#556059] flex items-center gap-1.5 pt-0.5">
              <MessageSquareText className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
              <span>
                Prefilled message: <span className="italic font-medium text-[#1E2621]">&ldquo;{WHATSAPP_CONFIG.defaultPrefilledMessage}&rdquo;</span>
              </span>
            </p>
          </div>
        </div>

        {/* Right Side: CTA Button */}
        <div className="shrink-0 flex flex-col items-start md:items-end justify-center pt-2 md:pt-0">
          <WhatsAppRecordButton showHelperText={false} size="md" fullWidthMobile={true} />
        </div>
      </div>

      {/* Honest Limitation & Architectural Transparency */}
      <div className="mt-3.5 pt-3 border-t border-[#DCFCE7] flex items-start gap-2 text-[11px] text-[#4B6354]">
        <ShieldAlert className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
        <p>
          Opens a real WhatsApp conversation with our business number. In this MVP, sending messages in WhatsApp does not automatically update this browser ledger. Full automated synchronization will be enabled in the upcoming WhatsApp Cloud API release.
        </p>
      </div>
    </div>
  );
};
