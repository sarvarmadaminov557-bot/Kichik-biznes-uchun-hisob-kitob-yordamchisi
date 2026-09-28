import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Printer,
  Download,
  Calendar,
  Layers,
  TrendingUp,
  CreditCard,
  Package,
  Receipt,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsTab: React.FC = () => {
  const { business, financialMetrics, filteredSales, filteredExpenses, debts, products, formatCurrency, t, showToast } = useApp();

  const [activeReport, setActiveReport] = useState<
    'pl' | 'sales' | 'expenses' | 'inventory' | 'debts' | 'tax'
  >('pl');

  // Handle Printable View
  const handlePrint = () => {
    window.print();
  };

  // Handle CSV Export
  const handleDownloadCSV = () => {
    let headers = '';
    let rows = '';

    if (activeReport === 'pl') {
      headers = 'Korsatkich,Summa,Izoh\n';
      rows = [
        `"Jami Daromad (Revenue)",${financialMetrics.revenue},"Savdo tushumlari"`,
        `"Tannarx (COGS)",${financialMetrics.cogs},"Sotilgan mahsulotlar tannarxi"`,
        `"Yalpi foyda (Gross Profit)",${financialMetrics.grossProfit},"Daromad - Tannarx"`,
        `"Operatsion xarajatlar",${financialMetrics.operatingExpenses},"Ijara, oylik va h.k."`,
        `"Sof foyda (Net Profit)",${financialMetrics.netProfit},"Soliqdan oldingi sof foyda"`,
      ].join('\n');
    } else if (activeReport === 'sales') {
      headers = 'Chek_No,Mijoz,Summa,Tolanmagan_Qarz,Sana\n';
      rows = filteredSales
        .map((s) => `"${s.invoiceNumber}","${s.customerName}",${s.total},${s.remainingDebt},"${s.createdAt}"`)
        .join('\n');
    } else if (activeReport === 'inventory') {
      headers = 'Mahsulot,SKU,Qoldiq,Tannarx,Jami_Tannarx_Qiymati\n';
      rows = products
        .map((p) => `"${p.name}","${p.sku}",${p.quantity},${p.purchasePrice},${p.quantity * p.purchasePrice}`)
        .join('\n');
    } else {
      headers = 'Shaxs,Turi,Qoldiq_Qarz,Muddat\n';
      rows = debts
        .map((d) => `"${d.partyName}","${d.type}",${d.remainingAmount},"${d.dueDate}"`)
        .join('\n');
    }

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `biznespro_hisobot_${activeReport}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('Hisobot CSV formatida yuklab olindi', 'success');
  };

  // Calculate turnover tax (e.g. 4% in Uzbekistan for simplified business)
  const taxRate = business.taxRate || 4;
  const estimatedTax = (financialMetrics.revenue * taxRate) / 100;
  const netProfitAfterTax = financialMetrics.netProfit - estimatedTax;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('reportsTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('reportsSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('downloadCSV')}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t('printReport')}</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl overflow-x-auto custom-scrollbar no-print">
        {[
          { id: 'pl', label: t('reportProfitLoss'), icon: TrendingUp },
          { id: 'sales', label: t('reportSales'), icon: BarChart3 },
          { id: 'expenses', label: t('reportExpenses'), icon: Receipt },
          { id: 'inventory', label: t('reportInventory'), icon: Package },
          { id: 'debts', label: t('reportDebts'), icon: CreditCard },
          { id: 'tax', label: 'Soliq hisoboti', icon: FileSpreadsheet },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReport === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReport(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs print:border-none print:shadow-none print:p-0">
        {/* Printable Business Header */}
        <div className="border-b border-slate-200 pb-5 mb-6 flex items-start justify-between">
          <div>
            <div className="text-xl font-extrabold text-slate-900">{business.name}</div>
            <div className="text-xs text-slate-500 mt-1">
              {business.address} • Tel: {business.phone || '+998 71 200 45 45'}
            </div>
            {business.taxNumber && (
              <div className="text-xs text-slate-400 font-mono mt-0.5">STIR / INN: {business.taxNumber}</div>
            )}
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-50 text-blue-700">
              Rasmiy hisobot
            </span>
            <div className="text-xs text-slate-400 mt-1">Sana: {new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* 1. PROFIT & LOSS STATEMENT */}
        {activeReport === 'pl' && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900">Foyda va zararlar to'g'risida hisobot (P&L)</h2>
              <p className="text-xs text-slate-500">Kompaniyaning haqiqiy moliyaviy natijalari</p>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {/* Revenue */}
              <div className="py-3 flex justify-between font-bold text-slate-900 text-sm">
                <span>1. JAMI SAVDO DAROMADI (REVENUE)</span>
                <span>{formatCurrency(financialMetrics.revenue)}</span>
              </div>

              {/* COGS */}
              <div className="py-3 flex justify-between text-slate-600 pl-4">
                <span>2. Sotilgan tovarlar tannarxi (COGS)</span>
                <span className="font-semibold text-rose-600">− {formatCurrency(financialMetrics.cogs)}</span>
              </div>

              {/* Gross Profit */}
              <div className="py-3 flex justify-between font-bold text-indigo-700 bg-indigo-50/40 px-3 rounded-lg text-sm">
                <span>3. YALPI FOYDA (GROSS PROFIT)</span>
                <span>{formatCurrency(financialMetrics.grossProfit)}</span>
              </div>

              {/* Operating Expenses */}
              <div className="py-3 flex justify-between text-slate-600 pl-4">
                <span>4. Operatsion xarajatlar (Ijara, Oylik, Reklama)</span>
                <span className="font-semibold text-rose-600">− {formatCurrency(financialMetrics.operatingExpenses)}</span>
              </div>

              {/* Operating Profit */}
              <div className="py-3 flex justify-between font-bold text-slate-800">
                <span>5. Operatsion sof foyda (Soliqdan oldin)</span>
                <span className={financialMetrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {formatCurrency(financialMetrics.netProfit)}
                </span>
              </div>

              {/* Taxes */}
              <div className="py-3 flex justify-between text-slate-500 pl-4">
                <span>6. Hisoblangan aylanma solig'i ({taxRate}%)</span>
                <span>− {formatCurrency(estimatedTax)}</span>
              </div>

              {/* Net Profit After Tax */}
              <div className="py-4 flex justify-between font-extrabold text-base bg-emerald-50 px-4 rounded-xl text-emerald-900">
                <span>7. CHO'NTAKKA QOLADIGAN SOF FOYDA (NET PROFIT)</span>
                <span>{formatCurrency(netProfitAfterTax)}</span>
              </div>
            </div>

            {/* Explanatory notes */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed">
              <strong>Tahlil xulosasi:</strong> Biznesning yalpi rentabelligi {financialMetrics.grossMarginPct.toFixed(1)}% ni tashkil etdi. Har 100 000 so'mlik savdodan {Math.max(0, Math.round((netProfitAfterTax / (financialMetrics.revenue || 1)) * 100000)).toLocaleString()} so'm sof foyda qolmoqda.
            </div>
          </div>
        )}

        {/* 2. SALES REPORT */}
        {activeReport === 'sales' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Savdolar va Cheklar hisoboti</h2>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Chek №</th>
                  <th className="py-2.5 px-3">Mijoz</th>
                  <th className="py-2.5 px-3">Summa</th>
                  <th className="py-2.5 px-3">To'langan</th>
                  <th className="py-2.5 px-3">Qarz</th>
                  <th className="py-2.5 px-3">Sana</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSales.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5 px-3 font-mono font-bold">{s.invoiceNumber}</td>
                    <td className="py-2.5 px-3">{s.customerName}</td>
                    <td className="py-2.5 px-3 font-bold">{formatCurrency(s.total)}</td>
                    <td className="py-2.5 px-3 text-emerald-600">{formatCurrency(s.paidAmount)}</td>
                    <td className="py-2.5 px-3 text-rose-600">{s.remainingDebt > 0 ? formatCurrency(s.remainingDebt) : '0'}</td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. EXPENSES REPORT */}
        {activeReport === 'expenses' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Xarajatlar moddalari hisoboti</h2>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Kategoriya</th>
                  <th className="py-2.5 px-3">Tavsif</th>
                  <th className="py-2.5 px-3">To'lov turi</th>
                  <th className="py-2.5 px-3">Sana</th>
                  <th className="py-2.5 px-3 text-right">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((e) => (
                  <tr key={e.id}>
                    <td className="py-2.5 px-3 font-bold">{e.category}</td>
                    <td className="py-2.5 px-3">{e.description}</td>
                    <td className="py-2.5 px-3 uppercase text-slate-500">{e.paymentMethod}</td>
                    <td className="py-2.5 px-3 text-slate-400">{new Date(e.date || e.createdAt).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-rose-600">-{formatCurrency(e.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. INVENTORY REPORT */}
        {activeReport === 'inventory' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Ombor qoldiqlari va tannarx qiymati</h2>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Mahsulot</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Kategoriya</th>
                  <th className="py-2.5 px-3">Qoldiq</th>
                  <th className="py-2.5 px-3">Tannarx</th>
                  <th className="py-2.5 px-3 text-right">Jami tannarx qiymati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 px-3 font-semibold">{p.name}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">{p.sku}</td>
                    <td className="py-2.5 px-3">{p.category}</td>
                    <td className="py-2.5 px-3 font-bold">{p.quantity} {p.unit}</td>
                    <td className="py-2.5 px-3">{formatCurrency(p.purchasePrice)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-indigo-700">
                      {formatCurrency(p.quantity * p.purchasePrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. DEBTS REPORT */}
        {activeReport === 'debts' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900">Qarzlar va muddati o'tgan majburiyatlar hisoboti</h2>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-semibold uppercase">
                <tr>
                  <th className="py-2.5 px-3">Shaxs / Korxona</th>
                  <th className="py-2.5 px-3">Qarz turi</th>
                  <th className="py-2.5 px-3">Qoldiq summa</th>
                  <th className="py-2.5 px-3">To'lash muddati</th>
                  <th className="py-2.5 px-3">Holati</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {debts.map((d) => (
                  <tr key={d.id}>
                    <td className="py-2.5 px-3 font-bold">{d.partyName}</td>
                    <td className="py-2.5 px-3 capitalize">
                      {d.type === 'receivable' ? 'Mijoz qarzi (Bizga)' : 'Bizning qarzimiz (Ta\'minotchi)'}
                    </td>
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">{formatCurrency(d.remainingAmount)}</td>
                    <td className="py-2.5 px-3 text-slate-500">{new Date(d.dueDate).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        d.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : d.status === 'overdue' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 6. TAX REPORT */}
        {activeReport === 'tax' && (
          <div className="space-y-5">
            <h2 className="text-base font-bold text-slate-900">Soliq hisob-kitobi xulosasi</h2>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Aylanmadan olinadigan soliq stavkasi:</span>
                <span className="font-bold text-slate-900">{taxRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Soliq solinadigan jami aylanma (Daromad):</span>
                <span className="font-bold text-slate-900">{formatCurrency(financialMetrics.revenue)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-extrabold text-blue-900">
                <span>Byudjetga to'lanishi lozim bo'lgan soliq:</span>
                <span>{formatCurrency(estimatedTax)}</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * Eslatma: Ushbu raqamlar tadbirkorlik subyekti ma'lumotlariga asosan hisoblangan bo'lib, rasmiy soliq hisobotini topshirishda soliq imtiyozlari hisobga olinishi mumkin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
