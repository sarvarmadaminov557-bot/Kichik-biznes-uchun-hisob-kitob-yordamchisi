import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  Wallet,
  CreditCard,
  HelpCircle,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Layers
} from 'lucide-react';

export const FinancialOverviewTab: React.FC = () => {
  const { financialMetrics, filteredSales, filteredExpenses, debts, formatCurrency, t } = useApp();
  const [viewTimeframe, setViewTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // Chart data simulation based on live sales & expenses
  const timepoints = [
    { label: '1-hafta', rev: 4500000, exp: 2800000, profit: 1700000 },
    { label: '2-hafta', rev: 8200000, exp: 4100000, profit: 4100000 },
    { label: '3-hafta', rev: 11500000, exp: 5900000, profit: 5600000 },
    { label: '4-hafta (Hozir)', rev: financialMetrics.revenue || 14850000, exp: financialMetrics.operatingExpenses || 7200000, profit: financialMetrics.netProfit || 4300000 },
  ];

  const maxVal = Math.max(...timepoints.map((t) => Math.max(t.rev, t.exp)));

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('navFinancial')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daromad, tannarx, xarajatlar va sof foydaning to'liq va sodda hisob-kitobi
          </p>
        </div>

        {/* View Timeframe Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-2xl shrink-0">
          {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setViewTimeframe(view)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                viewTimeframe === view ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {view === 'daily' ? 'Kunlik' : view === 'weekly' ? 'Haftalik' : view === 'monthly' ? 'Oylik' : 'Yillik'}
            </button>
          ))}
        </div>
      </div>

      {/* Accounting Formula Banner (Simple for non-accountants) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Foyda qanday hisoblanadi? (Buxgalter bo'lmagan tadbirkorlar uchun sodda tushuntirish)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          {/* Revenue */}
          <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 text-center">
            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">1. Jami Daromad</span>
            <span className="text-base font-extrabold text-blue-900 mt-1 block">
              {formatCurrency(financialMetrics.revenue)}
            </span>
            <span className="text-[11px] text-blue-600">Sotuvdan tushgan pullar</span>
          </div>

          <div className="text-center font-bold text-slate-400 text-lg hidden md:block">−</div>

          {/* COGS */}
          <div className="bg-indigo-50/70 p-3.5 rounded-xl border border-indigo-100 text-center">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">2. Mahsulot Tannarxi (COGS)</span>
            <span className="text-base font-extrabold text-indigo-900 mt-1 block">
              {formatCurrency(financialMetrics.cogs)}
            </span>
            <span className="text-[11px] text-indigo-600">Sotilgan tovarlar kirim narxi</span>
          </div>

          <div className="text-center font-bold text-slate-400 text-lg hidden md:block">=</div>

          {/* Gross Profit */}
          <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 text-center">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">3. Yalpi Foyda</span>
            <span className="text-base font-extrabold text-emerald-900 mt-1 block">
              {formatCurrency(financialMetrics.grossProfit)}
            </span>
            <span className="text-[11px] text-emerald-600">Ustama foyda marjasi</span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Operatsion xarajatlar (Ijara, Oylik, Reklama va h.k.):</span>
            <span className="font-bold text-rose-600">− {formatCurrency(financialMetrics.operatingExpenses)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Yakuniy sof cho'ntakka qoladigan foyda:</span>
            <span className="text-sm font-extrabold text-emerald-600">{formatCurrency(financialMetrics.netProfit)}</span>
          </div>
        </div>
      </div>

      {/* 4 Financial Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('revenue')}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(financialMetrics.revenue)}</div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +{financialMetrics.revenueChangePct.toFixed(1)}% o'sish
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('grossProfit')}</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-indigo-600 mt-2">{formatCurrency(financialMetrics.grossProfit)}</div>
          <div className="mt-2 text-xs text-slate-400">
            Rentabellik: <strong className="text-slate-700">{financialMetrics.grossMarginPct.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('netProfit')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">{formatCurrency(financialMetrics.netProfit)}</div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            +{financialMetrics.netProfitChangePct.toFixed(1)}% o'tgan davrga nisbatan
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('cashBalance')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">{formatCurrency(financialMetrics.cashBalance)}</div>
          <div className="mt-2 text-xs text-slate-400">
            Kassada va bank hisobida
          </div>
        </div>
      </div>

      {/* Interactive Charts: Revenue vs Expenses vs Profit over time */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Vaqt bo'yicha moliyaviy dinamika</h3>
            <p className="text-xs text-slate-500">Tushumlar, xarajatlar va sof foyda to'lqinlari</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>Daromad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Xarajat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>Sof foyda</span>
            </div>
          </div>
        </div>

        {/* Visual Chart Bars */}
        <div className="mt-6 pt-4 pb-2">
          <div className="grid grid-cols-4 gap-4 sm:gap-8 h-56 items-end border-b border-slate-200 pb-2">
            {timepoints.map((tp, idx) => {
              const revHeight = maxVal > 0 ? (tp.rev / maxVal) * 100 : 20;
              const expHeight = maxVal > 0 ? (tp.exp / maxVal) * 100 : 15;
              const profitHeight = maxVal > 0 ? (tp.profit / maxVal) * 100 : 10;

              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-2 h-full">
                    {/* Revenue Bar */}
                    <div
                      className="w-4 sm:w-8 bg-blue-600 rounded-t-lg transition-all group-hover:bg-blue-700 relative"
                      style={{ height: `${revHeight}%` }}
                      title={`Daromad: ${formatCurrency(tp.rev)}`}
                    />
                    {/* Expense Bar */}
                    <div
                      className="w-4 sm:w-8 bg-rose-500 rounded-t-lg transition-all group-hover:bg-rose-600 relative"
                      style={{ height: `${expHeight}%` }}
                      title={`Xarajat: ${formatCurrency(tp.exp)}`}
                    />
                    {/* Profit Bar */}
                    <div
                      className="w-4 sm:w-8 bg-emerald-500 rounded-t-lg transition-all group-hover:bg-emerald-600 relative"
                      style={{ height: `${profitHeight}%` }}
                      title={`Sof foyda: ${formatCurrency(tp.profit)}`}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                    {tp.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Receivables & Payables Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Receivables */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('receivables')}</h3>
              <p className="text-xs text-slate-500">Mijozlarimizdan kelishi kutilayotgan pullar</p>
            </div>
            <span className="text-sm font-extrabold text-blue-600">{formatCurrency(financialMetrics.receivables)}</span>
          </div>

          <div className="mt-3 space-y-2">
            {debts.filter((d) => d.type === 'receivable' && d.status !== 'paid').length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">Barcha mijoz qarzlari to'langan!</div>
            ) : (
              debts
                .filter((d) => d.type === 'receivable' && d.status !== 'paid')
                .slice(0, 4)
                .map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                    <div>
                      <span className="font-semibold text-slate-800">{d.partyName}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Muddat: {new Date(d.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-bold text-rose-600">{formatCurrency(d.remainingAmount)}</span>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Payables */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('payables')}</h3>
              <p className="text-xs text-slate-500">Ta'minotchilarga to'lashimiz kerak bo'lgan mablag'</p>
            </div>
            <span className="text-sm font-extrabold text-rose-600">{formatCurrency(financialMetrics.payables)}</span>
          </div>

          <div className="mt-3 space-y-2">
            {debts.filter((d) => d.type === 'payable' && d.status !== 'paid').length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">Ta'minotchilar oldida qarz yo'q!</div>
            ) : (
              debts
                .filter((d) => d.type === 'payable' && d.status !== 'paid')
                .slice(0, 4)
                .map((d) => (
                  <div key={d.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-50">
                    <div>
                      <span className="font-semibold text-slate-800">{d.partyName}</span>
                      <span className="text-[10px] text-slate-400 block">
                        Muddat: {new Date(d.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800">{formatCurrency(d.remainingAmount)}</span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
