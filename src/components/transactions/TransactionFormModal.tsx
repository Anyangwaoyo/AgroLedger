import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Transaction, TransactionType, GrainType } from '../../types';
import { getTodayDateString, formatNaira } from '../../utils/formatters';
import { WhatsAppIcon } from '../whatsapp/WhatsAppIcon';
import { WHATSAPP_CONFIG, buildWhatsAppChatUrl } from '../../config/whatsapp';

interface TransactionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  initialTransaction?: Transaction | null;
}

const INCOME_CATEGORIES = ['Grain sales', 'Other income'];
const EXPENSE_CATEGORIES = ['Purchases', 'Transportation', 'Packaging', 'Labour', 'Other expenses'];
const GRAIN_TYPES: GrainType[] = ['Rice', 'Maize', 'Soybean', 'Other', 'None'];

export const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTransaction,
}) => {
  const [type, setType] = useState<TransactionType>('income');
  const [amountStr, setAmountStr] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [category, setCategory] = useState<string>('Grain sales');
  const [grainType, setGrainType] = useState<GrainType>('Rice');
  const [description, setDescription] = useState<string>('');
  const [errors, setErrors] = useState<{ amount?: string; date?: string; category?: string }>({});

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmountStr(String(initialTransaction.amount));
      setDate(initialTransaction.date);
      setCategory(initialTransaction.category);
      setGrainType(initialTransaction.grainType || 'None');
      setDescription(initialTransaction.description || '');
    } else {
      // Reset defaults
      setType('income');
      setAmountStr('');
      setDate(getTodayDateString());
      setCategory('Grain sales');
      setGrainType('Rice');
      setDescription('');
    }
    setErrors({});
  }, [initialTransaction, isOpen]);

  // When type toggles, adjust default category if mismatched
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'income' && !INCOME_CATEGORIES.includes(category)) {
      setCategory('Grain sales');
    } else if (newType === 'expense' && !EXPENSE_CATEGORIES.includes(category)) {
      setCategory('Purchases');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { amount?: string; date?: string; category?: string } = {};

    const cleanAmount = parseFloat(amountStr.replace(/,/g, '').trim());
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than ₦0';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (!category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      type,
      amount: cleanAmount,
      date,
      category,
      grainType: grainType === 'None' ? undefined : grainType,
      description: description.trim() || undefined,
    });

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
          <h2 className="text-lg font-bold text-[#1E2621]">
            {initialTransaction ? 'Edit Transaction' : 'Record New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-[#6B756F] hover:text-[#1E2621] p-1.5 rounded-lg hover:bg-[#EBE8DF] transition-colors"
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Income vs Expense Toggle */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-2">
              Transaction Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('income')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                  type === 'income'
                    ? 'bg-[#107548] text-white border-[#107548] shadow-sm'
                    : 'bg-[#F9FAF8] text-[#4D5751] border-[#D6D2C4] hover:bg-[#F0EFE9]'
                }`}
              >
                <ArrowDownRight className="w-5 h-5 text-emerald-200" />
                <span>Income (Money In)</span>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('expense')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                  type === 'expense'
                    ? 'bg-[#C2410C] text-white border-[#C2410C] shadow-sm'
                    : 'bg-[#F9FAF8] text-[#4D5751] border-[#D6D2C4] hover:bg-[#F0EFE9]'
                }`}
              >
                <ArrowUpRight className="w-5 h-5 text-amber-200" />
                <span>Expense (Money Out)</span>
              </button>
            </div>
          </div>

          {/* Amount (₦) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="tx-amount" className="block text-xs font-bold uppercase tracking-wider text-[#556059]">
                Amount in Naira (₦) *
              </label>
              {!isNaN(parsedAmount) && parsedAmount > 0 && (
                <span className="text-xs font-bold text-[#144D34] bg-[#E7F3ED] px-2 py-0.5 rounded-md">
                  {formatNaira(parsedAmount)}
                </span>
              )}
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-[#8C9690]">
                ₦
              </span>
              <input
                id="tx-amount"
                type="number"
                step="any"
                min="1"
                placeholder="e.g. 250000"
                value={amountStr}
                onChange={(e) => {
                  setAmountStr(e.target.value);
                  if (errors.amount) setErrors(prev => ({ ...prev, amount: undefined }));
                }}
                className={`w-full pl-9 pr-4 py-3 rounded-xl border text-base font-semibold text-[#1E2621] focus:outline-none focus:ring-2 focus:ring-[#144D34] focus:border-transparent ${
                  errors.amount ? 'border-red-500 bg-red-50/30' : 'border-[#D5D1C7] bg-white'
                }`}
                autoFocus
              />
            </div>
            {errors.amount && (
              <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.amount}</p>
            )}
          </div>

          {/* Date & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <label htmlFor="tx-date" className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
                Date *
              </label>
              <input
                id="tx-date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  if (errors.date) setErrors(prev => ({ ...prev, date: undefined }));
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium text-[#1E2621] focus:outline-none focus:ring-2 focus:ring-[#144D34] ${
                  errors.date ? 'border-red-500' : 'border-[#D5D1C7] bg-white'
                }`}
              />
              {errors.date && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.date}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="tx-category" className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
                Category *
              </label>
              <select
                id="tx-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D1C7] bg-white text-sm font-medium text-[#1E2621] focus:outline-none focus:ring-2 focus:ring-[#144D34]"
              >
                {type === 'income' ? (
                  INCOME_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                ) : (
                  EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Grain Type (Optional) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
              Grain Type <span className="text-[#8C9690] font-normal">(Optional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {GRAIN_TYPES.map(grain => (
                <button
                  type="button"
                  key={grain}
                  onClick={() => setGrainType(grain)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    grainType === grain
                      ? 'bg-[#144D34] text-white border-[#144D34]'
                      : 'bg-[#F9FAF8] text-[#556059] border-[#D5D1C7] hover:bg-[#EFECE3]'
                  }`}
                >
                  {grain === 'None' ? 'Not Applicable' : grain}
                </button>
              ))}
            </div>
          </div>

          {/* Description (Optional) */}
          <div>
            <label htmlFor="tx-desc" className="block text-xs font-bold uppercase tracking-wider text-[#556059] mb-1.5">
              Description <span className="text-[#8C9690] font-normal">(Optional)</span>
            </label>
            <input
              id="tx-desc"
              type="text"
              placeholder="e.g. 10 bags Faro rice sold to Mama Kemi"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D5D1C7] bg-white text-sm text-[#1E2621] focus:outline-none focus:ring-2 focus:ring-[#144D34]"
              maxLength={150}
            />
          </div>

          {/* Quick WhatsApp option notice */}
          <div className="p-3 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-between text-xs text-[#166534]">
            <div className="flex items-center gap-2">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Prefer WhatsApp? Send your entry to our business line.</span>
            </div>
            <a
              href={buildWhatsAppChatUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline text-[#15803D] hover:text-[#166534] shrink-0 ml-2"
            >
              Open WhatsApp
            </a>
          </div>

          {/* Action buttons */}
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
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm transition-all ${
                type === 'income'
                  ? 'bg-[#107548] hover:bg-[#0C5836] active:bg-[#0A472C]'
                  : 'bg-[#C2410C] hover:bg-[#9A3412] active:bg-[#7C2D12]'
              }`}
            >
              {initialTransaction ? 'Save Changes' : (type === 'income' ? 'Record Income (₦)' : 'Record Expense (₦)')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
