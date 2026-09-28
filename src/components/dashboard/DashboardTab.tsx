import React from 'react';
import { useApp } from '../../context/AppContext';
import { DateFilter } from '../../types';
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  CreditCard,
  Wallet,
  Package,
  AlertCircle,
  Plus,
  ArrowRight,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { DashboardCard } from './DashboardCard';
import { AIInsightsCard } from './AIInsightsCard';

interface DashboardTabProps {
  onOpenNewSale: () => void;
  onOpenNewExpense: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({ onOpenNewSale, onOpenNewExpense }) => {
  const {
    business,
    dateFilter,
    setDateFilter,
    financialMetrics,
    filteredSales,
    filteredExpenses,
    filteredTransactions,
    products,
    debts,
    formatCurrency,
    setActiveTab,
    t,
  } = useApp();

  const filterOptions: { key: DateFilter; label: string }[] = [
    { key: 'today', label: t('filterToday') },
    { key: 'yesterday', label: t('filterYesterday') },
    { key: 'week', label: t('filterWeek') },
    { key: 'month', label: t('filterMonth') },
    { key: 'last_month', label: t('filterLastMonth') },
    { key: 'all', label: t('filterAll') },
  ];

  // Top selling products calculated from sales
  const productSalesCount: Record<string, { name: string; quantity: number; revenue: number; unit: string }> = {};
  filteredSales.forEach((s) => {
    s.items.forEach((item) => {
      if (!productSalesCount[item.productId]) {
        productSalesCount[item.productId] = {
          name: item.productName,
          quantity: 0,
          revenue: 0,
          unit: item.unit || 'dona',
        };
      }
      productSalesCount[item.productId].quantity += item.quantity;
      productSalesCount[item.productId].revenue += item.total;
    });
  });

  const topSelling = Object.values(productSalesCount)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const lowStockProducts = products.filter((p) => p.quantity <= p.minStock).slice(0, 4);
  const overdueDebts = debts.filter((d) => d.status === 'overdue' && d.type === 'receivable').slice(0, 4);

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header & Date Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {business.name}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('brandSubtitle')}
          </p>
        </div>

        {/* Date Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl overflow-x-auto custom-scrollbar shrink-0">
          {filterOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setDateFilter(opt.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                dateFilter === opt.key
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Insights Card */}
      <AIInsightsCard />

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <DashboardCard
          title={t('revenue')}
          value={formatCurrency(financialMetrics.revenue)}
          subtext={`${filteredSales.length} ta savdo`}
          icon={<DollarSign className="w-5 h-5" />}
          iconBg="bg-blue-50 text-blue-600"
          changePct={financialMetrics.revenueChangePct}
          comparisonText={t('comparedToPrevious')}
          isPositiveGood={true}
        />

        {/* Expenses */}
        <DashboardCard
          title={t('expenses')}
          value={formatCurrency(financialMetrics.operatingExpenses)}
          subtext={`${filteredExpenses.length} ta xarajat`}
          icon={<TrendingDown className="w-5 h-5" />}
          iconBg="bg-rose-50 text-rose-600"
          changePct={-5.2}
          comparisonText={t('comparedToPrevious')}
          isPositiveGood={false}
        />

        {/* Net Profit */}
        <DashboardCard
          title={t('profit')}
          value={formatCurrency(financialMetrics.netProfit)}
          subtext={`Rentabellik: ${financialMetrics.grossMarginPct.toFixed(0)}%`}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBg={financialMetrics.netProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}
          changePct={financialMetrics.netProfitChangePct}
          comparisonText={t('comparedToPrevious')}
          isPositiveGood={true}
          highlightBorder={financialMetrics.netProfit >= 0 ? 'border-emerald-200' : 'border-rose-200'}
        />

        {/* Total Debts */}
        <DashboardCard
          title={t('totalDebt')}
          value={formatCurrency(financialMetrics.totalDebt)}
          subtext={`Mijozlar: ${formatCurrency(financialMetrics.receivables)}`}
          icon={<CreditCard className="w-5 h-5" />}
          iconBg="bg-amber-50 text-amber-600"
          changePct={financialMetrics.pendingDebtsCount > 0 ? 8.4 : 0}
          comparisonText={`${financialMetrics.pendingDebtsCount} ta ochiq qarz`}
          isPositiveGood={false}
        />
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="px-3 border-r border-slate-100 last:border-none">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-blue-600" />
            {t('cashBalance')}
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {formatCurrency(financialMetrics.cashBalance)}
          </div>
          <div className="text-[11px] text-slate-400">Naqd + Bank hisobi</div>
        </div>

        <div className="px-3 border-r border-slate-100 last:border-none">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            {t('grossProfit')}
          </div>
          <div className="text-lg font-bold text-emerald-600 mt-1">
            {formatCurrency(financialMetrics.grossProfit)}
          </div>
          <div className="text-[11px] text-slate-400">Daromad - COGS</div>
        </div>

        <div className="px-3 border-r border-slate-100 last:border-none">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-indigo-600" />
            {t('totalProducts')}
          </div>
          <div className="text-lg font-bold text-slate-900 mt-1">
            {products.length} ta
          </div>
          <div className="text-[11px] text-amber-600 font-semibold">
            {financialMetrics.lowStockCount} ta kam qolgan
          </div>
        </div>

        <div className="px-3">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Muddati o'tgan qarz
          </div>
          <div className="text-lg font-bold text-rose-600 mt-1">
            {overdueDebts.length} ta mijoz
          </div>
          <div className="text-[11px] text-slate-400">Tezkor talab zarur</div>
        </div>
      </div>

