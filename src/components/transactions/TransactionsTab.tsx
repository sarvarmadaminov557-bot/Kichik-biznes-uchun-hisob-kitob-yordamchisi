import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ShoppingBag,
  Truck,
  CreditCard
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export const TransactionsTab: React.FC = () => {
  const { transactions, formatCurrency, t } = useApp();
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedMethod, setSelectedMethod] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description.toLowerCase().includes(search.toLowerCase()) ||
      (tx.relatedPerson && tx.relatedPerson.toLowerCase().includes(search.toLowerCase())) ||
      tx.id.toLowerCase().includes(search.toLowerCase());

    const matchesType = selectedType === 'all' || tx.type === selectedType;
    const matchesMethod = selectedMethod === 'all' || tx.paymentMethod === selectedMethod;

    return matchesSearch && matchesType && matchesMethod;
  });

  const typeLabels: Record<string, { label: string; color: string }> = {
    sale: { label: t('typeSale'), color: 'bg-emerald-50 text-emerald-700' },
    purchase: { label: t('typePurchase'), color: 'bg-indigo-50 text-indigo-700' },
    expense: { label: t('typeExpense'), color: 'bg-rose-50 text-rose-700' },
    customer_payment: { label: t('typeCustomerPayment'), color: 'bg-blue-50 text-blue-700' },
    supplier_payment: { label: t('typeSupplierPayment'), color: 'bg-amber-50 text-amber-700' },
    adjustment: { label: t('typeAdjustment'), color: 'bg-slate-100 text-slate-700' },
    refund: { label: 'Qaytarish (Vozvrat)', color: 'bg-purple-50 text-purple-700' },
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('transactionsTitle')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">Barcha kirim, chiqim va to'lov operatsiyalari auditi</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ID, tavsif yoki shaxs..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Barcha turlar</option>
            <option value="sale">{t('typeSale')}</option>
            <option value="purchase">{t('typePurchase')}</option>
            <option value="expense">{t('typeExpense')}</option>
            <option value="customer_payment">{t('typeCustomerPayment')}</option>
            <option value="supplier_payment">{t('typeSupplierPayment')}</option>
            <option value="adjustment">{t('typeAdjustment')}</option>
          </select>

          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Barcha to'lov turlari</option>
            <option value="cash">{t('methodCash')}</option>
            <option value="card">{t('methodCard')}</option>
            <option value="bank">{t('methodBank')}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-7 h-7" />}
          title="Tranzaksiyalar topilmadi"
          description="Hech qanday moliyaviy operatsiya mavjud emas."
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('transactionId')}</th>
                <th className="py-3 px-4">{t('date')}</th>
                <th className="py-3 px-4">{t('transactionType')}</th>
                <th className="py-3 px-4">{t('description')}</th>
                <th className="py-3 px-4">Bog'liq shaxs</th>
                <th className="py-3 px-4">{t('paymentMethod')}</th>
                <th className="py-3 px-4">Operator</th>
                <th className="py-3 px-4 text-right">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((tx) => {
                const conf = typeLabels[tx.type] || { label: tx.type, color: 'bg-slate-100 text-slate-700' };

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{tx.id}</td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <div>{new Date(tx.createdAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${conf.color}`}>
                        {conf.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">{tx.description}</td>
                    <td className="py-3.5 px-4 text-slate-600">{tx.relatedPerson || '—'}</td>
                    <td className="py-3.5 px-4 uppercase text-[11px] font-semibold text-slate-500">
                      {t(`method${tx.paymentMethod.charAt(0).toUpperCase() + tx.paymentMethod.slice(1)}` as any, tx.paymentMethod)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{tx.createdBy}</td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-sm">
                      <span className={tx.isIncome ? 'text-emerald-600' : 'text-slate-800'}>
                        {tx.isIncome ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
