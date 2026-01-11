
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet,
  Building,
  Smartphone,
  HandCoins
} from 'lucide-react';
import { FinancialStats, Transaction, TransactionType } from '../types.ts';

interface DashboardProps {
  stats: FinancialStats;
  transactions: Transaction[];
}

const formatCurrency = (val: number) => `৳${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const StatCard = ({ title, amount, icon: Icon, color, trend }: { 
  title: string; 
  amount: number; 
  icon: any; 
  color: string;
  trend?: { val: string; up: boolean }
}) => (
  <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:shadow-purple-400/20 transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-gray-700`}>
        <Icon size={24} className={color} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm font-medium ${trend.up ? 'text-green-400' : 'text-red-400'}`}>
          {trend.up ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {trend.val}
        </div>
      )}
    </div>
    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
    <h3 className="text-2xl font-bold text-white">{formatCurrency(amount)}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ stats, transactions }) => {
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    return {
      name: d.toLocaleString('default', { month: 'short' }),
      income: 0,
      expense: 0,
      month: d.getMonth(),
      year: d.getFullYear()
    };
  });

  transactions.forEach(tx => {
    const txDate = new Date(tx.date);
    const monthIdx = last6Months.findIndex(m => m.month === txDate.getMonth() && m.year === txDate.getFullYear());
    if (monthIdx !== -1) {
      if (tx.type === TransactionType.INCOME) last6Months[monthIdx].income += tx.amount;
      if (tx.type === TransactionType.EXPENSE) last6Months[monthIdx].expense += tx.amount;
    }
  });

  const sourceData = [
    { name: 'Cash', value: stats.cashBalance, color: '#10b981' },
    { name: 'Bank', value: stats.bankBalance, color: '#3b82f6' },
    { name: 'MFS', value: stats.mfsBalance, color: '#d946ef' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Financial Overview</h2>
          <p className="text-gray-400">Personal wealth & debt tracking in BDT.</p>
        </div>
        <div className="bg-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg shadow-purple-500/20">
          <p className="text-purple-100 text-xs font-bold uppercase tracking-wider mb-1">Net Worth</p>
          <p className="text-3xl font-bold">{formatCurrency(stats.totalWealth)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Cash Balance" amount={stats.cashBalance} icon={Wallet} color="text-green-400" />
        <StatCard title="Bank Balance" amount={stats.bankBalance} icon={Building} color="text-blue-400" />
        <StatCard title="MFS Balance" amount={stats.mfsBalance} icon={Smartphone} color="text-pink-400" />
        <StatCard title="Total Payable" amount={stats.payable} icon={ArrowDownRight} color="text-red-400" />
        <StatCard title="Total Receivable" amount={stats.receivable} icon={ArrowUpRight} color="text-indigo-400" />
        <StatCard title="Net Position" amount={stats.receivable - stats.payable} icon={HandCoins} color="text-gray-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-6">Cashflow (Last 6 Months)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: number) => `৳${value.toLocaleString()}`}
                  cursor={{ fill: 'rgba(192, 132, 252, 0.2)' }}
                  contentStyle={{ background: '#1f2937', border: '1px solid #4b5563', borderRadius: '12px' }}
                  labelStyle={{ color: '#d1d5db' }}
                />
                <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="expense" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
          <h3 className="text-lg font-bold text-white mb-6">Asset Allocation</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData.length > 0 ? sourceData : [{ name: 'No Data', value: 1, color: '#374151' }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  {sourceData.length === 0 && <Cell fill="#374151" />}
                </Pie>
                <Tooltip formatter={(value: number) => `৳${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Active</p>
                <p className="text-xl font-bold text-white">Assets</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
