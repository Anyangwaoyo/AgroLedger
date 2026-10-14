import React from 'react';
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Plus, 
  Clock, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Sparkles,
  ReceiptText
} from 'lucide-react';
import { useAgroLedger } from '../../hooks/useAgroLedger';
import { formatNaira, formatDate, getDebtOutstandingBalance } from '../../utils/formatters';
import { ActiveTab } from '../layout/Navbar';
import { WhatsAppQuickAccessCard } from '../whatsapp/WhatsAppQuickAccessCard';
import { WhatsAppRecordButton } from '../whatsapp/WhatsAppRecordButton';

interface DashboardOverviewProps {
  useAgroLedgerHook: ReturnType<typeof useAgroLedger>;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenTransactionModal: () => void;
  onOpenDebtModal: () => void;
  onLoadDemo: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  useAgroLedgerHook,
  setActiveTab,
  onOpenTransactionModal,
  onOpenDebtModal,
  onLoadDemo,
}) => {
  const { 
    transactions, 
    debts, 
    todayMetrics, 
    thisMonthMetrics, 
    debtMetrics,
    isDemo
  } = useAgroLedgerHook;

  const hasAnyData = transactions.length > 0 || debts.length > 0;
  const recentTransactions = transactions.slice(0, 5);
  
  // Outstanding debts only for the dashboard widget
  const outstandingDebts = debts
    .filter(d => getDebtOutstandingBalance(d) > 0)
    .sort((a, b) => getDebtOutstandingBalance(b) - getDebtOutstandingBalance(a))
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-20 md:pb-12">
      {/* Welcome & Primary Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E2621]">
            Business Overview
          </h1>
          <p className="text-sm text-[#556059] mt-1">
            Simple bookkeeping for rice, maize, and soybean trade in Nigeria.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <WhatsAppRecordButton showHelperText={false} size="md" />

          <button
            onClick={onOpenTransactionModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#144D34] text-white font-bold text-sm shadow-md hover:bg-[#0F3D29] active:bg-[#0A2D1E] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Record Transaction
          </button>
          <button
            onClick={onOpenDebtModal}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5D1C7] bg-white text-[#1E2621] font-bold text-sm hover:bg-[#F4F2EB] active:bg-[#ECE8DD] transition-all cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5] text-[#B45309]" />
            Record Debt
          </button>
        </div>
      </div>

      {/* WhatsApp Quick Access Section */}
      <WhatsAppQuickAccessCard />

      {/* Fresh Account Empty Hero Banner */}
      {!hasAnyData && (
        <div className="bg-gradient-to-br from-[#FAF9F5] to-[#F4F2EB] rounded-2xl p-6 sm:p-8 border border-[#E3DFD4] text-center shadow-xs">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#EBF4EE] text-[#144D34] flex items-center justify-center">
            <ReceiptText className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-[#1E2621]">
            Welcome to AgroLedger
          </h2>
          <p className="text-sm text-[#556059] max-w-lg mx-auto mt-2 mb-6 leading-relaxed">
            Your books are currently clean and empty. Record your first grain sale or expense, or load sample records to explore how AgroLedger tracks transactions, customer debts, and profit.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <WhatsAppRecordButton showHelperText={false} size="md" />
            <button
              onClick={onOpenTransactionModal}
              className="px-5 py-2.5 rounded-xl bg-[#144D34] text-white text-sm font-bold shadow-md hover:bg-[#0F3D29] transition-colors"
            >
              + Record in Web Ledger
            </button>
            <button
              onClick={onLoadDemo}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#C88A22] bg-[#FFFBEB] text-[#92400E] text-sm font-bold hover:bg-[#FEF3C7] transition-colors shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#D97706]" />
              Load Sample Demo Data
            </button>
          </div>
        </div>
      )}

      {/* 3 Core Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Today's Transactions Overview */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
                Today&apos;s Activity
              </span>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-semibold text-[#144D34] hover:underline flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#556059] flex items-center gap-1">
                  <ArrowDownRight className="w-3.5 h-3.5 text-[#107548]" />
                  Income:
                </span>
                <span className="font-semibold text-[#107548] font-mono">
                  {formatNaira(todayMetrics.income)}
                </span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#556059] flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#C2410C]" />
                  Expenses:
                </span>
                <span className="font-semibold text-[#C2410C] font-mono">
                  {formatNaira(todayMetrics.expenses)}
                </span>
              </div>

              <div className="pt-2 border-t border-[#F0EEE6] flex justify-between items-center">
                <span className="text-xs font-bold text-[#1E2621]">
                  Net Today:
                </span>
                <span className={`text-base font-bold font-mono ${
                  todayMetrics.estimatedProfit >= 0 ? 'text-[#144D34]' : 'text-red-600'
                }`}>
                  {formatNaira(todayMetrics.estimatedProfit)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0EEE6]">
            <button
              onClick={onOpenTransactionModal}
              className="w-full py-1.5 text-xs font-semibold text-[#144D34] bg-[#EBF4EE] hover:bg-[#D8EADB] rounded-lg transition-colors text-center"
            >
              + Record new entry
            </button>
          </div>
        </div>

        {/* Card 2: Customer Debts Overview */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
                Customer Debts
              </span>
              <button
                onClick={() => setActiveTab('debts')}
                className="text-xs font-semibold text-[#144D34] hover:underline flex items-center gap-1"
              >
                <span>View Debts</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3">
              <span className="text-xs text-[#556059]">Total Outstanding:</span>
              <p className="text-2xl font-extrabold text-[#B45309] font-mono mt-0.5">
                {formatNaira(debtMetrics.totalOutstanding)}
              </p>
              <p className="text-xs text-[#6B756F] mt-1">
                {debtMetrics.outstandingCount} {debtMetrics.outstandingCount === 1 ? 'customer has unpaid balance' : 'customers have unpaid balance'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0EEE6] flex items-center justify-between text-xs">
            <span className="text-[#6B756F]">Collected so far:</span>
            <span className="font-semibold text-[#107548] font-mono">{formatNaira(debtMetrics.totalRepaid)}</span>
          </div>
        </div>

        {/* Card 3: This Month's Estimated Profit */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
                This Month&apos;s Profit
              </span>
              <button
                onClick={() => setActiveTab('profit')}
                className="text-xs font-semibold text-[#144D34] hover:underline flex items-center gap-1"
              >
                <span>Full Summary</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-3">
              <span className="text-xs text-[#556059]">Estimated Net Profit:</span>
              <p className={`text-2xl font-extrabold font-mono mt-0.5 ${
                thisMonthMetrics.estimatedProfit >= 0 ? 'text-[#144D34]' : 'text-red-600'
              }`}>
                {formatNaira(thisMonthMetrics.estimatedProfit)}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#6B756F] mt-1.5">
                <span>In: <strong className="text-[#107548]">{formatNaira(thisMonthMetrics.income)}</strong></span>
                <span>•</span>
                <span>Out: <strong className="text-[#C2410C]">{formatNaira(thisMonthMetrics.expenses)}</strong></span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F0EEE6]">
            <p className="text-[11px] text-[#8C9690] italic">
              Estimated Profit = Total Income − Total Expenses
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Transactions & Outstanding Debts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Recent Transactions */}
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#144D34]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E2621]">
                Recent Transactions
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('transactions')}
              className="text-xs font-bold text-[#144D34] hover:underline flex items-center gap-1"
            >
              <span>See all</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <p className="text-xs text-[#8C9690] py-8 text-center italic">
              No transactions recorded yet.
            </p>
          ) : (
            <div className="space-y-2.5">
              {recentTransactions.map(tx => {
                const isIncome = tx.type === 'income';
                return (
                  <div 
                    key={tx.id}
                    className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-between hover:bg-[#F4F2EB] transition-colors text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isIncome ? 'bg-[#E7F3ED] text-[#107548]' : 'bg-[#FEECEB] text-[#C2410C]'
                        }`}>
                          {isIncome ? 'Income' : 'Expense'}
                        </span>
                        <span className="font-semibold text-[#1E2621]">{tx.category}</span>
                        {tx.grainType && tx.grainType !== 'None' && (
                          <span className="text-[10px] bg-[#EAE7DC] text-[#4D5751] px-1.5 py-0.5 rounded">
                            {tx.grainType}
                          </span>
                        )}
                      </div>
                      <p className="text-[#6B756F]">
                        {formatDate(tx.date)} {tx.description ? `• ${tx.description}` : ''}
                      </p>
                    </div>

                    <span className={`font-mono font-bold text-sm ${
                      isIncome ? 'text-[#107548]' : 'text-[#C2410C]'
                    }`}>
                      {isIncome ? '+' : '-'}{formatNaira(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Column 2: Outstanding Customer Debts */}
        <div className="bg-white rounded-2xl border border-[#E8E6DF] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#B45309]" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E2621]">
                Customers With Outstanding Balances
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('debts')}
              className="text-xs font-bold text-[#144D34] hover:underline flex items-center gap-1"
            >
              <span>Manage debts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {outstandingDebts.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#8C9690] italic">
              {debts.length === 0 ? 'No customer debts recorded.' : 'All customer debts have been fully settled!'}
            </div>
          ) : (
            <div className="space-y-2.5">
              {outstandingDebts.map(debt => {
                const bal = getDebtOutstandingBalance(debt);
                return (
                  <div 
                    key={debt.id}
                    className="p-3 rounded-xl bg-[#FAF9F5] border border-[#E8E6DF] flex items-center justify-between hover:bg-[#F4F2EB] transition-colors text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#1E2621]">{debt.customerName}</h4>
                      <p className="text-[#6B756F] text-[11px]">
                        Incurred: {formatDate(debt.dateRecorded)} • Orig: {formatNaira(debt.originalAmount)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-[#B45309] block">
                        Owed
                      </span>
                      <span className="font-mono font-bold text-sm text-[#B45309]">
                        {formatNaira(bal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
