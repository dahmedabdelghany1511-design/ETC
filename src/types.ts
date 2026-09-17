export type UserRole = 
  | 'System Owner'
  | 'Super Administrator'
  | 'Financial Director (CFO)'
  | 'Financial Controller'
  | 'Senior Accountant'
  | 'Tax Consultant'
  | 'Internal Auditor'
  | 'External Auditor'
  | 'Financial Analyst'
  | 'Accountant'
  | 'Viewer';

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  role: UserRole | string;
  departmentId?: string;
  departmentName?: string;
  department?: string;
  companyIds: string[];
  currentCompanyId: string;
  isActive: boolean;
  isOwner?: boolean;
  isSuperAdmin: boolean;
  phone?: string;
  mobile?: string;
  jobTitle?: string;
  createdAt: string;
  lastLoginAt?: string;
  lastLogin?: string;
  loginCount?: number;
  lastActivity?: string;
  activeSessionsCount?: number;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  createdAt: string;
}

export interface CustomRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
}

export interface LoginRecord {
  id: string;
  userId: string;
  userName: string;
  username?: string;
  email: string;
  timestamp: string;
  date?: string;
  time?: string;
  ip: string;
  device: string;
  browser: string;
  location?: string;
  status: 'success' | 'failed' | 'disabled';
  result?: string;
}

export interface ActiveSession {
  id: string;
  userId: string;
  userName?: string;
  username?: string;
  role?: string;
  deviceId?: string;
  deviceType?: 'Desktop' | 'Mobile' | 'Tablet' | string;
  device?: string;
  browser: string;
  ip: string;
  loginTime?: string;
  lastActive: string;
  current?: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  username?: string;
  companyId?: string;
  module: string;
  action: string;
  details: string;
  date?: string;
  time?: string;
  timestamp: string;
  ip?: string;
  device?: string;
  browser?: string;
  result?: 'نجح' | 'فشل' | 'success' | 'failed';
}

export interface Company {
  id: string;
  name: string;
  legalName: string;
  taxRegistrationNumber: string; // رقم التسجيل الضريبي المصري
  commercialRegistrationNumber: string; // رقم السجل التجاري
  commercialRegistration?: string;
  commercialRegisterNumber?: string;
  commercialRegister?: string;
  activityType?: string;
  city?: string;
  country?: string;
  taxOffice: string; // مأمورية الضرائب
  currency: string;
  fiscalYearStart: string; // e.g. "01-01"
  fiscalYearEnd: string; // e.g. "12-31"
  address: string;
  phone: string;
  email: string;
  standard?: string;
  notes?: string;
  eInvoiceClientId?: string;
  createdAt: string;
}

export interface JournalLine {
  id?: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
export type NormalBalance = 'Debit' | 'Credit';

export interface Account {
  id: string;
  companyId: string;
  code: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  type: AccountType;
  normalBalance: NormalBalance;
  parentId?: string | null;
  level: number;
  currency?: string;
  isHeader: boolean;
  isActive: boolean;
  status?: 'Active' | 'Inactive';
  description?: string;
}

export interface LegalUpdate {
  id: string;
  title: string;
  category: string;
  subCategory?: string;
  publicationDate: string;
  effectiveDate: string;
  decisionNumber: string;
  referenceNumber: string;
  officialSource: string;
  officialLink: string;
  summary: string;
  fullDescription: string;
  accountingImpact?: string;
  taxImpact?: string;
  auditImpact?: string;
  riskImpact?: string;
  complianceRequirements?: string;
  lastUpdatedDate: string;
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
  costCenterId?: string;
  branchId?: string;
}

export interface JournalEntry {
  id: string;
  companyId: string;
  entryNumber: number;
  date: string;
  description: string;
  reference?: string;
  status: 'draft' | 'posted' | 'reviewed';
  lines: JournalEntryLine[];
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
  createdAt: string;
  postedAt?: string;
  reviewedBy?: string;
}

export interface RecurringEntry {
  id: string;
  companyId: string;
  title: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  startDate: string;
  endDate?: string;
  nextRunDate: string;
  lines: JournalEntryLine[];
  description: string;
  isActive: boolean;
}

export interface CostCenter {
  id: string;
  companyId: string;
  code: string;
  name: string;
  manager?: string;
}

export interface Branch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
}

