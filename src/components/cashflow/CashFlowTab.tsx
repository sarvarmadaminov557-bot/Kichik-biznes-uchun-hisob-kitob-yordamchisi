import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building2,
  Calendar,
  Filter,
  DollarSign
} from 'lucide-react';

export const CashFlowTab: React.FC = () => {
  const { business, transactions, formatCurrency, t } = useApp();
  const [filterMethod, setFilterMethod] = useState<string>('all');

  // Compute Inflow & Outflow
  const inflows = transactions.filter((t) => t.isIncome);
  const outflows = transactions.filter((t) => !t.isIncome);

  const totalInflow = inflows.reduce((sum, t) => sum + t.amount, 0);
  const totalOutflow = outflows.reduce((sum, t) => sum + t.amount, 0);
  const netCashFlow = totalInflow - totalOutflow;

  // Breakdown by method
  const methodTotals: Record<string, { in: number; out: number }> = {
    cash: { in: 0, out: 0 },
    card: { in: 0, out: 0 },
    bank: { in: 0, out: 0 },
  };

  transactions.forEach((tx) => {
    const m = tx.paymentMethod === 'bank' ? 'bank' : tx.paymentMethod === 'card' ? 'card' : 'cash';
    if (tx.isIncome) {
      methodTotals[m].in += tx.amount;
    } else {
      methodTotals[m].out += tx.amount;
    }
  });

  const filteredTransactions = transactions.filter(
    (tx) => filterMethod === 'all' || tx.paymentMethod === filterMethod
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('cashflowTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('cashflowSubtitle')}</p>
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl self-start sm:self-auto">
          {['all', 'cash', 'card', 'bank'].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filterMethod === m ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {m === 'all' ? 'Barchasi' : m === 'cash' ? t('methodCash') : m === 'card' ? t('methodCard') : t('methodBank')}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Inflow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('inflow')}</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">+{formatCurrency(totalInflow)}</div>
          <div className="mt-1 text-xs text-slate-400">{inflows.length} ta kirim operatsiyasi</div>
        </div>

        {/* Outflow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('outflow')}</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-rose-600 mt-2">-{formatCurrency(totalOutflow)}</div>
          <div className="mt-1 text-xs text-slate-400">{outflows.length} ta chiqim operatsiyasi</div>
        </div>

        {/* Net Cash Flow */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">{t('netCashflow')}</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-bold mt-2 ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
          </div>
          <div className="mt-1 text-xs text-slate-400">
            Kassadagi sof o'zgarish
          </div>
        </div>
      </div>

      {/* Payment Channels Balances */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cash in Register */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-xs">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>Naqd pul kassasi</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{formatCurrency(business.cashBalance)}</div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
            <span>Kirim: +{formatCurrency(methodTotals.cash.in)}</span>
            <span>Chiqim: -{formatCurrency(methodTotals.cash.out)}</span>
          </div>
        </div>

        {/* Bank Account */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-xs">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Bank hisob raqami</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">{formatCurrency(business.bankBalance)}</div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
            <span>Kirim: +{formatCurrency(methodTotals.bank.in)}</span>
            <span>Chiqim: -{formatCurrency(methodTotals.bank.out)}</span>
          </div>
        </div>

        {/* Plastic Card / Terminal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-xs">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span>Karta / Humo / Uzcard</span>
          </div>
          <div className="text-xl font-extrabold text-slate-900">
            +{formatCurrency(methodTotals.card.in - methodTotals.card.out)}
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-400">
            <span>Kirim: +{formatCurrency(methodTotals.card.in)}</span>
            <span>Chiqim: -{formatCurrency(methodTotals.card.out)}</span>
          </div>
        </div>
      </div>

      {/* Cash Flow Timeline */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Pul oqimi xronologiyasi</h3>

        <div className="divide-y divide-slate-100">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    tx.isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {tx.isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{tx.description}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(tx.createdAt).toLocaleDateString()} • {tx.relatedPerson} • {tx.paymentMethod}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-sm font-extrabold ${tx.isIncome ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {tx.isIncome ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">{tx.id}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
