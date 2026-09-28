import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import {
  Package,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Download,
  Upload,
  Edit2,
  Trash2,
  RefreshCw,
  TrendingUp,
  Tag,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ProductModal } from './ProductModal';
import { StockAdjustModal } from './StockAdjustModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { EmptyState } from '../common/EmptyState';

export const ProductsTab: React.FC = () => {
  const { products, categories, deleteProduct, formatCurrency, t, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Filtered & Searched products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.barcode && p.barcode.includes(search));

    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

    let matchesStock = true;
    if (stockFilter === 'low') matchesStock = p.quantity <= p.minStock && p.quantity > 0;
    if (stockFilter === 'out') matchesStock = p.quantity === 0;

    return matchesSearch && matchesCat && matchesStock;
  });

  // Inventory valuation calculations
  const totalCostValue = products.reduce((sum, p) => sum + p.quantity * p.purchasePrice, 0);
  const totalRetailValue = products.reduce((sum, p) => sum + p.quantity * p.sellingPrice, 0);
  const lowStockCount = products.filter((p) => p.quantity <= p.minStock).length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'ID,Nomi,SKU,Shtrix-kod,Kategoriya,Tannarx,Sotuv_narxi,Qoldiq,Birlik,Min_zaxira,Taminotchi\n';
    const rows = products
      .map(
        (p) =>
          `"${p.id}","${p.name}","${p.sku}","${p.barcode || ''}","${p.category}",${p.purchasePrice},${p.sellingPrice},${p.quantity},"${p.unit}",${p.minStock},"${p.supplierName || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `biznespro_ombor_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    showToast('Ombor ma\'lumotlari CSV formatida yuklab olindi', 'success');
  };

  const handleImportSample = () => {
    showToast('CSV import namunasi muvaffaqiyatli ishlandi', 'info');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('productsTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('productsSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
            title="CSV eksport"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsProductModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addProduct')}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Jami tovarlar</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{products.length} ta nomlanish</div>
          <div className="text-xs text-slate-400 mt-0.5">Omborda jami faol tovarlar</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Ombor tannarx qiymati</span>
          <div className="text-xl font-bold text-indigo-600 mt-1">{formatCurrency(totalCostValue)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Sotuv qiymati: {formatCurrency(totalRetailValue)}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Kam qolgan mahsulotlar</span>
          <div className="text-xl font-bold text-amber-600 mt-1">{lowStockCount} ta tovar</div>
          <div className="text-xs text-amber-600 font-semibold mt-0.5">Zaxirani to'ldirish kerak</div>
        </div>
      </div>

      {/* Low stock warning banner if any */}
      {lowStockCount > 0 && (
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Diqqat:</strong> {lowStockCount} ta mahsulot minimal chegarasidan past. Zaxirani to'ldirish uchun yangi xarid buyurtmasini rejalashtiring.
            </span>
          </div>
          <button
            onClick={() => setStockFilter(stockFilter === 'low' ? 'all' : 'low')}
            className="px-3 py-1 font-semibold rounded-lg bg-amber-200/60 hover:bg-amber-200 text-amber-900 shrink-0 transition-colors"
          >
            {stockFilter === 'low' ? 'Barchasini ko\'rsatish' : 'Faqat kam qolganlar'}
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tovar nomi, SKU, shtrix-kod..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="all">Barcha qoldiqlar</option>
            <option value="low">Kam qolganlar (&le; min)</option>
            <option value="out">Tugaganlar (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package className="w-7 h-7" />}
          title="Mahsulotlar topilmadi"
          description="Hech qanday mahsulot mavjud emas. Yangi tovar qo'shing yoki filtrni tozalang."
          actionText={t('addProduct')}
          onAction={() => {
            setProductToEdit(null);
            setIsProductModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('productName')}</th>
                <th className="py-3 px-4">{t('sku')}</th>
                <th className="py-3 px-4">{t('category')}</th>
                <th className="py-3 px-4">{t('purchasePrice')}</th>
                <th className="py-3 px-4">{t('sellingPrice')}</th>
                <th className="py-3 px-4">{t('stockQuantity')}</th>
                <th className="py-3 px-4">{t('status')}</th>
                <th className="py-3 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => {
                const isLow = p.quantity <= p.minStock && p.quantity > 0;
                const isOut = p.quantity === 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      <div>{p.name}</div>
                      {p.supplierName && <div className="text-[10px] text-slate-400">{p.supplierName}</div>}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">{p.sku}</td>
                    <td className="py-3.5 px-4 text-slate-600">{p.category}</td>
                    <td className="py-3.5 px-4 text-slate-500">{formatCurrency(p.purchasePrice)}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(p.sellingPrice)}</td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-800">
                      {p.quantity} {p.unit}
                    </td>
                    <td className="py-3.5 px-4">
                      {isOut ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                          {t('outOfStock')}
                        </span>
                      ) : isLow ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                          {p.quantity} {p.unit} qoldi (min: {p.minStock})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {t('inStock')}
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setAdjustingProduct(p)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          title="Qoldiqni to'g'rilash"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setProductToEdit(p);
                            setIsProductModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="O'chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      <ProductModal
        isOpen={isProductModalOpen}
        productToEdit={productToEdit}
        onClose={() => {
          setIsProductModalOpen(false);
          setProductToEdit(null);
        }}
      />

      {/* Stock Adjust Modal */}
      <StockAdjustModal
        isOpen={!!adjustingProduct}
        product={adjustingProduct}
        onClose={() => setAdjustingProduct(null)}
      />

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
            setProductToDelete(null);
          }
        }}
        title="Mahsulotni o'chirish"
        message={`"${productToDelete?.name}" mahsulotini o'chirmoqchimisiz?`}
        confirmText="O'chirish"
        isDanger={true}
      />
    </div>
  );
};
