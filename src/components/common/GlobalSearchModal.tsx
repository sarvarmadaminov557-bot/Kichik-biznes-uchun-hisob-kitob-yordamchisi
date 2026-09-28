import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Package, Users, ShoppingBag, FileText, ArrowRight, X } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { products, customers, sales, setActiveTab, formatCurrency, t } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // toggle modal
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedProducts = q
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.barcode && p.barcode.includes(q)) ||
          p.category.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const matchedCustomers = q
    ? customers.filter(
        (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q)
      ).slice(0, 5)
    : [];

  const matchedSales = q
    ? sales.filter(
        (s) => s.invoiceNumber.toLowerCase().includes(q) || s.customerName.toLowerCase().includes(q)
      ).slice(0, 5)
    : [];

  const totalResults = matchedProducts.length + matchedCustomers.length + matchedSales.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            autoFocus
            className="w-full px-3 py-1 text-base text-slate-800 placeholder-slate-400 bg-transparent border-none outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 rounded border border-slate-200 ml-2">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-100">
          {query && totalResults === 0 && (
            <div className="py-8 text-center text-sm text-slate-500">
              "{query}" bo'yicha hech narsa topilmadi
            </div>
          )}

          {!query && (
            <div className="py-6 px-3 text-center text-xs text-slate-400">
              Mahsulot nomi, artikul, mijoz ismi, telefon raqami yoki chek raqamini yozing
            </div>
          )}

          {/* Matched Products */}
          {matchedProducts.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" />
                {t('productsTitle')}
              </div>
              {matchedProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setActiveTab('products');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">{p.name}</div>
                    <div className="text-xs text-slate-400 font-mono">
                      {p.sku} • {p.category} • Omborda: {p.quantity} {p.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-slate-700">{formatCurrency(p.sellingPrice)}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 inline ml-2" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Matched Customers */}
          {matchedCustomers.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                {t('customersTitle')}
              </div>
              {matchedCustomers.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveTab('customers');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">{c.name}</div>
                    <div className="text-xs text-slate-400 font-mono">{c.phone}</div>
                  </div>
                  <div className="text-right">
                    {c.currentDebt > 0 ? (
                      <span className="text-xs font-bold text-rose-600">Qarzi: {formatCurrency(c.currentDebt)}</span>
                    ) : (
                      <span className="text-xs text-emerald-600">Qarzsiz</span>
                    )}
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 inline ml-2" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Matched Sales */}
          {matchedSales.length > 0 && (
            <div className="py-2">
              <div className="px-3 pb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                {t('salesTitle')}
              </div>
              {matchedSales.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveTab('sales');
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-50 text-left transition-colors group"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 font-mono">
                      {s.invoiceNumber}
                    </div>
                    <div className="text-xs text-slate-400">
                      {s.customerName} • {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-800">{formatCurrency(s.total)}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 inline ml-2" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