      {/* Middle Grid: Financial Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Visual Financial Overview */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t('navFinancial')}</h3>
                <p className="text-xs text-slate-500">Tushumlar va xarajatlar taqqoslanishi</p>
              </div>
              <button
                onClick={() => setActiveTab('financial')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Batafsil tahlil</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Visual Bar Comparison */}
            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    {t('revenue')}
                  </span>
                  <span className="font-bold text-slate-900">{formatCurrency(financialMetrics.revenue)}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        (financialMetrics.revenue / (financialMetrics.revenue + financialMetrics.operatingExpenses || 1)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    {t('cogs')} (Tannarxi)
                  </span>
                  <span className="font-bold text-slate-900">{formatCurrency(financialMetrics.cogs)}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        financialMetrics.revenue > 0 ? (financialMetrics.cogs / financialMetrics.revenue) * 100 : 0
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    Operatsion xarajatlar
                  </span>
                  <span className="font-bold text-slate-900">{formatCurrency(financialMetrics.operatingExpenses)}</span>
                </div>
                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        financialMetrics.revenue > 0
                          ? (financialMetrics.operatingExpenses / financialMetrics.revenue) * 100
                          : 40
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500">Sof foyda hisoblash formulasi:</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    Daromad ({formatCurrency(financialMetrics.revenue)}) — Tannarx ({formatCurrency(financialMetrics.cogs)}) — Xarajat ({formatCurrency(financialMetrics.operatingExpenses)})
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Sof foyda</span>
                  <div className={`text-base font-extrabold ${financialMetrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {formatCurrency(financialMetrics.netProfit)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-slate-400">
              Kassa qoldig'i: <strong className="text-slate-700">{formatCurrency(financialMetrics.cashBalance)}</strong>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenNewExpense}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                + Xarajat qo'shish
              </button>
              <button
                onClick={onOpenNewSale}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-2xs"
              >
                + Yangi savdo
              </button>
            </div>
          </div>
        </div>

        {/* Right (1 col): Top Selling Products */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">{t('topSellingProducts')}</h3>
              <button
                onClick={() => setActiveTab('products')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                {t('viewAll')}
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {topSelling.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Bu davrda savdolar yo'q
                </div>
              ) : (
                topSelling.map((prod, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <span className="w-5 h-5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-800 truncate">{prod.name}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-900">{formatCurrency(prod.revenue)}</div>
                      <div className="text-[10px] text-slate-400">
                        {prod.quantity} {prod.unit}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab('sales')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>Savdolar jurnali</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Warnings & Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Low Stock Alerts */}
        <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80">
          <div className="flex items-center justify-between pb-2 border-b border-amber-200/60">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
              <Package className="w-4 h-4 text-amber-600" />
              <span>{t('lowStockAlerts')} ({financialMetrics.lowStockCount})</span>
            </div>
            <button
              onClick={() => setActiveTab('products')}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="mt-2.5 space-y-2">
            {lowStockProducts.length === 0 ? (
              <div className="text-xs text-amber-700/80 py-2">Barcha tovarlar yetarli miqdorda mavjud.</div>
            ) : (
              lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-xl border border-amber-200/50">
                  <div>
                    <span className="font-semibold text-slate-800">{p.name}</span>
                    <span className="text-[11px] text-slate-400 block">Artikul: {p.sku}</span>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                      {p.quantity} {p.unit} qoldi
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">min: {p.minStock} {p.unit}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overdue Debts Alerts */}
        <div className="bg-rose-50/60 rounded-2xl p-4 border border-rose-200/80">
          <div className="flex items-center justify-between pb-2 border-b border-rose-200/60">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Muddati o'tgan mijoz qarzlari ({overdueDebts.length})</span>
            </div>
            <button
              onClick={() => setActiveTab('debts')}
              className="text-xs font-semibold text-rose-700 hover:text-rose-900"
            >
              {t('viewAll')}
            </button>
          </div>

          <div className="mt-2.5 space-y-2">
            {overdueDebts.length === 0 ? (
              <div className="text-xs text-rose-700/80 py-2">Muddati o'tgan qarzdorliklar mavjud emas.</div>
            ) : (
              overdueDebts.map((d) => (
                <div key={d.id} className="flex items-center justify-between text-xs bg-white/80 p-2 rounded-xl border border-rose-200/50">
                  <div>
                    <span className="font-semibold text-slate-800">{d.partyName}</span>
                    <span className="text-[10px] text-rose-600 font-medium block">
                      Muddat: {new Date(d.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-600 text-xs">{formatCurrency(d.remainingAmount)}</span>
                    <button
                      onClick={() => setActiveTab('debts')}
                      className="text-[10px] font-semibold text-blue-600 hover:underline block"
                    >
                      To'lov olish
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('recentTransactions')}</h3>
            <p className="text-xs text-slate-500">So'nggi operatsiyalar oqimi</p>
          </div>
          <button
            onClick={() => setActiveTab('transactions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>Barchasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">Tranzaksiyalar mavjud emas</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredTransactions.slice(0, 6).map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}
                  >
                    {tx.isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{tx.description}</div>
                    <div className="text-[11px] text-slate-400">
                      {tx.relatedPerson || 'Kassa'} • {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {tx.paymentMethod}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-bold ${
                      tx.isIncome ? 'text-emerald-600' : 'text-slate-800'
                    }`}
                  >
                    {tx.isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
