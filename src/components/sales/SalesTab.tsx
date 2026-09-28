import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sale } from '../../types';
import {
  ShoppingBag,
  Plus,
  Search,
  Printer,
  Calendar,
  User,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';
import { ReceiptModal } from '../common/ReceiptModal';
import { EmptyState } from '../common/EmptyState';

interface SalesTabProps {
  onOpenNewSale: () => void;
}

export const SalesTab: React.FC<SalesTabProps> = ({ onOpenNewSale }) => {
  const { sales, formatCurrency, t } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'partial' | 'debt'>('all');
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<Sale | null>(null);

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (s.customerPhone && s.customerPhone.includes(search));

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalVolume = filteredSales.reduce((sum, s) => sum + s.total, 0);
  const totalPaid = filteredSales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalDebt = filteredSales.reduce((sum, s) => sum + s.remainingDebt, 0);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('salesTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('salesSubtitle')}</p>
        </div>

        <button
          onClick={onOpenNewSale}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('newSaleButton')}</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Jami savdolar</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatCurrency(totalVolume)}</div>
          <div className="text-xs text-slate-400 mt-0.5">{filteredSales.length} ta chek</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Qabul qilingan to'lov</span>
          <div className="text-xl font-bold text-emerald-600 mt-1">{formatCurrency(totalPaid)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Kassaga kirim bo'ldi</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Qarzga berilgan (Nasiya)</span>
          <div className="text-xl font-bold text-rose-600 mt-1">{formatCurrency(totalDebt)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Mijozlar qarz daftari</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chek №, mijoz ismi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 rounded-xl">
          {[
            { key: 'all', label: 'Barchasi' },
            { key: 'completed', label: t('statusCompleted') },
            { key: 'partial', label: t('statusPartial') },
            { key: 'debt', label: t('statusDebt') },
          ].map((st) => (
            <button
              key={st.key}
              onClick={() => setStatusFilter(st.key as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === st.key ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sales List */}
      {filteredSales.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="w-7 h-7" />}
          title="Savdolar topilmadi"
          description="Ushbu mezon bo'yicha hech qanday savdo mavjud emas. Yangi savdo oching!"
          actionText={t('newSaleButton')}
          onAction={onOpenNewSale}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">{t('invoiceNumber')}</th>
                  <th className="py-3 px-4">{t('customer')}</th>
                  <th className="py-3 px-4">Tovarlar</th>
                  <th className="py-3 px-4">{t('totalAmount')}</th>
                  <th className="py-3 px-4">{t('paidAmount')}</th>
                  <th className="py-3 px-4">{t('status')}</th>
                  <th className="py-3 px-4">{t('date')}</th>
                  <th className="py-3 px-4 text-right">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">{s.invoiceNumber}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{s.customerName}</div>
                      {s.customerPhone && <div className="text-[11px] text-slate-400">{s.customerPhone}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {s.items.length} xil tovar
                      <span className="block text-[10px] text-slate-400 truncate max-w-[150px]">
                        {s.items.map((i) => i.productName).join(', ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(s.total)}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-emerald-700">{formatCurrency(s.paidAmount)}</span>
                      {s.remainingDebt > 0 && (
                        <span className="text-[10px] text-rose-600 block">
                          Qarz: {formatCurrency(s.remainingDebt)}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          s.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : s.status === 'partial'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {s.status === 'completed' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {s.status === 'completed'
                          ? t('statusCompleted')
                          : s.status === 'partial'
                          ? t('statusPartial')
                          : t('statusDebt')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedReceiptSale(s)}
                        className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg inline-flex items-center gap-1.5 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Chek
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredSales.map((s) => (
              <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-mono font-bold text-xs text-slate-800">{s.invoiceNumber}</span>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      s.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {s.status === 'completed' ? t('statusCompleted') : t('statusDebt')}
                  </span>
                </div>

                <div className="flex justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{s.customerName}</span>
                    <span className="text-[11px] text-slate-400 block">{s.items.length} xil tovar</span>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900 block">{formatCurrency(s.total)}</span>
                    {s.remainingDebt > 0 && (
                      <span className="text-[10px] text-rose-600 font-bold block">
                        Qarz: {formatCurrency(s.remainingDebt)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => setSelectedReceiptSale(s)}
                    className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Chek
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Printable Receipt Modal */}
      <ReceiptModal
        isOpen={!!selectedReceiptSale}
        sale={selectedReceiptSale}
        onClose={() => setSelectedReceiptSale(null)}
      />
    </div>
  );
};
