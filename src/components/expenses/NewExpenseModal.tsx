import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Receipt, Plus } from 'lucide-react';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense, categories, addCategory, formatCurrency, t, showToast } = useApp();

  const [category, setCategory] = useState<string>('Ijara haqi');
  const [newCatName, setNewCatName] = useState<string>('');
  const [isAddingNewCat, setIsAddingNewCat] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank' | 'other'>('cash');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleAddNewCategory = () => {
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setCategory(newCatName.trim());
    setNewCatName('');
    setIsAddingNewCat(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast('Iltimos, xarajat summasini kiriting', 'error');
      return;
    }

    addExpense({
      category,
      amount,
      paymentMethod,
      description: description.trim() || category,
      date: new Date(date).toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('addExpense')}</h2>
              <p className="text-xs text-slate-400">Chiqim yoki operatsion to'lovni qayd qilish</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">{t('expenseCategory')}</label>
              {!isAddingNewCat && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewCat(true)}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  + Yangi toifa
                </button>
              )}
            </div>

            {isAddingNewCat ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Yangi toifa nomi..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="px-3 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl"
                >
                  Qo'shish
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCat(false)}
                  className="px-2 py-2 text-xs text-slate-400"
                >
                  Bekor
                </button>
              </div>
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="Ijara haqi">{t('categoryRent')}</option>
                <option value="Ish haqi (Oylik)">{t('categorySalary')}</option>
                <option value="Kommunal to'lovlar">{t('categoryUtilities')}</option>
                <option value="Transport va yetkazib berish">{t('categoryTransport')}</option>
                <option value="Marketing va reklama">{t('categoryAdvertising')}</option>
                <option value="Uskunalar va inventar">{t('categoryEquipment')}</option>
                <option value="Soliqlar va to'lovlar">{t('categoryTaxes')}</option>
                <option value="Mahsulot xaridi">{t('categoryProductPurchase')}</option>
                <option value="Boshqa xarajatlar">{t('categoryOther')}</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              Summa ({formatCurrency(amount || 0)})
            </label>
            <input
              type="number"
              min="0"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="0"
              required
              className="w-full px-3 py-2.5 text-base font-bold rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-slate-900"
            />
          </div>

          {/* Payment Method & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('paymentMethod')}</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="cash">{t('methodCash')}</option>
                <option value="card">{t('methodCard')}</option>
                <option value="bank">{t('methodBank')}</option>
                <option value="other">{t('methodOther')}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('date')}</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">{t('description')}</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Xarajat nima uchun sarflandi..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
            >
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
