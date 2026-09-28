import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Debt } from '../../types';
import { X, CreditCard, DollarSign, CheckCircle2 } from 'lucide-react';

interface RecordPaymentModalProps {
  debt: Debt | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({ debt, isOpen, onClose }) => {
  const { recordDebtPayment, formatCurrency, t, showToast } = useApp();

  const [amount, setAmount] = useState<number>(debt?.remainingAmount || 0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank' | 'other'>('cash');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen || !debt) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      showToast('Iltimos, to\'lov summasini kiriting', 'error');
      return;
    }
    if (amount > debt.remainingAmount) {
      showToast('To\'lov summasi qarz qoldig\'idan oshmasligi kerak', 'error');
      return;
    }

    recordDebtPayment(debt.id, amount, paymentMethod, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {debt.type === 'receivable' ? 'Qarz to\'lovini qabul qilish' : 'Ta\'minotchiga to\'lov qilish'}
              </h2>
              <p className="text-xs text-slate-400">{debt.partyName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Mijoz / Hamkor:</span>
              <span className="font-bold text-slate-900">{debt.partyName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hozirgi qarz qoldig'i:</span>
              <span className="font-extrabold text-rose-600">{formatCurrency(debt.remainingAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">To'lash muddati:</span>
              <span>{new Date(debt.dueDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">To'lanayotgan summa</label>
              <button
                type="button"
                onClick={() => setAmount(debt.remainingAmount)}
                className="text-[10px] text-blue-600 hover:underline font-bold"
              >
                To'liq yopish ({formatCurrency(debt.remainingAmount)})
              </button>
            </div>
            <input
              type="number"
              min="1"
              max={debt.remainingAmount}
              required
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 text-base font-extrabold rounded-xl border border-slate-200 outline-none focus:border-blue-500 text-slate-900"
            />
            {amount < debt.remainingAmount && (
              <span className="text-[11px] text-slate-400 mt-1 block">
                To'lovdan keyin qoladigan qarz: <strong>{formatCurrency(debt.remainingAmount - amount)}</strong>
              </span>
            )}
          </div>

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
            <label className="text-xs font-semibold text-slate-700 block mb-1">Izoh / Kvitansiya</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="To'lov haqida qo'shimcha ma'lumot..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
            />
          </div>

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
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
            >
              To'lovni saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
