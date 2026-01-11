
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
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search transactions..."
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none font-medium"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredTransactions.map(tx => (
          <div key={tx.id} className="bg-gray-800 p-4 rounded-xl border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  tx.type === TransactionType.INCOME || tx.type === TransactionType.LEND ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
                }`}>
                  {tx.type === TransactionType.INCOME || tx.type === TransactionType.LEND ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                </div>
                <div>
                  <p className="font-bold text-white">{tx.category}</p>
                  {tx.beneficiaryId && <p className="text-xs text-gray-400 font-medium">To/From: {getBeneficiaryName(tx.beneficiaryId)}</p>}
                  <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${
                  tx.type === TransactionType.INCOME || tx.type === TransactionType.LEND ? 'text-green-400' : 'text-red-400'
                }`}>
                  {tx.type === TransactionType.INCOME || tx.type === TransactionType.LEND ? '+' : '-'}৳{tx.amount.toLocaleString()}
                </p>
                { (tx.type === TransactionType.LEND || tx.type === TransactionType.BORROW) &&
                  <p className="text-xs text-gray-500">{tx.status}</p>
                }
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-700">
                {tx.notes ? <p className="text-xs text-gray-400 italic max-w-[50%]">{tx.notes}</p> : <span />}
                <div className="flex items-center gap-2">
                  { (tx.type === TransactionType.LEND || tx.type === TransactionType.BORROW) && tx.status !== DebtStatus.SETTLED &&
                    <button
                      aria-label="Settle"
                      onClick={() => onSettle(tx.id)}
                      className="text-xs font-bold bg-gray-700 text-gray-200 px-3 py-1 rounded-lg hover:bg-gray-600">Settle</button>
                  }
                  <button aria-label="Edit" onClick={() => onEdit(tx)} className="p-2 text-gray-400 hover:text-purple-400 transition-colors"><Edit3 size={16} /></button>
                  <button aria-label="Delete" onClick={() => onDelete(tx.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllTransactions;
