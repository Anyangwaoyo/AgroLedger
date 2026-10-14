import { useState, useEffect, useCallback, useMemo } from 'react';
import { Transaction, Debt, DebtRepayment, DateFilterOption, ProfitSummaryBreakdown } from '../types';
import { storageService } from '../services/storageService';
import { getDebtOutstandingBalance, getDateRangeForFilter, getTodayDateString } from '../utils/formatters';

export function useAgroLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshData = useCallback(() => {
    setTransactions(storageService.getTransactions());
    setDebts(storageService.getDebts());
    setIsDemo(storageService.isDemoMode());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refreshData();

    const handleStorageChange = () => {
      refreshData();
    };

    window.addEventListener('agroledger_data_changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('agroledger_data_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshData]);

  // Actions
  const addTransaction = useCallback((tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const created = storageService.addTransaction(tx);
    refreshData();
    return created;
  }, [refreshData]);

  const updateTransaction = useCallback((id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    const updated = storageService.updateTransaction(id, updates);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteTransaction = useCallback((id: string) => {
    const success = storageService.deleteTransaction(id);
    refreshData();
    return success;
  }, [refreshData]);

  const addDebt = useCallback((debt: Omit<Debt, 'id' | 'createdAt' | 'repayments'>) => {
    const created = storageService.addDebt(debt);
    refreshData();
    return created;
  }, [refreshData]);

  const addRepayment = useCallback((debtId: string, repayment: Omit<DebtRepayment, 'id' | 'createdAt' | 'debtId'>) => {
    const updated = storageService.addRepayment(debtId, repayment);
    refreshData();
    return updated;
  }, [refreshData]);

  const deleteDebt = useCallback((id: string) => {
    const success = storageService.deleteDebt(id);
    refreshData();
    return success;
  }, [refreshData]);

  const loadDemoData = useCallback(() => {
    storageService.loadSampleData();
    refreshData();
  }, [refreshData]);

  const resetToEmpty = useCallback(() => {
    storageService.clearAllData();
    refreshData();
  }, [refreshData]);

  // Aggregated Debt Metrics
  const debtMetrics = useMemo(() => {
    let totalOriginalDebt = 0;
    let totalOutstanding = 0;
    let totalRepaid = 0;
    let outstandingCount = 0;
    let paidCount = 0;

    debts.forEach(d => {
      const orig = Number(d.originalAmount) || 0;
      const repaid = (d.repayments || []).reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
      const balance = Math.max(0, orig - repaid);

      totalOriginalDebt += orig;
      totalRepaid += repaid;
      totalOutstanding += balance;

      if (balance > 0) {
        outstandingCount++;
      } else {
        paidCount++;
      }
    });

    return {
      totalOriginalDebt,
      totalOutstanding,
      totalRepaid,
      totalCount: debts.length,
      outstandingCount,
      paidCount,
    };
  }, [debts]);

  // Sorted debts: Outstanding first, then Paid (sorted newest first within each)
  const sortedDebts = useMemo(() => {
    const outstanding: Debt[] = [];
    const paid: Debt[] = [];

    debts.forEach(d => {
      const balance = getDebtOutstandingBalance(d);
      if (balance > 0) {
        outstanding.push(d);
      } else {
        paid.push(d);
      }
    });

    const sortByDate = (a: Debt, b: Debt) => {
      const dateCmp = b.dateRecorded.localeCompare(a.dateRecorded);
      if (dateCmp !== 0) return dateCmp;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    };

    outstanding.sort(sortByDate);
    paid.sort(sortByDate);

    return [...outstanding, ...paid];
  }, [debts]);

  // Today metrics
  const todayMetrics = useMemo(() => {
    const todayStr = getTodayDateString();
    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
      if (t.date === todayStr) {
        const amt = Number(t.amount) || 0;
        if (t.type === 'income') income += amt;
        if (t.type === 'expense') expenses += amt;
      }
    });

    return {
      income,
      expenses,
      estimatedProfit: income - expenses
    };
  }, [transactions]);

  // Current Month metrics
  const thisMonthMetrics = useMemo(() => {
    const { start, end } = getDateRangeForFilter('this_month');
    let income = 0;
    let expenses = 0;

    transactions.forEach(t => {
      if (t.date >= start && t.date <= end) {
        const amt = Number(t.amount) || 0;
        if (t.type === 'income') income += amt;
        if (t.type === 'expense') expenses += amt;
      }
    });

    return {
      income,
      expenses,
      estimatedProfit: income - expenses
    };
  }, [transactions]);

  // Filtered Profit Breakdown Calculator
  const getProfitSummaryForFilter = useCallback((
    filter: DateFilterOption,
    customStart?: string,
    customEnd?: string
  ): ProfitSummaryBreakdown => {
    const { start, end } = getDateRangeForFilter(filter, customStart, customEnd);
    
    let totalIncome = 0;
    let totalExpenses = 0;
    const incomeCatMap: Record<string, number> = {};
    const expenseCatMap: Record<string, number> = {};
    const grainSalesMap: Record<string, number> = {};
    let incomeCount = 0;
    let expenseCount = 0;

    transactions.forEach(t => {
      if (t.date >= start && t.date <= end) {
        const amt = Number(t.amount) || 0;
        if (t.type === 'income') {
          totalIncome += amt;
          incomeCount++;
          const cat = t.category || 'Other income';
          incomeCatMap[cat] = (incomeCatMap[cat] || 0) + amt;

          // Grain sales breakdown
          if (cat === 'Grain sales' || t.grainType) {
            const grain = t.grainType && t.grainType !== 'None' ? t.grainType : 'Unspecified Grain';
            grainSalesMap[grain] = (grainSalesMap[grain] || 0) + amt;
          }
        } else if (t.type === 'expense') {
          totalExpenses += amt;
          expenseCount++;
          const cat = t.category || 'Other expenses';
          expenseCatMap[cat] = (expenseCatMap[cat] || 0) + amt;
        }
      }
    });

    const estimatedProfit = totalIncome - totalExpenses;

    const incomeCategories = Object.entries(incomeCatMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    const expenseCategories = Object.entries(expenseCatMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    const grainSales = Object.entries(grainSalesMap).map(([grain, amount]) => ({
      grain,
      amount,
      percentage: totalIncome > 0 ? (amount / totalIncome) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    return {
      totalIncome,
      totalExpenses,
      estimatedProfit,
      incomeCategories,
      expenseCategories,
      grainSales,
      incomeCount,
      expenseCount
    };
  }, [transactions]);

  return {
    transactions,
    debts,
    sortedDebts,
    isDemo,
    isLoading,
    debtMetrics,
    todayMetrics,
    thisMonthMetrics,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addDebt,
    addRepayment,
    deleteDebt,
    loadDemoData,
    resetToEmpty,
    getProfitSummaryForFilter
  };
}
