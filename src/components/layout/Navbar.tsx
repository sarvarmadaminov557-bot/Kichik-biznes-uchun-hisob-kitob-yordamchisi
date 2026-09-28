import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Language, UserRole } from '../../types';
import {
  Search,
  Plus,
  Bell,
  ChevronDown,
  Building2,
  Globe,
  User as UserIcon,
  LogOut,
  RotateCcw,
  Sparkles,
  Check,
  Shield,
  Layers
} from 'lucide-react';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

interface NavbarProps {
  onOpenNewSale: () => void;
  onOpenNewBusinessModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewSale, onOpenNewBusinessModal }) => {
  const {
    business,
    businesses,
    switchBusiness,
    language,
    setLanguage,
    user,
    quickDemoLogin,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveTab,
    resetDemoData,
    t,
  } = useApp();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBusinessMenuOpen, setIsBusinessMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const roleLabels: Record<UserRole, string> = {
    owner: t('roleOwner'),
    manager: t('roleManager'),
    employee: t('roleEmployee'),
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 no-print shadow-xs">
        {/* Left: Mobile Brand & Business Switcher */}
        <div className="flex items-center gap-3">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              B
            </div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg">BiznesPro</span>
          </div>

          {/* Business Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsBusinessMenuOpen(!isBusinessMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors text-left"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
                  {business.name}
                </div>
                <div className="text-[10px] text-slate-400 capitalize">{business.type} • {business.currency}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isBusinessMenuOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  {t('switchBusiness')}
                </div>
                <div className="space-y-1">
                  {businesses.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        switchBusiness(b.id);
                        setIsBusinessMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                        b.id === business.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="truncate">{b.name}</span>
                      {b.id === business.id && <Check className="w-4 h-4 text-blue-600" />}
                    </button>
                  ))}
                </div>
                {onOpenNewBusinessModal && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setIsBusinessMenuOpen(false);
                        onOpenNewBusinessModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {t('newBusiness')}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Center: Quick Search Trigger */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-1.5 bg-slate-100/80 hover:bg-slate-100 rounded-xl text-xs text-slate-400 border border-transparent hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span>{t('searchPlaceholder')}</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white rounded border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Quick Sale, Language, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Sale CTA */}
          <button
            onClick={onOpenNewSale}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t('quickSale')}</span>
          </button>

          {/* Search button for mobile */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              title="Tilni o'zgartirish / Сменить язык / Change language"
            >
              <span>{languages.find((l) => l.code === language)?.flag}</span>
              <span className="uppercase text-slate-600">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isLangMenuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 z-40 animate-in fade-in zoom-in-95">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors ${
                      language === l.code ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {language === l.code && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              title={t('notifications')}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-40 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">{t('notifications')}</span>
                    {unreadNotifications.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600">
                        {unreadNotifications.length} yangi
                      </span>
                    )}
                  </div>
                  {unreadNotifications.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      {t('markAllRead')}
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 py-1">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-xs text-slate-400">{t('noNotifications')}</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkTab) setActiveTab(notif.linkTab);
                          setIsNotifOpen(false);
                        }}
                        className={`p-2.5 rounded-xl cursor-pointer transition-colors ${
                          notif.isRead ? 'hover:bg-slate-50 opacity-75' : 'bg-blue-50/50 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-bold ${
                              notif.type === 'danger'
                                ? 'text-rose-600'
                                : notif.type === 'warning'
                                ? 'text-amber-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 leading-snug">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 pl-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="hidden md:block text-right">
                <div className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.fullName || 'Foydalanuvchi'}
                </div>
                <div className="text-[10px] text-blue-600 font-semibold">{user ? roleLabels[user.role] : 'Mehmon'}</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.fullName?.charAt(0) || 'U'
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-40 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <div className="text-sm font-bold text-slate-900">{user?.fullName}</div>
                  <div className="text-xs text-slate-400">{user?.email}</div>
                  <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    <Shield className="w-3 h-3" />
                    {user ? roleLabels[user.role] : ''}
                  </div>
                </div>

                {/* Quick Role Switcher for Demo testing */}
                <div className="py-2 border-b border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-400 px-3 uppercase tracking-wider mb-1">
                    Rolni sinash (Demo):
                  </div>
                  <div className="grid grid-cols-3 gap-1 px-2">
                    <button
                      onClick={() => {
                        quickDemoLogin('owner');
                        setIsUserMenuOpen(false);
                      }}
                      className={`px-2 py-1 text-[11px] rounded-lg font-semibold text-center transition-colors ${
                        user?.role === 'owner' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Egasi
                    </button>
                    <button
                      onClick={() => {
                        quickDemoLogin('manager');
                        setIsUserMenuOpen(false);
                      }}
                      className={`px-2 py-1 text-[11px] rounded-lg font-semibold text-center transition-colors ${
                        user?.role === 'manager' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Menejer
                    </button>
                    <button
                      onClick={() => {
                        quickDemoLogin('employee');
                        setIsUserMenuOpen(false);
                      }}
                      className={`px-2 py-1 text-[11px] rounded-lg font-semibold text-center transition-colors ${
                        user?.role === 'employee' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Xodim
                    </button>
                  </div>
                </div>

                <div className="pt-1 space-y-0.5">
                  <button
                    onClick={() => {
                      resetDemoData();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
                    <span>{t('resetDemoData')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('settings');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('navSettings')}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
