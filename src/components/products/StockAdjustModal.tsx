import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { X, RefreshCw, Plus, Minus, AlertCircle } from 'lucide-react';

interface StockAdjustModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const StockAdjustModal: React.FC<StockAdjustModalProps> = ({ product, isOpen, onClose }) => {
  const { adjustStock, showToast } = useApp();
  const [delta, setDelta] = useState<number>(0);
  const [reason, setReason] = useState<string>('Sanash natijasi (Inventarizatsiya)');

  if (!isOpen || !product) return null;

  const newStock = Math.max(0, product.quantity + delta);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (delta === 0) {
      showToast('O\'zgarish miqdorini kiriting', 'error');
      return;
    }
    adjustStock(product.id, delta, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Qoldiqni to'g'rilash</h2>
              <p className="text-xs text-slate-400">{product.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">Hozirgi qoldiq:</span>
            <span className="text-base font-extrabold text-slate-900">
              {product.quantity} {product.unit}
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">
              O'zgarish miqdori (+ qo'shish, - kamaytirish)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={delta || ''}
                onChange={(e) => setDelta(parseInt(e.target.value) || 0)}
                placeholder="+5 yoki -2"
                className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-slate-200 outline-none focus:border-blue-500"
              />
              <span className="text-xs font-semibold text-slate-500">{product.unit}</span>
            </div>
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
            <span className="text-blue-800 font-semibold">Yangi hisoblangan qoldiq:</span>
            <span className="font-extrabold text-blue-900 text-sm">
              {newStock} {product.unit}
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">To'g'rilash sababi</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              <option value="Sanash natijasi (Inventarizatsiya)">Sanash natijasi (Inventarizatsiya)</option>
              <option value="Buzilgan yoki yaroqsiz tovar (Spisaniye)">Buzilgan yoki yaroqsiz tovar (Spisaniye)</option>
              <option value="Kassa xatosi orqali noaniqlik">Kassa xatosi orqali noaniqlik</option>
              <option value="Mijozdan qaytgan tovar (Vozvrat)">Mijozdan qaytgan tovar (Vozvrat)</option>
              <option value="Boshqa sabab">Boshqa sabab</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
