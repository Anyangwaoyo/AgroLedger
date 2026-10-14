import { Transaction, Debt, DebtRepayment } from '../types';
import { getTodayDateString } from '../utils/formatters';
import { authService } from './authService';

const BASE_TRANSACTIONS_KEY = 'agroledger_transactions_v3';
const BASE_DEBTS_KEY = 'agroledger_debts_v3';
const BASE_DEMO_KEY = 'agroledger_is_demo_v3';

// Realistic sample data for Nigerian grain business demo
export function generateSampleData(): { transactions: Transaction[]; debts: Debt[] } {
  const today = getTodayDateString();
  
  // Calculate relative dates
  const d = new Date();
  const formatOffset = (offsetDays: number) => {
    const copy = new Date(d);
    copy.setDate(copy.getDate() + offsetDays);
    const year = copy.getFullYear();
    const month = String(copy.getMonth() + 1).padStart(2, '0');
    const day = String(copy.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const sampleTransactions: Transaction[] = [
    {
      id: 'tx_demo_1',
      type: 'income',
      amount: 480000,
      date: today,
      category: 'Grain sales',
      grainType: 'Maize',
      description: 'Sale of 16 bags of yellow maize to Mama Kemi',
      createdAt: new Date().toISOString(),
      rawInputText: 'I sold 16 bags of maize for N480,000 today to Mama Kemi'
    },
    {
      id: 'tx_demo_2',
      type: 'expense',
      amount: 45000,
      date: today,
      category: 'Transportation',
      grainType: 'Maize',
      description: 'Truck charter from depot to retail stall',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'tx_demo_3',
      type: 'income',
      amount: 620000,
      date: formatOffset(-1),
      category: 'Grain sales',
      grainType: 'Rice',
      description: 'Sale of 10 bags of milled Faro 44 rice',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      rawInputText: 'Sold 10 bags Faro rice for N620,000 yesterday'
    },
    {
      id: 'tx_demo_4',
      type: 'expense',
      amount: 350000,
      date: formatOffset(-2),
      category: 'Purchases',
      grainType: 'Soybean',
      description: 'Bought 8 bags of clean soybeans from Benue aggregator',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'tx_demo_5',
      type: 'expense',
      amount: 18000,
      date: formatOffset(-2),
      category: 'Labour',
      grainType: 'Other',
      description: 'Offloading fee for 4 workers at warehouse',
      createdAt: new Date(Date.now() - 170000000).toISOString(),
    },
    {
      id: 'tx_demo_6',
      type: 'income',
      amount: 210000,
      date: formatOffset(-3),
      category: 'Grain sales',
      grainType: 'Soybean',
      description: 'Sale of 4 bags of soybeans to poultry feed mill',
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: 'tx_demo_7',
      type: 'expense',
      amount: 12000,
      date: formatOffset(-4),
      category: 'Packaging',
      grainType: 'Rice',
      description: '50kg woven sacks and sewing thread',
      createdAt: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: 'tx_demo_8',
      type: 'income',
      amount: 25000,
      date: formatOffset(-5),
      category: 'Other income',
      grainType: 'None',
      description: 'Sale of empty used sacks and grain chaff',
      createdAt: new Date(Date.now() - 432000000).toISOString(),
    }
  ];

  const sampleDebts: Debt[] = [
    {
      id: 'debt_demo_1',
      customerName: 'Alhaji Bashir (Bodija Market)',
      originalAmount: 320000,
      dateRecorded: formatOffset(-7),
      note: 'Took 10 bags of maize on credit, agreed 2 weeks payment',
      repayments: [
        {
          id: 'rep_demo_1_1',
          debtId: 'debt_demo_1',
          amount: 150000,
          date: formatOffset(-2),
          note: 'First installment paid via bank transfer',
          createdAt: new Date(Date.now() - 172800000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 604800000).toISOString()
    },
    {
      id: 'debt_demo_2',
      customerName: 'Mrs. Chinyere Okafor',
      originalAmount: 180000,
      dateRecorded: formatOffset(-10),
      note: '3 bags of Faro Rice supplied for restaurant catering',
      repayments: [],
      createdAt: new Date(Date.now() - 864000000).toISOString()
    },
    {
      id: 'debt_demo_3',
      customerName: 'Ibrahim Danladi Feedmill',
      originalAmount: 240000,
      dateRecorded: formatOffset(-14),
      note: '6 bags broken maize for animal feed formulation',
      repayments: [
        {
          id: 'rep_demo_3_1',
          debtId: 'debt_demo_3',
          amount: 100000,
          date: formatOffset(-8),
          note: 'Part payment',
          createdAt: new Date(Date.now() - 691200000).toISOString()
        },
        {
          id: 'rep_demo_3_2',
          debtId: 'debt_demo_3',
          amount: 140000,
          date: formatOffset(-1),
          note: 'Final balance paid in cash',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 1209600000).toISOString()
    }
  ];

  return { transactions: sampleTransactions, debts: sampleDebts };
}

class StorageService {
  private memoryTransactions: Transaction[] = [];
  private memoryDebts: Debt[] = [];
  private memoryIsDemo: boolean = false;
  private currentUserId: string = 'guest';
  private hasInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('agroledger_auth_changed', () => {
        this.syncWithActiveUser();
      });
    }
  }

  private getStorageKeys() {
    const uid = this.currentUserId;
    return {
      txKey: `${BASE_TRANSACTIONS_KEY}_${uid}`,
      debtsKey: `${BASE_DEBTS_KEY}_${uid}`,
      demoKey: `${BASE_DEMO_KEY}_${uid}`,
    };
  }

  private isStorageAvailable(): boolean {
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  public syncWithActiveUser() {
    const profile = authService.getProfile();
    const newUserId = profile ? profile.id : 'guest';
    this.currentUserId = newUserId;
    this.hasInitialized = false;
    this.initIfNeeded();
  }

  private initIfNeeded() {
    if (this.hasInitialized) return;
    this.hasInitialized = true;

    const profile = authService.getProfile();
    this.currentUserId = profile ? profile.id : 'guest';
    const { txKey, debtsKey, demoKey } = this.getStorageKeys();

    if (this.isStorageAvailable()) {
      const storedTx = window.localStorage.getItem(txKey);
      const storedDebts = window.localStorage.getItem(debtsKey);
      const storedDemo = window.localStorage.getItem(demoKey);

      if (storedTx) {
        try {
          this.memoryTransactions = JSON.parse(storedTx);
        } catch {
          this.memoryTransactions = [];
        }
      } else {
        this.memoryTransactions = [];
      }

      if (storedDebts) {
        try {
          this.memoryDebts = JSON.parse(storedDebts);
        } catch {
          this.memoryDebts = [];
        }
      } else {
        this.memoryDebts = [];
      }

      this.memoryIsDemo = storedDemo === 'true';
    }
  }

  private persist() {
    if (this.isStorageAvailable()) {
      const { txKey, debtsKey, demoKey } = this.getStorageKeys();
      try {
        window.localStorage.setItem(txKey, JSON.stringify(this.memoryTransactions));
        window.localStorage.setItem(debtsKey, JSON.stringify(this.memoryDebts));
        window.localStorage.setItem(demoKey, this.memoryIsDemo ? 'true' : 'false');
      } catch (e) {
        console.error('Failed to persist to localStorage:', e);
      }
    }
    // Dispatch custom event for reactive multi-component synchronization
    window.dispatchEvent(new Event('agroledger_data_changed'));
  }

  // --- Transactions ---

  public getTransactions(): Transaction[] {
    this.initIfNeeded();
    // Return sorted newest first by date, then createdAt
    return [...this.memoryTransactions].sort((a, b) => {
      const dateCmp = b.date.localeCompare(a.date);
      if (dateCmp !== 0) return dateCmp;
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }

  public addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Transaction {
    this.initIfNeeded();
    const newTx: Transaction = {
      ...tx,
      id: 'tx_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      createdAt: new Date().toISOString()
    };
    this.memoryTransactions.push(newTx);
    this.persist();
    return newTx;
  }

  public updateTransaction(id: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Transaction | null {
    this.initIfNeeded();
    const index = this.memoryTransactions.findIndex(t => t.id === id);
    if (index === -1) return null;

    const existing = this.memoryTransactions[index];
    const updated: Transaction = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString()
    };
    this.memoryTransactions[index] = updated;
    this.persist();
    return updated;
  }

  public deleteTransaction(id: string): boolean {
    this.initIfNeeded();
    const prevLen = this.memoryTransactions.length;
    this.memoryTransactions = this.memoryTransactions.filter(t => t.id !== id);
    const changed = this.memoryTransactions.length !== prevLen;
    if (changed) {
      this.persist();
    }
    return changed;
  }

  // --- Debts ---

  public getDebts(): Debt[] {
    this.initIfNeeded();
    return [...this.memoryDebts];
  }

  public addDebt(debt: Omit<Debt, 'id' | 'createdAt' | 'repayments'>): Debt {
    this.initIfNeeded();
    const newDebt: Debt = {
      ...debt,
      id: 'debt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      repayments: [],
      createdAt: new Date().toISOString()
    };
    this.memoryDebts.push(newDebt);
    this.persist();
    return newDebt;
  }

  public addRepayment(debtId: string, repayment: Omit<DebtRepayment, 'id' | 'createdAt' | 'debtId'>): Debt | null {
    this.initIfNeeded();
    const debt = this.memoryDebts.find(d => d.id === debtId);
    if (!debt) return null;

    const newRepayment: DebtRepayment = {
      ...repayment,
      id: 'rep_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      debtId: debt.id,
      createdAt: new Date().toISOString()
    };

    if (!debt.repayments) {
      debt.repayments = [];
    }
    debt.repayments.push(newRepayment);
    this.persist();
    return debt;
  }

  public deleteDebt(id: string): boolean {
    this.initIfNeeded();
    const prevLen = this.memoryDebts.length;
    this.memoryDebts = this.memoryDebts.filter(d => d.id !== id);
    const changed = this.memoryDebts.length !== prevLen;
    if (changed) {
      this.persist();
    }
    return changed;
  }

  // --- Demo / Clean Data Management ---

  public isDemoMode(): boolean {
    this.initIfNeeded();
    return this.memoryIsDemo;
  }

  public loadSampleData(): void {
    const { transactions, debts } = generateSampleData();
    this.memoryTransactions = transactions;
    this.memoryDebts = debts;
    this.memoryIsDemo = true;
    this.persist();
  }

  public clearAllData(): void {
    this.memoryTransactions = [];
    this.memoryDebts = [];
    this.memoryIsDemo = false;
    this.persist();
  }
}

export const storageService = new StorageService();
