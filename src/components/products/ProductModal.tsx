import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { X, Package, DollarSign, Layers } from 'lucide-react';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct, categories, suppliers, t, showToast } = useApp();

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState(categories[0] || 'Smartfonlar');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(10);
  const [minStock, setMinStock] = useState<number>(5);
  const [supplierName, setSupplierName] = useState('');
  const [unit, setUnit] = useState('dona');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setSku(productToEdit.sku);
      setBarcode(productToEdit.barcode || '');
      setCategory(productToEdit.category);
      setPurchasePrice(productToEdit.purchasePrice);
      setSellingPrice(productToEdit.sellingPrice);
      setQuantity(productToEdit.quantity);
      setMinStock(productToEdit.minStock);
      setSupplierName(productToEdit.supplierName || '');
      setUnit(productToEdit.unit);
      setDescription(productToEdit.description || '');
    } else {
      setName('');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setBarcode('');
      setCategory(categories[0] || 'Smartfonlar');
      setPurchasePrice(0);
      setSellingPrice(0);
      setQuantity(10);
      setMinStock(5);
      setSupplierName('');
      setUnit('dona');
      setDescription('');
    }
  }, [productToEdit, isOpen, categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Iltimos, tovar nomini kiriting', 'error');
      return;
    }
    if (sellingPrice < purchasePrice) {
      if (!confirm('Sotuv narxi tannarxdan past. Davom etilsinmi?')) {
        return;
      }
    }

    if (productToEdit) {
      updateProduct(productToEdit.id, {
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        category,
        purchasePrice,
        sellingPrice,
        quantity,
        minStock,
        supplierName: supplierName || undefined,
        unit,
        description: description.trim() || undefined,
      });
    } else {
      addProduct({
        name: name.trim(),
        sku: sku.trim(),
        barcode: barcode.trim() || undefined,
        category,
        purchasePrice,
        sellingPrice,
        quantity,
        minStock,
        supplierName: supplierName || undefined,
        unit,
        description: description.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {productToEdit ? 'Mahsulotni tahrirlash' : t('addProduct')}
              </h2>
              <p className="text-xs text-slate-400">Tannarx, sotuv narxi va zaxira parametrlari</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('productName')} *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Samsung Galaxy A55 128GB"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('sku')}</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="SKU-1024"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('barcode')}</label>
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                placeholder="8806091234567"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('category')}</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('unit')}</label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-500"
              >
                <option value="dona">{t('unitPiece')}</option>
                <option value="kg">{t('unitKg')}</option>
                <option value="litr">{t('unitLiter')}</option>
                <option value="metr">{t('unitMeter')}</option>
                <option value="quti">{t('unitBox')}</option>
              </select>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('purchasePrice')} (Tannarxi)
              </label>
              <input
                type="number"
                min="0"
                value={purchasePrice || ''}
                onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Sof foydani aniq hisoblash uchun asos</span>
            </div>

            <div className="bg-blue-50/50 p-3 rounded-2xl border border-blue-200">
              <label className="text-xs font-semibold text-blue-950 block mb-1">
                {t('sellingPrice')} (Sotuv narxi)
              </label>
              <input
                type="number"
                min="0"
                value={sellingPrice || ''}
                onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-blue-300 bg-white text-blue-700"
              />
              <span className="text-[10px] text-blue-600 font-semibold mt-1 block">
                Foyda marjasi: {sellingPrice > purchasePrice ? `+${(((sellingPrice - purchasePrice) / (sellingPrice || 1)) * 100).toFixed(0)}%` : '0%'}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('stockQuantity')} ({unit})
              </label>
              <input
                type="number"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('minStockLevel')} ({unit})
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={(e) => setMinStock(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Ushbu chegaradan kamayganda ogohlantirish beriladi</span>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                {t('supplier')} (Ta'minotchi)
              </label>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Kompaniya yoki yetkazib beruvchi nomi"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
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
              {t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
