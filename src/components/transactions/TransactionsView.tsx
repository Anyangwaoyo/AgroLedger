import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Trash2, 
  Pencil, 
  Calendar, 
  Tag, 
  ArrowDownRight, 
  ArrowUpRight,
  ReceiptText
} from 'lucide-react';
import { Transaction, TransactionType, DateFilterOption, GrainType } from '../../types';
import { formatNaira, formatDate, getDateRangeForFilter } from '../../utils/formatters';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { WhatsAppRecordButton } from '../whatsapp/WhatsAppRecordButton';

interface TransactionsViewProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  requireAuth?: (actionName: string, action: () => void) => boolean;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  requireAuth,
}) => {
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [dateFilter, setDateFilter] = useState<DateFilterOption>('all');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');
  const [grainFilter, setGrainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Delete confirmation modal state
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    const { start, end } = getDateRangeForFilter(dateFilter, customStart, customEnd);

    return transactions.filter(t => {
      // Type filter
      if (typeFilter !== 'all' && t.type !== typeFilter) {
        return false;
      }

      // Date range filter
      if (t.date < start || t.date > end) {
        return false;
      }

      // Grain filter
      if (grainFilter !== 'all') {
        if (grainFilter === 'none') {
          if (t.grainType && t.grainType !== 'None') return false;
        } else {
          if (t.grainType !== grainFilter) return false;
        }
      }

      // Search query filter (matches category, description, grainType)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const catMatch = (t.category || '').toLowerCase().includes(query);
        const descMatch = (t.description || '').toLowerCase().includes(query);
        const grainMatch = (t.grainType || '').toLowerCase().includes(query);
        if (!catMatch && !descMatch && !grainMatch) return false;
      }

      return true;
    });
  }, [transactions, typeFilter, dateFilter, customStart, customEnd, grainFilter, searchQuery]);

  // Running totals for the filtered subset
  const filteredTotals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    filteredTransactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === 'income') income += amt;
      else expenses += amt;
    });
    return {
      income,
      expenses,
      net: income - expenses,
      count: filteredTransactions.length
    };
  }, [filteredTransactions]);

  const confirmDelete = () => {
    if (txToDelete) {
      onDeleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-28 md:pb-12">
      {/* Top action & header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E2621]">
            Transactions
          </h1>
          <p className="text-sm text-[#556059] mt-1">
            Record, track, and filter your daily grain sales and business expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <WhatsAppRecordButton showHelperText={false} size="md" />

          <button
            onClick={onAddTransaction}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#144D34] text-white font-bold text-sm shadow-md hover:bg-[#0F3D29] active:bg-[#0A2D1E] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Record Transaction
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E8E6DF] shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Type Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B756F] mb-1.5">
              Type
            </label>
            <div className="grid grid-cols-3 gap-1 bg-[#F4F2EB] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setTypeFilter('all')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  typeFilter === 'all'
                    ? 'bg-white text-[#1E2621] shadow-2xs'
                    : 'text-[#6B756F] hover:text-[#1E2621]'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('income')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  typeFilter === 'income'
                    ? 'bg-[#107548] text-white shadow-2xs'
                    : 'text-[#107548] hover:bg-[#E7F3ED]'
                }`}
              >
                Income
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter('expense')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  typeFilter === 'expense'
                    ? 'bg-[#C2410C] text-white shadow-2xs'
                    : 'text-[#C2410C] hover:bg-[#FEECEB]'
                }`}
              >
                Expense
              </button>
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B756F] mb-1.5">
              Period
            </label>
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as DateFilterOption)}
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-[#D5D1C7] bg-[#FAF9F5] text-xs font-semibold text-[#1E2621] focus:ring-2 focus:ring-[#144D34]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="custom">Custom Date Range</option>
              </select>
            </div>
          </div>

          {/* Grain Type Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B756F] mb-1.5">
              Grain Filter
            </label>
            <select
              value={grainFilter}
              onChange={(e) => setGrainFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D5D1C7] bg-[#FAF9F5] text-xs font-semibold text-[#1E2621] focus:ring-2 focus:ring-[#144D34]"
            >
              <option value="all">All Grains / Items</option>
              <option value="Rice">Rice only</option>
              <option value="Maize">Maize only</option>
              <option value="Soybean">Soybean only</option>
              <option value="Other">Other Grains</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B756F] mb-1.5">
              Search
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search note, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5D1C7] bg-[#FAF9F5] text-xs font-medium text-[#1E2621] placeholder:text-[#8C9690] focus:ring-2 focus:ring-[#144D34]"
              />
            </div>
          </div>
        </div>

        {/* Custom Date Pickers if selected */}
        {dateFilter === 'custom' && (
          <div className="pt-2 border-t border-[#E8E6DF] flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#556059]">From:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#D5D1C7] bg-white text-xs text-[#1E2621]"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#556059]">To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#D5D1C7] bg-white text-xs text-[#1E2621]"
              />
            </div>
            {(customStart || customEnd) && (
              <button
                type="button"
                onClick={() => { setCustomStart(''); setCustomEnd(''); }}
                className="text-xs text-[#144D34] hover:underline font-semibold"
              >
                Clear range
              </button>
            )}
          </div>
        )}
      </div>

      {/* Summary tally bar for current view */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F4F2EB] p-3 sm:p-4 rounded-2xl border border-[#E3DFD4]">
          <div className="bg-white px-4 py-3 rounded-xl border border-[#E8E6DF]">
            <span className="text-xs font-bold text-[#6B756F] uppercase tracking-wider block">
              Filtered Income
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#107548]">
              {formatNaira(filteredTotals.income)}
            </span>
          </div>

          <div className="bg-white px-4 py-3 rounded-xl border border-[#E8E6DF]">
            <span className="text-xs font-bold text-[#6B756F] uppercase tracking-wider block">
              Filtered Expenses
            </span>
            <span className="text-lg sm:text-xl font-bold text-[#C2410C]">
              {formatNaira(filteredTotals.expenses)}
            </span>
          </div>

          <div className="bg-white px-4 py-3 rounded-xl border border-[#E8E6DF]">
            <span className="text-xs font-bold text-[#6B756F] uppercase tracking-wider block">
              Net Balance
            </span>
            <span className={`text-lg sm:text-xl font-bold ${
              filteredTotals.net >= 0 ? 'text-[#144D34]' : 'text-red-600'
            }`}>
              {formatNaira(filteredTotals.net)}
            </span>
          </div>
        </div>
      )}

      {/* Transactions Table / List */}
      {filteredTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E8E6DF] shadow-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F4F2EB] flex items-center justify-center text-[#8C9690]">
            <ReceiptText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1E2621]">
            {transactions.length === 0 ? 'No transactions recorded yet' : 'No matching transactions'}
          </h3>
          <p className="text-sm text-[#556059] max-w-md mx-auto mt-1 mb-6">
            {transactions.length === 0
              ? 'Start by recording your grain sales or everyday business expenses. Each entry keeps your numbers accurate.'
              : 'Try clearing your filters or search terms to see other records.'}
          </p>
          {transactions.length === 0 ? (
            <button
              onClick={onAddTransaction}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#144D34] text-white font-bold text-sm hover:bg-[#0F3D29] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Record First Transaction
            </button>
          ) : (
            <button
              onClick={() => {
                setTypeFilter('all');
                setDateFilter('all');
                setGrainFilter('all');
                setSearchQuery('');
              }}
              className="text-sm font-semibold text-[#144D34] hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E8E6DF] shadow-xs overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF9F5] border-b border-[#E8E6DF] text-[11px] font-bold uppercase tracking-wider text-[#6B756F]">
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Grain</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Amount (₦)</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EEE6] text-sm">
                {filteredTransactions.map(tx => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-[#1E2621] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#8C9690]" />
                          <span>{formatDate(tx.date)}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          isIncome 
                            ? 'bg-[#E7F3ED] text-[#107548]' 
                            : 'bg-[#FEECEB] text-[#C2410C]'
                        }`}>
                          {isIncome ? (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          )}
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1E2621] whitespace-nowrap">
                        {tx.category}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {tx.grainType && tx.grainType !== 'None' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-[#F4F2EB] text-[#3D4741] border border-[#E3DFD4]">
                            <Tag className="w-3 h-3 text-[#A89F91]" />
                            {tx.grainType}
                          </span>
                        ) : (
                          <span className="text-xs text-[#A89F91]">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#556059] max-w-xs truncate" title={tx.description}>
                        {tx.description || <span className="text-[#A89F91] italic">No description</span>}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className={`font-mono text-base font-bold ${
                          isIncome ? 'text-[#107548]' : 'text-[#C2410C]'
                        }`}>
                          {isIncome ? '+' : '-'}{formatNaira(tx.amount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            className="p-1.5 rounded-lg text-[#6B756F] hover:text-[#144D34] hover:bg-[#EBF4EE] transition-colors"
                            title="Edit transaction"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (requireAuth) {
                                requireAuth('deleting transactions', () => setTxToDelete(tx));
                              } else {
                                setTxToDelete(tx);
                              }
                            }}
                            className="p-1.5 rounded-lg text-[#6B756F] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List View */}
          <div className="md:hidden divide-y divide-[#F0EEE6]">
            {filteredTransactions.map(tx => {
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          isIncome 
                            ? 'bg-[#E7F3ED] text-[#107548]' 
                            : 'bg-[#FEECEB] text-[#C2410C]'
                        }`}>
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                        <span className="text-xs font-semibold text-[#1E2621]">
                          {tx.category}
                        </span>
                        {tx.grainType && tx.grainType !== 'None' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F4F2EB] text-[#4D5751]">
                            {tx.grainType}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B756F] mt-1">
                        {formatDate(tx.date)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono text-base font-bold block ${
                        isIncome ? 'text-[#107548]' : 'text-[#C2410C]'
                      }`}>
                        {isIncome ? '+' : '-'}{formatNaira(tx.amount)}
                      </span>
                    </div>
                  </div>

                  {tx.description && (
                    <p className="text-xs text-[#556059] bg-[#FAF9F5] p-2 rounded-lg">
                      {tx.description}
                    </p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-[#144D34] bg-[#EBF4EE] hover:bg-[#D5EADB] transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (requireAuth) {
                          requireAuth('deleting transactions', () => setTxToDelete(tx));
                        } else {
                          setTxToDelete(tx);
                        }
                      }}
                      className="px-3 py-1 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!txToDelete}
        title="Delete Transaction?"
        message={`Are you sure you want to delete this ${txToDelete?.type || 'transaction'} record of ${txToDelete ? formatNaira(txToDelete.amount) : ''}? This will remove it from your records and adjust your profit calculations.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setTxToDelete(null)}
      />
    </div>
  );
};
