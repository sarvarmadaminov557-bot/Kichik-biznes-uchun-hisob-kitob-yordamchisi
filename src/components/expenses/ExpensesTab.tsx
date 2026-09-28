import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  TrendingDown,
  Calendar,
  CreditCard,
  Building2,
  PieChart
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

interface ExpensesTabProps {
  onOpenNewExpense: () => void;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({ onOpenNewExpense }) => {
  const { expenses, formatCurrency, t } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Breakdown by category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const totalExpenseAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('expensesTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('expensesSubtitle')}</p>
        </div>

        <button
          onClick={onOpenNewExpense}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addExpense')}</span>
        </button>
      </div>

      {/* Categories Breakdown Cards */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{t('expenseBreakdown')}</h3>
            <p className="text-xs text-slate-500">Xarajatlar qaysi sohalarga yo'naltirilgan</p>
          </div>
          <span className="text-sm font-extrabold text-rose-600">{formatCurrency(totalExpenseAmount)}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sortedCategories.map(([cat, amount], idx) => {
            const share = totalExpenseAmount > 0 ? (amount / totalExpenseAmount) * 100 : 0;
            return (
              <div
                key={idx}
                onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'border-rose-400 bg-rose-50/50 shadow-xs'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 truncate">{cat}</span>
                  <span className="text-rose-600 font-bold">{formatCurrency(amount)}</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all"
                    style={{ width: `${share}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 text-right mt-1 font-semibold">{share.toFixed(1)}% ulush</div>
              </div>
            );
          })}
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
            placeholder="Tavsif yoki toifa qidirish..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Barcha toifalar</option>
            {sortedCategories.map(([cat]) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <EmptyState
          icon={<Receipt className="w-7 h-7" />}
          title="Xarajatlar topilmadi"
          description="Hech qanday xarajat kiritilmagan yoki qidiruv natijasi bo'sh."
          actionText={t('addExpense')}
          onAction={onOpenNewExpense}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('date')}</th>
                <th className="py-3 px-4">{t('expenseCategory')}</th>
                <th className="py-3 px-4">{t('description')}</th>
                <th className="py-3 px-4">{t('paymentMethod')}</th>
                <th className="py-3 px-4">Kiritgan shaxs</th>
                <th className="py-3 px-4 text-right">{t('amount')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-slate-500">
                    {new Date(exp.date || exp.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{exp.category}</td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{exp.description}</td>
                  <td className="py-3.5 px-4 uppercase text-slate-500 text-[11px] font-semibold">
                    {t(`method${exp.paymentMethod.charAt(0).toUpperCase() + exp.paymentMethod.slice(1)}` as any, exp.paymentMethod)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">{exp.createdBy}</td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-rose-600">
                    -{formatCurrency(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
