import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, TrendingUp, AlertTriangle, Package, CheckCircle2, ArrowRight } from 'lucide-react';

export const AIInsightsCard: React.FC = () => {
  const { financialMetrics, products, debts, expenses, formatCurrency, setActiveTab, t } = useApp();

  const insights: {
    type: 'success' | 'warning' | 'info' | 'danger';
    icon: React.ReactNode;
    title: string;
    description: string;
    actionTab?: string;
    actionLabel?: string;
  }[] = [];

  // 1. Revenue & Profit Insight
  if (financialMetrics.revenueChangePct > 0) {
    insights.push({
      type: 'success',
      icon: <TrendingUp className="w-4 h-4 text-emerald-600" />,
      title: 'Daromad ijobiy o\'smoqda',
      description: `Bu davrdagi savdo tushumlari o'tgan davrga nisbatan +${financialMetrics.revenueChangePct.toFixed(1)}% ga oshgan. Yalpi foyda rentabelligi: ${financialMetrics.grossMarginPct.toFixed(1)}%.`,
      actionTab: 'financial',
      actionLabel: 'Tahlilni ko\'rish',
    });
  }

  // 2. Low Stock Warning
  const lowStockProds = products.filter((p) => p.quantity <= p.minStock);
  if (lowStockProds.length > 0) {
    const names = lowStockProds.slice(0, 2).map((p) => `${p.name} (${p.quantity} ${p.unit})`).join(', ');
    insights.push({
      type: 'warning',
      icon: <Package className="w-4 h-4 text-amber-600" />,
      title: `${lowStockProds.length} ta mahsulot kam qoldi`,
      description: `Omborda quyidagi tovarlar zaxirasi minimal chegaradan past: ${names}${lowStockProds.length > 2 ? ` va yana ${lowStockProds.length - 2} ta` : ''}. Yangi kirim buyurtmasi ochish tavsiya etiladi.`,
      actionTab: 'products',
      actionLabel: 'Omborni tekshirish',
    });
  }

  // 3. Overdue Debts
  const overdueDebts = debts.filter((d) => d.status === 'overdue' && d.type === 'receivable');
  if (overdueDebts.length > 0) {
    const overdueSum = overdueDebts.reduce((sum, d) => sum + d.remainingAmount, 0);
    insights.push({
      type: 'danger',
      icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
      title: `${overdueDebts.length} ta mijoz qarzi muddati o'tgan`,
      description: `Jami ${formatCurrency(overdueSum)} miqdoridagi nasiya to'lovi belgilangan muddatdan kechikmoqda. Mijozlar bilan bog'lanib, to'lovni talab qilish zarur.`,
      actionTab: 'debts',
      actionLabel: 'Qarzdorlarni ko\'rish',
    });
  }

  // 4. Expenses Insight
  if (expenses.length > 0) {
    // Find top expense category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });
    const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    if (sorted.length > 0) {
      const [topCat, topAmount] = sorted[0];
      const totalExp = financialMetrics.operatingExpenses || 1;
      const share = ((topAmount / totalExp) * 100).toFixed(0);
      insights.push({
        type: 'info',
        icon: <Sparkles className="w-4 h-4 text-blue-600" />,
        title: `Asosiy xarajat toifasi: ${topCat}`,
        description: `Barcha xarajatlarning ${share}% qismi (${formatCurrency(topAmount)}) "${topCat}" toifasiga to'g'ri kelmoqda.`,
        actionTab: 'expenses',
        actionLabel: 'Xarajatlar grafigi',
      });
    }
  }

  if (insights.length === 0) {
    insights.push({
      type: 'success',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      title: 'Barcha moliyaviy ko\'rsatkichlar me\'yorda',
      description: 'Qarzlar o\'z vaqtida yopilmoqda, ombor to\'liq va foyda ko\'rsatkichlari barqaror.',
      actionTab: 'financial',
      actionLabel: 'Tahlilni ko\'rish',
    });
  }

  return (
    <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-md relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-300 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">{t('aiInsightsTitle')}</h3>
            <p className="text-[11px] text-blue-200/80">{t('aiInsightsSubtitle')}</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('ai-assistant')}
          className="text-xs font-semibold text-blue-200 hover:text-white flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10"
        >
          <span>AI Maslahatchi</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 relative z-10">
        {insights.slice(0, 3).map((item, idx) => (
          <div
            key={idx}
            className="bg-white/10 hover:bg-white/15 backdrop-blur-xs rounded-xl p-3.5 border border-white/10 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1 rounded bg-white/10">{item.icon}</div>
                <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              </div>
              <p className="text-xs text-blue-100/80 line-clamp-3 leading-relaxed">{item.description}</p>
            </div>

            {item.actionTab && (
              <button
                onClick={() => setActiveTab(item.actionTab!)}
                className="mt-3 text-[11px] font-semibold text-blue-300 hover:text-white flex items-center gap-1 transition-colors self-start"
              >
                <span>{item.actionLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