export interface Customer {
  id: string;
  companyId: string;
  code: string;
  name: string;
  taxNumber?: string;
  commercialRecord?: string;
  phone: string;
  email?: string;
  address?: string;
  creditLimit: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  companyId: string;
  code: string;
  name: string;
  taxNumber?: string;
  commercialRecord?: string;
  phone: string;
  email?: string;
  address?: string;
  withholdingTaxRate: number; // 1% goods, 3% services, etc.
  createdAt: string;
}

export interface InventoryItem {
  id: string;
  companyId: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  quantityOnHand: number;
  reorderLevel: number;
}

export interface FixedAsset {
  id: string;
  companyId: string;
  assetCode: string;
  name: string;
  purchaseDate: string;
  purchaseCost: number;
  salvageValue: number;
  usefulLifeYears: number;
  depreciationMethod: 'Straight-Line' | 'Declining-Balance';
  accumulatedDepreciation: number;
  netBookValue: number;
  costCenterId?: string;
}

export interface Employee {
  id: string;
  companyId: string;
  employeeCode: string;
  name: string;
  nationalId: string;
  jobTitle: string;
  departmentId?: string;
  basicSalary: number;
  variableSalary: number;
  allowances: number;
  insuranceDeduction: number;
  hireDate: string;
  isActive: boolean;
}

export interface TreasuryAccount {
  id: string;
  companyId: string;
  name: string;
  type: 'Cash' | 'Bank';
  accountNumber?: string;
  bankName?: string;
  iban?: string;
  currency: string;
  glAccountId: string;
}

export interface BankReconciliation {
  id: string;
  companyId: string;
  bankAccountId: string;
  statementDate: string;
  statementBalance: number;
  bookBalance: number;
  outstandingChecks: { checkNumber: string; amount: number; payee: string }[];
  depositsInTransit: { date: string; amount: number; description: string }[];
  bankAdjustments: { description: string; amount: number; type: 'debit' | 'credit' }[];
  reconciledBalance: number;
  difference: number;
  isReconciled: boolean;
  notes?: string;
}

// Tax
export interface EInvoice {
  id: string;
  companyId: string;
  invoiceNumber: string;
  issueDate: string;
  dateTimeIssued?: string;
  receiverType: 'B2B' | 'B2C' | 'Foreign';
  receiverName: string;
  receiverTaxId?: string;
  receiverTaxNumber?: string;
  items: { description: string; quantity: number; unitPrice: number; vatAmount: number; total: number }[];
  subtotal: number;
  totalSales?: number;
  vatTotal: number;
  totalTax?: number;
  withholdingTaxTotal: number;
  grandTotal: number;
  netAmount?: number;
  status: 'valid' | 'submitted' | 'rejected';
  uuid: string;
}

export interface EReceipt {
  id: string;
  companyId: string;
  receiptNumber: string;
  dateTime: string;
  customerName?: string;
  totalAmount: number;
  vatAmount: number;
  paymentMethod: 'Cash' | 'Visa' | 'Transfer';
  status: 'valid' | 'submitted';
  receiptUuid: string;
}

export interface TaxReturnRecord {
  id: string;
  companyId: string;
  type: 'VAT_Form_10' | 'Corporate_Income_Tax' | 'Payroll_Tax' | 'Withholding_Form_41';
  period: string; // e.g. "2026-Q1" or "2026-03"
  grossRevenue: number;
  taxableAmount: number;
  taxDue: number;
  deductions: number;
  netTaxPayable: number;
  submissionDate?: string;
  status: 'draft' | 'filed' | 'reviewed';
}

