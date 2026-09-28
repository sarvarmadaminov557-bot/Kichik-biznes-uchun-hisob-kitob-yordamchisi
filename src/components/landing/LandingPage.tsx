import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import {
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Bot,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  DollarSign,
  HelpCircle,
  Building2,
  Zap,
  Globe,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onGoToAuth: (mode?: 'login' | 'register') => void;
  onGoToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGoToAuth, onGoToDashboard }) => {
  const { language, setLanguage, t, financialMetrics, formatCurrency } = useApp();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const features = [
    {
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      icon: CreditCard,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      icon: ShoppingBag,
      color: 'bg-indigo-50 text-indigo-600',
    },
    {
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      icon: Bot,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const pricingPlans = [
    {
      name: t('pricingFree'),
      price: "0 so'm",
      period: 'umrbod bepul',
      desc: t('pricingFreeDesc'),
      features: [
        '50 tagacha mahsulot',
        'Kunlik va oylik daromad hisobi',
        'Oddiy kassa savdosi',
        'Bitta foydalanuvchi',
      ],
      popular: false,
      cta: 'Sinab ko\'rish',
    },
    {
      name: t('pricingPro'),
      price: "190 000 so'm",
      period: 'oyiga',
      desc: t('pricingProDesc'),
      features: [
        'Cheksiz mahsulotlar va ombor',
        'Aniq P&L (Sof foyda) hisoblash',
        'Qarzlar daftari va eslatmalar',
        'AI Biznes maslahatchi',
        '5 tagacha xodimlar va kassa',
        'Excel / CSV hisobotlar eksporti',
      ],
      popular: true,
      cta: t('choosePlan'),
    },
    {
      name: t('pricingEnterprise'),
      price: "450 000 so'm",
      period: 'oyiga',
      desc: t('pricingEnterpriseDesc'),
      features: [
        'Bir nechta filial va bizneslar',
        'Kengaytirilgan xodim huquqlari (RBAC)',
        'Xavfsizlik auditi (Audit log)',
        'Shaxsiy buxgalter yordamchisi',
        '24/7 ustuvor qo\'llab-quvvatlash',
      ],
      popular: false,
      cta: t('choosePlan'),
    },
  ];

  const faqs = [
    {
      q: 'BiznesPro dasturidan foydalanish uchun buxgalteriya bilimiga ega bo\'lish shartmi?',
      a: 'Mutlaqo shart emas! Tizim aynan buxgalter bo\'lmagan tadbirkorlar va do\'kon egalari uchun sodda tilda yaratilgan. Murakkab debit-kredit o\'rniga Daromad, Xarajat, Qarzlar va Sof foyda aniq ko\'rsatiladi.',
    },
    {
      q: 'Telefon orqali kassa va savdo qilish mumkinmi?',
      a: 'Ha, BiznesPro 100% smartfon va planshetlarga moslashtirilgan. Siz xarid cheklarini telefon orqali kiritishingiz va kassa termoprinteriga chiqarishingiz mumkin.',
    },
    {
      q: 'Mijozlarning qarzlarini qanday nazorat qilaman?',
      a: 'Har bir savdoda nasiyaga berilgan qarz avtomatik tarzda Qarzlar daftariga tushadi. Muddat yaqinlashganda va o\'tib ketganda tizim ogohlantiradi. Qarz to\'langanida kassa balansi avtomatik yangilanadi.',
    },
    {
      q: 'Ma\'lumotlarim xavfsizligi qanday ta\'minlangan?',
      a: 'Barcha ma\'lumotlar shifrlangan holatda saqlanadi. Xodimlar faqat o\'zlariga ruxsat berilgan bo\'limlarni ko\'ra oladilar, masalan, kassir faqat savdo qo\'shishi mumkin, butun biznesning sof foydasi va hisobotlarini ko\'rmaydi.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
            B
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">BiznesPro</span>
            <span className="text-[10px] text-blue-600 font-bold uppercase ml-1.5 px-1.5 py-0.5 rounded bg-blue-50">
              SaaS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language picker */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  language === l.code ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{l.flag}</span>
                <span className="ml-1 uppercase hidden sm:inline">{l.code}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => onGoToAuth('login')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            {t('login')}
          </button>

          <button
            onClick={onGoToDashboard}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
          >
            {t('viewDemo')}
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-16 pb-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 animate-in fade-in">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Kichik biznes va do'konlar uchun №1 sodda buxgalteriya</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto">
          {t('landingHeroTitle')}
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t('landingHeroSubtitle')}
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onGoToAuth('register')}
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-2xl shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>{t('startFree')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onGoToDashboard}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-2xl shadow-xs transition-colors"
          >
            {t('viewDemo')} (Jonli Tizim)
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Karta talab qilinmaydi
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 14 kunlik bepul sinov
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> O'zbek tilida to'liq yordam
          </span>
        </div>
      </section>

      {/* DASHBOARD PREVIEW MOCKUP */}
      <section className="px-4 sm:px-6 max-w-5xl mx-auto mb-24">
        <div className="bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="font-mono ml-2 text-[11px] text-slate-500">app.biznespro.uz/dashboard</span>
            </div>
            <button
              onClick={onGoToDashboard}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>Demoning to'liq versiyasini ochish</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5">
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tushum (Daromad)</span>
              <div className="text-lg font-bold text-white mt-1">24 850 000 so'm</div>
              <span className="text-[10px] text-emerald-400 font-semibold">+14.2% o'sish</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Xarajatlar</span>
              <div className="text-lg font-bold text-white mt-1">7 200 000 so'm</div>
              <span className="text-[10px] text-rose-400 font-semibold">-5.1% tejaldi</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Sof foyda</span>
              <div className="text-lg font-bold text-emerald-400 mt-1">11 450 000 so'm</div>
              <span className="text-[10px] text-emerald-400 font-semibold">+18.4% sof</span>
            </div>
            <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] uppercase font-bold text-slate-400">Mijozlar qarzi</span>
              <div className="text-lg font-bold text-blue-400 mt-1">8 500 000 so'm</div>
              <span className="text-[10px] text-amber-400 font-semibold">5 ta nasiya</span>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-16 bg-white border-y border-slate-200 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Imkoniyatlar</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Biznesingizni nazorat qilish uchun kerak bo'lgan barcha vositalar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl border border-slate-200 hover:shadow-lg transition-shadow bg-slate-50/40">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${feat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t('navPricing')}</span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Har qanday hajmdagi biznes uchun shaffof tariflar
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Hech qanday yashirin to'lovlarsiz. Istalgan vaqtda bekor qilish mumkin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                plan.popular
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-[1.03] border-2 border-blue-500'
                  : 'bg-white border border-slate-200 shadow-xs'
              }`}
            >
              <div>
                {plan.popular && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white/20 text-white mb-3 inline-block">
                    Eng ommabop
                  </span>
                )}
                <h3 className={`text-lg font-bold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mt-1 ${plan.popular ? 'text-blue-100' : 'text-slate-500'}`}>{plan.desc}</p>

                <div className="my-6">
                  <div className={`text-3xl font-extrabold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                    {plan.price}
                  </div>
                  <div className={`text-xs mt-0.5 ${plan.popular ? 'text-blue-200' : 'text-slate-400'}`}>
                    {plan.period}
                  </div>
                </div>

                <div className="space-y-2.5 text-xs">
                  {plan.features.map((f, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${plan.popular ? 'text-blue-200' : 'text-emerald-600'}`}
                      />
                      <span className={plan.popular ? 'text-blue-50' : 'text-slate-700'}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onGoToAuth('register')}
                className={`mt-8 w-full py-3 text-xs font-bold rounded-xl transition-all ${
                  plan.popular
                    ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-md'
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-white border-t border-slate-200 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900">Ko'p beriladigan savollar (FAQ)</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between text-sm font-bold text-slate-800">
                  <span>{faq.q}</span>
                  <span className="text-slate-400 text-base">{activeFaq === idx ? '−' : '+'}</span>
                </div>
                {activeFaq === idx && (
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2.5">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-4 sm:px-8 text-xs">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-base">
              B
            </div>
            <div>
              <div className="font-extrabold text-white text-base">BiznesPro SaaS</div>
              <div className="text-[11px] text-slate-500">Kichik biznes va buxgalteriya yordamchisi</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onGoToAuth('login')} className="hover:text-white transition-colors">
              {t('login')}
            </button>
            <button onClick={() => onGoToAuth('register')} className="hover:text-white transition-colors">
              {t('register')}
            </button>
            <button onClick={onGoToDashboard} className="hover:text-white transition-colors">
              Demo Panel
            </button>
          </div>

          <div className="text-[11px] text-slate-500">
            &copy; {new Date().getFullYear()} BiznesPro. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
};
