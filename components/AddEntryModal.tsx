
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, AccountSource, Beneficiary } from '../types';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Partial<Transaction>) => void;
  beneficiaries: Beneficiary[];
}

const TypeButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
      isActive
        ? 'bg-purple-600 text-white'
        : 'text-gray-300 bg-gray-700 hover:bg-gray-600'
    }`}
  >
    {label}
  </button>
);


const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, onAddTransaction, beneficiaries }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [formData, setFormData] = useState<Partial<Transaction>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setFormData({
        type: TransactionType.EXPENSE,
        date: Date.now(),
        source: AccountSource.CASH,
        amount: 0,
      });
      setType(TransactionType.EXPENSE);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTypeSelect = (selectedType: TransactionType) => {
    setError(null);
    setType(selectedType);
    setFormData(p => ({ ...p, type: selectedType }));
  };

  const reset = () => {
    setFormData({});
    setError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.category) {
      setError('Category is required.');
      return;
    }
    if ((type === TransactionType.LEND || type === TransactionType.BORROW) && !formData.beneficiaryId) {
      setError('Beneficiary is required for debts.');
      return;
    }
    onAddTransaction({ ...formData, id: crypto.randomUUID() });
    reset();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={reset} />
      <div className="bg-[#1C1C1E] rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in duration-300 text-white">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">Record Entry</h2>

          <div className="flex justify-around">
            <TypeButton label="Expense" isActive={type === TransactionType.EXPENSE} onClick={() => handleTypeSelect(TransactionType.EXPENSE)} />
            <TypeButton label="Income" isActive={type === TransactionType.INCOME} onClick={() => handleTypeSelect(TransactionType.INCOME)} />
            <TypeButton label="Borrowed" isActive={type === TransactionType.BORROW} onClick={() => handleTypeSelect(TransactionType.BORROW)} />
            <TypeButton label="Lent" isActive={type === TransactionType.LEND} onClick={() => handleTypeSelect(TransactionType.LEND)} />
          </div>

          <div className="bg-[#2C2C2E] p-4 rounded-2xl text-center">
            <label className="text-xs text-purple-400 uppercase">Amount</label>
            <input
              type="number"
              required
              value={formData.amount ?? ''}
              onChange={e => setFormData(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-transparent text-white text-5xl font-bold text-center outline-none"
              placeholder="0"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <select value={formData.source || ''} onChange={e => setFormData(p => ({ ...p, source: e.target.value as AccountSource }))} className="w-full p-3 bg-[#2C2C2E] border-0 rounded-full text-center">
              {Object.values(AccountSource).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="date" value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} onChange={e => setFormData(p => ({ ...p, date: new Date(e.target.value).getTime() }))} className="w-full p-3 bg-[#2C2C2E] border-0 rounded-full text-center" />
          </div>

          <input type="text" required placeholder="Category (e.g. Food)" value={formData.category || ''} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full p-3 bg-[#2C2C2E] border-0 rounded-full text-center" />

          <textarea placeholder="Notes" value={formData.notes || ''} onChange={e => setFormData(p => ({...p, notes: e.target.value}))} className="w-full p-3 bg-[#2C2C2E] border-0 rounded-2xl text-center" />

          {(type === TransactionType.LEND || type === TransactionType.BORROW) && (
            <select required value={formData.beneficiaryId || ''} onChange={e => setFormData(p => ({ ...p, beneficiaryId: e.target.value }))} className="w-full p-3 bg-[#2C2C2E] border-0 rounded-full text-center">
              <option value="">Select Beneficiary</option>
              {beneficiaries.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex items-center justify-around pt-4">
            <button type="button" onClick={reset} className="font-semibold">Cancel</button>
            <button type="submit" className="px-10 py-3 bg-purple-600 text-white font-bold rounded-full">Confirm</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEntryModal;
