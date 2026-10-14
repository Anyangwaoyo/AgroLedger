import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  History, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Search,
  Users,
  AlertCircle
} from 'lucide-react';
import { Debt, DebtRepayment } from '../../types';
import { 
  formatNaira, 
  formatDate, 
  getDebtOutstandingBalance, 
  getDebtTotalRepaid, 
  isDebtPaid 
} from '../../utils/formatters';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { RepaymentModal } from './RepaymentModal';
import { DebtHistoryModal } from './DebtHistoryModal';

interface DebtsViewProps {
  debts: Debt[];
  onAddDebt: () => void;
  onAddRepayment: (debtId: string, repayment: Omit<DebtRepayment, 'id' | 'createdAt' | 'debtId'>) => void;
  onDeleteDebt: (id: string) => void;
  requireAuth?: (actionName: string, action: () => void) => boolean;
}

export const DebtsView: React.FC<DebtsViewProps> = ({
  debts,
  onAddDebt,
  onAddRepayment,
  onDeleteDebt,
  requireAuth,
}) => {
  // Tabs: 'outstanding' | 'all' | 'paid' (defaults to 'outstanding' so outstanding debts show first!)
  const [activeFilter, setActiveFilter] = useState<'outstanding' | 'all' | 'paid'>('outstanding');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [repayingDebt, setRepayingDebt] = useState<Debt | null>(null);
  const [historyDebt, setHistoryDebt] = useState<Debt | null>(null);
  const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);

  // Overall metrics
  const metrics = useMemo(() => {
    let totalOutstanding = 0;
    let totalOriginal = 0;
    let totalRepaid = 0;
    let outstandingCount = 0;
    let paidCount = 0;

    debts.forEach(d => {
      const orig = Number(d.originalAmount) || 0;
      const repaid = getDebtTotalRepaid(d);
      const bal = getDebtOutstandingBalance(d);

      totalOriginal += orig;
      totalRepaid += repaid;
      totalOutstanding += bal;

      if (bal > 0) outstandingCount++;
      else paidCount++;
    });

    return {
      totalOutstanding,
      totalOriginal,
      totalRepaid,
      outstandingCount,
      paidCount,
      totalCount: debts.length
    };
  }, [debts]);

  // Filtered and sorted debts (Outstanding first)
  const filteredDebts = useMemo(() => {
    return debts
      .filter(d => {
        const isPaid = isDebtPaid(d);
        if (activeFilter === 'outstanding' && isPaid) return false;
        if (activeFilter === 'paid' && !isPaid) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const nameMatch = d.customerName.toLowerCase().includes(q);
          const noteMatch = (d.note || '').toLowerCase().includes(q);
          if (!nameMatch && !noteMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Outstanding debts always first
        const balA = getDebtOutstandingBalance(a);
        const balB = getDebtOutstandingBalance(b);
        if (balA > 0 && balB === 0) return -1;
        if (balA === 0 && balB > 0) return 1;

        // Then by date recorded newest first
        const dateCmp = b.dateRecorded.localeCompare(a.dateRecorded);
        if (dateCmp !== 0) return dateCmp;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
  }, [debts, activeFilter, searchQuery]);

  const confirmDelete = () => {
    if (debtToDelete) {
      onDeleteDebt(debtToDelete.id);
      setDebtToDelete(null);
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 pb-28 md:pb-12">
      {/* Top action & header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E2621]">
            Debt Tracking
          </h1>
          <p className="text-sm text-[#556059] mt-1">
            Track customers who owe you for grain, record repayments, and monitor remaining balances.
          </p>
        </div>

        <button
          onClick={onAddDebt}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#144D34] text-white font-bold text-sm shadow-md hover:bg-[#0F3D29] active:bg-[#0A2D1E] transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Record Customer Debt
        </button>
      </div>

      {/* Accounting Protection Banner */}
      <div className="bg-[#FAF9F5] border border-[#E3DFD4] p-3.5 sm:p-4 rounded-2xl flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#556059]">
          <span className="font-bold text-[#1E2621]">Clean Accounting Guarantee: </span>
          Debt repayments update customer balances and are kept separate from new income. This prevents accidental double-counting of revenue in your profit calculations.
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Outstanding */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
              Total Money Owed To You
            </span>
            <span className="p-1.5 rounded-lg bg-[#FEF3C7] text-[#B45309]">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#B45309] mt-2 font-mono">
            {formatNaira(metrics.totalOutstanding)}
          </p>
          <p className="text-xs text-[#6B756F] mt-1">
            {metrics.outstandingCount} {metrics.outstandingCount === 1 ? 'customer owes balance' : 'customers owe balances'}
          </p>
        </div>

        {/* Total Recovered */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
              Total Repayments Collected
            </span>
            <span className="p-1.5 rounded-lg bg-[#E7F3ED] text-[#107548]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#107548] mt-2 font-mono">
            {formatNaira(metrics.totalRepaid)}
          </p>
          <p className="text-xs text-[#6B756F] mt-1">
            {metrics.paidCount} fully settled debts
          </p>
        </div>

        {/* Total Credit Issued */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
              Total Credit Extended
            </span>
            <span className="p-1.5 rounded-lg bg-[#F4F2EB] text-[#556059]">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[#1E2621] mt-2 font-mono">
            {formatNaira(metrics.totalOriginal)}
          </p>
          <p className="text-xs text-[#6B756F] mt-1">
            Across {metrics.totalCount} debt records
          </p>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF] shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex items-center bg-[#F4F2EB] p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('outstanding')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'outstanding'
                ? 'bg-white text-[#B45309] shadow-2xs'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            Outstanding ({metrics.outstandingCount})
          </button>
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'all'
                ? 'bg-white text-[#1E2621] shadow-2xs'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            All Debts ({metrics.totalCount})
          </button>
          <button
            onClick={() => setActiveFilter('paid')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeFilter === 'paid'
                ? 'bg-white text-[#107548] shadow-2xs'
                : 'text-[#6B756F] hover:text-[#1E2621]'
            }`}
          >
            Paid ({metrics.paidCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-[#8C9690] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5D1C7] bg-[#FAF9F5] text-xs font-medium text-[#1E2621] placeholder:text-[#8C9690] focus:ring-2 focus:ring-[#144D34]"
          />
        </div>
      </div>

      {/* Debt Cards List */}
      {filteredDebts.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 sm:p-12 text-center border border-[#E8E6DF] shadow-xs">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F4F2EB] flex items-center justify-center text-[#8C9690]">
            <Users className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-[#1E2621]">
            {debts.length === 0
              ? 'No customer debts recorded'
              : activeFilter === 'outstanding'
              ? 'No outstanding debts! All customers have settled up.'
              : 'No matching customer debts'}
          </h3>
          <p className="text-sm text-[#556059] max-w-md mx-auto mt-1 mb-6">
            {debts.length === 0
              ? 'When a customer takes grain on credit, record their name and amount here. You can record partial or full repayments anytime.'
              : 'Try changing your filter or search query.'}
          </p>
          {debts.length === 0 && (
            <button
              onClick={onAddDebt}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#144D34] text-white font-bold text-sm hover:bg-[#0F3D29] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Record First Debt
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDebts.map(debt => {
            const original = Number(debt.originalAmount) || 0;
            const repaid = getDebtTotalRepaid(debt);
            const balance = getDebtOutstandingBalance(debt);
            const isPaid = balance <= 0;
            const percentRepaid = original > 0 ? Math.min(100, Math.round((repaid / original) * 100)) : 0;
            const repaymentsCount = debt.repayments?.length || 0;

            return (
              <div 
                key={debt.id} 
                className="bg-white rounded-2xl border border-[#E8E6DF] p-5 shadow-xs hover:border-[#D5D1C7] transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Name & Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-[#1E2621]">
                        {debt.customerName}
                      </h3>
                      <p className="text-xs text-[#6B756F]">
                        Recorded on {formatDate(debt.dateRecorded)}
                      </p>
                    </div>

                    <div>
                      {isPaid ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E7F3ED] text-[#107548]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-[#FEF3C7] text-[#B45309]">
                          <Clock className="w-3.5 h-3.5" />
                          Outstanding
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Financial Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 bg-[#FAF9F5] p-3 rounded-xl border border-[#E8E6DF] my-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B756F] block">Original</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#1E2621]">{formatNaira(original)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B756F] block">Repaid</span>
                      <span className="text-xs sm:text-sm font-semibold text-[#107548]">{formatNaira(repaid)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#6B756F] block">Balance</span>
                      <span className={`text-xs sm:text-sm font-bold font-mono ${isPaid ? 'text-[#107548]' : 'text-[#B45309]'}`}>
                        {formatNaira(balance)}
                      </span>
                    </div>
                  </div>

                  {/* Repayment Progress bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-[11px] text-[#6B756F]">
                      <span>{percentRepaid}% repaid</span>
                      <span>{repaymentsCount} {repaymentsCount === 1 ? 'payment made' : 'payments made'}</span>
                    </div>
                    <div className="w-full h-2 bg-[#E8E6DF] rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${
                          isPaid ? 'bg-[#107548]' : 'bg-[#D97706]'
                        }`}
                        style={{ width: `${percentRepaid}%` }}
                      />
                    </div>
                  </div>

                  {/* Note if exists */}
                  {debt.note && (
                    <p className="text-xs text-[#556059] bg-[#F7F6F0] p-2 rounded-lg mb-3">
                      <strong className="text-[#1E2621]">Note:</strong> {debt.note}
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-[#E8E6DF] flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setHistoryDebt(debt)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#4D5751] bg-[#F4F2EB] hover:bg-[#EAE6DB] transition-colors"
                      title="View repayment history"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>History ({repaymentsCount})</span>
                    </button>
                    <button
                      onClick={() => {
                        if (requireAuth) {
                          requireAuth('deleting customer debts', () => setDebtToDelete(debt));
                        } else {
                          setDebtToDelete(debt);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#6B756F] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete customer debt record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {!isPaid && (
                    <button
                      onClick={() => {
                        if (requireAuth) {
                          requireAuth('recording debt repayments', () => setRepayingDebt(debt));
                        } else {
                          setRepayingDebt(debt);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#107548] hover:bg-[#0C5836] shadow-2xs transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Record Repayment
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Repayment Modal */}
      <RepaymentModal
        isOpen={!!repayingDebt}
        debt={repayingDebt}
        onClose={() => setRepayingDebt(null)}
        onSubmit={onAddRepayment}
      />

      {/* Debt History Modal */}
      <DebtHistoryModal
        isOpen={!!historyDebt}
        debt={historyDebt}
        onClose={() => setHistoryDebt(null)}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!debtToDelete}
        title="Delete Customer Debt?"
        message={`Are you sure you want to delete the debt record for "${debtToDelete?.customerName}" (Original: ${debtToDelete ? formatNaira(debtToDelete.originalAmount) : ''})? This will also delete any associated repayment history.`}
        confirmLabel="Yes, Delete Record"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={confirmDelete}
        onCancel={() => setDebtToDelete(null)}
      />
    </div>
  );
};
