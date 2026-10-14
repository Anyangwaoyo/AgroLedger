import React from 'react';
import { X, History, Calendar, CheckCircle2 } from 'lucide-react';
import { Debt } from '../../types';
import { formatNaira, formatDate, getDebtOutstandingBalance, getDebtTotalRepaid } from '../../utils/formatters';

interface DebtHistoryModalProps {
  isOpen: boolean;
  debt: Debt | null;
  onClose: () => void;
}

export const DebtHistoryModal: React.FC<DebtHistoryModalProps> = ({
  isOpen,
  debt,
  onClose,
}) => {
  if (!isOpen || !debt) return null;

  const original = Number(debt.originalAmount) || 0;
  const totalRepaid = getDebtTotalRepaid(debt);
  const outstanding = getDebtOutstandingBalance(debt);
  const repayments = debt.repayments || [];
  const percentRepaid = original > 0 ? Math.min(100, Math.round((totalRepaid / original) * 100)) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E8E6DF] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8F7F2] border-b border-[#E8E6DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#EBF4EE] text-[#144D34] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1E2621]">Repayment History</h2>
              <p className="text-xs text-[#556059]">{debt.customerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B756F] hover:text-[#1E2621] p-1.5 rounded-lg hover:bg-[#EBE8DF] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Card */}
          <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E6DF] space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <span className="text-[11px] font-bold text-[#6B756F] uppercase block">Original Debt</span>
                <span className="text-sm font-bold text-[#1E2621]">{formatNaira(original)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#6B756F] uppercase block">Total Repaid</span>
                <span className="text-sm font-bold text-[#107548]">{formatNaira(totalRepaid)}</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#6B756F] uppercase block">Remaining</span>
                <span className="text-sm font-bold text-[#B45309]">{formatNaira(outstanding)}</span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs text-[#6B756F] mb-1 font-medium">
                <span>Repayment status:</span>
                <span className="font-bold text-[#144D34]">{percentRepaid}% complete</span>
              </div>
              <div className="w-full h-2.5 bg-[#E8E6DF] rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    percentRepaid === 100 ? 'bg-[#107548]' : 'bg-[#D97706]'
                  }`}
                  style={{ width: `${percentRepaid}%` }}
                />
              </div>
            </div>

            {debt.note && (
              <p className="text-xs text-[#556059] pt-2 border-t border-[#E8E6DF]">
                <strong className="text-[#1E2621]">Note:</strong> {debt.note}
              </p>
            )}
          </div>

          {/* Repayment Log */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B756F] mb-3">
              Payment Log ({repayments.length} {repayments.length === 1 ? 'installment' : 'installments'})
            </h3>

            {repayments.length === 0 ? (
              <div className="text-center py-6 px-4 bg-[#FAF9F5] rounded-xl border border-[#E8E6DF]">
                <p className="text-sm font-semibold text-[#1E2621]">No repayments made yet</p>
                <p className="text-xs text-[#6B756F] mt-1">
                  When the customer pays in part or in full, use &quot;Record Repayment&quot; to log it here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {repayments.map((rep, idx) => (
                  <div 
                    key={rep.id || idx}
                    className="p-3 bg-white rounded-xl border border-[#E8E6DF] flex items-center justify-between text-xs hover:border-[#CBD5E1] transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 font-semibold text-[#1E2621]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#107548]" />
                        <span>Installment #{repayments.length - idx}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#6B756F]">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(rep.date)}</span>
                      </div>
                      {rep.note && (
                        <p className="text-[#556059] italic mt-0.5">{rep.note}</p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-sm font-bold text-[#107548]">
                        +{formatNaira(rep.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Close button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#D5D1C7] text-sm font-semibold text-[#4D5751] hover:bg-[#F2EFE8] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
