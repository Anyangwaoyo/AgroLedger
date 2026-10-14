import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { WHATSAPP_CONFIG, buildWhatsAppChatUrl } from '../../config/whatsapp';
import { ExternalLink } from 'lucide-react';

interface WhatsAppRecordButtonProps {
  className?: string;
  showHelperText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidthMobile?: boolean;
}

export const WhatsAppRecordButton: React.FC<WhatsAppRecordButtonProps> = ({
  className = '',
  showHelperText = true,
  size = 'md',
  fullWidthMobile = false,
}) => {
  const isConfigured = !!WHATSAPP_CONFIG.businessPhoneNumber && WHATSAPP_CONFIG.businessPhoneNumber !== 'UNCONFIGURED';
  const chatUrl = isConfigured ? buildWhatsAppChatUrl() : '#';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }[size];

  return (
    <div className={`inline-flex flex-col ${fullWidthMobile ? 'w-full sm:w-auto' : ''} ${className}`}>
      {isConfigured ? (
        <a
          href={chatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center font-bold text-white rounded-xl bg-[#25D366] hover:bg-[#20BA5A] active:bg-[#1DA851] shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer ${sizeClasses} ${
            fullWidthMobile ? 'w-full sm:w-auto' : ''
          }`}
          title="Open WhatsApp chat with AgroLedger"
        >
          <WhatsAppIcon className={`${iconSizes} shrink-0`} />
          <span className="whitespace-nowrap">Record via WhatsApp</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0 ml-0.5" />
        </a>
      ) : (
        <button
          disabled
          className={`inline-flex items-center justify-center font-bold text-[#8C9690] rounded-xl bg-[#E8E6DF] cursor-not-allowed ${sizeClasses} ${
            fullWidthMobile ? 'w-full sm:w-auto' : ''
          }`}
          title="WhatsApp number not yet configured"
        >
          <WhatsAppIcon className={`${iconSizes} shrink-0 text-[#8C9690]`} />
          <span>WhatsApp (Not Configured)</span>
        </button>
      )}

      {showHelperText && (
        <span className="text-[11px] text-[#556059] mt-1 text-center sm:text-left">
          {WHATSAPP_CONFIG.helperText}
        </span>
      )}
    </div>
  );
};
