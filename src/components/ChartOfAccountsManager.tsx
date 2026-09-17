import React, { useState, useMemo } from "react";
import { Account, AccountType, NormalBalance } from "../types";
import { api } from "../services/api";
import { formatNumber } from "../utils/formatters";
import {
  FolderTree,
  Table as TableIcon,
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronLeft,
  Search,
  RefreshCw,
  Sparkles,
  ArrowUpDown,
  Move,
  CheckCircle2,
  XCircle,
  FileDown,
  FileUp,
  SlidersHorizontal,
  Info,
  ShieldAlert,
} from "lucide-react";

interface ChartOfAccountsManagerProps {
  accounts: Account[];
  onRefresh: () => void;
  currency?: string;
}

interface TreeNode {
  account: Account;
  children: TreeNode[];
}

export const ChartOfAccountsManager: React.FC<ChartOfAccountsManagerProps> = ({
  accounts,
  onRefresh,
  currency = "EGP",
}) => {
  const [viewMode, setViewMode] = useState<"tree" | "flat">("tree");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [expandedCodes, setExpandedCodes] = useState<Set<string>>(
    new Set(["1", "2", "3", "4", "11", "12", "21", "22", "23"])
  );

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [movingAccount, setMovingAccount] = useState<Account | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    nameAr: "",
    nameEn: "",
    type: "Asset" as AccountType,
    normalBalance: "Debit" as NormalBalance,
    parentId: "" as string,
    level: 1,
    currency: currency,
    isHeader: false,
    status: "Active" as "Active" | "Inactive",
    description: "",
  });

  const [newParentId, setNewParentId] = useState<string>("");
  const [importText, setImportText] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        acc.code.toLowerCase().includes(q) ||
        acc.name.toLowerCase().includes(q) ||
        (acc.nameAr && acc.nameAr.toLowerCase().includes(q)) ||
        (acc.nameEn && acc.nameEn.toLowerCase().includes(q)) ||
        (acc.description && acc.description.toLowerCase().includes(q));

      const matchesType = selectedType === "ALL" || acc.type === selectedType;
      const matchesStatus =
        selectedStatus === "ALL" ||
        (selectedStatus === "Active" ? acc.isActive !== false : acc.isActive === false);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, searchQuery, selectedType, selectedStatus]);

  // Build Hierarchical Tree
  const treeData = useMemo(() => {
    const map: { [id: string]: TreeNode } = {};
    const roots: TreeNode[] = [];

    // Sort accounts by code
    const sorted = [...accounts].sort((a, b) =>
      a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: "base" })
    );

    sorted.forEach((acc) => {
      map[acc.id] = { account: acc, children: [] };
    });

    sorted.forEach((acc) => {
      if (acc.parentId && map[acc.parentId]) {
        map[acc.parentId].children.push(map[acc.id]);
      } else {
        roots.push(map[acc.id]);
      }
    });

    return roots;
  }, [accounts]);

  const toggleExpand = (code: string) => {
    setExpandedCodes((prev) => {
      const next = new Set(prev);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set(accounts.map((a) => a.code));
    setExpandedCodes(all);
  };

  const collapseAll = () => {
    setExpandedCodes(new Set());
  };

  const openAddChild = (parentAcc?: Account) => {
    setErrorMessage("");
    setSuccessMessage("");
    if (parentAcc) {
      // Suggest next child code
      const siblings = accounts.filter((a) => a.parentId === parentAcc.id);
      let suggestedCode = `${parentAcc.code}1`;
      if (siblings.length > 0) {
        const lastSib = siblings[siblings.length - 1];
        const numPart = parseInt(lastSib.code.slice(parentAcc.code.length), 10);
        if (!isNaN(numPart)) {
          suggestedCode = `${parentAcc.code}${numPart + 1}`;
        }
      }
      setFormData({
        code: suggestedCode,
        name: "",
        nameAr: "",
        nameEn: "",
        type: parentAcc.type,
        normalBalance: parentAcc.normalBalance,
        parentId: parentAcc.id,
        level: (parentAcc.level || 1) + 1,
        currency: parentAcc.currency || currency,
        isHeader: false,
        status: "Active",
        description: "",
      });
    } else {
      setFormData({
        code: "",
        name: "",
        nameAr: "",
        nameEn: "",
        type: "Asset",
        normalBalance: "Debit",
        parentId: "",
        level: 1,
        currency: currency,
        isHeader: false,
        status: "Active",
        description: "",
      });
    }
    setShowAddModal(true);
  };

  const openEdit = (acc: Account) => {
    setErrorMessage("");
    setSuccessMessage("");
    setEditingAccount(acc);
    setFormData({
      code: acc.code,
      name: acc.name,
      nameAr: acc.nameAr || acc.name,
      nameEn: acc.nameEn || "",
      type: acc.type,
      normalBalance: acc.normalBalance,
      parentId: acc.parentId || "",
      level: acc.level,
      currency: acc.currency || currency,
      isHeader: acc.isHeader,
      status: acc.isActive !== false ? "Active" : "Inactive",
      description: acc.description || "",
    });
    setShowEditModal(true);
  };

  const openMove = (acc: Account) => {
    setErrorMessage("");
    setSuccessMessage("");
    setMovingAccount(acc);
    setNewParentId(acc.parentId || "");
    setShowMoveModal(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!formData.code.trim() || !formData.nameAr.trim()) {
      setErrorMessage("كود الحساب واسم الحساب العربي حقول إلزامية.");
      return;
    }
    setActionLoading(true);
    try {
      await api.createAccount({
        code: formData.code.trim(),
        name: formData.nameAr.trim(),
        nameAr: formData.nameAr.trim(),
        nameEn: formData.nameEn.trim(),
        type: formData.type,
        normalBalance: formData.normalBalance,
        parentId: formData.parentId || null,
        level: Number(formData.level) || 1,
        currency: formData.currency || currency,
        isHeader: formData.isHeader,
        isActive: formData.status === "Active",
        status: formData.status,
        description: formData.description.trim(),
      });
      setShowAddModal(false);
      setSuccessMessage(`تمت إضافة الحساب [${formData.code}] بنجاح.`);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ أثناء إضافة الحساب.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAccount) return;
    setErrorMessage("");
    if (!formData.code.trim() || !formData.nameAr.trim()) {
      setErrorMessage("كود الحساب واسم الحساب حقول إلزامية.");
      return;
    }
    setActionLoading(true);
    try {
      await api.updateAccount(editingAccount.id, {
        code: formData.code.trim(),
        name: formData.nameAr.trim(),
        nameAr: formData.nameAr.trim(),
        nameEn: formData.nameEn.trim(),
        type: formData.type,
        normalBalance: formData.normalBalance,
        parentId: formData.parentId || null,
        level: Number(formData.level) || 1,
        currency: formData.currency || currency,
        isHeader: formData.isHeader,
        isActive: formData.status === "Active",
        status: formData.status,
        description: formData.description.trim(),
      });
      setShowEditModal(false);
      setSuccessMessage(`تم تحديث بيانات الحساب [${formData.code}] بنجاح.`);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "حدث خطأ أثناء تعديل الحساب.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (acc: Account) => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!window.confirm(`هل أنت متأكد من حذف الحساب [${acc.code}] ${acc.name}؟`)) {
      return;
    }
    setActionLoading(true);
    try {
      await api.deleteAccount(acc.id);
      setSuccessMessage(`تم حذف الحساب [${acc.code}] بنجاح.`);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "فشل حذف الحساب.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (acc: Account) => {
    setErrorMessage("");
    setSuccessMessage("");
    const newStatus = acc.isActive ? "Inactive" : "Active";
    try {
      await api.toggleAccountStatus(acc.id, newStatus, newStatus === "Active");
      setSuccessMessage(`تم تغيير حالة الحساب [${acc.code}] إلى ${newStatus === "Active" ? "نشط" : "معطل"}.`);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "فشل تغيير حالة الحساب.");
    }
  };

  const handleMove = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movingAccount) return;
    setErrorMessage("");
    setActionLoading(true);
    try {
      await api.moveAccount(movingAccount.id, newParentId ? newParentId : null);
      setShowMoveModal(false);
      setSuccessMessage(`تم نقل الحساب [${movingAccount.code}] بنجاح.`);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "فشل نقل الحساب.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (!importText.trim()) {
      setErrorMessage("الرجاء إدخال بيانات الحسابات للاستيراد.");
      return;
    }
    setActionLoading(true);
    try {
      let parsedList: any[] = [];
      // Check if JSON
      if (importText.trim().startsWith("[") || importText.trim().startsWith("{")) {
        const parsed = JSON.parse(importText);
        parsedList = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        // Assume CSV: code, nameAr, nameEn, type, normalBalance
        const lines = importText.trim().split("\n");
        parsedList = lines.map((line) => {
          const parts = line.split(",").map((p) => p.trim());
          return {
            code: parts[0] || "",
            nameAr: parts[1] || "",
            nameEn: parts[2] || "",
            type: (parts[3] as AccountType) || "Asset",
            normalBalance: (parts[4] as NormalBalance) || "Debit",
          };
        });
      }

      const res = await api.importAccounts(parsedList);
      setShowImportModal(false);
      setImportText("");
      setSuccessMessage(`تم استيراد ${res.count} حساب بنجاح إلى شجرة الحسابات.`);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "فشل استيراد الحسابات. يرجى التحقق من صياغة البيانات.");
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Account Code", "Name Arabic", "Name English", "Type", "Normal Balance", "Level", "Is Header", "Status"];
    const rows = accounts.map((a) => [
      `"${a.code}"`,
      `"${a.nameAr || a.name}"`,
      `"${a.nameEn || ""}"`,
      `"${a.type}"`,
      `"${a.normalBalance}"`,
      a.level,
      a.isHeader ? "Yes" : "No",
      a.isActive !== false ? "Active" : "Inactive",
    ]);
    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Chart_of_Accounts_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSeedCOA = async () => {
    if (!window.confirm("هل ترغب في تهيئة دليل الحسابات المصري الموحد المعتمد؟ سيتم إضافة الحسابات القياسية إلى شجرتك.")) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.seedStandardCOA(false);
      setSuccessMessage(`تمت تهيئة دليل الحسابات المصري الموحد بنجاح (${res.count} حساب).`);
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || "فشل تهيئة الدليل المصري.");
    } finally {
      setActionLoading(false);
    }
  };

  const renderAccountTypeBadge = (type: AccountType) => {
    const colors: Record<AccountType, string> = {
      Asset: "bg-blue-50 text-blue-700 border-blue-200",
      Liability: "bg-amber-50 text-amber-700 border-amber-200",
      Equity: "bg-purple-50 text-purple-700 border-purple-200",
      Revenue: "bg-emerald-50 text-emerald-700 border-emerald-200",
      Expense: "bg-rose-50 text-rose-700 border-rose-200",
    };
    const labels: Record<AccountType, string> = {
      Asset: "أصول (Assets)",
      Liability: "التزامات (Liabilities)",
      Equity: "حقوق ملكية (Equity)",
      Revenue: "إيرادات (Revenue)",
      Expense: "مصروفات (Expenses)",
    };
    return (
      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${colors[type] || "bg-slate-100 text-slate-700"}`}>
        {labels[type] || type}
      </span>
    );
  };

  // Recursive Tree Node Renderer
  const renderTreeNode = (node: TreeNode, depth: number = 0) => {
    const { account, children } = node;
    const hasChildren = children.length > 0;
    const isExpanded = expandedCodes.has(account.code);

    return (
      <div key={account.id} className="select-none">
        <div
          className={`flex items-center justify-between py-2 px-3 hover:bg-slate-50 border-b border-slate-100 transition-colors ${
            account.isHeader ? "bg-slate-50/60 font-bold" : ""
          } ${!account.isActive ? "opacity-60 bg-slate-50/30" : ""}`}
          style={{ paddingRight: `${depth * 24 + 12}px` }}
        >
          {/* Left: Code, Expand/Collapse, Names */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            {hasChildren ? (
              <button
                onClick={() => toggleExpand(account.code)}
                className="w-5 h-5 rounded hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-transform"
                title={isExpanded ? "طي" : "توسيع"}
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            ) : (
              <span className="w-5 h-5 flex items-center justify-center text-slate-300">•</span>
            )}

            <span className="font-mono text-xs font-bold text-[#0A4DA3] bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100">
              {account.code}
            </span>

            <div className="flex items-baseline gap-2 truncate">
              <span className={`text-xs ${account.isHeader ? "font-black text-slate-900" : "text-slate-800"}`}>
                {account.nameAr || account.name}
              </span>
              {account.nameEn && (
                <span className="text-[11px] text-slate-400 font-mono hidden sm:inline truncate">
                  ({account.nameEn})
                </span>
              )}
            </div>

            {account.isHeader && (
              <span className="text-[9px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-semibold hidden md:inline">
                رئيسي
              </span>
            )}

            {!account.isActive && (
              <span className="text-[9px] px-1.5 py-0.5 bg-rose-100 text-rose-700 rounded font-semibold">
                معطل
              </span>
            )}
          </div>

          {/* Middle: Badges */}
          <div className="flex items-center gap-2 mx-3">
            {renderAccountTypeBadge(account.type)}

            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold hidden lg:inline ${
                account.normalBalance === "Debit"
                  ? "bg-blue-50 text-blue-700"
                  : "bg-emerald-50 text-emerald-700"
              }`}
            >
              {account.normalBalance === "Debit" ? "مدين" : "دائن"}
            </span>

            <span className="text-[11px] text-slate-400 font-mono hidden xl:inline">
              مستوى {account.level}
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => openAddChild(account)}
              title="إضافة حساب فرعي تحته"
              className="p-1 rounded hover:bg-blue-50 text-slate-500 hover:text-[#0A4DA3] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => openEdit(account)}
              title="تعديل الحساب"
              className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => openMove(account)}
              title="نقل الحساب إلى أصل آخر"
              className="p-1 rounded hover:bg-amber-50 text-slate-500 hover:text-amber-700 transition-colors"
            >
              <Move className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleToggleStatus(account)}
              title={account.isActive ? "تعطيل الحساب" : "تفعيل الحساب"}
              className="p-1 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
            >
              {account.isActive ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
              )}
            </button>
            <button
              onClick={() => handleDelete(account)}
              title="حذف الحساب"
              className="p-1 rounded hover:bg-rose-50 text-slate-500 hover:text-rose-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Render Children if expanded */}
        {hasChildren && isExpanded && (
          <div className="transition-all">
            {children.map((child) => renderTreeNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Alert Banners */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage("")} className="text-rose-500 hover:text-rose-700 text-xs">
            ✕
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage("")} className="text-emerald-500 hover:text-emerald-700 text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-[#0A4DA3]" />
              <span>دليل وشجرة الحسابات (Chart of Accounts)</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              هيكل هرمي متكامل يدعم المستويات المتعددة، الحسابات الرئيسية والفرعية، والربط اللحظي بقيود اليومية والميزانية.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleSeedCOA}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#0A4DA3] border border-blue-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تهيئة الدليل المصري الموحد</span>
            </button>

            <button
              onClick={() => openAddChild()}
              className="px-3 py-1.5 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة حساب رئيسي/جديد</span>
            </button>

            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              title="استيراد الحسابات من ملف أو نص"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>استيراد</span>
            </button>

            <button
              onClick={exportToCSV}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              title="تصدير شجرة الحسابات بصيغة CSV"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>تصدير</span>
            </button>
          </div>
        </div>

        {/* Filter and View Mode Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث بكود الحساب، الاسم العربي أو الإنجليزي..."
                className="w-full pl-3 pr-9 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A4DA3] transition-colors"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none"
            >
              <option value="ALL">كافة التبويبات</option>
              <option value="Asset">الأصول (Assets)</option>
              <option value="Liability">الالتزامات (Liabilities)</option>
              <option value="Equity">حقوق الملكية (Equity)</option>
              <option value="Revenue">الإيرادات (Revenue)</option>
              <option value="Expense">المصروفات (Expenses)</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1.5 px-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold focus:outline-none hidden sm:block"
            >
              <option value="ALL">كافة الحالات</option>
              <option value="Active">النشطة فقط</option>
              <option value="Inactive">المعطلة فقط</option>
            </select>
          </div>

          <div className="flex items-center gap-2 justify-end">
            {viewMode === "tree" && (
              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-bold">
                <button
                  onClick={expandAll}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  توسيع الكل
                </button>
                <button
                  onClick={collapseAll}
                  className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  طي الكل
                </button>
              </div>
            )}

            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("tree")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  viewMode === "tree"
                    ? "bg-white text-[#0A4DA3] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="عرض شجرة هرمية"
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>شجرة</span>
              </button>
              <button
                onClick={() => setViewMode("flat")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  viewMode === "flat"
                    ? "bg-white text-[#0A4DA3] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="عرض جدول مسطح"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>جدول</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { label: "الأصول", type: "Asset", count: accounts.filter((a) => a.type === "Asset").length, color: "text-blue-700 bg-blue-50 border-blue-200" },
          { label: "الالتزامات", type: "Liability", count: accounts.filter((a) => a.type === "Liability").length, color: "text-amber-700 bg-amber-50 border-amber-200" },
          { label: "حقوق الملكية", type: "Equity", count: accounts.filter((a) => a.type === "Equity").length, color: "text-purple-700 bg-purple-50 border-purple-200" },
          { label: "المصروفات", type: "Expense", count: accounts.filter((a) => a.type === "Expense").length, color: "text-rose-700 bg-rose-50 border-rose-200" },
          { label: "الإيرادات", type: "Revenue", count: accounts.filter((a) => a.type === "Revenue").length, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
        ].map((item) => (
          <div
            key={item.type}
            onClick={() => setSelectedType(selectedType === item.type ? "ALL" : item.type)}
            className={`cursor-pointer p-2.5 rounded-xl border transition-all text-center ${
              selectedType === item.type ? "ring-2 ring-offset-1 ring-[#0A4DA3]" : ""
            } ${item.color}`}
          >
            <div className="text-[11px] font-bold">{item.label}</div>
            <div className="text-sm font-black font-mono mt-0.5">{formatNumber(item.count)}</div>
          </div>
        ))}
      </div>

      {/* Main Content View */}
      {accounts.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
          <FolderTree className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-base font-black text-slate-800">شجرة الحسابات فارغة</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            تطبيقاً لسياسة البيانات الصارمة، لا نقوم بتوليد أي حسابات عشوائية. يمكنك إضافة حساباتك يدوياً أو تفعيل دليل الحسابات المصري الموحد بضغطة زر واحدة.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSeedCOA}
              className="px-4 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>تهيئة دليل الحسابات المصري الموحد الآن</span>
            </button>
            <button
              onClick={() => openAddChild()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
            >
              إضافة حساب يدوي
            </button>
          </div>
        </div>
      ) : viewMode === "tree" && searchQuery.trim() === "" && selectedType === "ALL" && selectedStatus === "ALL" ? (
        /* HIERARCHICAL TREE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="py-2.5 px-4 bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-xs flex items-center justify-between">
            <span>الهيكل الشجري للحسابات</span>
            <span className="text-[11px] text-slate-500 font-normal">
              إجمالي الحسابات: {formatNumber(accounts.length)} حساب
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {treeData.map((node) => renderTreeNode(node, 0))}
          </div>
        </div>
      ) : (
        /* FLAT TABLE VIEW (Used when searching, filtering, or explicitly chosen) */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">كود الحساب</th>
                  <th className="py-3 px-4">اسم الحساب (عربي)</th>
                  <th className="py-3 px-4">اسم الحساب (English)</th>
                  <th className="py-3 px-4">النوع / التبويب</th>
                  <th className="py-3 px-4">الطبيعة</th>
                  <th className="py-3 px-4">المستوى</th>
                  <th className="py-3 px-4">الحالة</th>
                  <th className="py-3 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400 text-xs">
                      لا توجد حسابات مطابقة لمعايير البحث أو التصفية الحالية.
                    </td>
                  </tr>
                ) : (
                  filteredAccounts.map((acc) => (
                    <tr
                      key={acc.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        acc.isHeader ? "bg-slate-50/40 font-bold" : ""
                      } ${!acc.isActive ? "opacity-60" : ""}`}
                    >
                      <td className="py-2.5 px-4 font-mono font-bold text-[#0A4DA3]">
                        {acc.code}
                      </td>
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {acc.nameAr || acc.name}
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-500">
                        {acc.nameEn || "-"}
                      </td>
                      <td className="py-2.5 px-4">
                        {renderAccountTypeBadge(acc.type)}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            acc.normalBalance === "Debit"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          {acc.normalBalance === "Debit" ? "مدين" : "دائن"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 font-mono text-slate-600">
                        مستوى {acc.level}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            acc.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {acc.isActive ? "نشط" : "معطل"}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => openAddChild(acc)}
                            title="إضافة حساب فرعي"
                            className="p-1 rounded hover:bg-blue-50 text-slate-500 hover:text-[#0A4DA3]"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEdit(acc)}
                            title="تعديل"
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openMove(acc)}
                            title="نقل الحساب"
                            className="p-1 rounded hover:bg-amber-50 text-slate-500 hover:text-amber-700"
                          >
                            <Move className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(acc)}
                            title={acc.isActive ? "تعطيل" : "تفعيل"}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500"
                          >
                            {acc.isActive ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(acc)}
                            title="حذف"
                            className="p-1 rounded hover:bg-rose-50 text-slate-500 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ACCOUNT */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-[#0A4DA3]" />
                <span>{showAddModal ? "إضافة حساب جديد إلى الدليل" : "تعديل بيانات الحساب"}</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={showAddModal ? handleCreate : handleUpdate} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    كود الحساب (Account Code) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="مثال: 1211"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold focus:outline-none focus:border-[#0A4DA3]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    نوع الحساب (Account Type) *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const t = e.target.value as AccountType;
                      setFormData({
                        ...formData,
                        type: t,
                        normalBalance: ["Asset", "Expense"].includes(t) ? "Debit" : "Credit",
                      });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none"
                  >
                    <option value="Asset">الأصول (Assets)</option>
                    <option value="Liability">الالتزامات (Liabilities)</option>
                    <option value="Equity">حقوق الملكية (Equity)</option>
                    <option value="Revenue">الإيرادات (Revenue)</option>
                    <option value="Expense">المصروفات (Expenses)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  اسم الحساب باللغة العربية *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value, name: e.target.value })}
                  placeholder="مثال: النقدية بالصندوق والخزينة العامة"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A4DA3]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  اسم الحساب باللغة الإنجليزية (English Name)
                </label>
                <input
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Cash on Hand and Petty Cash"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-[#0A4DA3]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    الحساب الأب / الرئيسي (Parent Account)
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => {
                      const pId = e.target.value;
                      const parent = accounts.find((a) => a.id === pId);
                      setFormData({
                        ...formData,
                        parentId: pId,
                        level: parent ? (parent.level || 1) + 1 : 1,
                        type: parent ? parent.type : formData.type,
                      });
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="">-- بدون أب (حساب جذر/رئيسي مستوى 1) --</option>
                    {accounts
                      .filter((a) => !editingAccount || a.id !== editingAccount.id)
                      .map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.code} - {a.nameAr || a.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    طبيعة الحساب (Normal Balance)
                  </label>
                  <select
                    value={formData.normalBalance}
                    onChange={(e) => setFormData({ ...formData, normalBalance: e.target.value as NormalBalance })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none"
                  >
                    <option value="Debit">مدين (Debit)</option>
                    <option value="Credit">دائن (Credit)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    المستوى (Level)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    العملة (Currency)
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none"
                  >
                    <option value="EGP">EGP (جنيه مصري)</option>
                    <option value="USD">USD (دولار أمريكي)</option>
                    <option value="EUR">EUR (يورو)</option>
                    <option value="SAR">SAR (ريال سعودي)</option>
                    <option value="AED">AED (درهم إماراتي)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    حالة الحساب
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none"
                  >
                    <option value="Active">نشط (Active)</option>
                    <option value="Inactive">معطل (Inactive)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isHeaderCheck"
                  checked={formData.isHeader}
                  onChange={(e) => setFormData({ ...formData, isHeader: e.target.checked })}
                  className="rounded text-[#0A4DA3]"
                />
                <label htmlFor="isHeaderCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  حساب رئيسي فقط (Header - لا يقبل قيود مباشرة وإنما تجميعي)
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  ملاحظات وتفاصيل إضافية
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="وصف تفصيلي للغرض المحاسبي للحساب..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A4DA3]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {actionLoading ? "جاري الحفظ..." : showAddModal ? "إضافة الحساب" : "حفظ التعديلات"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MOVE ACCOUNT */}
      {showMoveModal && movingAccount && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <Move className="w-5 h-5 text-amber-600" />
                <span>نقل الحساب في شجرة الحسابات</span>
              </h3>
              <button onClick={() => setShowMoveModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              أنت بصدد نقل الحساب:{" "}
              <strong className="text-slate-900 font-bold">
                [{movingAccount.code}] {movingAccount.nameAr || movingAccount.name}
              </strong>
            </p>

            <form onSubmit={handleMove} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  اختر الحساب الأب الجديد (New Parent)
                </label>
                <select
                  value={newParentId}
                  onChange={(e) => setNewParentId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="">-- نقله ليكون حساباً رئيسياً بدون أب (مستوى 1) --</option>
                  {accounts
                    .filter((a) => a.id !== movingAccount.id && a.parentId !== movingAccount.id)
                    .map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.code} - {a.nameAr || a.name} (مستوى {a.level})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMoveModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {actionLoading ? "جاري النقل..." : "تأكيد نقل الحساب"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT ACCOUNTS */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
                <FileUp className="w-5 h-5 text-[#0A4DA3]" />
                <span>استيراد دليل الحسابات (Import COA)</span>
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              يمكنك لصق بيانات الحسابات بصيغة JSON أو كصفوف CSV بالشكل:
              <br />
              <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-[11px] block mt-1">
                الكود, الاسم بالعربي, الاسم بالإنجليزي, النوع (Asset/Liability/Equity/Revenue/Expense), الطبيعة (Debit/Credit)
              </code>
            </p>

            <form onSubmit={handleImport} className="space-y-4 text-xs">
              <textarea
                rows={8}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder={`111, أراضي ومباني, Lands & Buildings, Asset, Debit\n112, آلات ومعدات, Machinery & Equipment, Asset, Debit\n211, رأس المال, Capital, Equity, Credit`}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#0A4DA3]"
              />

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {actionLoading ? "جاري الاستيراد..." : "بدء الاستيراد"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
