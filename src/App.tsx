import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { FinancialOverviewTab } from './components/financial/FinancialOverviewTab';
import { SalesTab } from './components/sales/SalesTab';
import { PurchasesTab } from './components/purchases/PurchasesTab';
import { ProductsTab } from './components/products/ProductsTab';
import { CustomersTab } from './components/customers/CustomersTab';
import { DebtsTab } from './components/debts/DebtsTab';
import { ExpensesTab } from './components/expenses/ExpensesTab';
import { CashFlowTab } from './components/cashflow/CashFlowTab';
import { TransactionsTab } from './components/transactions/TransactionsTab';
import { ReportsTab } from './components/reports/ReportsTab';
import { AIAssistantTab } from './components/ai/AIAssistantTab';
import { AuditLogTab } from './components/audit/AuditLogTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { NewSaleModal } from './components/sales/NewSaleModal';
import { NewExpenseModal } from './components/expenses/NewExpenseModal';
import { AuthPage } from './components/auth/AuthPage';
import { OnboardingWizard } from './components/auth/OnboardingWizard';
import { LandingPage } from './components/landing/LandingPage';
import { Toast } from './components/common/Toast';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isOnboarding, activeTab, setActiveTab } = useApp();

  // Public Landing / Auth routing state
  const [viewState, setViewState] = useState<'landing' | 'auth' | 'app'>('app');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Quick Global Action Modals
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

  // 1. If currently in onboarding wizard after new registration
  if (isAuthenticated && isOnboarding) {
    return <OnboardingWizard />;
  }

  // 2. If viewing public landing page
  if (viewState === 'landing') {
    return (
      <LandingPage
        onGoToAuth={(mode) => {
          setAuthMode(mode || 'login');
          setViewState('auth');
        }}
        onGoToDashboard={() => setViewState('app')}
      />
    );
  }

  // 3. If viewing authentication page
  if (viewState === 'auth' || !isAuthenticated) {
    return (
      <AuthPage
        onSuccess={() => setViewState('app')}
        onShowLanding={() => setViewState('landing')}
      />
    );
  }

  // 4. Main App Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Desktop Left Sidebar */}
      <Sidebar
        onShowLanding={() => setViewState('landing')}
        onShowPricing={() => {
          setViewState('landing');
          setTimeout(() => {
            window.scrollTo({ top: 1200, behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Navbar */}
        <Navbar
          onOpenNewSale={() => setIsNewSaleOpen(true)}
          onOpenNewBusinessModal={() => setActiveTab('settings')}
        />

        {/* Tab View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardTab
              onOpenNewSale={() => setIsNewSaleOpen(true)}
              onOpenNewExpense={() => setIsNewExpenseOpen(true)}
            />
          )}

          {activeTab === 'financial' && <FinancialOverviewTab />}

          {activeTab === 'sales' && (
            <SalesTab onOpenNewSale={() => setIsNewSaleOpen(true)} />
          )}

          {activeTab === 'purchases' && <PurchasesTab />}

          {activeTab === 'products' && <ProductsTab />}

          {activeTab === 'customers' && <CustomersTab />}

          {activeTab === 'debts' && <DebtsTab />}

          {activeTab === 'expenses' && (
            <ExpensesTab onOpenNewExpense={() => setIsNewExpenseOpen(true)} />
          )}

          {activeTab === 'cashflow' && <CashFlowTab />}

          {activeTab === 'transactions' && <TransactionsTab />}

          {activeTab === 'reports' && <ReportsTab />}

          {activeTab === 'ai-assistant' && <AIAssistantTab />}

          {activeTab === 'audit' && <AuditLogTab />}

          {activeTab === 'settings' && <SettingsTab />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav onOpenNewSale={() => setIsNewSaleOpen(true)} />

      {/* Global Quick Action Modals */}
      <NewSaleModal
        isOpen={isNewSaleOpen}
        onClose={() => setIsNewSaleOpen(false)}
      />

      <NewExpenseModal
        isOpen={isNewExpenseOpen}
        onClose={() => setIsNewExpenseOpen(false)}
      />

      {/* Toast Notification Container */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
