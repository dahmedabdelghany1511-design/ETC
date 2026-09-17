import React, { useEffect, useState } from "react";
import { Company, User, Account, JournalEntry, Customer, Vendor, InventoryItem, FixedAsset, Employee, BankReconciliation } from "../types";
import { api } from "../services/api";
import {
  FileSpreadsheet,
  Plus,
  BookOpen,
  Scale,
  Users,
  Building2,
  Package,
  Landmark,
  FileCheck2,
  CheckCircle,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  Sparkles,
  Calculator,
  RefreshCw
} from "lucide-react";

import { NewJournalEntryModal } from "../components/NewJournalEntryModal";
import { ChartOfAccountsManager } from "../components/ChartOfAccountsManager";
import { formatNumber } from "../utils/formatters";

interface AccountingPageProps {
  activeCompany: Company | null;
  currentUser?: User | null;
  initialTab?: string;
  onOpenNewJournalModal?: () => void;
}

export const AccountingPage: React.FC<AccountingPageProps> = ({
  activeCompany,
  currentUser,
  initialTab,
  onOpenNewJournalModal,
}) => {
  const [activeTab, setActiveTab] = useState<
    | "coa"
    | "journal"
    | "ledger"
    | "trial-balance"
    | "customers"
    | "vendors"
    | "inventory"
    | "assets"
    | "payroll"
    | "reconciliation"
  >((initialTab as any) || "coa");

  const [showInternalJournalModal, setShowInternalJournalModal] = useState(false);
  const [coaSearch, setCoaSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [vendorSearch, setVendorSearch] = useState("");
  const [journalSearch, setJournalSearch] = useState("");

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab as any);
    }
  }, [initialTab]);

  const handleOpenJournal = () => {
    if (onOpenNewJournalModal) {
      onOpenNewJournalModal();
    } else {
      setShowInternalJournalModal(true);
    }
  };

  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [trialBalanceData, setTrialBalanceData] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [assets, setAssets] = useState<FixedAsset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [reconciliations, setReconciliations] = useState<BankReconciliation[]>([]);

  // Modals & New Form States
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    code: "",
    name: "",
    type: "Asset" as const,
    normalBalance: "Debit" as const,
    isHeader: false,
    description: "",
  });

  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    code: "",
    name: "",
    taxNumber: "",
    phone: "",
    creditLimit: 0,
  });

  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [newVendor, setNewVendor] = useState({
    code: "",
    name: "",
    taxNumber: "",
    phone: "",
    withholdingTaxRate: 1,
  });

  const [showNewAssetModal, setShowNewAssetModal] = useState(false);
  const [newAsset, setNewAsset] = useState({
    assetCode: "",
    name: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    purchaseCost: 0,
    salvageValue: 0,
    usefulLifeYears: 5,
    depreciationMethod: "Straight-Line" as const,
  });

  const [showNewEmployeeModal, setShowNewEmployeeModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employeeCode: "",
    name: "",
    nationalId: "",
    jobTitle: "",
    basicSalary: 0,
    variableSalary: 0,
    allowances: 0,
    insuranceDeduction: 0,
  });

  // Selected Account for General Ledger
  const [selectedLedgerAccountId, setSelectedLedgerAccountId] = useState<string>("");

  useEffect(() => {
    if (activeCompany) {
      loadData();
    }
  }, [activeCompany?.id, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === "coa" || activeTab === "ledger" || activeTab === "trial-balance") {
        const accs = await api.getAccounts();
        setAccounts(accs);
        if (accs.length > 0 && !selectedLedgerAccountId) {
          setSelectedLedgerAccountId(accs[0].code);
        }
      }
      if (activeTab === "journal" || activeTab === "ledger") {
        const jEntries = await api.getJournalEntries();
        setEntries(jEntries);
      }
      if (activeTab === "trial-balance") {
        const tb = await api.getTrialBalance();
        setTrialBalanceData(tb);
      }
      if (activeTab === "customers") {
        const c = await api.getCustomers();
        setCustomers(c);
      }
      if (activeTab === "vendors") {
        const v = await api.getVendors();
        setVendors(v);
      }
      if (activeTab === "inventory") {
        const inv = await api.getInventory();
        setInventory(inv);
      }
      if (activeTab === "assets") {
        const a = await api.getFixedAssets();
        setAssets(a);
      }
      if (activeTab === "payroll") {
        const emp = await api.getEmployees();
        setEmployees(emp);
      }
      if (activeTab === "reconciliation") {
        const rec = await api.getBankReconciliations();
        setReconciliations(rec);
      }
    } catch (err) {
      console.error("Failed to load accounting data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCOA = async () => {
    if (!confirm("هل ترغب في تهيئة شجرة الحسابات وفقاً لدليل الحسابات المصري الموحد؟ (تبدأ جميع الحسابات بأرصدة صفرية نظيفة)")) return;
    setLoading(true);
    try {
      await api.seedStandardCOA(false);
      await loadData();
      alert("تمت تهيئة دليل الحسابات المصري الموحد بنجاح!");
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء تهيئة الدليل.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAccount(newAccount);
      setShowNewAccountModal(false);
      setNewAccount({ code: "", name: "", type: "Asset", normalBalance: "Debit", isHeader: false, description: "" });
      loadData();
    } catch (err: any) {
      alert(err.message || "فشل إضافة الحساب");
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCustomer(newCustomer);
      setShowNewCustomerModal(false);
      setNewCustomer({ code: "", name: "", taxNumber: "", phone: "", creditLimit: 0 });
      loadData();
    } catch (err: any) {
      alert(err.message || "فشل إضافة العميل");
    }
  };

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createVendor(newVendor);
      setShowNewVendorModal(false);
      setNewVendor({ code: "", name: "", taxNumber: "", phone: "", withholdingTaxRate: 1 });
      loadData();
    } catch (err: any) {
      alert(err.message || "فشل إضافة المورد");
    }
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const net = Number(newAsset.purchaseCost) || 0;
      await api.createFixedAsset({
        ...newAsset,
        accumulatedDepreciation: 0,
        netBookValue: net,
      });
      setShowNewAssetModal(false);
      setNewAsset({
        assetCode: "",
        name: "",
        purchaseDate: new Date().toISOString().split("T")[0],
        purchaseCost: 0,
        salvageValue: 0,
        usefulLifeYears: 5,
        depreciationMethod: "Straight-Line",
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "فشل إضافة الأصل");
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEmployee({
        ...newEmployee,
        hireDate: new Date().toISOString().split("T")[0],
        isActive: true,
      });
      setShowNewEmployeeModal(false);
      setNewEmployee({
        employeeCode: "",
        name: "",
        nationalId: "",
        jobTitle: "",
        basicSalary: 0,
        variableSalary: 0,
        allowances: 0,
        insuranceDeduction: 0,
      });
      loadData();
    } catch (err: any) {
      alert(err.message || "فشل إضافة الموظف");
    }
  };

  // Filter Ledger lines for selected account
  const ledgerLines = entries.flatMap((entry) =>
    (entry.lines || [])
      .filter((line) => line.accountCode === selectedLedgerAccountId || line.accountId === selectedLedgerAccountId)
      .map((line) => ({
        date: entry.date,
        entryNumber: entry.entryNumber,
        description: line.description || entry.description,
        debit: Number(line.debit) || 0,
        credit: Number(line.credit) || 0,
      }))
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-[#0A4DA3]" />
            <span>النظام المحاسبي المتكامل (Accounting Engine)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            دورة محاسبية كاملة مطابقة لمعايير المحاسبة المصرية (EAS) والدولية (IFRS) مع عزل تام لبيانات الشركة.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenJournal}
            className="px-3.5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة قيد يومية جديد</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold scrollbar-thin">
        {[
          { id: "coa", label: "دليل الحسابات (COA)", icon: BookOpen },
          { id: "journal", label: "قيود اليومية", icon: FileSpreadsheet },
          { id: "ledger", label: "دفتر الأستاذ", icon: FileCheck2 },
          { id: "trial-balance", label: "ميزان المراجعة", icon: Scale },
          { id: "customers", label: "العملاء", icon: Users },
          { id: "vendors", label: "الموردون", icon: Building2 },
          { id: "inventory", label: "المخزون", icon: Package },
          { id: "assets", label: "الأصول الثابتة والإهلاك", icon: Landmark },
          { id: "payroll", label: "الرواتب والأجور (كسب العمل)", icon: Calculator },
          { id: "reconciliation", label: "تسوية البنك", icon: RefreshCw },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#0A4DA3] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: CHART OF ACCOUNTS */}
      {activeTab === "coa" && (
        <ChartOfAccountsManager
          accounts={accounts}
          onRefresh={loadData}
          currency={activeCompany?.currency || "ج.م"}
        />
      )}

      {/* TAB 2: JOURNAL ENTRIES */}
      {activeTab === "journal" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">دفتر قيود اليومية العامة (Journal)</h3>
              <p className="text-[11px] text-slate-500">
                تسجيل العمليات المالية بالقيد المزدوج مع فحص التوازن اللحظي التام
              </p>
            </div>
            <button
              onClick={handleOpenJournal}
              className="px-3.5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة قيد جديد</span>
            </button>
          </div>

          {entries.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-black text-slate-800">لا توجد بيانات حتى الآن</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                لا نستخدم أي قيود أو أرصدة وهمية. ابدأ بتسجيل أول قيد محاسبي حقيقي لشركتك.
              </p>
              <button
                onClick={handleOpenJournal}
                className="px-4 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                ➕ تسجيل قيد يومية جديد
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#0A4DA3] bg-blue-50 px-2 py-0.5 rounded">
                        قيد #{entry.entryNumber}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{entry.description}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 font-mono">{entry.date}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        مرحل ومطابق
                      </span>
                    </div>
                  </div>

                  <table className="w-full text-xs text-right">
                    <thead className="text-slate-400 font-semibold border-b border-slate-100">
                      <tr>
                        <th className="pb-1.5">كود الحساب</th>
                        <th className="pb-1.5">اسم الحساب</th>
                        <th className="pb-1.5">البيان</th>
                        <th className="pb-1.5 text-left">مدين ({activeCompany?.currency || "ج.م"})</th>
                        <th className="pb-1.5 text-left">دائن ({activeCompany?.currency || "ج.م"})</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {entry.lines?.map((line) => (
                        <tr key={line.id} className="text-slate-700">
                          <td className="py-1.5 font-mono text-[#0A4DA3] font-bold">{line.accountCode}</td>
                          <td className="py-1.5 font-bold">{line.accountName}</td>
                          <td className="py-1.5 text-slate-500">{line.description}</td>
                          <td className="py-1.5 text-left font-mono font-bold text-blue-700">
                            {line.debit > 0 ? formatNumber(line.debit) : "-"}
                          </td>
                          <td className="py-1.5 text-left font-mono font-bold text-emerald-700">
                            {line.credit > 0 ? formatNumber(line.credit) : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="border-t border-slate-200 font-bold text-slate-900 bg-slate-50/50">
                      <tr>
                        <td colSpan={3} className="py-2 px-1 text-right">الإجمالي المتزن</td>
                        <td className="py-2 text-left font-mono text-blue-900">{formatNumber(entry.totalDebit)}</td>
                        <td className="py-2 text-left font-mono text-emerald-900">{formatNumber(entry.totalCredit)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GENERAL LEDGER */}
      {activeTab === "ledger" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">كشف حساب الأستاذ العام (General Ledger)</h3>
              <p className="text-[11px] text-slate-500">
                استعراض تفصيلي للحركات المدينة والدائنة والرصيد الفعلي التراكمي
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-600">اختر الحساب:</label>
              <select
                value={selectedLedgerAccountId}
                onChange={(e) => setSelectedLedgerAccountId(e.target.value)}
                className="p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 font-bold"
              >
                {accounts.filter((a) => !a.isHeader).map((acc) => (
                  <option key={acc.id} value={acc.code}>
                    [{acc.code}] {acc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-xs text-right divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">التاريخ</th>
                  <th className="py-3 px-4">رقم القيد</th>
                  <th className="py-3 px-4">البيان</th>
                  <th className="py-3 px-4 text-left">مدين</th>
                  <th className="py-3 px-4 text-left">دائن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ledgerLines.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                      لا توجد حركات مسجلة لهذا الحساب حالياً.
                    </td>
                  </tr>
                ) : (
                  ledgerLines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono text-slate-500">{line.date}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0A4DA3]">#{line.entryNumber}</td>
                      <td className="py-2.5 px-4">{line.description}</td>
                      <td className="py-2.5 px-4 text-left font-mono font-bold text-blue-700">
                        {line.debit > 0 ? formatNumber(line.debit) : "-"}
                      </td>
                      <td className="py-2.5 px-4 text-left font-mono font-bold text-emerald-700">
                        {line.credit > 0 ? formatNumber(line.credit) : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TRIAL BALANCE */}
      {activeTab === "trial-balance" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">ميزان المراجعة بالمجاميع والأرصدة</h3>
              <p className="text-[11px] text-slate-500">
                محسوب بصورة ديناميكية من واقع قيود اليومية المعتمدة الفعلية فقط
              </p>
            </div>
            <div>
              {trialBalanceData?.isBalanced ? (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  الميزان متزن تماماً
                </span>
              ) : (
                <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  يوجد فرق في توازن الميزان
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-xs text-right divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-bold">
                <tr>
                  <th rowSpan={2} className="py-3 px-4 border-l border-slate-200">كود الحساب</th>
                  <th rowSpan={2} className="py-3 px-4 border-l border-slate-200">اسم الحساب</th>
                  <th colSpan={2} className="py-2 px-4 text-center border-b border-l border-slate-200 bg-blue-50/50">مجاميع الحركات</th>
                  <th colSpan={2} className="py-2 px-4 text-center bg-emerald-50/50">أرصدة الإقفال</th>
                </tr>
                <tr>
                  <th className="py-2 px-3 text-left border-l border-slate-200">مدين</th>
                  <th className="py-2 px-3 text-left border-l border-slate-200">دائن</th>
                  <th className="py-2 px-3 text-left border-l border-slate-200">مدين</th>
                  <th className="py-2 px-3 text-left">دائن</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trialBalanceData?.accounts?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      لا توجد حسابات مسجلة لعرضها في ميزان المراجعة.
                    </td>
                  </tr>
                ) : (
                  trialBalanceData?.accounts?.map((acc: any) => (
                    <tr key={acc.accountId} className="hover:bg-slate-50">
                      <td className="py-2 px-4 font-mono font-bold text-[#0A4DA3] border-l border-slate-100">{acc.code}</td>
                      <td className="py-2 px-4 font-bold border-l border-slate-100">{acc.name}</td>
                      <td className="py-2 px-3 text-left font-mono border-l border-slate-100">{acc.totalDebit > 0 ? formatNumber(acc.totalDebit) : "-"}</td>
                      <td className="py-2 px-3 text-left font-mono border-l border-slate-100">{acc.totalCredit > 0 ? formatNumber(acc.totalCredit) : "-"}</td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-blue-800 border-l border-slate-100">{acc.closingDebit > 0 ? formatNumber(acc.closingDebit) : "-"}</td>
                      <td className="py-2 px-3 text-left font-mono font-bold text-emerald-800">{acc.closingCredit > 0 ? formatNumber(acc.closingCredit) : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-slate-100 font-black text-slate-900 border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-right">الإجماليات الكلية</td>
                  <td className="py-3 px-3 text-left font-mono">{formatNumber(trialBalanceData?.totalDebits || 0)}</td>
                  <td className="py-3 px-3 text-left font-mono">{formatNumber(trialBalanceData?.totalCredits || 0)}</td>
                  <td className="py-3 px-3 text-left font-mono text-blue-900">{formatNumber(trialBalanceData?.closingDebits || 0)}</td>
                  <td className="py-3 px-3 text-left font-mono text-emerald-900">{formatNumber(trialBalanceData?.closingCredits || 0)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: CUSTOMERS */}
      {activeTab === "customers" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">سجل العملاء والمدينين التجاريين</h3>
              <p className="text-[11px] text-slate-500">بيانات العملاء الرسمية وأرقام التسجيل الضريبي وحدود الائتمان</p>
            </div>
            <button
              onClick={() => setShowNewCustomerModal(true)}
              className="px-3 py-1.5 bg-[#0A4DA3] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة عميل جديد</span>
            </button>
          </div>

          {customers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-black text-slate-800">لا توجد بيانات حتى الآن</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">لا يتم إدراج أي أسماء وهمية، ابدأ بإضافة عملاء حقيقيين لشركتك.</p>
              <button
                onClick={() => setShowNewCustomerModal(true)}
                className="px-4 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                ➕ إضافة عميل جديد
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-right divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">كود العميل</th>
                    <th className="py-3 px-4">اسم العميل</th>
                    <th className="py-3 px-4">الرقم الضريبي</th>
                    <th className="py-3 px-4">الهاتف</th>
                    <th className="py-3 px-4">حد الائتمان</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0A4DA3]">{c.code}</td>
                      <td className="py-2.5 px-4 font-bold">{c.name}</td>
                      <td className="py-2.5 px-4 font-mono">{c.taxNumber || "غير محدد"}</td>
                      <td className="py-2.5 px-4 font-mono">{c.phone || "-"}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                        {formatNumber(Number(c.creditLimit))} {activeCompany?.currency || "ج.م"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: VENDORS */}
      {activeTab === "vendors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">سجل الموردين والدائنين التجاريين</h3>
              <p className="text-[11px] text-slate-500">نسب الخصم والتحصيل الضريبي (نموذج 41) وبيانات التواصل</p>
            </div>
            <button
              onClick={() => setShowNewVendorModal(true)}
              className="px-3 py-1.5 bg-[#0A4DA3] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة مورد جديد</span>
            </button>
          </div>

          {vendors.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-black text-slate-800">لا توجد بيانات حتى الآن</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">أضف الموردين المعتمدين لحساب فواتير المشتريات والخصم والتحصيل بدقة.</p>
              <button
                onClick={() => setShowNewVendorModal(true)}
                className="px-4 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                ➕ إضافة مورد جديد
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-right divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">كود المورد</th>
                    <th className="py-3 px-4">اسم المورد</th>
                    <th className="py-3 px-4">الرقم الضريبي</th>
                    <th className="py-3 px-4">الهاتف</th>
                    <th className="py-3 px-4">نسبة الخصم والتحصيل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0A4DA3]">{v.code}</td>
                      <td className="py-2.5 px-4 font-bold">{v.name}</td>
                      <td className="py-2.5 px-4 font-mono">{v.taxNumber || "غير مسجل"}</td>
                      <td className="py-2.5 px-4 font-mono">{v.phone || "-"}</td>
                      <td className="py-2.5 px-4">
                        <span className="bg-amber-100 text-amber-900 font-bold font-mono px-2 py-0.5 rounded text-[10px]">
                          {v.withholdingTaxRate}% (نموذج 41)
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: INVENTORY */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">إدارة المخزون والبضاعة</h3>
              <p className="text-[11px] text-slate-500">حركة الأصناف، أسعار التكلفة، وأرصدة المخازن الفعلية</p>
            </div>
          </div>

          {inventory.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">لا توجد أصناف مخزنية مضافة</h4>
              <p className="text-xs text-slate-500 mt-1">يتم احتساب تكلفة البضاعة المباعة ومخزون آخر المدة من واقع العمليات الفعلية.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-right divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">كود الصنف (SKU)</th>
                    <th className="py-3 px-4">اسم الصنف</th>
                    <th className="py-3 px-4">الوحدة</th>
                    <th className="py-3 px-4">تكلفة الشراء</th>
                    <th className="py-3 px-4">سعر البيع</th>
                    <th className="py-3 px-4">الكمية المتاحة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0A4DA3]">{item.sku}</td>
                      <td className="py-2.5 px-4 font-bold">{item.name}</td>
                      <td className="py-2.5 px-4 text-slate-500">{item.unit}</td>
                      <td className="py-2.5 px-4 font-mono">{formatNumber(Number(item.costPrice))}</td>
                      <td className="py-2.5 px-4 font-mono">{formatNumber(Number(item.sellingPrice))}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">{item.quantityOnHand}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: FIXED ASSETS */}
      {activeTab === "assets" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">سجل الأصول الثابتة والإهلاك الدوري</h3>
              <p className="text-[11px] text-slate-500">حساب الإهلاك المحاسبي وفقاً لمعيار المحاسبة المصري (10)</p>
            </div>
            <button
              onClick={() => setShowNewAssetModal(true)}
              className="px-3 py-1.5 bg-[#0A4DA3] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل أصل ثابت جديد</span>
            </button>
          </div>

          {assets.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">لا توجد أصول ثابتة مسجلة</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">أضف أصول الشركة لحساب مجمع الإهلاك وقسط الإهلاك السنوي والقيمة الدفترية تلقائياً.</p>
              <button
                onClick={() => setShowNewAssetModal(true)}
                className="px-4 py-2 bg-[#0A4DA3] text-white rounded-xl text-xs font-bold"
              >
                إضافة الأصل الأول
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-right divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">كود الأصل</th>
                    <th className="py-3 px-4">اسم الأصل</th>
                    <th className="py-3 px-4">تاريخ الشراء</th>
                    <th className="py-3 px-4">تكلفة الشراء</th>
                    <th className="py-3 px-4">العمر (سنوات)</th>
                    <th className="py-3 px-4">طريقة الإهلاك</th>
                    <th className="py-3 px-4">صافي القيمة الدفترية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {assets.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0A4DA3]">{a.assetCode}</td>
                      <td className="py-2.5 px-4 font-bold">{a.name}</td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">{a.purchaseDate}</td>
                      <td className="py-2.5 px-4 font-mono">{formatNumber(Number(a.purchaseCost))}</td>
                      <td className="py-2.5 px-4 font-mono">{a.usefulLifeYears} سنة</td>
                      <td className="py-2.5 px-4">القسط الثابت (Straight-Line)</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-800">
                        {formatNumber(Number(a.netBookValue))} {activeCompany?.currency || "ج.م"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 9: PAYROLL */}
      {activeTab === "payroll" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-800">المرتبات والأجور وضريبة كسب العمل</h3>
              <p className="text-[11px] text-slate-500">حساب استقطاعات التأمينات الاجتماعية والشرائح الضريبية وفقاً للتعديلات المصرية</p>
            </div>
            <button
              onClick={() => setShowNewEmployeeModal(true)}
              className="px-3 py-1.5 bg-[#0A4DA3] text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة موظف جديد</span>
            </button>
          </div>

          {employees.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">لا يوجد موظفون مسجلون حالياً</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">سجل موظفي الشركة لإعداد كشوف الرواتب الشهرية وإقرار كسب العمل الربع سنوي.</p>
              <button
                onClick={() => setShowNewEmployeeModal(true)}
                className="px-4 py-2 bg-[#0A4DA3] text-white rounded-xl text-xs font-bold"
              >
                إضافة الموظف الأول
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs text-right divide-y divide-slate-200">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">كود الموظف</th>
                    <th className="py-3 px-4">اسم الموظف</th>
                    <th className="py-3 px-4">الرقم القومي</th>
                    <th className="py-3 px-4">المسمى الوظيفي</th>
                    <th className="py-3 px-4">الراتب الأساسي</th>
                    <th className="py-3 px-4">التأمينات المستقطعة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0A4DA3]">{emp.employeeCode}</td>
                      <td className="py-2.5 px-4 font-bold">{emp.name}</td>
                      <td className="py-2.5 px-4 font-mono">{emp.nationalId || "-"}</td>
                      <td className="py-2.5 px-4">{emp.jobTitle}</td>
                      <td className="py-2.5 px-4 font-mono font-bold">{formatNumber(Number(emp.basicSalary))}</td>
                      <td className="py-2.5 px-4 font-mono text-red-600">{formatNumber(Number(emp.insuranceDeduction))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 10: BANK RECONCILIATION */}
      {activeTab === "reconciliation" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">مذكرة التسوية البنكية (Bank Reconciliation)</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              مطابقة رصيد الدفاتر الحسابية مع رصيد كشف الحساب البنكي الفعلي، وفصل الشيكات غير المصروفة والإيداعات بالطريق.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
            <RefreshCw className="w-12 h-12 text-[#0A4DA3] mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-800">تسوية أرصدة الحسابات الجارية</h4>
            <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 mb-4">
              يمكنك ربط كشف الحساب البنكي الشهري ومطابقته مباشرة مع حركة الحساب 122 (النقدية بالبنوك) لتحديد الفروق واعتماد التسوية.
            </p>
          </div>
        </div>
      )}

      {/* Modal: New Account */}
      {showNewAccountModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">إضافة حساب جديد في الدليل</h3>
            <form onSubmit={handleCreateAccount} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كود الحساب (مثال: 1211)</label>
                <input
                  type="text"
                  required
                  value={newAccount.code}
                  onChange={(e) => setNewAccount({ ...newAccount, code: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الحساب</label>
                <input
                  type="text"
                  required
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحساب</label>
                  <select
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right"
                  >
                    <option value="Asset">أصل (Asset)</option>
                    <option value="Liability">التزام (Liability)</option>
                    <option value="Equity">حقوق ملكية (Equity)</option>
                    <option value="Revenue">إيراد (Revenue)</option>
                    <option value="Expense">مصروف (Expense)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الطبيعة المحاسبية</label>
                  <select
                    value={newAccount.normalBalance}
                    onChange={(e) => setNewAccount({ ...newAccount, normalBalance: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right"
                  >
                    <option value="Debit">مدين بطبيعته</option>
                    <option value="Credit">دائن بطبيعته</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isHeader"
                  checked={newAccount.isHeader}
                  onChange={(e) => setNewAccount({ ...newAccount, isHeader: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0A4DA3]"
                />
                <label htmlFor="isHeader" className="text-xs font-bold text-slate-700 cursor-pointer">
                  حساب رئيسي إجمالي (لا يقبل قيود مباشرة)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewAccountModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0]"
                >
                  حفظ الحساب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Customer */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">إضافة عميل جديد</h3>
            <form onSubmit={handleCreateCustomer} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كود العميل (مثال: C-001)</label>
                <input
                  type="text"
                  required
                  value={newCustomer.code}
                  onChange={(e) => setNewCustomer({ ...newCustomer, code: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل / الشركة</label>
                <input
                  type="text"
                  required
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم التسجيل الضريبي</label>
                <input
                  type="text"
                  value={newCustomer.taxNumber}
                  onChange={(e) => setNewCustomer({ ...newCustomer, taxNumber: e.target.value })}
                  placeholder="000-000-000"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف</label>
                  <input
                    type="text"
                    value={newCustomer.phone}
                    onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">حد الائتمان</label>
                  <input
                    type="number"
                    value={newCustomer.creditLimit}
                    onChange={(e) => setNewCustomer({ ...newCustomer, creditLimit: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right font-mono"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewCustomerModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0]"
                >
                  حفظ العميل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Vendor */}
      {showNewVendorModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">إضافة مورد جديد</h3>
            <form onSubmit={handleCreateVendor} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كود المورد (مثال: V-101)</label>
                <input
                  type="text"
                  required
                  value={newVendor.code}
                  onChange={(e) => setNewVendor({ ...newVendor, code: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم المورد</label>
                <input
                  type="text"
                  required
                  value={newVendor.name}
                  onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم التسجيل الضريبي</label>
                <input
                  type="text"
                  value={newVendor.taxNumber}
                  onChange={(e) => setNewVendor({ ...newVendor, taxNumber: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نسبة الخصم والتحصيل</label>
                <select
                  value={newVendor.withholdingTaxRate}
                  onChange={(e) => setNewVendor({ ...newVendor, withholdingTaxRate: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right"
                >
                  <option value={1}>1% - توريدات وسلع</option>
                  <option value={3}>3% - خدمات</option>
                  <option value={5}>5% - مهن حرة واستشارات</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewVendorModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0]"
                >
                  حفظ المورد
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Fixed Asset */}
      {showNewAssetModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">تسجيل أصل ثابت جديد</h3>
            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كود الأصل (مثال: FA-001)</label>
                <input
                  type="text"
                  required
                  value={newAsset.assetCode}
                  onChange={(e) => setNewAsset({ ...newAsset, assetCode: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الأصل</label>
                <input
                  type="text"
                  required
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="سيارة نقل بضائع / ماكينة إنتاج"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تكلفة الشراء</label>
                  <input
                    type="number"
                    required
                    value={newAsset.purchaseCost}
                    onChange={(e) => setNewAsset({ ...newAsset, purchaseCost: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">العمر الافتراضي (سنوات)</label>
                  <input
                    type="number"
                    required
                    value={newAsset.usefulLifeYears}
                    onChange={(e) => setNewAsset({ ...newAsset, usefulLifeYears: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewAssetModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0]"
                >
                  تسجيل الأصل
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Employee */}
      {showNewEmployeeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">إضافة موظف جديد</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">كود الموظف (مثال: EMP-101)</label>
                <input
                  type="text"
                  required
                  value={newEmployee.employeeCode}
                  onChange={(e) => setNewEmployee({ ...newEmployee, employeeCode: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم الموظف الثلاثي</label>
                <input
                  type="text"
                  required
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">المسمى الوظيفي</label>
                <input
                  type="text"
                  required
                  value={newEmployee.jobTitle}
                  onChange={(e) => setNewEmployee({ ...newEmployee, jobTitle: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الراتب الأساسي</label>
                  <input
                    type="number"
                    required
                    value={newEmployee.basicSalary}
                    onChange={(e) => setNewEmployee({ ...newEmployee, basicSalary: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">استقطاع التأمينات</label>
                  <input
                    type="number"
                    value={newEmployee.insuranceDeduction}
                    onChange={(e) => setNewEmployee({ ...newEmployee, insuranceDeduction: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewEmployeeModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0]"
                >
                  حفظ الموظف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Double-Entry Journal Creation Modal */}
      <NewJournalEntryModal
        isOpen={showInternalJournalModal}
        onClose={() => setShowInternalJournalModal(false)}
        onSuccess={() => loadData()}
      />
    </div>
  );
};
