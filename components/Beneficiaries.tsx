
import React from 'react';
import { 
  Plus, 
  Trash2, 
  User, 
  Phone, 
  Mail, 
  X
} from 'lucide-react';
import { Beneficiary, Transaction, TransactionType, DebtStatus } from '../types.ts';

interface BeneficiariesProps {
  beneficiaries: Beneficiary[];
  transactions: Transaction[];
  onAdd: (ben: Partial<Beneficiary>) => void;
  onDelete: (id: string) => void;
}

const Beneficiaries: React.FC<BeneficiariesProps> = ({ beneficiaries, transactions, onAdd, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<Partial<Beneficiary>>({
    name: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    onAdd({ ...formData, id: crypto.randomUUID(), createdAt: Date.now() });
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '' });
  };

  const getBenStats = (id: string) => {
    const benTxs = transactions.filter(t => t.beneficiaryId === id);
    const outstanding = benTxs.reduce((sum, t) => {
      const repaid = (t.repayments || []).reduce((s, r) => s + r.amount, 0);
      const remaining = t.amount - repaid;
      if (t.status === DebtStatus.SETTLED) return sum;
      return t.type === TransactionType.LEND ? sum + remaining : sum - remaining;
    }, 0);
    return { outstanding };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-900">Beneficiaries</h2>
        <button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg"><Plus size={20} className="inline mr-2"/>Add</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beneficiaries.map(ben => (
          <div key={ben.id} className="bg-white p-6 rounded-3xl border shadow-sm group relative">
            <button onClick={() => onDelete(ben.id)} className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button>
            <h3 className="text-xl font-bold mb-4">{ben.name}</h3>
            <div className={`p-3 rounded-xl font-bold text-center ${getBenStats(ben.id).outstanding >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
              ৳{Math.abs(getBenStats(ben.id).outstanding).toLocaleString()} {getBenStats(ben.id).outstanding >= 0 ? 'Receivable' : 'Payable'}
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl relative p-6">
            <h3 className="text-xl font-bold mb-6">New Beneficiary</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" required placeholder="Name" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl">Add Beneficiary</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;
