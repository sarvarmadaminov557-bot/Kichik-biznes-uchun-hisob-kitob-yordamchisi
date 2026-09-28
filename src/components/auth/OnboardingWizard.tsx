import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BusinessType, Currency } from '../../types';
import {
  Check,
  Building2,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { business, finishOnboarding, t } = useApp();

  const [step, setStep] = useState<number>(1);
  const [bizName, setBizName] = useState(business.name || 'SmartTech Savdo');
  const [bizType, setBizType] = useState<BusinessType>('retail');
  const [currency, setCurrency] = useState<Currency>('UZS');
  const [initialBalance, setInitialBalance] = useState<number>(10000000);
  const [importSample, setImportSample] = useState<boolean>(true);

  const businessTypes: { type: BusinessType; title: string; desc: string }[] = [
    { type: 'retail', title: t('typeRetail'), desc: 'Do\'kon, savdo markazi, oziq-ovqat yoki kiyim-kechak' },
    { type: 'restaurant', title: t('typeRestaurant'), desc: 'Kafe, fast food, choyxona va oshxona' },
    { type: 'service', title: t('typeService'), desc: 'Go\'zallik saloni, avtoservis, IT va konsalting' },
    { type: 'online_store', title: t('typeOnlineStore'), desc: 'Instagram, Telegram yoki veb-sayt orqali sotuv' },
    { type: 'freelancer', title: t('typeFreelancer'), desc: 'Yakka tartibdagi mutaxassis va frilanser' },
    { type: 'workshop', title: t('typeWorkshop'), desc: 'Tikuvchilik, mebel va ishlab chiqarish ustaxonasi' },
    { type: 'other', title: t('typeOther'), desc: 'Boshqa barcha tadbirkorlik yo\'nalishlari' },
  ];

  const handleFinish = () => {
    finishOnboarding({
      name: bizName.trim() || 'Mening Biznesim',
      type: bizType,
      currency,
      initialBalance,
      importSample,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        {/* Wizard Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold mb-2">
            <span>Qadam {step} / 6</span>
            <span>{Math.round((step / 6) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: BUSINESS NAME */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{t('step1Title')}</h2>
              <p className="text-xs text-slate-500 mt-1">{t('step1Desc')}</p>
            </div>
            <input
              type="text"
              value={bizName}
              onChange={(e) => setBizName(e.target.value)}
              placeholder={t('businessNamePlaceholder')}
              autoFocus
              className="w-full px-4 py-3 text-sm font-semibold rounded-2xl border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        )}

        {/* STEP 2: BUSINESS TYPE */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{t('step2Title')}</h2>
              <p className="text-xs text-slate-500 mt-1">{t('step2Desc')}</p>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {businessTypes.map((bt) => (
                <button
                  key={bt.type}
                  type="button"
                  onClick={() => setBizType(bt.type)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    bizType === bt.type
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-slate-900">{bt.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{bt.desc}</div>
                  </div>
                  {bizType === bt.type && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: CURRENCY SELECTION */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{t('step3Title')}</h2>
              <p className="text-xs text-slate-500 mt-1">{t('step3Desc')}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { code: 'UZS', name: "O'zbek so'mi (UZS)", symbol: "so'm" },
                { code: 'USD', name: 'AQSH dollari (USD)', symbol: '$' },
                { code: 'EUR', name: 'Yevro (EUR)', symbol: '€' },
                { code: 'RUB', name: 'Rossiya rubli (RUB)', symbol: '₽' },
              ].map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => setCurrency(c.code as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    currency === c.code
                      ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-lg font-bold text-slate-900">{c.code}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{c.name}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: INITIAL BALANCE */}
        {step === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{t('step4Title')}</h2>
              <p className="text-xs text-slate-500 mt-1">{t('step4Desc')}</p>
            </div>

            <div>
              <label className="text-xs text-slate-500 block mb-1">Kassadagi dastlabki mablag' ({currency})</label>
              <input
                type="number"
                min="0"
                value={initialBalance}
                onChange={(e) => setInitialBalance(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 text-base font-extrabold rounded-2xl border border-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* STEP 5: IMPORT SAMPLE PRODUCTS */}
        {step === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{t('step5Title')}</h2>
              <p className="text-xs text-slate-500 mt-1">{t('step5Desc')}</p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setImportSample(true)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  importSample
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{t('importSampleYes')}</div>
                  <div className="text-xs text-slate-400 mt-0.5">20 ta tovar, narxlar va qoldiqlar yuklanadi</div>
                </div>
                {importSample && <Check className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                onClick={() => setImportSample(false)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  !importSample
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-slate-900">{t('importSampleNo')}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Toza, bo'sh baza bilan noldan boshlayman</div>
                </div>
                {!importSample && <Check className="w-4 h-4 text-blue-600" />}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: FINISH SETUP */}
        {step === 6 && (
          <div className="space-y-4 text-center py-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">{t('step6Title')}</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">{t('step6Desc')}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1.5 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">Biznes:</span>
                <span className="font-bold text-slate-800">{bizName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valyuta:</span>
                <span className="font-bold text-slate-800">{currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Boshlang'ich kassa:</span>
                <span className="font-bold text-slate-800">{initialBalance.toLocaleString()} {currency}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('back')}</span>
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>{t('next')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
            >
              {t('finishOnboarding')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
