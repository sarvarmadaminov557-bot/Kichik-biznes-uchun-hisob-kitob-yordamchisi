import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Debt } from '../../types';
import {
  CreditCard,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { RecordPaymentModal } from '../customers/RecordPaymentModal';
import { EmptyState } from '../common/EmptyState';

export const DebtsTab: React.FC = () => {
  const { debts, formatCurrency, t } = useApp();
  const [activeType, setActiveType] = useState<'receivable' | 'payable'>('receivable');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unpaid' | 'overdue' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const [payingDebt, setPayingDebt] = useState<Debt | null>(null);

  const filteredDebts = debts.filter((d) => {
    const matchesType = d.type === activeType;
    const matchesSearch =
      d.partyName.toLowerCase().includes(search.toLowerCase()) ||
      (d.partyPhone && d.partyPhone.includes(search)) ||
      (d.notes && d.notes.toLowerCase().includes(search.toLowerCase()));

    let matchesStatus = true;
    if (statusFilter === 'unpaid') matchesStatus = d.status === 'unpaid' || d.status === 'partial';
    if (statusFilter === 'overdue') matchesStatus = d.status === 'overdue';
    if (statusFilter === 'paid') matchesStatus = d.status === 'paid';

    return matchesType && matchesSearch && matchesStatus;
  });

  const totalReceivables = debts
    .filter((d) => d.type === 'receivable' && d.status !== 'paid')
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const totalPayables = debts
    .filter((d) => d.type === 'payable' && d.status !== 'paid')
    .reduce((sum, d) => sum + d.remainingAmount, 0);

  const overdueCount = debts.filter((d) => d.status === 'overdue' && d.type === activeType).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('debtsTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('debtsSubtitle')}</p>
        </div>

        {/* Tab Switcher: Receivables (Bizga) vs Payables (Bizdan) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl self-start sm:self-auto">
          <button
            onClick={() => setActiveType('receivable')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeType === 'receivable' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
            <span>{t('tabReceivables')}</span>
          </button>
          <button
            onClick={() => setActiveType('payable')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeType === 'payable' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4 text-rose-600" />
            <span>{t('tabPayables')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Mijozlar qarzi (Bizga to'lanishi kerak)
          </span>
          <div className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(totalReceivables)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Faol debitorlik qarzlari</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Bizning qarzimiz (Ta'minotchilarga)
          </span>
          <div className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(totalPayables)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Kreditorlik majburiyatlari</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Muddati o'tgan qarzlar ({activeType === 'receivable' ? 'Mijozlar' : 'Bizning'})
          </span>
          <div className="text-xl font-bold text-amber-600 mt-1">{overdueCount} ta</div>
          <div className="text-xs text-rose-600 font-semibold mt-0.5">Kechikish mavjud!</div>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Shaxs, korxona yoki izoh..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto w-full md:w-auto">
          {[
            { key: 'all', label: 'Barchasi' },
            { key: 'unpaid', label: 'To\'lanmagan' },
            { key: 'overdue', label: 'Muddati o\'tgan' },
            { key: 'paid', label: 'Yopilgan' },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === st.key ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Debts Table */}
      {filteredDebts.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-7 h-7" />}
          title="Qarzlar topilmadi"
          description="Ushbu toifada hech qanday qarz mavjud emas."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Shaxs / Korxona</th>
                <th className="py-3 px-4">Dastlabki summa</th>
                <th className="py-3 px-4">To'langan</th>
                <th className="py-3 px-4">Qolgan qarz</th>
                <th className="py-3 px-4">{t('dueDate')}</th>
                <th className="py-3 px-4">{t('debtStatus')}</th>
                <th className="py-3 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDebts.map((debt) => {
                const isOverdue = debt.status === 'overdue';
                const isPaid = debt.status === 'paid';

                return (
                  <tr key={debt.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div>{debt.partyName}</div>
                      {debt.partyPhone && <div className="text-[10px] text-slate-400 font-mono">{debt.partyPhone}</div>}
                      {debt.notes && <div className="text-[10px] text-slate-400 font-normal truncate max-w-xs">{debt.notes}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{formatCurrency(debt.originalAmount)}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">{formatCurrency(debt.paidAmount)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      {debt.remainingAmount > 0 ? (
                        <span className={isOverdue ? 'text-rose-600' : 'text-slate-900'}>
                          {formatCurrency(debt.remainingAmount)}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold">To'liq yopilgan</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                        {new Date(debt.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700'
                            : isOverdue
                            ? 'bg-rose-50 text-rose-700 animate-pulse'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {isPaid ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : isOverdue ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {isPaid ? 'Yopilgan' : isOverdue ? 'Muddati o\'tgan!' : 'To\'lanmoqda'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!isPaid && (
                        <button
                          onClick={() => setPayingDebt(debt)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors shadow-2xs ${
                            activeType === 'receivable'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {activeType === 'receivable' ? t('collectDebt') : t('payDebt')}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Record Payment Dialog */}
      <RecordPaymentModal
        isOpen={!!payingDebt}
        debt={payingDebt}
        onClose={() => setPayingDebt(null)}
      />
    </div>
  );
};
