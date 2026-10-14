import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ShieldAlert } from 'lucide-react';
import { Debt, DebtRepayment } from '../../types';
import { formatNaira, getTodayDateString, getDebtOutstandingBalance, getDebtTotalRepaid } from '../../utils/formatters';

interface RepaymentModalProps {
  isOpen: boolean;
  debt: Debt | null;
  onClose: () => void;
  onSubmit: (debtId: string, repayment: Omit<DebtRepayment, 'id' | 'createdAt' | 'debtId'>) => void;
}

export const RepaymentModal: React.FC<RepaymentModalProps> = ({
  isOpen,
  debt,
  onClose,
  onSubmit,
}) => {
  const [amountStr, setAmountStr] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmountStr('');
      setDate(getTodayDateString());
      setNote('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen || !debt) return null;

  const original = Number(debt.originalAmount) || 0;
  const alreadyRepaid = getDebtTotalRepaid(debt);
  const outstandingBalance = getDebtOutstandingBalance(debt);

  const parsedAmount = parseFloat(amountStr.replace(/,/g, '').trim());

  const handleQuickFill = (portion: number) => {
    const target = Math.round(outstandingBalance * portion);
    setAmountStr(String(target));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a repayment amount greater than ₦0');
      return;
    }

    if (parsedAmount > outstandingBalance) {
      setError(`Cannot repay more than the remaining balance (${formatNaira(outstandingBalance)})`);
      return;
    }

    if (!date) {
      setError('Date is required');
      return;
    }

    onSubmit(debt.id, {
      amount: parsedAmount,
      date,
      note: note.trim() || undefined,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E8E6DF] overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8F7F2] border-b border-[#E8E6DF] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1E2621]">Record Debt Repayment</h2>
            <p className="text-xs text-[#556059]">Customer: <span className="font-semibold text-[#1E2621]">{debt.customerName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B756F] hover:text-[#1E2621] p-1.5 rounded-lg hover:bg-[#EBE8DF] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Debt Breakdown Card */}
        <div className="p-6 pb-2">
          <div className="bg-[#FAF9F5] p-4 rounded-xl border border-[#E8E6DF] space-y-2">
            <div className="flex justify-between items-center text-xs text-[#556059]">
              <span>Original Debt:</span>
              <span className="font-semibold text-[#1E2621]">{formatNaira(original)}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-[#556059]">
              <span>Amount Already Repaid:</span>
              <span className="font-semibold text-[#107548]">{formatNaira(alreadyRepaid)}</span>
            </div>
            <div className="pt-2 border-t border-[#E8E6DF] flex justify-between items-center">
              <span className="text-xs font-bold text-[#1E2621] uppercase tracking-wider">
                Outstanding Balance:
              </span>
              <span className="text-base font-bold text-[#B45309] font-mono">
                {formatNaira(outstandingBalance)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-3 space-y-4">
          {/* Amount input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="repay-amount" className="block text-xs font-bold uppercase tracking-wider text-[#556059]">
                Repayment Amount (₦) *
              </label>
              {!isNaN(parsedAmount) && parsedAmount > 0 && (
                <span className="text-xs font-bold text-[#107548] bg-[#E7F3ED] px-2 py-0.5 rounded-md">
                  {formatNaira(parsedAmount)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#8C9690]">
                ₦
              </span>
              <input
                id="repay-amount"
                type="number"
                step="any"
                min="1"
                max={outstandingBalance}
                placeholder={`Max: ${outstandingBalance}`}
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  setError(null);
                }}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-base font-semibold text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                  error ? 'border-red-500 bg-red-50/30' : 'border-[#D5D1C7] bg-white'
                }`}
                autoFocus
              />
            </div>
            {error && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Quick-fill shortcuts */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B756F]">Quick Fill:</span>
            <button
              type="button"
              onClick={() => handleQuickFill(1)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#EBF4EE] text-[#144D34] hover:bg-[#D4EADB] transition-colors border border-[#C5DFCE]"
            >
              Full Balance ({formatNaira(outstandingBalance)})
            </button>
            {outstandingBalance > 1000 && (
              <button
                type="button"
                onClick={() => handleQuickFill(0.5)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-[#F4F2EB] text-[#4D5751] hover:bg-[#EAE6DB] transition-colors border border-[#DDD8CA]"
              >
                Half (50%)
              </button>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="repay-date" className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
              Repayment Date *
            </label>
            <input
              id="repay-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D1C7] bg-white text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34]"
            />
          </div>

          {/* Note */}
          <div>
            <label htmlFor="repay-note" className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
              Payment Note <span className="text-[#8C9690] font-normal">(Optional)</span>
            </label>
            <input
              id="repay-note"
              type="text"
              placeholder="e.g. Paid in cash at stall, or bank transfer"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D5D1C7] bg-white text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34]"
              maxLength={150}
            />
          </div>

          {/* Double-counting protection reminder */}
          <p className="text-[11px] text-[#6B756F] italic bg-[#FAF9F5] p-2.5 rounded-lg border border-[#EAE7DC]">
            Notice: Recording this repayment updates the customer&apos;s debt balance. To avoid double-counting revenue, it does not add to your profit summary.
          </p>

          {/* Actions */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#D5D1C7] text-sm font-semibold text-[#4D5751] hover:bg-[#F2EFE8] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#107548] hover:bg-[#0C5836] shadow-sm transition-all"
            >
              <CheckCircle className="w-4 h-4" />
              Save Repayment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
