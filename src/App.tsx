import React, { useState, useEffect } from "react";
import { User, Company, AppNotification } from "./types";
import { api } from "./services/api";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { PublicWebsite } from "./pages/public/PublicWebsite";
import { DashboardPage } from "./pages/DashboardPage";
import { AccountingPage } from "./pages/AccountingPage";
import { FinancialStatementsPage } from "./pages/FinancialStatementsPage";
import { FinancialAnalysisPage } from "./pages/FinancialAnalysisPage";
import { BudgetsPage } from "./pages/BudgetsPage";
import { TaxPage } from "./pages/TaxPage";
import { AuditPage } from "./pages/AuditPage";
import { AIAssistantPage } from "./pages/AIAssistantPage";
import { VoiceMentorPage } from "./pages/VoiceMentorPage";
import { FilesPage } from "./pages/FilesPage";
import { AcademyPage } from "./pages/AcademyPage";
import { KnowledgeBasePage } from "./pages/KnowledgeBasePage";
import { CommunicationsPage } from "./pages/CommunicationsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { UsersPage } from "./pages/UsersPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CompaniesPage } from "./pages/CompaniesPage";
import { FirstRunSetupPage } from "./pages/FirstRunSetupPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { NewJournalEntryModal } from "./components/NewJournalEntryModal";

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [needsSetup, setNeedsSetup] = useState<boolean>(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [activeCompany, setActiveCompany] = useState<Company | null>(null);
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isNewJournalOpen, setIsNewJournalOpen] = useState(false);

  // Check setup & login on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const setupStatus = await api.checkSetupStatus();
        if (setupStatus.needsSetup) {
          setNeedsSetup(true);
          setIsInitializing(false);
          return;
        }

        const token = api.getToken();
        if (token) {
          try {
            const user = await api.getCurrentUser();
            setCurrentUser(user);
            await loadCompanies();
            await loadNotifications();
          } catch (err) {
            console.error("Auth check failed:", err);
            api.logout();
            setCurrentUser(null);
          }
        }
      } catch (err) {
        console.error("Failed to check setup status:", err);
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuth();
  }, []);

  const loadCompanies = async () => {
    try {
      const comps = await api.getCompanies();
      setCompanies(comps);
      if (comps.length > 0) {
        const storedCompId = api.getActiveCompanyId();
        const found = comps.find((c) => c.id === storedCompId) || comps[0];
        setActiveCompany(found);
        api.setActiveCompanyId(found.id);
      }
    } catch (err) {
      console.error("Failed to load companies:", err);
    }
  };

  const loadNotifications = async () => {
    try {
      const notifs = await api.getNotifications();
      setNotifications(notifs);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    }
  };

  const handleSelectCompany = (company: Company) => {
    setActiveCompany(company);
    api.setActiveCompanyId(company.id);
  };

  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    await loadCompanies();
    await loadNotifications();
    setActivePage("dashboard");
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setActiveCompany(null);
    setCompanies([]);
  };

  const handleSetupComplete = async (user: User) => {
    setNeedsSetup(false);
    setCurrentUser(user);
    await loadCompanies();
    await loadNotifications();
    setActivePage("dashboard");
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-[#0A4DA3] text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-xl animate-pulse mb-4">
          ETC
        </div>
        <h2 className="text-sm font-bold text-slate-700">جاري تشغيل منصة ETC الذكية...</h2>
        <p className="text-xs text-slate-400 mt-1">التحقق من بيانات الأمان والاتصال بقاعدة البيانات</p>
      </div>
    );
  }

  // System starts empty -> Show First Run Setup Screen for Owner
  if (needsSetup) {
    return <FirstRunSetupPage onSetupComplete={handleSetupComplete} />;
  }

  // Not logged in -> Show Public Website (Home, About, Services, Contact, Login, Register)
  if (!currentUser) {
    return <PublicWebsite onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        companies={companies}
        activeCompany={activeCompany}
        onSelectCompany={handleSelectCompany}
        onLogout={handleLogout}
        onNavigate={setActivePage}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        unreadNotificationsCount={notifications.length}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activePage={activePage}
          onSelectPage={(page) => {
            setActivePage(page);
            setIsSidebarOpen(false);
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-64px)] pb-12">
          <ErrorBoundary onReset={() => setActivePage("dashboard")}>
            {activePage === "dashboard" && (
              <DashboardPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                onNavigate={setActivePage}
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}

            {activePage === "companies" && (
              <CompaniesPage
                companies={companies}
                activeCompany={activeCompany}
                currentUser={currentUser}
                onCompanyCreated={(comp) => {
                  setCompanies((prev) => [...prev, comp]);
                  setActiveCompany(comp);
                  api.setActiveCompanyId(comp.id);
                }}
                onCompanyUpdated={(comp) => {
                  setCompanies((prev) => prev.map((c) => (c.id === comp.id ? comp : c)));
                  if (activeCompany?.id === comp.id) setActiveCompany(comp);
                }}
                onCompanyDeleted={(id) => {
                  setCompanies((prev) => prev.filter((c) => c.id !== id));
                  if (activeCompany?.id === id) {
                    const next = companies.find((c) => c.id !== id) || null;
                    setActiveCompany(next);
                    if (next) api.setActiveCompanyId(next.id);
                  }
                }}
                onSelectCompany={handleSelectCompany}
              />
            )}

            {activePage === "users" && (
              <UsersPage currentUser={currentUser} />
            )}

            {/* Standard Accounting & Tab Deep-Links */}
            {activePage === "accounting" && (
              <AccountingPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}

            {activePage === "coa" && (
              <AccountingPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                initialTab="coa"
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}

            {activePage === "customers" && (
              <AccountingPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                initialTab="customers"
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}

            {activePage === "vendors" && (
              <AccountingPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                initialTab="vendors"
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}

            {activePage === "journal" && (
              <AccountingPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                initialTab="journal"
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}

            {activePage === "ledger" && (
              <AccountingPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                initialTab="ledger"
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}

            {activePage === "trial-balance" && (
              <AccountingPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                initialTab="trial-balance"
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}

            {activePage === "financial-statements" && (
              <FinancialStatementsPage activeCompany={activeCompany} />
            )}

            {activePage === "financial-analysis" && (
              <FinancialAnalysisPage activeCompany={activeCompany} />
            )}

            {activePage === "budgets" && (
              <BudgetsPage activeCompany={activeCompany} />
            )}

            {activePage === "tax" && (
              <TaxPage activeCompany={activeCompany} />
            )}

            {activePage === "audit" && (
              <AuditPage activeCompany={activeCompany} />
            )}

            {(activePage === "ai" || activePage === "ai-assistant") && (
              <AIAssistantPage activeCompany={activeCompany} currentUser={currentUser} />
            )}

            {activePage === "voice-mentor" && (
              <VoiceMentorPage activeCompany={activeCompany} currentUser={currentUser} />
            )}

            {activePage === "files" && (
              <FilesPage activeCompany={activeCompany} />
            )}

            {activePage === "academy" && (
              <AcademyPage currentUser={currentUser} />
            )}

            {activePage === "knowledge-base" && (
              <KnowledgeBasePage />
            )}

            {activePage === "communications" && (
              <CommunicationsPage activeCompany={activeCompany} currentUser={currentUser} />
            )}

            {activePage === "reports" && (
              <ReportsPage activeCompany={activeCompany} onNavigate={setActivePage} />
            )}

            {activePage === "notifications" && (
              <NotificationsPage notifications={notifications} />
            )}

            {activePage === "settings" && (
              <SettingsPage
                companies={companies}
                activeCompany={activeCompany}
                onCompanyCreated={(comp) => {
                  setCompanies((prev) => [...prev, comp]);
                  setActiveCompany(comp);
                  api.setActiveCompanyId(comp.id);
                }}
                onRefreshData={() => {
                  loadCompanies();
                  loadNotifications();
                }}
              />
            )}

            {/* Fallback for unknown URL / broken page states */}
            {![
              "dashboard",
              "companies",
              "users",
              "accounting",
              "coa",
              "customers",
              "vendors",
              "journal",
              "ledger",
              "trial-balance",
              "financial-statements",
              "financial-analysis",
              "budgets",
              "tax",
              "audit",
              "ai",
              "ai-assistant",
              "voice-mentor",
              "files",
              "academy",
              "knowledge-base",
              "communications",
              "reports",
              "notifications",
              "settings",
            ].includes(activePage) && (
              <DashboardPage
                activeCompany={activeCompany}
                currentUser={currentUser}
                onNavigate={setActivePage}
                onOpenNewJournalModal={() => setIsNewJournalOpen(true)}
              />
            )}
          </ErrorBoundary>
        </main>
      </div>

      {/* Global Double-Entry Journal Entry Modal */}
      <NewJournalEntryModal
        isOpen={isNewJournalOpen}
        onClose={() => setIsNewJournalOpen(false)}
        onSuccess={() => {
          // Journal entry created
        }}
      />
    </div>
  );
}
