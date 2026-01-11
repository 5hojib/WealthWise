
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction, AccountSource } from '../types';

interface SettleDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettle: (txId: string, amount: number, source: AccountSource) => void;
  transaction: Transaction | null;
}

const SettleDebtModal: React.FC<SettleDebtModalProps> = ({ isOpen, onClose, onSettle, transaction }) => {
  const [amount, setAmount] = useState(0);
  const [source, setSource] = useState(AccountSource.CASH);

  useEffect(() => {
    if (transaction) {
      const remaining = transaction.amount - (transaction.repayments || []).reduce((sum, r) => sum + r.amount, 0);
      setAmount(remaining);
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSettle(transaction.id, amount, source);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Settle Debt</h3>
          <button aria-label="Close" onClick={onClose} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <input type="number" required placeholder="Amount" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} className="w-full p-2 border rounded" />
            <button type="button" onClick={() => setAmount(transaction.amount - (transaction.repayments || []).reduce((sum, r) => sum + r.amount, 0))} className="bg-slate-200 px-4 py-2 rounded">Full</button>
          </div>
          <select value={source} onChange={e => setSource(e.target.value as AccountSource)} className="w-full p-2 border rounded">
            {Object.values(AccountSource).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button type="submit" className="w-full bg-emerald-600 text-white p-2 rounded">Settle</button>
        </form>
      </div>
    </div>
  );
};

export default SettleDebtModal;
