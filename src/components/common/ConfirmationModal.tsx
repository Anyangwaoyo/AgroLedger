import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E8E6DF] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className={`p-3 rounded-xl ${isDestructive ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              onClick={onCancel}
              className="text-[#6B756F] hover:text-[#1E2621] p-1 rounded-lg hover:bg-[#F4F2EB] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-lg font-bold text-[#1E2621]">{title}</h3>
            <p className="mt-2 text-sm text-[#556059] leading-relaxed">
              {message}
            </p>
          </div>

          <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#D5D1C7] text-sm font-semibold text-[#3E4842] hover:bg-[#F4F2EB] transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-xs transition-colors ${
                isDestructive
                  ? 'bg-[#BE123C] hover:bg-[#9F1239] active:bg-[#881337]'
                  : 'bg-[#144D34] hover:bg-[#0E3B27]'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
