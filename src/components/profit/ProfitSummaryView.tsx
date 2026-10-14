import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Printer,
  ShoppingBag,
  Truck,
  Package,
  HardHat,
  MoreHorizontal
} from 'lucide-react';
import { DateFilterOption } from '../../types';
import { useAgroLedger } from '../../hooks/useAgroLedger';
import { formatNaira, getDateRangeForFilter, formatDate } from '../../utils/formatters';

interface ProfitSummaryViewProps {
  useAgroLedgerHook: ReturnType<typeof useAgroLedger>;
}

export const ProfitSummaryView: React.FC<ProfitSummaryViewProps> = ({ useAgroLedgerHook }) => {
  const [selectedFilter, setSelectedFilter] = useState<DateFilterOption>('this_month');
  const [customStart, setCustomStart] = useState<string>('');
  const [customEnd, setCustomEnd] = useState<string>('');

  const { getProfitSummaryForFilter } = useAgroLedgerHook;

  const summary = useMemo(() => {
    return getProfitSummaryForFilter(selectedFilter, customStart, customEnd);
  }, [getProfitSummaryForFilter, selectedFilter, customStart, customEnd]);

  const dateRange = useMemo(() => {
    return getDateRangeForFilter(selectedFilter, customStart, customEnd);
  }, [selectedFilter, customStart, customEnd]);

  const isProfit = summary.estimatedProfit >= 0;

  const handlePrint = () => {
    window.print();
  };

  // Helper for category icon
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'grain sales':
        return <TrendingUp className="w-4 h-4 text-[#107548]" />;
      case 'purchases':
        return <ShoppingBag className="w-4 h-4 text-[#C2410C]" />;
      case 'transportation':
        return <Truck className="w-4 h-4 text-[#C2410C]" />;
      case 'packaging':
        return <Package className="w-4 h-4 text-[#C2410C]" />;
      case 'labour':
        return <HardHat className="w-4 h-4 text-[#C2410C]" />;
      default:
        return <MoreHorizontal className="w-4 h-4 text-[#6B756F]" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1E2621]">
            Profit Summary
          </h1>
          <p className="text-sm text-[#556059] mt-1">
            See your total income, expenses, and estimated net profit for any selected period.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#D5D1C7] bg-white text-xs font-semibold text-[#4D5751] hover:bg-[#F4F2EB] transition-colors shadow-2xs"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Summary</span>
          </button>
        </div>
      </div>

      {/* Date Filter Selector Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E6DF] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
            Select Period:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-[#F4F2EB] p-1 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSelectedFilter('today')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedFilter === 'today'
                  ? 'bg-white text-[#144D34] shadow-2xs'
                  : 'text-[#6B756F] hover:text-[#1E2621]'
              }`}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('this_week')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedFilter === 'this_week'
                  ? 'bg-white text-[#144D34] shadow-2xs'
                  : 'text-[#6B756F] hover:text-[#1E2621]'
              }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('this_month')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedFilter === 'this_month'
                  ? 'bg-white text-[#144D34] shadow-2xs'
                  : 'text-[#6B756F] hover:text-[#1E2621]'
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('custom')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedFilter === 'custom'
                  ? 'bg-white text-[#144D34] shadow-2xs'
                  : 'text-[#6B756F] hover:text-[#1E2621]'
              }`}
            >
              Custom Range
            </button>
          </div>
        </div>

        {/* Custom Date Picker if selected */}
        {selectedFilter === 'custom' && (
          <div className="pt-3 border-t border-[#E8E6DF] flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#556059]">From:</span>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#D5D1C7] bg-[#FAF9F5] text-xs text-[#1E2621]"
              />
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#556059]">To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-[#D5D1C7] bg-[#FAF9F5] text-xs text-[#1E2621]"
              />
            </div>
          </div>
        )}

        {/* Current Active Date Display */}
        <div className="text-xs text-[#6B756F] flex items-center justify-between pt-1">
          <span>
            Period: {selectedFilter === 'today' ? 'Today' : `${formatDate(dateRange.start)} – ${formatDate(dateRange.end)}`}
          </span>
          <span>
            {summary.incomeCount + summary.expenseCount} transactions recorded in this period
          </span>
        </div>
      </div>

      {/* Primary Figures Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
                Total Income
              </span>
              <span className="p-1.5 rounded-lg bg-[#E7F3ED] text-[#107548]">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#107548] mt-3 font-mono">
              {formatNaira(summary.totalIncome)}
            </p>
          </div>
          <div className="pt-4 border-t border-[#F0EEE6] mt-4 flex items-center justify-between text-xs text-[#6B756F]">
            <span>Income transactions:</span>
            <span className="font-semibold text-[#1E2621]">{summary.incomeCount}</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8E6DF] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B756F]">
                Total Expenses
              </span>
              <span className="p-1.5 rounded-lg bg-[#FEECEB] text-[#C2410C]">
                <TrendingDown className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#C2410C] mt-3 font-mono">
              {formatNaira(summary.totalExpenses)}
            </p>
          </div>
          <div className="pt-4 border-t border-[#F0EEE6] mt-4 flex items-center justify-between text-xs text-[#6B756F]">
            <span>Expense transactions:</span>
            <span className="font-semibold text-[#1E2621]">{summary.expenseCount}</span>
          </div>
        </div>

        {/* Estimated Profit (Hero Card) */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
          isProfit 
            ? 'bg-[#144D34] text-white border-[#103E2A]' 
            : 'bg-[#991B1B] text-white border-[#7F1D1D]'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#A7C8B7]">
                Estimated Profit
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/20 text-white uppercase">
                {isProfit ? 'Net Profit' : 'Net Loss'}
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white mt-3 font-mono tracking-tight">
              {formatNaira(summary.estimatedProfit)}
            </p>
          </div>
          <div className="pt-4 border-t border-white/20 mt-4 text-xs text-[#D0E3D8] flex items-center justify-between">
            <span>Formula:</span>
            <span className="font-medium text-white">Income − Expenses</span>
          </div>
        </div>
      </div>

      {/* Explicit Disclaimer / Education Box */}
      <div className="bg-[#FAF9F5] border border-[#E3DFD4] rounded-2xl p-4 sm:p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#556059] space-y-1">
          <p className="font-bold text-[#1E2621]">
            About this Estimated Profit Calculation
          </p>
          <p className="leading-relaxed">
            This figure is strictly calculated as <strong className="text-[#1E2621]">Total Income minus Total Expenses</strong> recorded in AgroLedger for the chosen period. Because it does not account for unsold inventory value, spoilage, or external taxes, it is labeled as an <em>estimated profit</em>.
          </p>
          <p className="text-xs text-[#78716C] pt-1">
            • Note: Customer debt repayments are tracked separately in the Debts module and are <strong>not counted as income</strong> to prevent accidental double-counting.
          </p>
        </div>
      </div>

      {/* Category Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Breakdown by Category */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E2621]">
              Income Breakdown by Category
            </h3>
            <span className="text-xs font-semibold text-[#107548]">
              {formatNaira(summary.totalIncome)}
            </span>
          </div>

          {summary.incomeCategories.length === 0 ? (
            <p className="text-xs text-[#8C9690] py-6 text-center italic">
              No income transactions recorded for this period.
            </p>
          ) : (
            <div className="space-y-3">
              {summary.incomeCategories.map(cat => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1E2621]">
                      {getCategoryIcon(cat.category)}
                      <span>{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#107548]">{formatNaira(cat.amount)}</span>
                      <span className="text-[11px] text-[#8C9690] w-10 text-right">({cat.percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#F4F2EB] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#107548] rounded-full" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Grain Sales Details if present */}
          {summary.grainSales.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[#F0EEE6]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B756F] mb-3">
                Grain Sales Distribution
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {summary.grainSales.map(g => (
                  <div key={g.grain} className="bg-[#FAF9F5] p-2.5 rounded-xl border border-[#E8E6DF] text-xs">
                    <span className="font-bold text-[#1E2621] block">{g.grain}</span>
                    <span className="font-mono text-[#107548] font-bold block">{formatNaira(g.amount)}</span>
                    <span className="text-[10px] text-[#8C9690]">{g.percentage.toFixed(0)}% of income</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Expense Breakdown by Category */}
        <div className="bg-white rounded-2xl p-5 border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E2621]">
              Expense Breakdown by Category
            </h3>
            <span className="text-xs font-semibold text-[#C2410C]">
              {formatNaira(summary.totalExpenses)}
            </span>
          </div>

          {summary.expenseCategories.length === 0 ? (
            <p className="text-xs text-[#8C9690] py-6 text-center italic">
              No expenses recorded for this period.
            </p>
          ) : (
            <div className="space-y-3">
              {summary.expenseCategories.map(cat => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-[#1E2621]">
                      {getCategoryIcon(cat.category)}
                      <span>{cat.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#C2410C]">{formatNaira(cat.amount)}</span>
                      <span className="text-[11px] text-[#8C9690] w-10 text-right">({cat.percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-[#F4F2EB] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#C2410C] rounded-full" 
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
