import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Truck, Plus, Search, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { NewPurchaseModal } from './NewPurchaseModal';
import { EmptyState } from '../common/EmptyState';

export const PurchasesTab: React.FC = () => {
  const { purchases, formatCurrency, t } = useApp();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPurchases = purchases.filter(
    (p) =>
      p.supplierName.toLowerCase().includes(search.toLowerCase()) ||
      p.items.some((i) => i.productName.toLowerCase().includes(search.toLowerCase()))
  );

  const totalVolume = filteredPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPaid = filteredPurchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPayableDebt = filteredPurchases.reduce((sum, p) => sum + p.remainingDebt, 0);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('purchasesTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('purchasesSubtitle')}</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newPurchase')}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Jami kirimlar</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalVolume)}</div>
          <div className="text-xs text-slate-400 mt-0.5">{filteredPurchases.length} ta ta'minot partiyasi</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">To'langan mablag'</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalPaid)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Ta'minotchilarga to'landi</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Bizning qarzimiz</span>
          <div className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(totalPayableDebt)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Kreditorlik qarzdorligi</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ta'minotchi yoki tovar nomi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {filteredPurchases.length === 0 ? (
        <EmptyState
          icon={<Truck className="w-7 h-7" />}
          title="Kirimlar topilmadi"
          description="Hozircha hech qanday ta'minot xaridi amalga oshirilmagan."
          actionText={t('newPurchase')}
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('date')}</th>
                <th className="py-3 px-4">{t('supplierName')}</th>
                <th className="py-3 px-4">Tovarlar</th>
                <th className="py-3 px-4">{t('purchaseTotal')}</th>
                <th className="py-3 px-4">To'langan</th>
                <th className="py-3 px-4">Qarzimiz</th>
                <th className="py-3 px-4">{t('paymentStatus')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(p.purchaseDate || p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{p.supplierName}</td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {p.items.map((i) => `${i.productName} (${i.quantity} dona)`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(p.totalAmount)}</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">{formatCurrency(p.paidAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-rose-600">
                    {p.remainingDebt > 0 ? formatCurrency(p.remainingDebt) : '0'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        p.paymentStatus === 'paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : p.paymentStatus === 'partial'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {p.paymentStatus === 'paid' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {p.paymentStatus === 'paid'
                        ? t('paidStatusFull')
                        : p.paymentStatus === 'partial'
                        ? t('paidStatusPartial')
                        : t('paidStatusUnpaid')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <NewPurchaseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
