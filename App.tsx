
import React, { useState, useEffect } from 'react';
import { Transaction, Beneficiary, FinancialStats, TransactionType, DebtStatus, AccountSource } from './types';
import { StorageService } from './services/storageService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AllTransactions from './components/AllTransactions';
import Beneficiaries from './components/Beneficiaries';
import AddEntryModal from './components/AddEntryModal';
import EditTransactionModal from './components/EditTransactionModal';
import SettleDebtModal from './components/SettleDebtModal';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [settlingDebt, setSettlingDebt] = useState<Transaction | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('syncing');
  const [stats, setStats] = useState<FinancialStats>({
    totalWealth: 0, cashBalance: 0, bankBalance: 0, mfsBalance: 0,
    receivable: 0, payable: 0, totalEarnings: 0, totalExpenses: 0,
  });

  const loadData = async (silent = false) => {
    if (!silent) setSyncStatus('syncing');
    try {
      const [txs, bens] = await Promise.all([
        StorageService.getTransactions(),
        StorageService.getBeneficiaries()
      ]);
      setTransactions(txs);
      setBeneficiaries(bens);
      setSyncStatus('synced');
    } catch (e) {
      console.error('Failed to load data:', e);
      setSyncStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Auto-refresh when tab is focused (cross-device sync helper)
    const handleFocus = () => loadData(true);
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  useEffect(() => {
    const newStats = StorageService.calculateStats(transactions);
    setStats(newStats);
  }, [transactions]);

  const handleAddTransaction = async (tx: Partial<Transaction>) => {
    setSyncStatus('syncing');
    const newTx = tx as Transaction;
    setTransactions(prev => [...prev, newTx]);
    await StorageService.saveTransaction(newTx);
    setSyncStatus('synced');
  };

  const handleEditTransaction = async (tx: Transaction) => {
    setSyncStatus('syncing');
    setTransactions(prev => prev.map(t => t.id === tx.id ? tx : t));
    await StorageService.saveTransaction(tx);
    setSyncStatus('synced');
  };

  const handleDeleteTransaction = async (id: string) => {
    if (!window.confirm('Delete this transaction?')) return;
    setSyncStatus('syncing');
    setTransactions(prev => prev.filter(t => t.id !== id));
    await StorageService.deleteTransaction(id);
    setSyncStatus('synced');
  };

  const handleAddBeneficiary = async (ben: Partial<Beneficiary>) => {
    setSyncStatus('syncing');
    const newBen = ben as Beneficiary;
    setBeneficiaries(prev => [...prev, newBen]);
    await StorageService.saveBeneficiary(newBen);
    setSyncStatus('synced');
  };

  const handleDeleteBeneficiary = async (id: string) => {
    const activeDebts = transactions.filter(t => t.beneficiaryId === id && t.status !== DebtStatus.SETTLED);
    if (activeDebts.length > 0) {
      alert('Cannot delete beneficiary with active debts.');
      return;
    }
    if (!window.confirm('Delete beneficiary?')) return;
    setSyncStatus('syncing');
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
    await StorageService.deleteBeneficiary(id);
    setSyncStatus('synced');
  };

  const handleSettleDebt = async (txId: string, amount: number, source: AccountSource) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;
    setSyncStatus('syncing');
    const updatedTx = { ...tx };
    updatedTx.repayments = [...(tx.repayments || []), { id: crypto.randomUUID(), amount, date: Date.now(), source }];
    const totalRepaid = updatedTx.repayments.reduce((sum, r) => sum + r.amount, 0);
    updatedTx.status = totalRepaid >= tx.amount ? DebtStatus.SETTLED : DebtStatus.PARTIALLY_REPAID;
    setTransactions(prev => prev.map(t => t.id === txId ? updatedTx : t));
    await StorageService.saveTransaction(updatedTx);
    setSyncStatus('synced');
  };

  const handleMarkBadDebt = async (txId: string) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || !window.confirm('Mark as bad debt?')) return;
    setSyncStatus('syncing');
    const updatedTx = { ...tx, status: DebtStatus.BAD_DEBT };
    setTransactions(prev => prev.map(t => t.id === txId ? updatedTx : t));
    await StorageService.saveTransaction(updatedTx);
    setSyncStatus('synced');
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
          <p className="text-slate-500 font-medium">Connecting to Cloud Wealth Vault...</p>
        </div>
      );
    }
    switch (activeTab) {
      case 'dashboard': return <Dashboard stats={stats} transactions={transactions} />;
      case 'transactions': return <AllTransactions transactions={transactions} beneficiaries={beneficiaries} onEdit={setEditingTransaction} onDelete={handleDeleteTransaction} onSettle={(txId) => setSettlingDebt(transactions.find(t => t.id === txId) || null)} />;
      case 'beneficiaries': return <Beneficiaries beneficiaries={beneficiaries} transactions={transactions} onAdd={handleAddBeneficiary} onDelete={handleDeleteBeneficiary} />;
      default: return <Dashboard stats={stats} transactions={transactions} />;
    }
  };

  return (
    <>
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        syncStatus={syncStatus}
        onRefresh={() => loadData()}
        setIsAddModalOpen={setIsAddModalOpen}
      >
        {renderContent()}
      </Layout>
      <AddEntryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddTransaction={handleAddTransaction}
        beneficiaries={beneficiaries}
      />
      <EditTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        onEditTransaction={handleEditTransaction}
        transaction={editingTransaction}
        beneficiaries={beneficiaries}
      />
      <SettleDebtModal
        isOpen={!!settlingDebt}
        onClose={() => setSettlingDebt(null)}
        onSettle={handleSettleDebt}
        transaction={settlingDebt}
      />
    </>
  );
};

export default App;
