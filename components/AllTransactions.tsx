
import React from 'react';
import { Transaction, TransactionType, AccountSource, Beneficiary, DebtStatus } from '../types';
import { Search, ArrowUpRight, ArrowDownRight, Trash2, Edit3 } from 'lucide-react';

interface AllTransactionsProps {
  transactions: Transaction[];
  beneficiaries: Beneficiary[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
  onSettle: (txId: string) => void;
}

const AllTransactions: React.FC<AllTransactionsProps> = ({ transactions, beneficiaries, onEdit, onDelete, onSettle }) => {
  const [search, setSearch] = React.useState('');

  const getBeneficiaryName = (id?: string) => beneficiaries.find(b => b.id === id)?.name || 'Unknown';

  const filteredTransactions = transactions.filter(t => {
    const searchTerm = search.toLowerCase();
    const beneficiaryName = t.beneficiaryId ? getBeneficiaryName(t.beneficiaryId).toLowerCase() : '';
    return (
      t.category.toLowerCase().includes(searchTerm) ||
      (t.notes && t.notes.toLowerCase().includes(searchTerm)) ||
      beneficiaryName.includes(searchTerm)
    );
  }).sort((a, b) => b.date - a.date);

  return (
    <div className="space-y-6">
      <div className="flex-1 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredTransactions.map(tx => (
          <div key={tx.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tx.type === TransactionType.INCOME || tx.type === TransactionType.LEND ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}>
                  {tx.type === TransactionType.INCOME || tx.type === TransactionType.LEND ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{tx.category}</p>
                  {tx.beneficiaryId && <p className="text-xs text-slate-500 font-medium">To/From: {getBeneficiaryName(tx.beneficiaryId)}</p>}
                  <p className="text-xs text-slate-500">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  tx.type === TransactionType.INCOME || tx.type === TransactionType.LEND ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {tx.type === TransactionType.INCOME || tx.type === TransactionType.LEND ? '+' : '-'}৳{tx.amount.toLocaleString()}
                </p>
                { (tx.type === TransactionType.LEND || tx.type === TransactionType.BORROW) &&
                  <p className="text-xs text-slate-500">{tx.status}</p>
                }
              </div>
            </div>
            <div className="flex items-center justify-end mt-2 pt-2 border-t border-slate-100">
                { (tx.type === TransactionType.LEND || tx.type === TransactionType.BORROW) && tx.status !== DebtStatus.SETTLED &&
                  <button
                    aria-label="Settle"
                    onClick={() => onSettle(tx.id)}
                    className="text-xs font-bold bg-slate-200 text-slate-800 px-3 py-1 rounded-lg hover:bg-slate-300">Settle</button>
                }
                <button aria-label="Edit" onClick={() => onEdit(tx)} className="p-2 text-slate-400 hover:text-emerald-600 transition-colors"><Edit3 size={16} /></button>
                <button aria-label="Delete" onClick={() => onDelete(tx.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTransactions;
