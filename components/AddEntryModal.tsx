
import React, { useState } from 'react';
import { X, ArrowUpRight, ArrowDownRight, UserPlus, FileText } from 'lucide-react';
import { Transaction, TransactionType, AccountSource, Beneficiary, DebtStatus } from '../types';

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Partial<Transaction>) => void;
  beneficiaries: Beneficiary[];
}

const AddEntryModal: React.FC<AddEntryModalProps> = ({ isOpen, onClose, onAddTransaction, beneficiaries }) => {
  const [step, setStep] = useState(0);
  const [type, setType] = useState<TransactionType | null>(null);
  const [formData, setFormData] = useState<Partial<Transaction>>({});

  if (!isOpen) return null;

  const handleTypeSelect = (selectedType: TransactionType) => {
    setType(selectedType);
    setFormData({ type: selectedType, date: Date.now(), source: AccountSource.CASH });
    setStep(1);
  };

  const reset = () => {
    setStep(0);
    setType(null);
    setFormData({});
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({ ...formData, id: crypto.randomUUID() });
    reset();
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <input type="number" required placeholder="Amount" value={formData.amount || ''} onChange={e => setFormData(p => ({ ...p, amount: parseFloat(e.target.value) }))} className="w-full p-2 border rounded" />
      <input type="text" required placeholder="Category" value={formData.category || ''} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className="w-full p-2 border rounded" />
      {type === TransactionType.LEND || type === TransactionType.BORROW ? (
        <select required value={formData.beneficiaryId || ''} onChange={e => setFormData(p => ({ ...p, beneficiaryId: e.target.value }))} className="w-full p-2 border rounded">
          <option value="">Select Beneficiary</option>
          {beneficiaries.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      ) : null}
      <select value={formData.source || ''} onChange={e => setFormData(p => ({ ...p, source: e.target.value as AccountSource }))} className="w-full p-2 border rounded">
        {Object.values(AccountSource).map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <input type="date" value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} onChange={e => setFormData(p => ({ ...p, date: new Date(e.target.value).getTime() }))} className="w-full p-2 border rounded" />
      <textarea placeholder="Notes" value={formData.notes || ''} onChange={e => setFormData(p => ({...p, notes: e.target.value}))} className="w-full p-2 border rounded" />
      <button type="submit" className="w-full bg-emerald-600 text-white p-2 rounded">Add Transaction</button>
    </form>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={reset} />
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{step === 0 ? 'Choose Entry Type' : `New ${type}`}</h3>
          <button aria-label="Close" onClick={reset} className="text-slate-400 hover:text-slate-900"><X size={24} /></button>
        </div>

        {step === 0 && (
          <div className="grid grid-cols-2 gap-4 p-6">
            <button onClick={() => handleTypeSelect(TransactionType.INCOME)} className="p-4 border rounded flex items-center justify-center gap-2"><ArrowUpRight /> Income</button>
            <button onClick={() => handleTypeSelect(TransactionType.EXPENSE)} className="p-4 border rounded flex items-center justify-center gap-2"><ArrowDownRight /> Expense</button>
            <button onClick={() => handleTypeSelect(TransactionType.LEND)} className="p-4 border rounded flex items-center justify-center gap-2"><UserPlus /> Lent</button>
            <button onClick={() => handleTypeSelect(TransactionType.BORROW)} className="p-4 border rounded flex items-center justify-center gap-2"><FileText /> Borrowed</button>
          </div>
        )}

        {step === 1 && renderForm()}
      </div>
    </div>
  );
};

export default AddEntryModal;
