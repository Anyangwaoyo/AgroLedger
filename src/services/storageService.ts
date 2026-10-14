import { Transaction, Debt, DebtRepayment } from '../types';
import { authService } from './authService';

const BASE_TRANSACTIONS_KEY = 'agroledger_transactions_v4';
const BASE_DEBTS_KEY = 'agroledger_debts_v4';

class StorageService {
  private memoryTransactions: Transaction[] = [];
  private memoryDebts: Debt[] = [];
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
    const { txKey, debtsKey } = this.getStorageKeys();

    if (this.isStorageAvailable()) {
      const storedTx = window.localStorage.getItem(txKey);
      const storedDebts = window.localStorage.getItem(debtsKey);

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
    }
  }

  private persist() {
    if (this.isStorageAvailable()) {
      const { txKey, debtsKey } = this.getStorageKeys();
      try {
        window.localStorage.setItem(txKey, JSON.stringify(this.memoryTransactions));
        window.localStorage.setItem(debtsKey, JSON.stringify(this.memoryDebts));
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

  public clearAllData(): void {
    this.memoryTransactions = [];
    this.memoryDebts = [];
    this.persist();
  }
}

export const storageService = new StorageService();
