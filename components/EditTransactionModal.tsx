
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Transaction, TransactionType, AccountSource, Beneficiary } from '../types';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditTransaction: (tx: Transaction) => void;
  transaction: Transaction | null;
  beneficiaries: Beneficiary[];
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ isOpen, onClose, onEditTransaction, transaction, beneficiaries }) => {
  const [formData, setFormData] = useState<Transaction | null>(null);

  useEffect(() => {
    setFormData(transaction);
  }, [transaction]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEditTransaction(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">Edit Transaction</h3>
          <button aria-label="Close" onClick={onClose} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input type="number" required placeholder="Amount" value={formData.amount} onChange={e => setFormData(p => ({ ...p!, amount: parseFloat(e.target.value) }))} className="w-full p-2 border rounded" />
          <input type="text" required placeholder="Category" value={formData.category} onChange={e => setFormData(p => ({ ...p!, category: e.target.value }))} className="w-full p-2 border rounded" />
          {formData.type === TransactionType.LEND || formData.type === TransactionType.BORROW ? (
            <select required value={formData.beneficiaryId || ''} onChange={e => setFormData(p => ({ ...p!, beneficiaryId: e.target.value }))} className="w-full p-2 border rounded">
              <option value="">Select Beneficiary</option>
              {beneficiaries.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          ) : null}
          <select value={formData.source} onChange={e => setFormData(p => ({ ...p!, source: e.target.value as AccountSource }))} className="w-full p-2 border rounded">
            {Object.values(AccountSource).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="date" value={new Date(formData.date).toISOString().split('T')[0]} onChange={e => setFormData(p => ({ ...p!, date: new Date(e.target.value).getTime() }))} className="w-full p-2 border rounded" />
          <textarea placeholder="Notes" value={formData.notes || ''} onChange={e => setFormData(p => ({...p!, notes: e.target.value}))} className="w-full p-2 border rounded" />
          <button type="submit" className="w-full bg-emerald-600 text-white p-2 rounded">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
