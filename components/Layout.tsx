
import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Users, Wallet, RefreshCw, CloudOff, Plus } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  syncStatus?: 'synced' | 'syncing' | 'error';
  onRefresh?: () => void;
  setIsAddModalOpen: (isOpen: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, syncStatus, onRefresh, setIsAddModalOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
  ];

  const renderSyncStatus = () => {
    switch (syncStatus) {
      case 'syncing':
        return <><RefreshCw className="w-4 h-4 animate-spin" /><span>Syncing...</span></>;
      case 'error':
        return <><CloudOff className="w-4 h-4" /><span>Sync Error</span></>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Wallet className="text-emerald-500" size={28} />
            <h1 className="text-xl font-bold text-slate-800">WealthWise</h1>
          </div>
          <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
            {renderSyncStatus()}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24">
        <div className="max-w-4xl mx-auto p-4">
          {children}
        </div>
      </main>

      <div className="fixed bottom-24 right-4 z-20">
        <button
          aria-label="Add new entry"
          className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 active:scale-95"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={24} />
        </button>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-slate-200">
        <div className="max-w-4xl mx-auto flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center pt-2 pb-1 transition-colors duration-200 ${
                activeTab === item.id
                  ? 'text-emerald-600'
                  : 'text-slate-500 hover:text-emerald-500'
              }`}
            >
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {activeTab === item.id && (
                <div className="w-8 h-1 bg-emerald-600 rounded-full mt-1" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;
