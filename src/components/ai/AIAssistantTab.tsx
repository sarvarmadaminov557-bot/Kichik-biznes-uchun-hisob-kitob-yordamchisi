import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Bot, Send, Sparkles, User, RefreshCw, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantTab: React.FC = () => {
  const { business, financialMetrics, filteredSales, filteredExpenses, debts, products, formatCurrency, language, t } = useApp();

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const initialGreeting: Record<string, string> = {
    uz: `Assalomu alaykum! Men BiznesPro sun'iy intellekt maslahatchisiman. Men sizning "${business.name}" biznesingizning jonli ko'rsatkichlarini (daromad, sof foyda, xarajatlar, qarzlar va ombor qoldiqlarini) tahlil qila olaman. Quyidagi tayyor savollardan birini tanlang yoki o'z savolingizni yozing!`,
    ru: `Здравствуйте! Я AI-ассистент BiznesPro. Я анализирую актуальные показатели вашего бизнеса "${business.name}" (выручку, чистую прибыль, расходы, долги и остатки на складе). Задайте любой вопрос или воспользуйтесь быстрыми подсказками ниже!`,
    en: `Hello! I am your BiznesPro AI Advisor. I analyze real-time metrics for "${business.name}" (revenue, net profit, expenses, receivables, and inventory levels). Ask any question or click a prompt below!`,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: initialGreeting[language] || initialGreeting.uz,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    t('aiPrompt1'),
    t('aiPrompt2'),
    t('aiPrompt3'),
    t('aiPrompt4'),
    t('aiPrompt5'),
  ];

  // Deep Analytical Business Logic grounded strictly in live metrics
  const generateAIResponse = (query: string): string => {
    const q = query.toLowerCase();

    // 1. Revenue & Profit questions
    if (q.includes('foyda') || q.includes('daromad') || q.includes('earn') || q.includes('прибыль') || q.includes('выручк')) {
      return `📊 **Moliyaviy ko'rsatkichlar tahlili (${business.name}):**\n\n` +
        `• **Jami daromad (tushum):** ${formatCurrency(financialMetrics.revenue)}\n` +
        `• **Sotilgan tovarlar tannarxi (COGS):** ${formatCurrency(financialMetrics.cogs)}\n` +
        `• **Yalpi foyda:** ${formatCurrency(financialMetrics.grossProfit)} (Rentabellik: ${financialMetrics.grossMarginPct.toFixed(1)}%)\n` +
        `• **Operatsion xarajatlar:** ${formatCurrency(financialMetrics.operatingExpenses)}\n` +
        `• **Sof foyda:** ${formatCurrency(financialMetrics.netProfit)} (${financialMetrics.revenueChangePct > 0 ? '+' : ''}${financialMetrics.revenueChangePct.toFixed(1)}% o'tgan davrga nisbatan)\n\n` +
        `💡 **Tavsiya:** Sof foydangiz ijobiy holatda. Foydani yanada oshirish uchun yuqori marjali aksessuarlar sotuvini ko'paytirish va kechiktirilgan operatsion xarajatlarni optimallashtirish tavsiya etiladi.`;
    }

    // 2. Expenses questions
    if (q.includes('xarajat') || q.includes('expense') || q.includes('расход')) {
      const categoryTotals: Record<string, number> = {};
      filteredExpenses.forEach((e) => {
        categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
      });
      const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
      const topList = sorted
        .slice(0, 4)
        .map(([cat, amt]) => `• **${cat}:** ${formatCurrency(amt)} (${((amt / (financialMetrics.operatingExpenses || 1)) * 100).toFixed(0)}%)`)
        .join('\n');

      return `💸 **Xarajatlar strukturasi bo'yicha tahlil:**\n\n` +
        `Jami operatsion xarajatlar: **${formatCurrency(financialMetrics.operatingExpenses)}**.\n\n` +
        `Eng katta xarajat moddalari:\n${topList}\n\n` +
        `💡 **Tavsiya:** Asosiy xarajatlaringiz bino ijarasi va ish haqi moddalariga to'g'ri kelmoqda. Reklama xarajatlarining ROI (samaradorligini) har hafta tekshirib boring.`;
    }

    // 3. Debts & Receivables
    if (q.includes('qarz') || q.includes('debt') || q.includes('долг') || q.includes('kim') || q.includes('who')) {
      const activeReceivables = debts.filter((d) => d.type === 'receivable' && d.status !== 'paid');
      const overdue = activeReceivables.filter((d) => d.status === 'overdue');
      const debtorsList = activeReceivables
        .slice(0, 5)
        .map(
          (d) =>
            `• **${d.partyName}:** ${formatCurrency(d.remainingAmount)} (Muddat: ${new Date(d.dueDate).toLocaleDateString()}${d.status === 'overdue' ? ' — ⚠️ MUDDATI O\'TGAN' : ''})`
        )
        .join('\n');

      return `📋 **Qarzdorliklar monitoringi:**\n\n` +
        `• **Mijozlarimizning jami qarzi (Bizga):** ${formatCurrency(financialMetrics.receivables)}\n` +
        `• **Bizning ta'minotchilar oldidagi qarzimiz:** ${formatCurrency(financialMetrics.payables)}\n` +
        `• **Muddati o'tgan mijozlar soni:** ${overdue.length} nafar\n\n` +
        `Eng yirik qarzdorlar ro'yxati:\n${debtorsList}\n\n` +
        `⚠️ **Maslahat:** Muddati o'tib ketgan mijozlarga darhol SMS yoki qo'ng'iroq orqali eslatma yuboring, yangi xaridlarni faqat oldingi qarz yopilgandan keyin bering.`;
    }

    // 4. Products & Low stock
    if (q.includes('mahsulot') || q.includes('ombor') || q.includes('product') || q.includes('stock') || q.includes('товар')) {
      const low = products.filter((p) => p.quantity <= p.minStock);
      const lowList = low
        .slice(0, 5)
        .map((p) => `• **${p.name}:** Omborda ${p.quantity} ${p.unit} qoldi (Minimal chegara: ${p.minStock} ${p.unit})`)
        .join('\n');

      return `📦 **Ombor zaxirasi holati:**\n\n` +
        `• **Jami mahsulot turlari:** ${products.length} ta\n` +
        `• **Kam qolgan xavfli tovarlar:** ${low.length} ta\n\n` +
        `Tezda xarid qilish talab etiladigan tovarlar:\n${lowList || 'Barcha tovarlar yetarli miqdorda mavjud.'}\n\n` +
        `💡 **Tavsiya:** Ushbu tovarlar xaridini "Xaridlar (Ta'minot)" bo'limi orqali buyurtma qilib, omborni to'ldirishingiz mumkin.`;
    }

    // 5. Practical recommendations / profit improvement
    return `📈 **"${business.name}" uchun 3 ta amaliy biznes tavsiya:**\n\n` +
      `1. **Nasiya (debitorlik) muddatini qisqartiring:** Hozirda aylanmada ${formatCurrency(financialMetrics.receivables)} qarz to'xtab turibdi. Qarzni tezroq undirish kassa likvidligini darhol oshiradi.\n` +
      `2. **Tugab borayotgan ${products.filter((p) => p.quantity <= p.minStock).length} ta tovar zaxirasini to'ldiring:** Xaridorlar talab yuqori bo'lgan mahsulotlarni topa olmasa, raqobatchilarga ketib qolishi mumkin.\n` +
      `3. **Yalpi foyda marjasini ${financialMetrics.grossMarginPct.toFixed(0)}% dan 45% ga oshirish:** Aksessuarlar va xizmat ko'rsatish ulushini ko'paytirish orqali sof daromadni 15-20% ga oshirish mumkin.`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    setTimeout(() => {
      const replyText = generateAIResponse(query);
      const aiMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t('aiAssistantTitle')}</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">{t('aiAssistantSubtitle')}</p>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-200/60 flex items-center gap-2.5 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span>
          <strong>100% Maxfiy va Xavfsiz:</strong> AI faqat sizning korxonangizning ichki ma'lumotlariga tayanadi va hech qanday ma'lumotni tashqariga chiqarmaydi.
        </span>
      </div>

      {/* Chat Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col h-[540px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-blue-600" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 border border-slate-200/80 text-slate-800'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div
                  className={`text-[10px] mt-2 text-right ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>{t('aiAnalyzing')}</span>
            </div>
          )}
        </div>

        {/* Quick Prompts Chips */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 overflow-x-auto flex items-center gap-2 custom-scrollbar">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            Savollar:
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-600 border border-slate-200 rounded-lg whitespace-nowrap transition-colors shrink-0 shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder={t('aiAskPlaceholder')}
            className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-500 bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!input.trim()}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>{t('aiSend')}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