// Audit
export interface AuditPlan {
  id: string;
  companyId: string;
  fiscalYear: string | number;
  title: string;
  auditScope?: string;
  scope?: string;
  leadAuditor?: string;
  team?: string[];
  startDate: string;
  endDate: string;
  materialityThreshold?: number;
  status: 'Planning' | 'Fieldwork' | 'Review' | 'Completed' | 'Draft';
  riskScore?: 'Low' | 'Medium' | 'High';
}

export interface AuditProgramItem {
  id: string;
  companyId: string;
  planId: string;
  area: 'Cash' | 'Revenue' | 'Purchases' | 'Payroll' | 'Fixed Assets' | 'Inventory' | 'Tax Compliance';
  procedure: string;
  auditor: string;
  status: 'Not Started' | 'In Progress' | 'Satisfactory' | 'Exceptions Noted';
  evidenceRef?: string;
  sampleSize: number;
  testedCount: number;
  notes?: string;
}

export interface AuditFinding {
  id: string;
  companyId: string;
  planId?: string;
  title: string;
  area?: string;
  category?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description?: string;
  condition?: string; // ما حدث بالفعل
  criteria?: string; // المعيار المحاسبي أو القانوني الواجب تطبيقه
  cause?: string; // السبب الجذري
  risk?: string;
  effect?: string; // الأثر المالي والرقابي
  recommendation: string; // التوصية
  managementResponse?: string;
  status: 'Open' | 'Under Review' | 'Resolved';
}

// Budget
export interface BudgetItem {
  id: string;
  companyId: string;
  year?: number;
  fiscalYear?: number | string;
  title?: string;
  quarter?: number;
  accountId: string;
  accountCode: string;
  accountName: string;
  costCenterId?: string;
  budgetedAmount: number;
  actualAmount?: number;
  variance?: number;
  variancePercentage?: number;
}

// Communication & Chat
export interface ChatMessage {
  id: string;
  companyId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId?: string; // empty for group
  channel: 'all-company' | 'finance-team' | 'direct';
  text?: string;
  content?: string;
  voiceAudioUrl?: string; // base64 audio
  audioUrl?: string;
  attachmentName?: string;
  attachmentData?: string; // base64 data
  timestamp?: string;
  createdAt?: string;
}

export interface Announcement {
  id: string;
  companyId: string;
  authorName: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  link?: string;
}

// Files
export interface UploadedFileRecord {
  id: string;
  companyId: string;
  uploadedBy: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileBase64?: string;
  uploadedAt: string;
  aiAnalysis?: any;
  analysisReport?: {
    summary: string;
    detectedErrors: string[];
    fraudIndicators: string[];
    taxRisks: string[];
    suggestedEntries: string[];
    confidence: string;
    dataSource: string;
    missingInfo?: string;
  };
}

// Academy
export interface AcademyCourse {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'مبتدئ' | 'متوسط' | 'متقدم' | 'خبير';
  category: 'Financial Accounting' | 'Cost Accounting' | 'Managerial Accounting' | 'Audit' | 'Tax' | 'Excel' | 'Power BI' | 'Financial Analysis';
  modules: {
    id: string;
    title: string;
    lessons: {
      id: string;
      title: string;
      duration: string;
      content: string;
      practicalCase?: string;
      quiz: {
        question: string;
        options: string[];
        correctIndex: number;
        explanation: string;
      }[];
    }[];
  }[];
}

export interface UserCertificate {
  id: string;
  userId: string;
  userName: string;
  studentName?: string;
  courseId: string;
  courseTitle: string;
  certificateNumber: string;
  gradePercentage: number;
  grade?: string | number;
  issueDate: string;
  issuedAt?: string;
}

export type AIMode = 
  | 'CFO'
  | 'Financial Controller'
  | 'Accountant'
  | 'Auditor'
  | 'Tax Consultant'
  | 'Financial Analyst'
  | 'Business Consultant'
  | 'Teacher'
  | 'Friend';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  mode?: AIMode;
  content: string;
  timestamp: string;
  metadata?: {
    dataSource?: string;
    confidenceLevel?: string;
    missingInformation?: string;
    recommendations?: string[];
  };
}
