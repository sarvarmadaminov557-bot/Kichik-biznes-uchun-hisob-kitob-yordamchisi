import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Truck, Plus, Trash2, AlertCircle } from 'lucide-react';

interface NewPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPurchaseModal: React.FC<NewPurchaseModalProps> = ({ isOpen, onClose }) => {
  const { suppliers, products, createPurchase, formatCurrency, t, showToast } = useApp();

  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || '');
  const [quantity, setQuantity] = useState(10);
  const [unitCost, setUnitCost] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank' | 'other'>('bank');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSelectProduct = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setUnitCost(prod.purchasePrice);
    }
  };

  const handleSelectSupplier = (supId: string) => {
    setSelectedSupplierId(supId);
    const s = suppliers.find((sup) => sup.id === supId);
    if (s) {
      setSupplierName(s.name);
    }
  };

  const totalAmount = quantity * unitCost;
  const remainingDebt = Math.max(0, totalAmount - paidAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierName.trim()) {
      showToast('Iltimos, ta\'minotchi nomini kiriting', 'error');
      return;
    }
    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) {
      showToast('Mahsulot tanlanmagan', 'error');
      return;
    }

    createPurchase({
      supplierId: selectedSupplierId || undefined,
      supplierName: supplierName.trim(),
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          quantity,
          unitCost,
          total: totalAmount,
        },
      ],
      paidAmount,
      paymentMethod,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('newPurchase')}</h2>
              <p className="text-xs text-slate-400">Omborni to'ldirish va ta'minotchi qarzini hisoblash</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Ta'minotchi</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedSupplierId}
                onChange={(e) => handleSelectSupplier(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="">Ro'yxatdan tanlash...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Yoki yangi ta'minotchi"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Mahsulot</label>
            <select
              value={selectedProductId}
              onChange={(e) => handleSelectProduct(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Hozirgi qoldiq: {p.quantity} {p.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Miqdori (Kirim soni)</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Kirim tannarxi</label>
              <input
                type="number"
                min="0"
                required
                value={unitCost || ''}
                onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">Jami kirim summasi:</span>
            <span className="text-base font-extrabold text-slate-900">{formatCurrency(totalAmount)}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">To'lov usuli</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="bank">Bank o'tkazmasi</option>
                <option value="cash">Naqd pul</option>
                <option value="card">Plastik karta</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Hozir to'langan summa</label>
              <input
                type="number"
                min="0"
                value={paidAmount || ''}
                onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {remainingDebt > 0 && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Ta'minotchi oldida <strong>{formatCurrency(remainingDebt)}</strong> qarz yoziladi.
              </span>
            </div>
          )}

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
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              Kirimni qabul qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
