import React, { useState } from 'react';
import { X, UserPlus, AlertCircle } from 'lucide-react';
import { Debt } from '../../types';
import { getTodayDateString, formatNaira } from '../../utils/formatters';

interface DebtFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Debt, 'id' | 'createdAt' | 'repayments'>) => void;
}

export const DebtFormModal: React.FC<DebtFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [amountStr, setAmountStr] = useState<string>('');
  const [dateRecorded, setDateRecorded] = useState<string>(getTodayDateString());
  const [note, setNote] = useState<string>('');
  const [errors, setErrors] = useState<{ customerName?: string; amount?: string; date?: string }>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { customerName?: string; amount?: string; date?: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    const cleanAmount = parseFloat(amountStr.replace(/,/g, '').trim());
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      newErrors.amount = 'Please enter an amount greater than ₦0';
    }

    if (!dateRecorded) {
      newErrors.date = 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      customerName: customerName.trim(),
      originalAmount: cleanAmount,
      dateRecorded,
      note: note.trim() || undefined,
    });

    // Reset and close
    setCustomerName('');
    setAmountStr('');
    setDateRecorded(getTodayDateString());
    setNote('');
    setErrors({});
    onClose();
  };

  const parsedAmount = parseFloat(amountStr.replace(/,/g, '').trim());

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
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-[#1E2621]">
              Record Customer Debt
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B756F] hover:text-[#1E2621] p-1.5 rounded-lg hover:bg-[#EBE8DF] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-[#FEF9EE] border border-[#FDE68A] p-3 rounded-xl flex items-start gap-2 text-xs text-[#92400E]">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Use this to track grain taken on credit. Debt repayments are tracked separately and will not inflate your income.
            </span>
          </div>

          {/* Customer Name */}
          <div>
            <label htmlFor="debt-customer" className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
              Customer Name *
            </label>
            <input
              id="debt-customer"
              type="text"
              placeholder="e.g. Alhaji Garba or Mama Chinedu"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errors.customerName) setErrors(prev => ({ ...prev, customerName: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                errors.customerName ? 'border-red-500 bg-red-50/30' : 'border-[#D5D1C7] bg-white'
              }`}
              autoFocus
            />
            {errors.customerName && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.customerName}</p>
            )}
          </div>

          {/* Original Debt Amount */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="debt-amount" className="block text-xs font-bold uppercase tracking-wider text-[#556059]">
                Original Amount Owed (₦) *
              </label>
              {!isNaN(parsedAmount) && parsedAmount > 0 && (
                <span className="text-xs font-bold text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded-md">
                  {formatNaira(parsedAmount)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#8C9690]">
                ₦
              </span>
              <input
                id="debt-amount"
                type="number"
                step="any"
                min="1"
                placeholder="e.g. 150000"
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                }}
                className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-base font-semibold text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                  errors.amount ? 'border-red-500 bg-red-50/30' : 'border-[#D5D1C7] bg-white'
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.amount}</p>
            )}
          </div>

          {/* Date Recorded */}
          <div>
            <label htmlFor="debt-date" className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
              Date Debt Incurred *
            </label>
            <input
              id="debt-date"
              type="date"
              value={dateRecorded}
              onChange={(e) => {
                setDateRecorded(e.target.value);
                if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:ring-2 focus:ring-[#144D34] ${
                errors.date ? 'border-red-500' : 'border-[#D5D1C7] bg-white'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.date}</p>
            )}
          </div>

          {/* Optional Note */}
          <div>
            <label htmlFor="debt-note" className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
              Notes <span className="text-[#8C9690] font-normal">(Optional)</span>
            </label>
            <textarea
              id="debt-note"
              rows={2}
              placeholder="e.g. 5 bags of white maize taken on credit for market day"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#D5D1C7] bg-white text-sm text-[#1E2621] focus:ring-2 focus:ring-[#144D34]"
              maxLength={200}
            />
          </div>

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
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#144D34] hover:bg-[#0E3A27] shadow-sm transition-all"
            >
              Save Customer Debt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
