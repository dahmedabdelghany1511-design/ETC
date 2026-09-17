import React, { useState, useEffect } from "react";
import { User, LoginRecord, ActiveSession, AuditLog } from "../types";
import { api } from "../services/api";
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  Search,
  Edit3,
  Trash2,
  Power,
  RefreshCw,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  Calendar,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Filter,
  X,
  Save,
  UserCheck,
  UserX,
  Activity,
  History,
  Info,
  Check,
} from "lucide-react";
import { formatDateTime } from "../utils/formatters";

interface UsersPageProps {
  currentUser?: User | null;
}

export const UsersPage: React.FC<UsersPageProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<"users" | "sessions" | "login_history" | "audit_logs">("users");

  // Users Data
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "active" | "disabled">("all");

  // Sessions & Logs Data
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loginHistory, setLoginHistory] = useState<LoginRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [logSearch, setLogSearch] = useState("");

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [newManualPassword, setNewManualPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // User Form State (Strict manual entry - no auto generation)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "Senior Accountant",
    department: "الإدارة المالية والمحاسبة",
    jobTitle: "محاسب مالي",
    mobile: "",
    isActive: true,
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Notification / Alert
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (activeTab === "sessions") loadSessions();
    if (activeTab === "login_history") loadHistory();
    if (activeTab === "audit_logs") loadAudit();
  }, [activeTab]);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await api.getUsers();
      setUsers(res);
    } catch (err: any) {
      console.error("Failed to load users:", err);
      showFeedback("error", err.message || "فشل تحميل قائمة المستخدمين.");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadSessions = async () => {
    setLoadingSessions(true);
    try {
      const res = await api.getActiveSessions();
      setSessions(res);
    } catch (err: any) {
      console.error("Failed to load sessions:", err);
    } finally {
      setLoadingSessions(false);
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await api.getLoginHistory();
      setLoginHistory(res);
    } catch (err: any) {
      console.error("Failed to load login history:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const loadAudit = async () => {
    setLoadingAudit(true);
    try {
      const res = await api.getAuditLogs();
      setAuditLogs(res);
    } catch (err: any) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoadingAudit(false);
    }
  };

  const resetUserForm = () => {
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      role: "Senior Accountant",
      department: "الإدارة المالية والمحاسبة",
      jobTitle: "محاسب مالي",
      mobile: "",
      isActive: true,
    });
    setEditingUser(null);
    setFormError("");
  };

  const openAddModal = () => {
    resetUserForm();
    setShowAddModal(true);
  };

  const openEditModal = (u: User) => {
    setEditingUser(u);
    setFormData({
      name: u.name,
      username: (u as any).username || "",
      email: u.email,
      password: "",
      role: u.role,
      department: (u as any).department || u.departmentName || "الإدارة المالية والمحاسبة",
      jobTitle: u.jobTitle || "محاسب مالي",
      mobile: (u as any).mobile || u.phone || "",
      isActive: u.isActive,
    });
    setFormError("");
    setShowAddModal(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError("الرجاء إدخال الاسم والبريد الإلكتروني.");
      return;
    }

    if (!editingUser) {
      if (!formData.username.trim() || !formData.password) {
        setFormError("الرجاء إدخال اسم المستخدم وكلمة المرور يدوياً.");
        return;
      }
      if (formData.password.length < 6) {
        setFormError("يجب ألا تقل كلمة المرور عن 6 خانات.");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (editingUser) {
        const updatePayload: any = {
          name: formData.name.trim(),
          email: formData.email.trim(),
          role: formData.role,
          department: formData.department.trim(),
          jobTitle: formData.jobTitle.trim(),
          mobile: formData.mobile.trim(),
          phone: formData.mobile.trim(),
          isActive: formData.isActive,
        };
        if (formData.username.trim() && !isOwner(editingUser)) {
          updatePayload.username = formData.username.trim();
        }
        if (formData.password) {
          updatePayload.password = formData.password;
        }
        await api.updateUser(editingUser.id, updatePayload);
        showFeedback("success", `تم تحديث بيانات المستخدم "${formData.name}" بنجاح.`);
      } else {
        await api.createUser({
          name: formData.name.trim(),
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          department: formData.department.trim(),
          jobTitle: formData.jobTitle.trim(),
          mobile: formData.mobile.trim(),
          phone: formData.mobile.trim(),
        });
        showFeedback("success", `تم إنشاء المستخدم "${formData.name}" يدوياً بنجاح.`);
      }
      setShowAddModal(false);
      resetUserForm();
      loadUsers();
    } catch (err: any) {
      setFormError(err.message || "فشلت العملية. يرجى مراجعة البيانات المدخلة.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    if (isOwner(user)) {
      showFeedback("error", "لا يمكن إيقاف حساب مالك النظام (System Owner).");
      return;
    }
    try {
      const res = await api.toggleUserStatus(user.id);
      showFeedback("success", res.isActive ? `تم تفعيل حساب ${user.name}` : `تم إيقاف حساب ${user.name}`);
      loadUsers();
    } catch (err: any) {
      showFeedback("error", err.message || "فشل تغيير حالة المستخدم.");
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingUser) return;
    if (!newManualPassword || newManualPassword.length < 6) {
      showFeedback("error", "يجب ألا تقل كلمة المرور الجديدة عن 6 خانات.");
      return;
    }
    try {
      await api.resetUserPasswordManual(resettingUser.id, newManualPassword);
      showFeedback("success", `تم تعيين كلمة المرور الجديدة للمستخدم "${resettingUser.name}" بنجاح.`);
      setResettingUser(null);
      setNewManualPassword("");
    } catch (err: any) {
      showFeedback("error", err.message || "فشل إعادة تعيين كلمة المرور.");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (isOwner(user)) {
      showFeedback("error", "لا يمكن حذف حساب مالك النظام (System Owner).");
      return;
    }
    if (currentUser && currentUser.id === user.id) {
      showFeedback("error", "لا يمكنك حذف الحساب النشط الحالي الذي قمت بتسجيل الدخول به.");
      return;
    }
    if (!window.confirm(`هل أنت متأكد من حذف المستخدم "${user.name}" نهائياً من النظام؟`)) {
      return;
    }
    try {
      await api.deleteUser(user.id);
      showFeedback("success", `تم حذف المستخدم "${user.name}" نهائياً.`);
      loadUsers();
    } catch (err: any) {
      showFeedback("error", err.message || "فشل حذف المستخدم.");
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    try {
      await api.terminateSession(sessionId);
      showFeedback("success", "تم إنهاء الجلسة فورياً بنجاح.");
      loadSessions();
    } catch (err: any) {
      showFeedback("error", err.message || "فشل إنهاء الجلسة.");
    }
  };

  const isOwner = (u: User) => {
    return (u as any).isOwner || u.role === "System Owner" || u.id === "usr_owner";
  };

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      ((u as any).username || "").toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.departmentName || "").toLowerCase().includes(userSearch.toLowerCase());

    const matchStatus =
      userStatusFilter === "all" ? true : userStatusFilter === "active" ? u.isActive : !u.isActive;

    return matchSearch && matchStatus;
  });

  const filteredAudit = auditLogs.filter((log) => {
    if (!logSearch.trim()) return true;
    const term = logSearch.toLowerCase();
    return (
      log.userName.toLowerCase().includes(term) ||
      log.module.toLowerCase().includes(term) ||
      log.action.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      log.ip.toLowerCase().includes(term)
    );
  });

  return (
    <div dir="rtl" className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 text-right font-sans">
      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-lg transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-red-50 text-red-900 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0A4DA3]/10 text-[#0A4DA3] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                إدارة المستخدمين والصلاحيات والرقابة
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                التحكم المركزي في حسابات المستخدمين، مراقبة الجلسات المباشرة، وسجلات تتبع النشاط (Audit Logs)
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (activeTab === "users") loadUsers();
              else if (activeTab === "sessions") loadSessions();
              else if (activeTab === "login_history") loadHistory();
              else loadAudit();
            }}
            className="p-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl border border-slate-200 transition-colors shadow-xs"
            title="تحديث البيانات"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-[#0A4DA3] hover:bg-[#083a7a] active:scale-[0.99] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-900/10 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>➕ إضافة مستخدم جديد</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === "users"
              ? "border-[#0A4DA3] text-[#0A4DA3]"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>المستخدمون ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === "sessions"
              ? "border-[#0A4DA3] text-[#0A4DA3]"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>الجلسات النشطة ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("login_history")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === "login_history"
              ? "border-[#0A4DA3] text-[#0A4DA3]"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجل تسجيلات الدخول</span>
        </button>

        <button
          onClick={() => setActiveTab("audit_logs")}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
            activeTab === "audit_logs"
              ? "border-[#0A4DA3] text-[#0A4DA3]"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>سجل الرقابة وتتبع النشاط (Audit Logs)</span>
        </button>
      </div>

      {/* ================= TAB 1: USERS LIST ================= */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Filter / Search Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="البحث بالاسم، اسم المستخدم، البريد، أو الدور الوظيفي..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-semibold shrink-0">الحالة:</span>
              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 font-bold focus:outline-none focus:border-blue-500"
              >
                <option value="all">كافة الحالات</option>
                <option value="active">نشط فقط</option>
                <option value="disabled">موقوف فقط</option>
              </select>
            </div>
          </div>

          {/* Loading */}
          {loadingUsers ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-[#0A4DA3] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-700">جارٍ تحميل بيانات المستخدمين...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0A4DA3] flex items-center justify-center mx-auto shadow-inner">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {userSearch ? "لا توجد نتائج تطابق بحثك" : "لا يوجد مستخدمون حتى الآن"}
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {userSearch
                  ? "جرّب تغيير كلمات البحث أو مسح حقل البحث."
                  : "يبدأ النظام بحساب المالك فقط. يمكنك إضافة مستخدمين وتعيين صلاحياتهم يدوياً."}
              </p>
              <button
                onClick={openAddModal}
                className="px-5 py-2.5 bg-[#0A4DA3] hover:bg-[#083a7a] text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>➕ إضافة مستخدم</span>
              </button>
            </div>
          ) : (
            /* Users Table */
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right divide-y divide-slate-200">
                  <thead className="bg-slate-50/80 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">المستخدم</th>
                      <th className="py-3.5 px-4">اسم المستخدم</th>
                      <th className="py-3.5 px-4">البريد الإلكتروني</th>
                      <th className="py-3.5 px-4">الدور الوظيفي (RBAC)</th>
                      <th className="py-3.5 px-4">القسم</th>
                      <th className="py-3.5 px-4 text-center">الحالة</th>
                      <th className="py-3.5 px-4">آخر نشاط</th>
                      <th className="py-3.5 px-4 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => {
                      const ownerFlag = isOwner(u);
                      return (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                                  ownerFlag
                                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                                    : "bg-blue-50 text-[#0A4DA3]"
                                }`}
                              >
                                {ownerFlag ? "👑" : u.name.charAt(0)}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold">{u.name}</span>
                                  {ownerFlag && (
                                    <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300">
                                      Owner
                                    </span>
                                  )}
                                </div>
                                <span className="text-[11px] text-slate-400 block">{u.jobTitle || "موظف"}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-700 font-semibold">
                            {(u as any).username || "—"}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-600 text-[11px] dir-ltr text-right">
                            {u.email}
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                                ownerFlag
                                  ? "bg-amber-50 text-amber-900 border-amber-200"
                                  : u.role === "Super Administrator"
                                  ? "bg-purple-50 text-purple-900 border-purple-200"
                                  : "bg-blue-50 text-blue-900 border-blue-200"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-600">
                            {(u as any).department || u.departmentName || "الإدارة"}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                u.isActive
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-rose-50 text-rose-700 border-rose-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  u.isActive ? "bg-emerald-500" : "bg-rose-500"
                                }`}
                              />
                              <span>{u.isActive ? "نشط" : "موقوف"}</span>
                            </span>
                          </td>

                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {u.lastLoginAt ? (
                              <div>
                                <span>{new Date(u.lastLoginAt).toLocaleDateString("ar-EG")}</span>
                                <span className="block text-[10px] text-slate-400">
                                  {new Date(u.lastLoginAt).toLocaleTimeString("ar-EG")}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-400 italic">لم يسجل بعد</span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {/* Edit */}
                              <button
                                onClick={() => openEditModal(u)}
                                className="p-1.5 text-slate-600 hover:text-[#0A4DA3] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="تعديل المستخدم"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              {/* Reset Password */}
                              <button
                                onClick={() => {
                                  setResettingUser(u);
                                  setNewManualPassword("");
                                }}
                                className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                                title="إعادة تعيين كلمة المرور يدوياً"
                              >
                                <KeyRound className="w-4 h-4" />
                              </button>

                              {/* Toggle Active / Disabled */}
                              {!ownerFlag && (
                                <button
                                  onClick={() => handleToggleStatus(u)}
                                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                    u.isActive
                                      ? "text-slate-600 hover:text-rose-600 hover:bg-rose-50"
                                      : "text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                                  }`}
                                  title={u.isActive ? "إيقاف الحساب" : "تفعيل الحساب"}
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                              )}

                              {/* Delete (Never for Owner) */}
                              {!ownerFlag && (
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                  title="حذف المستخدم نهائياً"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: ACTIVE SESSIONS ================= */}
      {activeTab === "sessions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#0A4DA3]" />
              <span>الجلسات المفتوحة حالياً في النظام في الوقت الفعلي</span>
            </div>
            <button
              onClick={loadSessions}
              className="text-xs text-[#0A4DA3] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحديث الجلسات</span>
            </button>
          </div>

          {loadingSessions ? (
            <div className="bg-white rounded-2xl p-8 text-center">
              <RefreshCw className="w-6 h-6 text-[#0A4DA3] animate-spin mx-auto" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-2">
              <Laptop className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-700">لا توجد جلسات نشطة مسجلة</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 relative"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0A4DA3] flex items-center justify-center">
                        {sess.device?.includes("Mobile") ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Laptop className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{sess.userName || "مستخدم"}</div>
                        <div className="text-[10px] text-slate-400 font-mono">@{sess.username || sess.userId}</div>
                      </div>
                    </div>
                    {sess.current ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        جلستك الحالية
                      </span>
                    ) : (
                      <button
                        onClick={() => handleTerminateSession(sess.id)}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[10px] font-bold border border-red-200 transition-colors cursor-pointer"
                      >
                        إنهاء الجلسة
                      </button>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">الجهاز:</span>
                      <span className="font-semibold">{sess.device || "Desktop"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">المتصفح:</span>
                      <span className="font-semibold">{sess.browser || "Browser"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">عنوان IP:</span>
                      <span className="font-mono text-[10px]">{sess.ip}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">بدء الجلسة:</span>
                      <span className="font-mono text-[10px]">
                        {sess.loginTime ? new Date(sess.loginTime).toLocaleTimeString("ar-EG") : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: LOGIN HISTORY ================= */}
      {activeTab === "login_history" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <History className="w-4 h-4 text-[#0A4DA3]" />
                <span>سجل محاولات وتسجيلات الدخول للنظام</span>
              </h3>
              <button
                onClick={loadHistory}
                className="text-xs text-[#0A4DA3] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>تحديث</span>
              </button>
            </div>

            {loadingHistory ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-6 h-6 text-[#0A4DA3] animate-spin mx-auto" />
              </div>
            ) : loginHistory.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs">لا توجد سجلات دخول حتى الآن.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3 px-4">المستخدم</th>
                      <th className="py-3 px-4">التاريخ والوقت</th>
                      <th className="py-3 px-4">عنوان IP</th>
                      <th className="py-3 px-4">الجهاز</th>
                      <th className="py-3 px-4">المتصفح</th>
                      <th className="py-3 px-4 text-center">الحالة / النتيجة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loginHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-bold text-slate-800">
                          <div>
                            <span>{item.userName || item.username || "غير معروف"}</span>
                            <span className="block text-[10px] text-slate-400 font-mono">
                              {item.email || item.username}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600 text-[11px]">
                          {formatDateTime(item.timestamp)}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-600 text-[11px]">{item.ip}</td>
                        <td className="py-2.5 px-4 text-slate-600">{item.device}</td>
                        <td className="py-2.5 px-4 text-slate-600">{item.browser}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              item.status === "success"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : item.status === "disabled"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : "bg-red-50 text-red-800 border-red-200"
                            }`}
                          >
                            {item.status === "success"
                              ? "نجح"
                              : item.status === "disabled"
                              ? "حساب موقوف"
                              : "فشل الاعتماد"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 4: AUDIT LOGS ================= */}
      {activeTab === "audit_logs" && (
        <div className="space-y-4">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="البحث في تفاصيل النشاط الرقابي، الوحدة، الإجراء، المستخدم، أو عنوان IP..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-right"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
            <button
              onClick={loadAudit}
              className="text-xs text-[#0A4DA3] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحديث السجل</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            {loadingAudit ? (
              <div className="p-8 text-center">
                <RefreshCw className="w-6 h-6 text-[#0A4DA3] animate-spin mx-auto" />
              </div>
            ) : filteredAudit.length === 0 ? (
              <div className="p-10 text-center text-slate-500 text-xs">لا توجد سجلات رقابية مطابقة.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3 px-4">المستخدم</th>
                      <th className="py-3 px-4">الوحدة (Module)</th>
                      <th className="py-3 px-4">الإجراء (Action)</th>
                      <th className="py-3 px-4">تفاصيل العملية</th>
                      <th className="py-3 px-4">التاريخ والوقت</th>
                      <th className="py-3 px-4">IP والجهاز</th>
                      <th className="py-3 px-4 text-center">النتيجة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAudit.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-4 font-bold text-slate-800">{log.userName}</td>
                        <td className="py-2.5 px-4">
                          <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {log.module}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-blue-800">{log.action}</td>
                        <td className="py-2.5 px-4 text-slate-700 leading-relaxed max-w-sm">{log.details}</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {log.date || (log.timestamp ? new Date(log.timestamp).toLocaleDateString("ar-EG") : "—")}{" "}
                          {log.time || (log.timestamp ? new Date(log.timestamp).toLocaleTimeString("ar-EG") : "")}
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          <div>{log.ip}</div>
                          {log.device && <div className="text-[10px] text-slate-400">{log.device}</div>}
                        </td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              log.result === "فشل"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {log.result || "نجح"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD / EDIT USER ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#0A4DA3]" />
                <span>{editingUser ? "تعديل بيانات المستخدم" : "إضافة مستخدم جديد يدوياً"}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              {/* Full Name */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم الكامل (Full Name) *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: أحمد محمود"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                />
              </div>

              {/* Username & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم المستخدم (Username) *</label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingUser && isOwner(editingUser))}
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="مثال: ahmed_m"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-left font-mono disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">البريد الإلكتروني (Email) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ahmed@etc.corp"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-left font-mono"
                  />
                </div>
              </div>

              {/* Password (Required on create, optional on edit) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {editingUser ? "كلمة المرور (اتركها فارغة إذا لم ترغب في التغيير)" : "كلمة المرور يدويًا *"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required={!editingUser}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="أدخل كلمة مرور قوية (6 خانات فأكثر)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-left font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role & Department Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">الدور الوظيفي (Role) *</label>
                  <select
                    disabled={Boolean(editingUser && isOwner(editingUser))}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold disabled:opacity-50"
                  >
                    <option value="System Owner">مالك النظام (System Owner)</option>
                    <option value="Super Administrator">مسؤول عام للنظام (Super Admin)</option>
                    <option value="Financial Director (CFO)">مدير مالي (CFO)</option>
                    <option value="Senior Accountant">محاسب أول (Senior Accountant)</option>
                    <option value="Internal Auditor">مراجع داخلي (Internal Auditor)</option>
                    <option value="Tax Specialist">أخصائي ضرائب (Tax Specialist)</option>
                    <option value="Accountant">محاسب عام (Accountant)</option>
                    <option value="Data Entry">مدخل بيانات (Data Entry)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">القسم (Department)</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="الإدارة المالية"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-right"
                  />
                </div>
              </div>

              {/* Job Title & Mobile Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">المسمى الوظيفي</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="رئيس قسم الحسابات"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-right"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم الهاتف / الجوال</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="01xxxxxxxxx"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-left font-mono"
                  />
                </div>
              </div>

              {/* Active Toggle (Only for non-owner) */}
              {!(editingUser && isOwner(editingUser)) && (
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700 font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="w-4 h-4 text-[#0A4DA3] rounded border-slate-300 focus:ring-[#0A4DA3]"
                    />
                    <span>حساب نشط (يمكنه تسجيل الدخول واستخدام النظام)</span>
                  </label>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#0A4DA3] hover:bg-[#083a7a] text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{submitting ? "جاري الحفظ..." : editingUser ? "حفظ التعديلات" : "إنشاء المستخدم يدوياً"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: MANUAL PASSWORD RESET ================= */}
      {resettingUser && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-600" />
                <span>إعادة تعيين كلمة المرور يدوياً</span>
              </h3>
              <button
                onClick={() => setResettingUser(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 text-xs text-slate-600">
              أدخل كلمة المرور الجديدة للمستخدم:{" "}
              <strong className="text-slate-900">{resettingUser.name}</strong> (
              <span className="font-mono">{(resettingUser as any).username || resettingUser.email}</span>).
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">كلمة المرور الجديدة *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newManualPassword}
                    onChange={(e) => setNewManualPassword(e.target.value)}
                    placeholder="6 خانات على الأقل"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-left font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>تأكيد تغيير كلمة المرور</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
