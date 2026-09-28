import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Language, UserRole, BusinessType } from '../../types';
import {
  Building2,
  Lock,
  Mail,
  User,
  ArrowRight,
  Globe,
  Sparkles,
  Phone,
  Shield,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface AuthPageProps {
  onSuccess?: () => void;
  onShowLanding?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess, onShowLanding }) => {
  const { login, register, quickDemoLogin, language, setLanguage, t } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState<BusinessType>('retail');
  const [forgotSent, setForgotSent] = useState(false);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || 'demo@biznespro.uz', 'owner');
    if (onSuccess) onSuccess();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(
      fullName || 'Tadbirkor',
      businessName || 'Yangi Korxona',
      email || 'biznes@pro.uz',
      businessType,
      language
    );
    if (onSuccess) onSuccess();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6">
      {/* Top Bar with Language Switcher & Back to Landing */}
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-3">
          {onShowLanding && (
            <button
              onClick={onShowLanding}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-200/60 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('navLanding')}</span>
            </button>
          )}
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-2xl shadow-2xs">
          {languages.map((l) => (
            <button
              key={l.code}
              onClick={() => setLanguage(l.code)}
              className={`px-3 py-1 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors ${
                language === l.code ? 'bg-blue-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{l.flag}</span>
              <span className="uppercase">{l.code}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Auth Card */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-500/30 mb-3">
              B
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">BiznesPro</h1>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'login'
                ? t('loginSubtitle')
                : mode === 'register'
                ? t('registerSubtitle')
                : t('forgotPasswordSubtitle')}
            </p>
          </div>

          {/* Quick Demo Login Pill for Instant Testing */}
          {mode === 'login' && (
            <div className="mb-6 p-3 bg-blue-50/70 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block mb-2 text-center">
                🚀 Tezkor demo kirish (Parol talab qilinmaydi):
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    quickDemoLogin('owner');
                    if (onSuccess) onSuccess();
                  }}
                  className="px-2 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-xs text-center"
                >
                  {t('demoOwner')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    quickDemoLogin('manager');
                    if (onSuccess) onSuccess();
                  }}
                  className="px-2 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all text-center"
                >
                  {t('demoManager')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    quickDemoLogin('employee');
                    if (onSuccess) onSuccess();
                  }}
                  className="px-2 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all text-center"
                >
                  {t('demoEmployee')}
                </button>
              </div>
            </div>
          )}

          {/* LOGIN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{t('emailOrPhone')}</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarvar@biznespro.uz"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">{t('password')}</label>
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    {t('forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
              >
                {t('login')}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-xs text-slate-600 hover:text-blue-600 font-semibold"
                >
                  {t('dontHaveAccount')}
                </button>
              </div>
            </form>
          )}

          {/* REGISTER FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{t('fullName')} *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Sarvar Madaminov"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{t('step1Title')} *</label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="SmartTech Savdo & Servis"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{t('step2Title')}</label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value as any)}
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
                <label className="text-xs font-semibold text-slate-700 block mb-1">{t('emailOrPhone')} *</label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarvar@biznespro.uz"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">{t('password')} *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors mt-2"
              >
                {t('register')} & {t('onboardingTitle')}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-xs text-slate-600 hover:text-blue-600 font-semibold"
                >
                  {t('alreadyHaveAccount')}
                </button>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotSent ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-xs space-y-2">
                  <div className="font-bold text-emerald-800 text-sm">Tiklash havolasi yuborildi!</div>
                  <p className="text-emerald-700">
                    "{email || 'Emailingiz'}" manziliga parolni tiklash bo'yicha ko'rsatma yuborildi.
                  </p>
                  <button
                    onClick={() => {
                      setForgotSent(false);
                      setMode('login');
                    }}
                    className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                  >
                    {t('backToLogin')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">{t('email')}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hisobingiz@pochta.uz"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                  >
                    {t('sendResetLink')}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs text-slate-600 hover:text-blue-600 font-semibold"
                    >
                      {t('backToLogin')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-slate-400 max-w-sm mx-auto">
        &copy; {new Date().getFullYear()} BiznesPro SaaS. Barcha huquqlar himoyalangan.
      </div>
    </div>
  );
};
