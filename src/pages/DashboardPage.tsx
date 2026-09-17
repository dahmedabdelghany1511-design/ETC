import React, { useEffect, useState } from "react";
import { Company, User } from "../types";
import { api } from "../services/api";
import {
  FileSpreadsheet,
  BarChart3,
  Receipt,
  Search,
  Bot,
  Mic,
  GraduationCap,
  FolderOpen,
  Plus,
  ShieldCheck,
  Building2,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  UserPlus,
  Users,
  UploadCloud,
  FileText,
  Clock,
  Layers,
  Sparkles,
  RefreshCw
} from "lucide-react";
import { formatNumber } from "../utils/formatters";

interface DashboardPageProps {
  activeCompany: Company | null;
  currentUser?: User | null;
  onNavigate: (page: string) => void;
  onOpenNewJournalModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  activeCompany,
  currentUser,
  onNavigate,
  onOpenNewJournalModal,
}) => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    accountsCount: 0,
    journalEntriesCount: 0,
    trialBalanceBalanced: true,
    totalDebits: 0,
    customersCount: 0,
    vendorsCount: 0,
    eInvoicesCount: 0,
    filesCount: 0,
    auditFindingsCount: 0,
  });

  const userName = currentUser?.name || "المستخدم";

  useEffect(() => {
    loadDashboardData();
  }, [activeCompany?.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (!activeCompany) {
        setLoading(false);
        return;
      }

      const [accounts, entries, tb, customers, vendors, invoices, files, findings] = await Promise.all([
        api.getAccounts().catch(() => []),
        api.getJournalEntries().catch(() => []),
        api.getTrialBalance().catch(() => ({ isBalanced: true, totalDebits: 0 })),
        api.getCustomers().catch(() => []),
        api.getVendors().catch(() => []),
        api.getEInvoices().catch(() => []),
        api.getFiles().catch(() => []),
        api.getAuditFindings().catch(() => []),
      ]);

      setStats({
        accountsCount: accounts.length,
        journalEntriesCount: entries.length,
        trialBalanceBalanced: tb.isBalanced,
        totalDebits: tb.totalDebits || 0,
        customersCount: customers.length,
        vendorsCount: vendors.length,
        eInvoicesCount: invoices.length,
        filesCount: files.length,
        auditFindingsCount: findings.length,
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const hasNoData =
    !activeCompany ||
    (stats.accountsCount === 0 &&
      stats.journalEntriesCount === 0 &&
      stats.customersCount === 0 &&
      stats.vendorsCount === 0 &&
      stats.filesCount === 0);

  if (loading) {
    return (
      <div dir="rtl" className="min-h-[450px] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#EAF4FF] text-[#0A4DA3] flex items-center justify-center animate-spin shadow-inner">
          <RefreshCw className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">جارٍ تحميل البيانات...</h3>
          <p className="text-xs text-slate-400 mt-1">التحقق من سجلات المنشأة وتحديث المؤشرات المحاسبية</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Welcome Top Banner */}
      <div className="bg-gradient-to-r from-[#0A4DA3] via-[#1565C0] to-[#0A4DA3] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md">
                مرحباً بك، {userName}
              </span>
              <span className="bg-emerald-400/20 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>جلسة آمنة معتمدة</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black">
              {activeCompany ? activeCompany.name : "لوحة تحكم منصة ETC الذكية"}
            </h2>

            <p className="text-xs sm:text-sm text-blue-100 max-w-2xl font-medium leading-relaxed">
              منظومة متكاملة للمحاسبة والقيد المزدوج، ميزان المراجعة، الفاتورة الإلكترونية ETA، وأدوات التدقيق والرقابة.
            </p>
          </div>

          {/* Banner Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap shrink-0">
            <button
              onClick={() => onNavigate("accounting")}
              className="px-4 py-2.5 bg-white text-[#0A4DA3] hover:bg-blue-50 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#0A4DA3]" />
              <span>إدارة المحاسبة والقيود</span>
            </button>

            <button
              onClick={() => onNavigate("ai")}
              className="px-4 py-2.5 bg-blue-900/50 hover:bg-blue-900/80 text-white border border-white/20 font-bold text-xs rounded-xl backdrop-blur-md transition-all flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-amber-300" />
              <span>مستشار ETC AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= IF THERE IS NO DATA ================= */}
      {hasNoData ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 text-center space-y-6 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#0A4DA3] flex items-center justify-center mx-auto shadow-inner">
            <Layers className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-2xl font-black text-slate-800">
              لا توجد بيانات حتى الآن
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              لم يتم إدخال أو تسجيل أي حركات محاسبية بعد لهذه المنشأة. يمكنك البدء الآن بإضافة المنشأة والمستخدمين والحسابات والعملاء والموردين أو رفع الملفات والمستندات لبدء المعالجة.
            </p>
          </div>

          {/* The 6 Buttons Explicitly Mandated By User */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
            <button
              onClick={() => onNavigate("companies")}
              className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#0A4DA3] rounded-2xl shadow-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A4DA3] group-hover:bg-[#0A4DA3] group-hover:text-white flex items-center justify-center transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-[#0A4DA3]">
                ➕ إضافة شركة
              </span>
            </button>

            <button
              onClick={() => onNavigate("users")}
              className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#0A4DA3] rounded-2xl shadow-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 group-hover:bg-purple-700 group-hover:text-white flex items-center justify-center transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                ➕ إضافة مستخدم
              </span>
            </button>

            <button
              onClick={() => onNavigate("coa")}
              className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#0A4DA3] rounded-2xl shadow-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white flex items-center justify-center transition-colors">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                ➕ إضافة حساب
              </span>
            </button>

            <button
              onClick={() => onNavigate("customers")}
              className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#0A4DA3] rounded-2xl shadow-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-700 group-hover:text-white flex items-center justify-center transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                ➕ إضافة عميل
              </span>
            </button>

            <button
              onClick={() => onNavigate("vendors")}
              className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#0A4DA3] rounded-2xl shadow-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white flex items-center justify-center transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-700">
                ➕ إضافة مورد
              </span>
            </button>

            <button
              onClick={() => onNavigate("files")}
              className="p-4 bg-white hover:bg-blue-50/70 border border-slate-200 hover:border-[#0A4DA3] rounded-2xl shadow-xs transition-all flex flex-col items-center justify-center gap-2 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 group-hover:bg-rose-700 group-hover:text-white flex items-center justify-center transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-rose-700">
                📁 رفع ملف
              </span>
            </button>
          </div>
        </div>
      ) : (
        /* ================= WHEN DATA EXISTS ================= */
        <div className="space-y-6">
          {/* Real Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">قيود اليومية المسجلة</span>
                <FileSpreadsheet className="w-4 h-4 text-[#0A4DA3]" />
              </div>
              <p className="text-2xl font-black text-slate-800 font-mono">
                {stats.journalEntriesCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {stats.journalEntriesCount > 0 ? "قيود متوازنة ومرحلة" : "لا توجد قيود مسجلة بعد"}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">شجرة الحسابات (COA)</span>
                <Building2 className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-800 font-mono">
                {stats.accountsCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                {stats.accountsCount > 0 ? "حساب معتمد للشركة" : "بحاجة لتهيئة الدليل"}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">حالة ميزان المراجعة</span>
                <BarChart3 className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex items-center gap-2">
                {stats.trialBalanceBalanced ? (
                  <span className="text-sm font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    متزن 100%
                  </span>
                ) : (
                  <span className="text-sm font-black text-red-700 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    يوجد فرق توازن
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">
                إجمالي الحركات: {formatNumber(stats.totalDebits)} {activeCompany?.currency || "ج.م"}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 transition-colors">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-bold">الفواتير الإلكترونية (ETA)</span>
                <Receipt className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-800 font-mono">
                {stats.eInvoicesCount}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                معتمدة برمز UUID مشفر
              </p>
            </div>
          </div>

          {/* Quick Action Navigation Strip */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-700 mb-3">الوصول السريع للأقسام الرئيسية</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs">
              <button
                onClick={() => onNavigate("accounting")}
                className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#0A4DA3] rounded-xl font-bold transition-all text-center"
              >
                📑 المحاسبة
              </button>
              <button
                onClick={() => onNavigate("financial-statements")}
                className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#0A4DA3] rounded-xl font-bold transition-all text-center"
              >
                📊 القوائم المالية
              </button>
              <button
                onClick={() => onNavigate("tax")}
                className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#0A4DA3] rounded-xl font-bold transition-all text-center"
              >
                🧾 الضرائب
              </button>
              <button
                onClick={() => onNavigate("audit")}
                className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#0A4DA3] rounded-xl font-bold transition-all text-center"
              >
                🔍 المراجعة
              </button>
              <button
                onClick={() => onNavigate("financial-analysis")}
                className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#0A4DA3] rounded-xl font-bold transition-all text-center"
              >
                📈 التحليل المالي
              </button>
              <button
                onClick={() => onNavigate("reports")}
                className="p-3 bg-slate-50 hover:bg-blue-50 hover:text-[#0A4DA3] rounded-xl font-bold transition-all text-center"
              >
                📄 التقارير
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
