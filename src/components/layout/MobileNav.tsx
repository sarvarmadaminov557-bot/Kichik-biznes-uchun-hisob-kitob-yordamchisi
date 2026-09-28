import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Menu,
  Plus,
  TrendingUp,
  Receipt,
  CreditCard,
  Wallet,
  BarChart3,
  Bot,
  Settings,
  X
} from 'lucide-react';

interface MobileNavProps {
  onOpenNewSale: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onOpenNewSale }) => {
  const { activeTab, setActiveTab, t } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'sales', label: t('navSales'), icon: ShoppingBag },
    // Center is Floating Action Button
    { id: 'products', label: t('navProducts'), icon: Package },
    { id: 'customers', label: t('navCustomers'), icon: Users },
  ];

  const moreTabs = [
    { id: 'financial', label: t('navFinancial'), icon: TrendingUp },
    { id: 'debts', label: t('navDebts'), icon: CreditCard },
    { id: 'expenses', label: t('expenses'), icon: Receipt },
    { id: 'cashflow', label: t('navCashflow'), icon: Wallet },
    { id: 'reports', label: t('navReports'), icon: BarChart3 },
    { id: 'ai-assistant', label: t('navAIAssistant'), icon: Bot },
    { id: 'settings', label: t('navSettings'), icon: Settings },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-between no-print shadow-lg">
        {mainTabs.slice(0, 2).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] truncate max-w-[64px]">{tab.label}</span>
            </button>
          );
        })}

        {/* Floating Quick Action Button for + Savdo */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={onOpenNewSale}
            className="w-13 h-13 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/35 active:scale-95 transition-transform"
            title={t('quickSale')}
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {mainTabs.slice(2, 4).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 flex-1 py-1 transition-colors ${
                isActive ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] truncate max-w-[64px]">{tab.label}</span>
            </button>
          );
        })}

        {/* More Menu Drawer Trigger */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-400 hover:text-slate-600"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">Menyu</span>
        </button>
      </nav>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150">
          <div className="bg-white rounded-t-3xl p-6 shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-base font-bold text-slate-900">Barcha bo'limlar</span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-4">
              {moreTabs.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors ${
                      isActive
                        ? 'border-blue-200 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
