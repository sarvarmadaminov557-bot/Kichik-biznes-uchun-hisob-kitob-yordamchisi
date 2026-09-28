import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  TrendingUp,
  ShoppingBag,
  Truck,
  Package,
  Users,
  CreditCard,
  Wallet,
  Receipt,
  BarChart3,
  Bot,
  ShieldCheck,
  Settings,
  ChevronRight,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface SidebarProps {
  onShowLanding?: () => void;
  onShowPricing?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeColor?: string;
  highlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ onShowLanding, onShowPricing }) => {
  const { activeTab, setActiveTab, financialMetrics, t, user } = useApp();

  const isOwnerOrManager = user?.role === 'owner' || user?.role === 'manager';

  const navGroups: NavGroup[] = [
    {
      group: 'Asosiy',
      items: [
        { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
        { id: 'financial', label: t('navFinancial'), icon: TrendingUp },
        { id: 'sales', label: t('navSales'), icon: ShoppingBag },
        { id: 'purchases', label: t('navPurchases'), icon: Truck },
      ],
    },
    {
      group: 'Katalog & Mijozlar',
      items: [
        {
          id: 'products',
          label: t('navProducts'),
          icon: Package,
          badge: financialMetrics.lowStockCount > 0 ? financialMetrics.lowStockCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-800',
        },
        { id: 'customers', label: t('navCustomers'), icon: Users },
        {
          id: 'debts',
          label: t('navDebts'),
          icon: CreditCard,
          badge: financialMetrics.pendingDebtsCount > 0 ? financialMetrics.pendingDebtsCount : undefined,
          badgeColor: 'bg-rose-100 text-rose-800',
        },
      ],
    },
    {
      group: 'Buxgalteriya & Moliya',
      items: [
        { id: 'expenses', label: t('expenses'), icon: Receipt },
        { id: 'cashflow', label: t('navCashflow'), icon: Wallet },
        { id: 'transactions', label: t('navTransactions'), icon: Receipt },
        { id: 'reports', label: t('navReports'), icon: BarChart3 },
      ],
    },
    {
      group: 'Intellekt & Tizim',
      items: [
        {
          id: 'ai-assistant',
          label: t('navAIAssistant'),
          icon: Bot,
          highlight: true,
        },
        ...(isOwnerOrManager ? [{ id: 'audit', label: t('navAuditLog'), icon: ShieldCheck }] : []),
        { id: 'settings', label: t('navSettings'), icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex-col shrink-0 hidden md:flex border-r border-slate-800 select-none h-screen sticky top-0 no-print">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-blue-500/25">
            B
          </div>
          <div>
            <div className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
              BiznesPro
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                SaaS
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Buxgalteriya va Savdo</div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5 custom-scrollbar">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {group.group}
            </div>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                      : item.highlight
                      ? 'text-blue-300 hover:bg-slate-800/80 hover:text-white'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-700 text-slate-300'}`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info & Public Links */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 space-y-2">
        {onShowLanding && (
          <button
            onClick={onShowLanding}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('navLanding')}</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
        {onShowPricing && (
          <button
            onClick={onShowPricing}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{t('navPricing')}</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </aside>
  );
};
