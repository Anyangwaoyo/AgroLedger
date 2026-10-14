import { Debt, DateFilterOption } from '../types';

/**
 * Formats a number into Nigerian Naira (₦).
 * Uses standard formatting, e.g., ₦250,000 or ₦1,250.50
 */
export function formatNaira(amount: number, showDecimals: boolean = false): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₦0';
  }
  
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  
  const formatted = new Intl.NumberFormat('en-NG', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 2,
  }).format(absAmount);

  return `${isNegative ? '-' : ''}₦${formatted}`;
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a YYYY-MM-DD date string into human-friendly Nigerian date format
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      
      const todayStr = getTodayDateString();
      if (dateString === todayStr) {
        return 'Today';
      }
      
      // Yesterday check
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      if (dateString === yStr) {
        return 'Yesterday';
      }

      return new Intl.DateTimeFormat('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    }
    return dateString;
  } catch {
    return dateString;
  }
}

/**
 * Calculate total repaid for a customer debt
 */
export function getDebtTotalRepaid(debt: Debt): number {
  if (!debt.repayments || debt.repayments.length === 0) return 0;
  return debt.repayments.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
}

/**
 * Calculate outstanding balance for a customer debt
 */
export function getDebtOutstandingBalance(debt: Debt): number {
  const repaid = getDebtTotalRepaid(debt);
  const remaining = Number(debt.originalAmount) - repaid;
  return Math.max(0, remaining);
}

/**
 * Check if a debt is fully paid
 */
export function isDebtPaid(debt: Debt): boolean {
  return getDebtOutstandingBalance(debt) <= 0;
}

/**
 * Returns date range bounds (YYYY-MM-DD) for a given filter
 */
export function getDateRangeForFilter(
  filter: DateFilterOption,
  customStart?: string,
  customEnd?: string
): { start: string; end: string } {
  const today = new Date();
  const formatD = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayStr = formatD(today);

  if (filter === 'today') {
    return { start: todayStr, end: todayStr };
  }

  if (filter === 'this_week') {
    // Current week: Monday to Sunday
    const d = new Date(today);
    const day = d.getDay();
    const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diffToMonday));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { start: formatD(monday), end: formatD(sunday) };
  }

  if (filter === 'this_month') {
    const year = today.getFullYear();
    const month = today.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    return { start: formatD(firstDay), end: formatD(lastDay) };
  }

  if (filter === 'custom' && customStart && customEnd) {
    return { start: customStart, end: customEnd };
  }

  // default / 'all'
  return { start: '1970-01-01', end: '2099-12-31' };
}
