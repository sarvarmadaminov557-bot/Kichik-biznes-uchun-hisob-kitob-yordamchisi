import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Language, Currency, UserRole, BusinessType } from '../../types';
import {
  Settings,
  Building2,
  Globe,
  DollarSign,
  Users,
  Database,
  Shield,
  Save,
  RotateCcw,
  Trash2,
  Plus,
  Check,
  Download
} from 'lucide-react';
import { ConfirmationModal } from '../common/ConfirmationModal';

export const SettingsTab: React.FC = () => {
  const {
    business,
    updateBusinessSettings,
    language,
    setLanguage,
    user,
    teamMembers,
    addTeamMember,
    categories,
    addCategory,
    resetDemoData,
    clearAllData,
    exportDataJSON,
    t,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'business' | 'system' | 'team' | 'categories' | 'data'
  >('business');

  // Business fields
  const [bizName, setBizName] = useState(business.name);
  const [bizType, setBizType] = useState<BusinessType>(business.type);
  const [bizPhone, setBizPhone] = useState(business.phone || '');
  const [bizEmail, setBizEmail] = useState(business.email || '');
  const [bizAddress, setBizAddress] = useState(business.address || '');
  const [taxNumber, setTaxNumber] = useState(business.taxNumber || '');
  const [taxRate, setTaxRate] = useState(business.taxRate || 4);

  // Currency
  const [currency, setCurrency] = useState<Currency>(business.currency || 'UZS');

  // New category
  const [newCat, setNewCat] = useState('');

  // New Member Modal
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<UserRole>('employee');
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Confirmation Modals
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusinessSettings({
      name: bizName.trim(),
      type: bizType,
      phone: bizPhone.trim() || undefined,
      email: bizEmail.trim() || undefined,
      address: bizAddress.trim() || undefined,
      taxNumber: taxNumber.trim() || undefined,
      taxRate,
      currency,
    });
  };

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    addTeamMember(newMemberName.trim(), newMemberEmail.trim(), newMemberRole);
    setNewMemberName('');
    setNewMemberEmail('');
    setIsAddingMember(false);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('settingsTitle')}</h1>
        <p className="text-xs text-slate-500 mt-0.5">{t('settingsSubtitle')}</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-2xl overflow-x-auto custom-scrollbar">
        {[
          { id: 'business', label: t('tabBusiness'), icon: Building2 },
          { id: 'system', label: t('tabSystem'), icon: Globe },
          { id: 'team', label: t('tabTeam'), icon: Users },
          { id: 'categories', label: 'Kategoriyalar', icon: Settings },
          { id: 'data', label: t('tabData'), icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SECTION 1: BUSINESS SETTINGS */}
      {activeSection === 'business' && (
        <form onSubmit={handleSaveBusiness} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            {t('tabBusiness')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Biznes nomi *</label>
              <input
                type="text"
                required
                value={bizName}
                onChange={(e) => setBizName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Faoliyat turi</label>
              <select
                value={bizType}
                onChange={(e) => setBizType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="retail">{t('typeRetail')}</option>
                <option value="restaurant">{t('typeRestaurant')}</option>
                <option value="service">{t('typeService')}</option>
                <option value="online_store">{t('typeOnlineStore')}</option>
                <option value="freelancer">{t('typeFreelancer')}</option>
                <option value="workshop">{t('typeWorkshop')}</option>
                <option value="other">{t('typeOther')}</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('phone')}</label>
              <input
                type="text"
                value={bizPhone}
                onChange={(e) => setBizPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('email')}</label>
              <input
                type="email"
                value={bizEmail}
                onChange={(e) => setBizEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('companyAddress')}</label>
              <input
                type="text"
                value={bizAddress}
                onChange={(e) => setBizAddress(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('taxId')}</label>
              <input
                type="text"
                value={taxNumber}
                onChange={(e) => setTaxNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">{t('taxRatePercent')}</label>
              <input
                type="number"
                min="0"
                max="100"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('saveChanges')}</span>
            </button>
          </div>
        </form>
      )}

      {/* SECTION 2: SYSTEM LANGUAGE & CURRENCY */}
      {activeSection === 'system' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            {t('tabSystem')}
          </h2>

          {/* Language Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-3">
              {t('preferredLanguage')} (O'zbek / Русский / English)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { code: 'uz', label: "O'zbekcha", desc: 'Lotin alifbosida o\'zbek tili', flag: '🇺🇿' },
                { code: 'ru', label: 'Русский', desc: 'Русский язык интерфейса', flag: '🇷🇺' },
                { code: 'en', label: 'English', desc: 'International English', flag: '🇬🇧' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLanguage(lang.code as any)}
                  className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    language === lang.code
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lang.flag}</span>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{lang.label}</div>
                      <div className="text-[11px] text-slate-400">{lang.desc}</div>
                    </div>
                  </div>
                  {language === lang.code && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Selection */}
          <div className="pt-4 border-t border-slate-100">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-3">
              {t('preferredCurrency')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { code: 'UZS', name: "O'zbek so'mi", symbol: "so'm" },
                { code: 'USD', name: 'AQSH dollari', symbol: '$' },
                { code: 'EUR', name: 'Yevro', symbol: '€' },
                { code: 'RUB', name: 'Rossiya rubli', symbol: '₽' },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    setCurrency(c.code as any);
                    updateBusinessSettings({ currency: c.code as any });
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    currency === c.code
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-slate-900">{c.code}</span>
                    <span className="text-xs font-mono font-bold text-blue-600">{c.symbol}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TEAM MEMBERS & ROLES */}
      {activeSection === 'team' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('tabTeam')}</h2>
              <p className="text-xs text-slate-500">Biznes egasi, menejer va xodimlar uchun huquqlar (RBAC)</p>
            </div>
            <button
              onClick={() => setIsAddingMember(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Xodim qo'shish</span>
            </button>
          </div>

          {/* Members Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                  <div className="text-[11px] text-slate-400">{member.email}</div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      member.role === 'owner'
                        ? 'bg-purple-100 text-purple-800'
                        : member.role === 'manager'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {member.role === 'owner' ? t('roleOwner') : member.role === 'manager' ? t('roleManager') : t('roleEmployee')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Add Member Drawer/Form */}
          {isAddingMember && (
            <form onSubmit={handleCreateMember} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide block">Yangi jamoa a'zosi</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Xodim F.I.SH."
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Email manzili"
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                >
                  <option value="employee">{t('roleEmployee')} (Faqat kassa va savdo)</option>
                  <option value="manager">{t('roleManager')} (Ombor, tovarlar va hisobotlar)</option>
                  <option value="owner">{t('roleOwner')} (To'liq ruxsat)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddingMember(false)}
                  className="px-3 py-1.5 text-xs text-slate-500"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-xl"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SECTION 4: PRODUCT CATEGORIES */}
      {activeSection === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Mahsulot kategoriyalari
          </h2>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Yangi toifa nomi..."
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
            />
            <button
              onClick={() => {
                if (newCat.trim()) {
                  addCategory(newCat.trim());
                  setNewCat('');
                }
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
            >
              Qo'shish
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: DATA BACKUP & RESET */}
      {activeSection === 'data' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            {t('tabData')}
          </h2>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-slate-900">Ma'lumotlar zaxirasini yuklab olish (JSON)</div>
              <div className="text-xs text-slate-500 mt-0.5">
                Barcha savdo, xarajat, tovar va mijozlar ma'lumotlarini faylga saqlash
              </div>
            </div>
            <button
              onClick={exportDataJSON}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Yuklab olish</span>
            </button>
          </div>

          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-amber-950">Demo ma'lumotlarni qayta tiklash</div>
              <div className="text-xs text-amber-800/80 mt-0.5">
                Tizimni 20 ta tovar, 10 ta mijoz, namunaviy savdolar va qarzlar bilan to'ldirish
              </div>
            </div>
            <button
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-200/80 hover:bg-amber-200 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('resetDemoData')}</span>
            </button>
          </div>

          <div className="p-4 bg-rose-50/60 rounded-2xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-sm font-bold text-rose-950">Barcha ma'lumotlarni tozalash (Noldan boshlash)</div>
              <div className="text-xs text-rose-800/80 mt-0.5">
                Barcha tovarlar, savdolar va operatsiyalarni o'chirib, yangi toza biznes boshlash
              </div>
            </div>
            <button
              onClick={() => setConfirmClear(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('clearAllData')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={resetDemoData}
        title="Demo ma'lumotlarni tiklash"
        message="Barcha mavjud o'zgarishlar namunaviy ma'lumotlar bazasi bilan almashtiriladi. Davom etilsinmi?"
        confirmText="Tiklash"
        isDanger={false}
      />

      <ConfirmationModal
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={clearAllData}
        title="Barcha ma'lumotlarni tozalash"
        message="Haqiqatan ham barcha savdolar, tovarlar va mijozlar o'chirilsinmi? Ushbu amal qaytarib bo'lmaydi."
        confirmText="Tozalash"
        isDanger={true}
      />
    </div>
  );
};
