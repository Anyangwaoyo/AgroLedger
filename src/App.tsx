/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAgroLedger } from './hooks/useAgroLedger';
import { Navbar, ActiveTab } from './components/layout/Navbar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TransactionsView } from './components/transactions/TransactionsView';
import { DebtsView } from './components/debts/DebtsView';
import { ProfitSummaryView } from './components/profit/ProfitSummaryView';
import { TransactionFormModal } from './components/transactions/TransactionFormModal';
import { DebtFormModal } from './components/debts/DebtFormModal';
import { ConfirmationModal } from './components/common/ConfirmationModal';
import { WelcomePopup } from './components/common/WelcomePopup';
import { AuthModal } from './components/auth/AuthModal';
import { authService } from './services/authService';
import { BusinessProfile, Transaction, DebtRepayment } from './types';
import { Sprout } from 'lucide-react';

export default function App() {
  const agroLedger = useAgroLedger();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Authentication State
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  // Auth Gate Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');
  const [authPrompt, setAuthPrompt] = useState<string | undefined>(undefined);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // App Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  useEffect(() => {
    // Check if an existing profile is active
    const activeProfile = authService.getProfile();
    setProfile(activeProfile);

    const handleAuthChange = () => {
      setProfile(authService.getProfile());
    };

    window.addEventListener('agroledger_auth_changed', handleAuthChange);
    return () => {
      window.removeEventListener('agroledger_auth_changed', handleAuthChange);
    };
  }, []);

  const handleSignOut = async () => {
    await authService.signOut();
    setProfile(null);
  };

  const handleOpenAuth = (mode: 'register' | 'login' = 'register', prompt?: string, onComplete?: () => void) => {
    setAuthModalMode(mode);
    setAuthPrompt(prompt);
    setPendingAction(() => onComplete || null);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    const updated = authService.getProfile();
    setProfile(updated);
    if (pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(() => action(), 100);
    }
  };

  // Guarded actions: User can view all features, but must register/login to record or mutate data
  const requireAuth = (actionName: string, action: () => void) => {
    if (!profile) {
      handleOpenAuth(
        'register',
        `Please register your business account before ${actionName}.`,
        action
      );
      return false;
    }
    action();
    return true;
  };

  // Transaction action handlers
  const handleOpenNewTransaction = () => {
    requireAuth('recording a new transaction', () => {
      setEditingTransaction(null);
      setIsTxModalOpen(true);
    });
  };

  const handleEditTransaction = (tx: Transaction) => {
    requireAuth('editing transactions', () => {
      setEditingTransaction(tx);
      setIsTxModalOpen(true);
    });
  };

  const handleDeleteTransaction = (id: string) => {
    requireAuth('deleting transactions', () => {
      agroLedger.deleteTransaction(id);
    });
  };

  const handleSaveTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (editingTransaction) {
      agroLedger.updateTransaction(editingTransaction.id, data);
    } else {
      agroLedger.addTransaction(data);
    }
  };

  // Debt action handlers
  const handleOpenNewDebt = () => {
    requireAuth('recording customer debts', () => {
      setIsDebtModalOpen(true);
    });
  };

  const handleAddRepayment = (debtId: string, repayment: Omit<DebtRepayment, 'id' | 'createdAt' | 'debtId'>) => {
    requireAuth('recording debt repayments', () => {
      agroLedger.addRepayment(debtId, repayment);
    });
  };

  const handleDeleteDebt = (id: string) => {
    requireAuth('deleting debt records', () => {
      agroLedger.deleteDebt(id);
    });
  };

  const hasRecords = agroLedger.transactions.length > 0 || agroLedger.debts.length > 0;

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1E2621] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDemo={agroLedger.isDemo}
        hasRecords={hasRecords}
        profile={profile}
        onLoadDemo={agroLedger.loadDemoData}
        onReset={() => setIsResetConfirmOpen(true)}
        onSignOut={handleSignOut}
        onOpenAuth={(mode, prompt) => handleOpenAuth(mode, prompt)}
      />

      {/* Main Content Area - Accessible to all visitors so they can explore every feature */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            useAgroLedgerHook={agroLedger}
            setActiveTab={setActiveTab}
            onOpenTransactionModal={handleOpenNewTransaction}
            onOpenDebtModal={handleOpenNewDebt}
            onLoadDemo={agroLedger.loadDemoData}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionsView
            transactions={agroLedger.transactions}
            onAddTransaction={handleOpenNewTransaction}
            onEditTransaction={handleEditTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'debts' && (
          <DebtsView
            debts={agroLedger.debts}
            onAddDebt={handleOpenNewDebt}
            onAddRepayment={handleAddRepayment}
            onDeleteDebt={handleDeleteDebt}
          />
        )}

        {activeTab === 'profit' && (
          <ProfitSummaryView useAgroLedgerHook={agroLedger} />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E8E6DF] bg-white py-6 text-xs text-[#6B756F] hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-[#144D34] flex items-center justify-center text-[#FCD34D]">
              <Sprout className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#1E2621]">AgroLedger</span>
            <span>
              {profile 
                ? `— Bookkeeping for ${profile.businessName} (${profile.mainGrain})` 
                : '— Simple bookkeeping for rice, maize, and soybean trade in Nigeria'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#8C9690]">
            <span>Record every transaction. Know your profit.</span>
            <span>•</span>
            <span>Currency: NGN (₦)</span>
          </div>
        </div>
      </footer>

      {/* First-login Welcome Popup */}
      <WelcomePopup profile={profile} />

      {/* Action Guard Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
        actionPrompt={authPrompt}
      />

      {/* Transaction Form Modal */}
      <TransactionFormModal
        isOpen={isTxModalOpen}
        onClose={() => {
          setIsTxModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleSaveTransaction}
        initialTransaction={editingTransaction}
      />

      {/* Debt Form Modal */}
      <DebtFormModal
        isOpen={isDebtModalOpen}
        onClose={() => setIsDebtModalOpen(false)}
        onSubmit={agroLedger.addDebt}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmationModal
        isOpen={isResetConfirmOpen}
        title="Reset All Records?"
        message="Are you sure you want to clear all transactions, customer debts, and repayments? This action cannot be undone."
        confirmLabel="Yes, Clear All Data"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={() => {
          agroLedger.resetToEmpty();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />
    </div>
  );
}
