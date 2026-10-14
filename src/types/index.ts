export type TransactionType = 'income' | 'expense';

export type GrainType = 'Rice' | 'Maize' | 'Soybean' | 'Other' | 'None';

export type IncomeCategory = 'Grain sales' | 'Other income';

export type ExpenseCategory = 
  | 'Purchases' 
  | 'Transportation' 
  | 'Packaging' 
  | 'Labour' 
  | 'Other expenses';

export type TransactionCategory = IncomeCategory | ExpenseCategory | string;

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // in Nigerian Naira (₦)
  date: string; // YYYY-MM-DD
  category: TransactionCategory;
  description?: string;
  grainType?: GrainType;
  createdAt: string; // ISO string
  updatedAt?: string; // ISO string
  // For future WhatsApp integration architecture
  rawInputText?: string;
}

export interface DebtRepayment {
  id: string;
  debtId: string;
  amount: number; // in Nigerian Naira (₦)
  date: string; // YYYY-MM-DD
  note?: string;
  createdAt: string;
}

export interface Debt {
  id: string;
  customerName: string;
  originalAmount: number; // in Nigerian Naira (₦)
  dateRecorded: string; // YYYY-MM-DD
  note?: string;
  repayments: DebtRepayment[];
  createdAt: string;
}

export type DateFilterOption = 'all' | 'today' | 'this_week' | 'this_month' | 'custom';

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ProfitSummaryBreakdown {
  totalIncome: number;
  totalExpenses: number;
  estimatedProfit: number;
  incomeCategories: { category: string; amount: number; percentage: number }[];
  expenseCategories: { category: string; amount: number; percentage: number }[];
  grainSales: { grain: string; amount: number; percentage: number }[];
  incomeCount: number;
  expenseCount: number;
}

// User & Business Profile Types
export type BusinessType = 'Grain Trader' | 'Retailer' | 'Aggregator' | 'Agro-dealer' | 'Other';

export type MainGrainType = 'Rice' | 'Maize' | 'Soybean' | 'Multiple';

export interface BusinessProfile {
  id: string; // matches auth user id
  email: string;
  fullName: string;
  businessName: string;
  businessType: BusinessType;
  mainGrain: MainGrainType;
  stateOfOperation?: string;
  createdAt: string;
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  businessName: string;
  businessType: BusinessType;
  mainGrain: MainGrainType;
  stateOfOperation: string;
}
