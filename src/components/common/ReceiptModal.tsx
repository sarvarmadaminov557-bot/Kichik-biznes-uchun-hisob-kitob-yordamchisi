import React from 'react';
import { Sale } from '../../types';
import { useApp } from '../../context/AppContext';
import { Printer, X, CheckCircle, Clock } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, isOpen, onClose }) => {
  const { business, formatCurrency, t } = useApp();

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">{t('printReceipt')}</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-blue-50 text-blue-700">
              {sale.invoiceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              Chop etish
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="p-8 overflow-y-auto bg-slate-50/50 print:bg-white print:p-0 print:overflow-visible">
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs max-w-md mx-auto print:border-none print:shadow-none print:p-0 font-mono text-sm text-slate-800">
            {/* Business Header */}
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <h2 className="text-lg font-bold uppercase tracking-wider text-slate-900">{business.name}</h2>
              {business.address && <p className="text-xs text-slate-500 mt-0.5">{business.address}</p>}
              {business.phone && <p className="text-xs text-slate-500">Tel: {business.phone}</p>}
              {business.taxNumber && <p className="text-xs text-slate-500">STIR/INN: {business.taxNumber}</p>}
            </div>

            {/* Receipt Meta */}
            <div className="py-3 border-b border-dashed border-slate-300 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('invoiceNumber')}:</span>
                <span className="font-semibold">{sale.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('date')}:</span>
                <span>{new Date(sale.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('customer')}:</span>
                <span className="font-semibold">{sale.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kassir / Xodim:</span>
                <span>{sale.createdBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{t('paymentMethod')}:</span>
                <span className="uppercase">{t(`method${sale.paymentMethod.charAt(0).toUpperCase() + sale.paymentMethod.slice(1)}` as any, sale.paymentMethod)}</span>
              </div>
            </div>

            {/* Items Table */}
            <div className="py-3 border-b border-dashed border-slate-300">
              <div className="flex justify-between text-xs font-bold text-slate-500 pb-1">
                <span>Tovar / Xizmat</span>
                <span>Jami</span>
              </div>
              <div className="space-y-2 mt-2">
                {sale.items.map((item, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="font-semibold text-slate-900">{item.productName}</div>
                    <div className="flex justify-between text-slate-500 mt-0.5">
                      <span>
                        {item.quantity} {item.unit || 'dona'} x {formatCurrency(item.unitPrice)}
                      </span>
                      <span className="font-semibold text-slate-800">{formatCurrency(item.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals Summary */}
            <div className="py-3 border-b border-dashed border-slate-300 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">{t('subtotal')}:</span>
                <span>{formatCurrency(sale.subtotal)}</span>
              </div>
              {sale.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>{t('discount')}:</span>
                  <span>-{formatCurrency(sale.discount)}</span>
                </div>
              )}
              {sale.tax > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>{t('tax')}:</span>
                  <span>+{formatCurrency(sale.tax)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-1 border-t border-slate-200 text-slate-900">
                <span>{t('totalAmount')}:</span>
                <span>{formatCurrency(sale.total)}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">{t('paidAmount')}:</span>
                <span className="font-semibold text-emerald-700">{formatCurrency(sale.paidAmount)}</span>
              </div>
              {sale.remainingDebt > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>{t('remainingDebt')}:</span>
                  <span>{formatCurrency(sale.remainingDebt)}</span>
                </div>
              )}
            </div>

            {/* Status Footer */}
            <div className="pt-4 text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                {sale.status === 'completed' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>To'liq to'langan</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Qarz mavjud: {formatCurrency(sale.remainingDebt)}</span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Xaridingiz uchun tashakkur!</p>
              <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2">
                BiznesPro SaaS orqali avtomatlashtirilgan
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
