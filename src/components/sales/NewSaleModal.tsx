import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SaleItem, Sale } from '../../types';
import {
  X,
  Plus,
  Trash2,
  Search,
  ShoppingCart,
  User,
  CreditCard,
  DollarSign,
  AlertCircle,
  Calendar
} from 'lucide-react';

interface NewSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaleCreated?: (sale: Sale) => void;
}

export const NewSaleModal: React.FC<NewSaleModalProps> = ({ isOpen, onClose, onSaleCreated }) => {
  const { products, customers, createSale, formatCurrency, t, showToast } = useApp();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [items, setItems] = useState<SaleItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank' | 'other'>('cash');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');

  // Product search picker
  const [prodSearch, setProdSearch] = useState('');

  if (!isOpen) return null;

  // Available in-stock products
  const searchResults = prodSearch.trim()
    ? products.filter(
        (p) =>
          p.quantity > 0 &&
          (p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
            p.sku.toLowerCase().includes(prodSearch.toLowerCase()))
      ).slice(0, 6)
    : [];

  const handleSelectCustomer = (custId: string) => {
    setSelectedCustomerId(custId);
    if (custId) {
      const c = customers.find((cust) => cust.id === custId);
      if (c) {
        setCustomerName(c.name);
        setCustomerPhone(c.phone);
      }
    } else {
      setCustomerName('');
      setCustomerPhone('');
    }
  };

  const handleAddItem = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const existingIdx = items.findIndex((i) => i.productId === productId);
    if (existingIdx > -1) {
      const newItems = [...items];
      if (newItems[existingIdx].quantity < prod.quantity) {
        newItems[existingIdx].quantity += 1;
        newItems[existingIdx].total = newItems[existingIdx].quantity * newItems[existingIdx].unitPrice;
        setItems(newItems);
      } else {
        showToast(`Omborda faqat ${prod.quantity} ${prod.unit} mavjud`, 'error');
      }
    } else {
      const newItem: SaleItem = {
        productId: prod.id,
        productName: prod.name,
        quantity: 1,
        unitPrice: prod.sellingPrice,
        costPrice: prod.purchasePrice,
        total: prod.sellingPrice,
        unit: prod.unit,
      };
      setItems([...items, newItem]);
    }
    setProdSearch('');
  };

  const handleUpdateItemQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(index);
      return;
    }
    const item = items[index];
    const prod = products.find((p) => p.id === item.productId);
    if (prod && newQty > prod.quantity) {
      showToast(`Omborda faqat ${prod.quantity} ${prod.unit} mavjud`, 'error');
      return;
    }
    const newItems = [...items];
    newItems[index].quantity = newQty;
    newItems[index].total = newQty * newItems[index].unitPrice;
    setItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, i) => sum + i.total, 0);
  const total = Math.max(0, subtotal - discount + tax);
  const remainingDebt = Math.max(0, total - paidAmount);

  // Auto set paid amount to full if not customized
  const handleSetFullPayment = () => {
    setPaidAmount(total);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      showToast('Iltimos, kamida bitta mahsulot tanlang', 'error');
      return;
    }

    const created = createSale({
      customerId: selectedCustomerId || undefined,
      customerName: customerName || t('walkInCustomer'),
      customerPhone: customerPhone || undefined,
      items,
      discount,
      tax,
      paidAmount,
      paymentMethod,
      notes,
      dueDate: remainingDebt > 0 ? dueDate : undefined,
    });

    if (onSaleCreated) {
      onSaleCreated(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('newSaleButton')}</h2>
              <p className="text-xs text-slate-400">Tezkor kassa savdosi va qarzni hisoblash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Customer Selection */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-3">
              1. Mijoz ma'lumotlari
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">
                  Mijozni tanlang
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleSelectCustomer(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-blue-500"
                >
                  <option value="">{t('walkInCustomer')}</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.currentDebt > 0 ? `(Qarzi: ${formatCurrency(c.currentDebt)})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">
                  Mijoz ismi (yoki telefon)
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ism yoki korxona nomi"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-800 outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Product Selector */}
          <div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-2">
              2. Mahsulotlarni qo'shish
            </span>

            {/* Product Quick Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
                placeholder="Mahsulot nomi yoki artikulini yozing..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
              />

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-20 max-h-48 overflow-y-auto">
                  {searchResults.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleAddItem(p.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-blue-50 text-left transition-colors"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">{p.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {p.sku} • Omborda: {p.quantity} {p.unit}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-blue-600">
                        {formatCurrency(p.sellingPrice)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Items List */}
            {items.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                Savdo uchun mahsulotlar tanlanmagan. Yuqoridagi qidiruv orqali tovar qo'shing.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
                {items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 truncate">{item.productName}</div>
                      <div className="text-[11px] text-slate-400">{formatCurrency(item.unitPrice)} / {item.unit}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItemQuantity(idx, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 text-center font-bold border border-slate-200 rounded-lg text-xs"
                      />
                      <span className="text-[11px] text-slate-500 w-10">{item.unit}</span>
                    </div>

                    <div className="w-24 text-right font-bold text-slate-900">
                      {formatCurrency(item.total)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment & Calculation */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-4">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">
              3. Hisob-kitob va To'lov
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">Chegirma</label>
                <input
                  type="number"
                  min="0"
                  value={discount || ''}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">To'lov turi</label>
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
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-500 font-semibold">To'langan summa</label>
                  <button
                    type="button"
                    onClick={handleSetFullPayment}
                    className="text-[10px] text-blue-600 hover:underline font-bold"
                  >
                    To'liq to'landi
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={paidAmount || ''}
                  onChange={(e) => setPaidAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-slate-900"
                />
              </div>
            </div>

            {/* If debt exists, ask for due date */}
            {remainingDebt > 0 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>
                    Qarz summasi: <strong>{formatCurrency(remainingDebt)}</strong>. Nasiya daftarga kiritiladi.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-amber-700 font-semibold">Qaytarish muddati:</span>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="px-2 py-1 rounded-lg border border-amber-300 bg-white text-xs font-semibold"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Eslatma / Izoh</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Chek izohi yoki qo'shimcha shartlar..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              />
            </div>

            {/* Final Totals Bar */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400">Oraliq jami: {formatCurrency(subtotal)}</span>
                {discount > 0 && <span className="text-emerald-600 block">Chegirma: -{formatCurrency(discount)}</span>}
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Jami to'lov</span>
                <div className="text-xl font-extrabold text-blue-600">{formatCurrency(total)}</div>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={items.length === 0}
              className="px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs disabled:opacity-50 transition-all"
            >
              {t('completeSale')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
