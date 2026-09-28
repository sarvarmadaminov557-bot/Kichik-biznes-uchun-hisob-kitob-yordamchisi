import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Customer, Debt } from '../../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Edit2,
  Trash2,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CustomerModal } from './CustomerModal';
import { RecordPaymentModal } from './RecordPaymentModal';
import { ConfirmationModal } from '../common/ConfirmationModal';
import { EmptyState } from '../common/EmptyState';

export const CustomersTab: React.FC = () => {
  const { customers, debts, deleteCustomer, formatCurrency, t } = useApp();

  const [search, setSearch] = useState('');
  const [filterDebtors, setFilterDebtors] = useState<'all' | 'debtors'>('all');

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  // For recording payment on a customer's active debt
  const [activePaymentDebt, setActivePaymentDebt] = useState<Debt | null>(null);

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()));

    const matchesDebt = filterDebtors === 'all' || c.currentDebt > 0;

    return matchesSearch && matchesDebt;
  });

  const totalDebtors = customers.filter((c) => c.currentDebt > 0).length;
  const totalReceivableAmount = customers.reduce((sum, c) => sum + c.currentDebt, 0);

  const handleOpenPaymentForCustomer = (cust: Customer) => {
    // find debt record for this customer
    const existingDebt = debts.find(
      (d) => d.partyId === cust.id && d.type === 'receivable' && d.remainingAmount > 0
    );

    if (existingDebt) {
      setActivePaymentDebt(existingDebt);
    } else {
      // create synthetic debt object for customer
      const syntheticDebt: Debt = {
        id: `debt-rec-${Date.now()}`,
        businessId: cust.businessId,
        type: 'receivable',
        partyId: cust.id,
        partyName: cust.name,
        partyPhone: cust.phone,
        originalAmount: cust.currentDebt,
        paidAmount: 0,
        remainingAmount: cust.currentDebt,
        dueDate: new Date().toISOString(),
        status: 'unpaid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setActivePaymentDebt(syntheticDebt);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('customersTitle')}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{t('customersSubtitle')}</p>
        </div>

        <button
          onClick={() => {
            setCustomerToEdit(null);
            setIsCustomerModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addCustomer')}</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Jami mijozlar</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{customers.length} nafar</div>
          <div className="text-xs text-slate-400 mt-0.5">Ro'yxatga olingan xaridorlar</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Qarzdor mijozlar</span>
          <div className="text-xl font-bold text-rose-600 mt-1">{totalDebtors} nafar</div>
          <div className="text-xs text-slate-400 mt-0.5">Faol nasiyasi mavjud</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Jami mijoz qarzi</span>
          <div className="text-xl font-bold text-blue-600 mt-1">{formatCurrency(totalReceivableAmount)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Bizga qaytarilishi kerak bo'lgan mablag'</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mijoz ismi yoki telefon raqami..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilterDebtors('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterDebtors === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Barcha mijozlar
          </button>
          <button
            onClick={() => setFilterDebtors('debtors')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterDebtors === 'debtors' ? 'bg-white text-rose-600 shadow-2xs font-bold' : 'text-slate-600'
            }`}
          >
            Faqat qarzdorlar ({totalDebtors})
          </button>
        </div>
      </div>

      {/* Customer List Table */}
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon={<Users className="w-7 h-7" />}
          title="Mijozlar topilmadi"
          description="Hech qanday mijoz topilmadi. Yangi mijoz qo'shing."
          actionText={t('addCustomer')}
          onAction={() => {
            setCustomerToEdit(null);
            setIsCustomerModalOpen(true);
          }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">{t('customerName')}</th>
                <th className="py-3 px-4">{t('phone')}</th>
                <th className="py-3 px-4">{t('totalPurchases')}</th>
                <th className="py-3 px-4">{t('paidAmount')}</th>
                <th className="py-3 px-4">{t('currentCustomerDebt')}</th>
                <th className="py-3 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    <div>{cust.name}</div>
                    {cust.notes && <div className="text-[10px] text-slate-400 font-normal">{cust.notes}</div>}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{cust.phone}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{formatCurrency(cust.totalPurchases)}</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-semibold">{formatCurrency(cust.totalPaid)}</td>
                  <td className="py-3.5 px-4 font-extrabold">
                    {cust.currentDebt > 0 ? (
                      <span className="text-rose-600 inline-flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formatCurrency(cust.currentDebt)}
                      </span>
                    ) : (
                      <span className="text-emerald-600 text-[11px] font-semibold">Qarzsiz</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {cust.currentDebt > 0 && (
                        <button
                          onClick={() => handleOpenPaymentForCustomer(cust)}
                          className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Qarz olish</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setCustomerToEdit(cust);
                          setIsCustomerModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCustomerToDelete(cust)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                        title="O'chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Add/Edit Modal */}
      <CustomerModal
        isOpen={isCustomerModalOpen}
        customerToEdit={customerToEdit}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setCustomerToEdit(null);
        }}
      />

      {/* Record Debt Payment Modal */}
      <RecordPaymentModal
        isOpen={!!activePaymentDebt}
        debt={activePaymentDebt}
        onClose={() => setActivePaymentDebt(null)}
      />

      {/* Delete Customer Confirmation */}
      <ConfirmationModal
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={() => {
          if (customerToDelete) {
            deleteCustomer(customerToDelete.id);
            setCustomerToDelete(null);
          }
        }}
        title="Mijozni o'chirish"
        message={`"${customerToDelete?.name}" mijozini o'chirmoqchimisiz?`}
        confirmText="O'chirish"
        isDanger={true}
      />
    </div>
  );
};
