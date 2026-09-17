import {
  User,
  Company,
  Account,
  JournalEntry,
  Customer,
  Vendor,
  InventoryItem,
  FixedAsset,
  Employee,
  BankReconciliation,
  EInvoice,
  EReceipt,
  TaxReturnRecord,
  AuditPlan,
  AuditProgramItem,
  AuditFinding,
  BudgetItem,
  ChatMessage,
  Announcement,
  AppNotification,
  UploadedFileRecord,
  UserCertificate,
  Department,
  CustomRole,
  LoginRecord,
  ActiveSession,
  AuditLog,
  LegalUpdate
} from "../types";

let currentCompanyId = localStorage.getItem("etc_company_id") || "comp_default_1";

export function setApiCompanyId(id: string) {
  currentCompanyId = id;
  localStorage.setItem("etc_company_id", id);
}

export function getApiCompanyId(): string {
  return currentCompanyId;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  headers.set("x-company-id", currentCompanyId);

  const token = localStorage.getItem("etc_auth_token");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: "فشل في تنفيذ الطلب" }));
    throw new Error(errorData.error || `خطأ ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Token & Storage
  getToken: (): string | null => localStorage.getItem("etc_auth_token"),
  setToken: (token: string) => localStorage.setItem("etc_auth_token", token),
  getActiveCompanyId: (): string => getApiCompanyId(),
  setActiveCompanyId: (id: string) => setApiCompanyId(id),

  // Auth & System Setup
  checkSetupStatus: () => request<{ needsSetup: boolean; usersCount: number; hasOwner: boolean }>("/api/auth/setup-status"),
  setupOwner: async (data: {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
    mobile?: string;
  }) => {
    const res = await request<{ success: boolean; user: User; token: string }>("/api/auth/setup-owner", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.token && res.user) {
      localStorage.setItem("etc_auth_token", res.token);
      localStorage.setItem("etc_current_user", JSON.stringify(res.user));
    }
    return res;
  },
  login: async (data: any) => {
    const res = await request<{ user: User; token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify(data) });
    localStorage.setItem("etc_auth_token", res.token);
    localStorage.setItem("etc_current_user", JSON.stringify(res.user));
    return res;
  },
  logout: async () => {
    try {
      await request<{ success: boolean }>("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    }
    localStorage.removeItem("etc_auth_token");
    localStorage.removeItem("etc_current_user");
  },
  register: (data: any) => request<{ user: User }>("/api/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getCurrentUser: () => request<User>("/api/auth/me"),
  forgotPassword: (email: string) => request<{ success: boolean; message: string }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (userId: string, newPassword: string) => request<{ success: boolean }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ userId, newPassword }) }),
  sendContact: (data: { name: string; email: string; phone?: string; message: string }) =>
    request<{ success: boolean; message: string }>("/api/contact", { method: "POST", body: JSON.stringify(data) }),

  // Companies
  getCompanies: () => request<Company[]>("/api/companies"),
  createCompany: (data: Partial<Company>) => request<Company>("/api/companies", { method: "POST", body: JSON.stringify(data) }),
  updateCompany: (id: string, data: any) => request<Company>(`/api/companies/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCompany: (id: string) => request<{ success: boolean }>(`/api/companies/${id}`, { method: "DELETE" }),

  // Users & Roles & Sessions
  getUsers: () => request<User[]>("/api/users"),
  createUser: (data: any) => request<User>("/api/users", { method: "POST", body: JSON.stringify(data) }),
  updateUser: (id: string, data: any) => request<User>(`/api/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteUser: (id: string) => request<{ success: boolean }>(`/api/users/${id}`, { method: "DELETE" }),
  toggleUserStatus: (id: string) => request<User>(`/api/users/${id}/toggle-status`, { method: "POST" }),
  resetUserPasswordManual: (id: string, newPassword: string) =>
    request<{ success: boolean; message: string }>(`/api/users/${id}/reset-password`, {
      method: "POST",
      body: JSON.stringify({ newPassword }),
    }),
  killUserSession: (userId: string) => request<{ success: boolean }>(`/api/users/${userId}/sessions`, { method: "DELETE" }),
  getRoles: () => request<CustomRole[]>("/api/roles"),
  getDepartments: () => request<Department[]>("/api/departments"),
  getLoginHistory: () => request<LoginRecord[]>("/api/login-history"),
  getActiveSessions: () => request<ActiveSession[]>("/api/active-sessions"),
  terminateSession: (id: string) => request<{ success: boolean }>(`/api/active-sessions/${id}`, { method: "DELETE" }),
  getAuditLogs: () => request<AuditLog[]>("/api/audit-logs"),

  // Accounting
  getAccounts: () => request<Account[]>("/api/accounts"),
  createAccount: (data: Partial<Account>) => request<Account>("/api/accounts", { method: "POST", body: JSON.stringify(data) }),
  updateAccount: (id: string, data: Partial<Account>) => request<Account>(`/api/accounts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteAccount: (id: string) => request<{ success: boolean; message: string }>(`/api/accounts/${id}`, { method: "DELETE" }),
  toggleAccountStatus: (id: string, status?: 'Active' | 'Inactive', isActive?: boolean) =>
    request<Account>(`/api/accounts/${id}/status`, { method: "PATCH", body: JSON.stringify({ status, isActive }) }),
  moveAccount: (id: string, newParentId: string | null) =>
    request<Account>(`/api/accounts/${id}/move`, { method: "PATCH", body: JSON.stringify({ newParentId }) }),
  importAccounts: (accounts: Partial<Account>[]) =>
    request<{ success: boolean; count: number }>("/api/accounts/import", { method: "POST", body: JSON.stringify({ accounts }) }),
  seedStandardCOA: (clearExisting = false) => request<{ success: boolean; count: number }>("/api/accounts/seed-standard", { method: "POST", body: JSON.stringify({ clearExisting }) }),
  getJournalEntries: () => request<JournalEntry[]>("/api/journal-entries"),
  createJournalEntry: (data: any) => request<JournalEntry>("/api/journal-entries", { method: "POST", body: JSON.stringify(data) }),
  getTrialBalance: () => request<{ accounts: any[]; totalDebits: number; totalCredits: number; closingDebits: number; closingCredits: number; isBalanced: boolean }>("/api/accounting/trial-balance"),
  getFinancialStatements: () => request<{ incomeStatement: any; balanceSheet: any }>("/api/accounting/financial-statements"),

  // Legal & Regulatory Updates Center (مركز القوانين والتشريعات)
  getLegalUpdates: () => request<LegalUpdate[]>("/api/legal-updates"),
  getLegalUpdateById: (id: string) => request<LegalUpdate>(`/api/legal-updates/${id}`),
  checkOfficialLegalUpdates: () =>
    request<{ success: boolean; lastSync: string; message: string; totalOfficialRecords: number }>("/api/legal-updates/check-updates", { method: "POST" }),
  analyzeLegalUpdateAI: (data: { title: string; summary: string; fullDescription: string }) =>
    request<{ analysis: string }>("/api/legal-updates/ai-analyze", { method: "POST", body: JSON.stringify(data) }),

  // Entities
  getCustomers: () => request<Customer[]>("/api/customers"),
  createCustomer: (data: any) => request<Customer>("/api/customers", { method: "POST", body: JSON.stringify(data) }),
  getVendors: () => request<Vendor[]>("/api/vendors"),
  createVendor: (data: any) => request<Vendor>("/api/vendors", { method: "POST", body: JSON.stringify(data) }),
  getInventory: () => request<InventoryItem[]>("/api/inventory"),
  createInventoryItem: (data: any) => request<InventoryItem>("/api/inventory", { method: "POST", body: JSON.stringify(data) }),
  getFixedAssets: () => request<FixedAsset[]>("/api/fixed-assets"),
  createFixedAsset: (data: any) => request<FixedAsset>("/api/fixed-assets", { method: "POST", body: JSON.stringify(data) }),
  getEmployees: () => request<Employee[]>("/api/employees"),
  createEmployee: (data: any) => request<Employee>("/api/employees", { method: "POST", body: JSON.stringify(data) }),
  getBankReconciliations: () => request<BankReconciliation[]>("/api/bank-reconciliations"),
  createBankReconciliation: (data: any) => request<BankReconciliation>("/api/bank-reconciliations", { method: "POST", body: JSON.stringify(data) }),
  getCostCenters: () => request<any[]>("/api/cost-centers"),
  createCostCenter: (data: any) => request<any>("/api/cost-centers", { method: "POST", body: JSON.stringify(data) }),
  getBranches: () => request<any[]>("/api/branches"),
  createBranch: (data: any) => request<any>("/api/branches", { method: "POST", body: JSON.stringify(data) }),

  // Tax
  getEInvoices: () => request<EInvoice[]>("/api/tax/e-invoices"),
  createEInvoice: (data: any) => request<EInvoice>("/api/tax/e-invoices", { method: "POST", body: JSON.stringify(data) }),
  getEReceipts: () => request<EReceipt[]>("/api/tax/e-receipts"),
  createEReceipt: (data: any) => request<EReceipt>("/api/tax/e-receipts", { method: "POST", body: JSON.stringify(data) }),
  getTaxReturns: () => request<TaxReturnRecord[]>("/api/tax/returns"),
  createTaxReturn: (data: any) => request<TaxReturnRecord>("/api/tax/returns", { method: "POST", body: JSON.stringify(data) }),

  // Audit
  getAuditPlans: () => request<AuditPlan[]>("/api/audit/plans"),
  createAuditPlan: (data: any) => request<AuditPlan>("/api/audit/plans", { method: "POST", body: JSON.stringify(data) }),
  getAuditPrograms: () => request<AuditProgramItem[]>("/api/audit/programs"),
  createAuditProgram: (data: any) => request<AuditProgramItem>("/api/audit/programs", { method: "POST", body: JSON.stringify(data) }),
  getAuditFindings: () => request<AuditFinding[]>("/api/audit/findings"),
  createAuditFinding: (data: any) => request<AuditFinding>("/api/audit/findings", { method: "POST", body: JSON.stringify(data) }),

  // Budgets
  getBudgets: () => request<BudgetItem[]>("/api/budgets"),
  createBudget: (data: any) => request<BudgetItem>("/api/budgets", { method: "POST", body: JSON.stringify(data) }),

  // Files
  getFiles: () => request<UploadedFileRecord[]>("/api/files"),
  uploadAndAnalyzeFile: (data: any) => request<UploadedFileRecord>("/api/files/upload-and-analyze", { method: "POST", body: JSON.stringify(data) }),

  // Communications
  getMessages: () => request<ChatMessage[]>("/api/communications/messages"),
  sendMessage: (data: any) => request<ChatMessage>("/api/communications/messages", { method: "POST", body: JSON.stringify(data) }),
  getAnnouncements: () => request<Announcement[]>("/api/communications/announcements"),
  createAnnouncement: (data: any) => request<Announcement>("/api/communications/announcements", { method: "POST", body: JSON.stringify(data) }),
  getNotifications: () => request<AppNotification[]>("/api/notifications"),

  // AI & Voice Mentor
  sendAIChat: (data: { message: string; mode: string; history: any[] }) =>
    request<{ reply: string }>("/api/ai/chat", { method: "POST", body: JSON.stringify(data) }),
  sendVoiceMentor: (data: { userSpeech: string; topic?: string; level?: string }) =>
    request<{ text: string }>("/api/ai/voice-mentor", { method: "POST", body: JSON.stringify(data) }),

  // Academy
  getCertificates: () => request<UserCertificate[]>("/api/academy/certificates"),
  issueCertificate: (data: any) => request<UserCertificate>("/api/academy/issue-certificate", { method: "POST", body: JSON.stringify(data) }),

  // Backups
  getBackup: () => request<any>("/api/backup/export"),
  exportBackup: () => (window.location.href = "/api/backup/export"),
  restoreBackup: (data: any) => request<{ success: boolean; message: string }>("/api/backup/restore", { method: "POST", body: JSON.stringify(data) }),
};
