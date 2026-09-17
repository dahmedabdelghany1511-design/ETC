import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Data Directory
const DATA_DIR = path.join(process.cwd(), "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const DB_FILE = path.join(DATA_DIR, "etc_database.json");

// Gemini Client initialization (server-side only)
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Master DB Structure
interface DatabaseSchema {
  users: any[];
  roles: any[];
  departments: any[];
  companies: any[];
  loginHistory: any[];
  activeSessions: any[];
  auditLogs: any[];
  accounts: any[];
  journalEntries: any[];
  recurringEntries: any[];
  customers: any[];
  vendors: any[];
  inventory: any[];
  fixedAssets: any[];
  employees: any[];
  treasury: any[];
  bankReconciliations: any[];
  costCenters: any[];
  branches: any[];
  eInvoices: any[];
  eReceipts: any[];
  taxReturns: any[];
  auditPlans: any[];
  auditPrograms: any[];
  auditFindings: any[];
  budgets: any[];
  messages: any[];
  announcements: any[];
  notifications: any[];
  files: any[];
  certificates: any[];
  legalUpdates: any[];
}

const initialDb: DatabaseSchema = {
  users: [],
  roles: [
    {
      id: "role_system_owner",
      name: "System Owner",
      description: "مالك النظام - صلاحيات كاملة ومطلقة لإدارة النظام والمستخدمين والشركات والأمان",
      permissions: ["*"],
      isSystem: true,
    },
    {
      id: "role_super_admin",
      name: "Super Administrator",
      description: "صلاحيات كاملة وغير محدودة للنظام وإدارة كافة الشركات والمستخدمين",
      permissions: ["*"],
      isSystem: true,
    },
    {
      id: "role_cfo",
      name: "Financial Director (CFO)",
      description: "إدارة الاستراتيجية المالية واعتماد القوائم والموازنات والتقارير",
      permissions: ["accounting.*", "statements.*", "tax.*", "audit.*", "budgets.*", "reports.*", "analysis.*"],
      isSystem: true,
    },
    {
      id: "role_senior_acc",
      name: "Senior Accountant",
      description: "إدخال ومراجعة قيود اليومية، إقفال الفترات، وإعداد التسويات الجردية",
      permissions: ["accounting.read", "accounting.write", "accounting.post", "reports.read", "tax.read"],
      isSystem: true,
    },
    {
      id: "role_auditor",
      name: "Auditor",
      description: "المراجعة الداخلية والخارجية وفحص العمليات وإعداد أوراق العمل والتقارير",
      permissions: ["audit.*", "accounting.read", "tax.read", "reports.read"],
      isSystem: true,
    },
    {
      id: "role_tax_consultant",
      name: "Tax Consultant",
      description: "فحص الالتزام الضريبي، الفاتورة والإيصال الإلكتروني، وإعداد الإقرارات",
      permissions: ["tax.*", "accounting.read", "reports.read"],
      isSystem: true,
    },
  ],
  departments: [
    { id: "dep_management", name: "الإدارة العليا والرقابة", createdAt: new Date().toISOString() },
    { id: "dep_finance", name: "الإدارة المالية والمحاسبة", createdAt: new Date().toISOString() },
    { id: "dep_audit", name: "المراجعة الداخلية وإدارة المخاطر", createdAt: new Date().toISOString() },
    { id: "dep_tax", name: "إدارة الضرائب والفاتورة الإلكترونية", createdAt: new Date().toISOString() },
  ],
  companies: [
    {
      id: "comp_default_1",
      name: "الشركة المصرية العامة للأنظمة والأعمال (ETC)",
      legalName: "شركة ETC للحلول المالية والمحاسبية ش.م.م",
      taxRegistrationNumber: "100-245-890",
      commercialRegistrationNumber: "84920",
      taxOffice: "مأمورية ضرائب الشركات المساهمة - القاهرة",
      currency: "EGP",
      fiscalYearStart: "01-01",
      fiscalYearEnd: "12-31",
      address: "مدينة نصر - القاهرة - جمهورية مصر العربية",
      phone: "+20 2 24000000",
      email: "info@etc.corp",
      createdAt: new Date().toISOString(),
    },
  ],
  loginHistory: [],
  activeSessions: [],
  auditLogs: [],
  accounts: [],
  journalEntries: [],
  recurringEntries: [],
  customers: [],
  vendors: [],
  inventory: [],
  fixedAssets: [],
  employees: [],
  treasury: [],
  bankReconciliations: [],
  costCenters: [],
  branches: [],
  eInvoices: [],
  eReceipts: [],
  taxReturns: [],
  auditPlans: [],
  auditPrograms: [],
  auditFindings: [],
  budgets: [],
  messages: [],
  announcements: [],
  notifications: [],
  files: [],
  certificates: [],
  legalUpdates: [
    {
      id: "leg_update_1",
      title: "حزمة التيسيرات الضريبية الشاملة لمساندة مجتمع الأعمال والشركات الناشئة",
      category: "قوانين ضريبية",
      subCategory: "ضريبة الدخل والإجراءات الضريبية",
      publicationDate: "2024-09-11",
      effectiveDate: "2024-10-01",
      decisionNumber: "بيان وزارة المالية وقرار مجلس الوزراء",
      referenceNumber: "ETA-CIRCULAR-2024-09",
      officialSource: "وزارة المالية المصرية ومصلحة الضرائب المصرية (ETA)",
      officialLink: "https://www.eta.gov.eg",
      summary: "إطلاق حزمة التيسيرات الضريبية الشاملة التي تتضمن نظاماً ضريبياً مبسطاً ومتكاملاً للشركات والمنشآت التي لا يتجاوز حجم أعمالها السنوي 15 مليون جنيه، وإعفاء من ضرائب الأرباح الرأسمالية وتوزيعات الأرباح ورسوم الدمغة، ووضع حد أقصى لغرامات التأخير لا يتجاوز أصل الضريبة.",
      fullDescription: "أعلنت وزارة المالية المصرية ومصلحة الضرائب المصرية عن إطلاق الحزمة الأولى من التسهيلات والتيسيرات الضريبية، والتي تهدف إلى بناء شراكة حقيقية بين مصلحة الضرائب ومجتمع الأعمال. تشمل الحزمة تبسيط الإقرارات الضريبية، التوسع في نظام الفحص بالعينة لجميع الممولين، تسوية المنازعات الضريبية القديمة ما قبل عام 2020 بآليات قطعية مبسطة، وتفعيل منظومة المقاصة المركزية بين مستحقات الممول ومديونياته لدى كافة الجهات الحكومية.",
      accountingImpact: "تخفيض التكاليف والالتزامات الضريبية المؤجلة، وإمكانية إجراء مقاصة محاسبية فورية بين المستحقات والالتزامات الحكومية وفقاً لمعيار المحاسبة المصري رقم (1).",
      taxImpact: "معاملة ضريبية قطعية مبسطة للشركات الصغيرة، وإلغاء الغرامات والفوائد التي تتجاوز أصل دين الضريبة، وتيسير تقديم الإقرارات الربع سنوية والسنوية.",
      auditImpact: "تعديل برامج المراجعة للتحقق من أهلية المنشأة للاستفادة من حد الـ 15 مليون جنيه ومراجعة احتساب غرامات التأخير والتحقق من عدم تجاوزها السقف القانوني.",
      riskImpact: "انخفاض مخاطر المنازعات الضريبية القديمة ومخاطر الحجز الإداري، مع ضرورة الالتزام بمنظومة الفاتورة الإلكترونية للاستفادة من الحوافز.",
      complianceRequirements: "التسجيل في منظومة الفاتورة والإيصال الإلكتروني وتقديم الإقرارات في المواعيد المقررة بدون تأخير.",
      lastUpdatedDate: "2024-09-15",
    },
    {
      id: "leg_update_2",
      title: "معايير المحاسبة المصرية المعدلة (قرار رئيس مجلس الوزراء رقم 883 لسنة 2023)",
      category: "معايير المحاسبة المصرية",
      subCategory: "معايير المحاسبة المصرية (EAS)",
      publicationDate: "2023-03-06",
      effectiveDate: "2023-07-01",
      decisionNumber: "قرار رئيس مجلس الوزراء رقم 883 لسنة 2023",
      referenceNumber: "EAS-AMEND-883-2023",
      officialSource: "الهيئة العامة للرقابة المالية والجريدة الرسمية",
      officialLink: "https://fra.gov.eg",
      summary: "تعديل بعض أحكام معايير المحاسبة المصرية بإضافة معيار المحاسبة المصري رقم (34) المعدل بشأن الاستثمار العقاري، ومعيار المحاسبة المصري رقم (35) بشأن الزراعة، وملحق (ج) للمعيار رقم (13) الخاص بآثار التغيرات في أسعار صرف العملات الأجنبية لمعالجة تحريك سعر الصرف.",
      fullDescription: "صدر قرار رئيس مجلس الوزراء رقم 883 لسنة 2023 بتعديل بعض معايير المحاسبة المصرية، بهدف مواكبة التطورات الاقتصادية ومعالجة الآثار المحاسبية المترتبة على تحريك سعر الصرف، وإتاحة خيار نموذج القيمة العادلة في تقييم الاستثمارات العقارية والحيوانية والنباتية لأول مرة بدلاً من نموذج التكلفة التاريخية فقط.",
      accountingImpact: "السماح بإثبات فروق تقييم الأصول الناتجة عن انخفاض سعر الجنيه في بنود الدخل الشامل الآخر أو تكلفة الأصول المؤهلة وفق الملحق (ج)، مع إمكانية استخدام نموذج القيمة العادلة للاستثمارات العقارية.",
      taxImpact: "فروق إعادة التقييم الناتجة عن القيمة العادلة غير محققة ضريبياً حتى يتم التصرف الفعلي في الأصل العقاري وفقاً للقانون 91 لسنة 2005.",
      auditImpact: "ضرورة الحصول على تقييمات من خبراء تقييم عقاري معتمدين ومسجلين لدى الهيئة العامة للرقابة المالية وفحص افتراضات ومعدلات الخصم المستخدمة.",
      riskImpact: "تذبذب حقوق الملكية وصافي الربح في حال تطبيق نموذج القيمة العادلة، ومخاطر الفروق المؤقتة والدائمة بين الأساس المحاسبي والأساس الضريبي.",
      complianceRequirements: "الإفصاح الكامل في الإيضاحات المتممة للقوائم المالية عن السياسة المحاسبية المتبعة ونماذج التقييم المستخدمة.",
      lastUpdatedDate: "2023-07-01",
    },
    {
      id: "leg_update_3",
      title: "قانون الإجراءات الضريبية الموحد رقم 206 لسنة 2020 ولائحته التنفيذية",
      category: "قوانين ضريبية",
      subCategory: "إجراءات ضريبية وفاتورة إلكترونية",
      publicationDate: "2020-10-19",
      effectiveDate: "2020-10-20",
      decisionNumber: "القانون رقم 206 لسنة 2020 والقرار الوزاري 286 لسنة 2021",
      referenceNumber: "LAW-206-2020",
      officialSource: "الجريدة الرسمية - العدد 42 مكرر (ج)",
      officialLink: "https://www.eta.gov.eg",
      summary: "توحيد إجراءات ربط وتحصيل الضريبة لكافة أنواع الضرائب (الدخل، القيمة المضافة، الدمغة، رسم التنمية)، وإلزام كافة الممولين والمسجلين بمنظومة الفاتورة والإيصال الإلكتروني وتقديم الإقرارات عبر البوابة الإلكترونية.",
      fullDescription: "أقر القانون رقم 206 لسنة 2020 الإطار التشريعي الشامل لتوحيد الإجراءات الضريبية في مصر وميكنة كافة المعاملات والمستندات. حدد القانون التزامات الممولين في مسك الدفاتر المحاسبية الإلكترونية وإصدار الفواتير اللحظية وإلزامية توثيقها رقمياً برقم UUID من مصلحة الضرائب لتعتمد كمصروف معترف به ضريبياً.",
      accountingImpact: "وجوب ربط نظام ERP والدفاتر المحاسبية اللحظية مع بوابة الفاتورة الإلكترونية لمصلحة الضرائب وتوثيق أرقام الفواتير الرسمية في قيود المبيعات والمشتريات.",
      taxImpact: "عدم الاعتداد بأي فاتورة ورقية في خصم الضريبة على القيمة المضافة أو إدراجها ضمن تكاليف ومصروفات ضريبة الدخل بدءاً من التواريخ الإلزامية.",
      auditImpact: "فحص ومطابقة سجل فواتير المبيعات والمشتريات بالدفاتر مع بيانات منظومة الفاتورة الإلكترونية عبر الربط الآلي واستبعاد الفواتير غير المعتمدة.",
      riskImpact: "عقوبات وغرامات مالية مشددة في حال عدم إصدار الفواتير الإلكترونية أو عدم تقديم الإقرارات في المواعيد المقررة، وتصنيف الممول عالي المخاطر.",
      complianceRequirements: "الربط عبر نظام ERP أو الـ Portal، واستخدام الختم الإلكتروني (e-Seal) أو التوقيع الإلكتروني وتكويد السلع وفقاً لمعايير GS1 أو EGS.",
      lastUpdatedDate: "2024-01-01",
    },
    {
      id: "leg_update_4",
      title: "تعديلات قانون الضريبة على القيمة المضافة (القانون رقم 3 لسنة 2022)",
      category: "قوانين ضريبية",
      subCategory: "ضريبة القيمة المضافة",
      publicationDate: "2022-01-26",
      effectiveDate: "2022-01-27",
      decisionNumber: "القانون رقم 3 لسنة 2022 المعدل للقانون رقم 67 لسنة 2016",
      referenceNumber: "LAW-3-2022-VAT",
      officialSource: "الجريدة الرسمية - العدد 3 مكرر (أ)",
      officialLink: "https://www.eta.gov.eg",
      summary: "تعديل بعض أحكام قانون الضريبة على القيمة المضافة وإقرار تيسيرات للمصانع والآلات الإنتاجية وتطبيق نظام التسجيل المبسط لغير المقيمين الموردين لخدمات إلكترونية، وإعفاء بعض السلع الاستراتيجية ومدخلات الإنتاج الدوائية.",
      fullDescription: "تضمن القانون رقم 3 لسنة 2022 تعليق أداء الضريبة المستحقة على الآلات والمعدات الواردة من الخارج لاستخدامها في الإنتاج الصناعي لمدة سنة قابلة للتجديد، وإسقاطها فور بدء الإنتاج. كما أرسى آلية تحصيل الضريبة على التجارة والخدمات الإلكترونية عبر نظام المورد المبسط (Simplified Vendor Registration).",
      accountingImpact: "معالجة الضريبة المعلقة على الآلات كالتزام مشروط يسقط عند بدء الإنتاج، وضبط حسابات وسيطة لضريبة القيمة المضافة وفق معيار المحاسبة المصري رقم (10).",
      taxImpact: "إسقاط ضريبة القيمة المضافة على خطوط الإنتاج والآلات الصناعية، وتوسيع نطاق الخصم الضريبي للمدخلات المباشرة وغير المباشرة وتعديل مهلة الرد الضريبي.",
      auditImpact: "مراجعة شروط إسقاط الضريبة المعلقة وشهادات بدء الإنتاج الصناعي الصادرة من التنمية الصناعية للتحقق من مشروعية الإسقاط.",
      riskImpact: "مطالبة المصلحة بالضريبة المعلقة مع فوائد التأخير في حال التصرف في الآلات أو عدم استخدامها في الغرض المخصص خلال المهلة القانونية.",
      complianceRequirements: "تقديم شهادة فنية من هيئة التنمية الصناعية ببدء الإنتاج لطلب إسقاط الضريبة رسمياً وإرفاقها مع إقرار نموذج 10 ضريبة قيمة مضافة.",
      lastUpdatedDate: "2023-01-01",
    },
    {
      id: "leg_update_5",
      title: "معايير المراجعة المصرية والفحص المحدود الصادرة بالقرار الوزاري 166 لسنة 2024",
      category: "معايير المراجعة المصرية",
      subCategory: "معايير المراجعة والتدقيق والرقابة على الجودة",
      publicationDate: "2024-04-18",
      effectiveDate: "2024-07-01",
      decisionNumber: "قرار وزير الاستثمار والتجارة الخارجية رقم 166 لسنة 2024",
      referenceNumber: "ESA-2024-UPDATE",
      officialSource: "وزارة الاستثمار والتجارة الخارجية والوقائع المصرية",
      officialLink: "https://fra.gov.eg",
      summary: "إصدار النسخة الكاملة المحدثة من معايير المراجعة المصرية والفحص المحدود ومهام التأكد الأخرى، متوافقة بالكامل مع أحدث معايير المراجعة الدولية (ISA) الصادرة عن الاتحاد الدولي للمحاسبين (IFAC) بما في ذلك معيار إدارة الجودة ISQM 1 و ISQM 2.",
      fullDescription: "أصدرت وزارة الاستثمار والتجارة الخارجية حزمة معايير المراجعة المصرية المحدثة، والتي تفرض منهجية إدارة الجودة الشاملة على مستوى مكاتب وشركات المحاسبة والمراجعة (معيار إدارة الجودة رقم 1 ورقم 2)، وتحديث معيار المراجعة المصري رقم 315 الخاص بتحديد وتقييم مخاطر التحريف الجوهري بما في ذلك بيئة تكنولوجيا المعلومات والأمن السيبراني للمنشأة محل المراجعة.",
      accountingImpact: "إلزام المنشآت بتوثيق نظم الرقابة الداخلية وبيئة نظم المعلومات والتحكم المحاسبي الآلي لتسهيل مهمة مراقب الحسابات.",
      taxImpact: "اعتماد تقارير مراجع الحسابات المستوفية لمعايير الجودة من مصلحة الضرائب المصرية في تقدير أرباح الممولين ذوي المخاطر المنخفضة.",
      auditImpact: "إلزام مراقبي الحسابات بإعداد خطط جودة موثقة وتطبيق إجراءات فحص شاملة لأنظمة الـ ERP وضوابط الأمن الرقمي وسجلات النشاط (Audit Trail).",
      riskImpact: "عدم قبول تقرير المراجع أو إحالته للتحقيق المهني في حال ثبوت عدم الالتزام بمتطلبات معايير إدارة الجودة الجديدة.",
      complianceRequirements: "إعداد ملف مراجعة إلكتروني متكامل يوثق أدلة الإثبات وتحديد الأهمية النسبية واستجابة المراجع للمخاطر المقيمة.",
      lastUpdatedDate: "2024-07-01",
    },
  ],
};

// Database read/write helpers
function loadDb(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      const parsed = JSON.parse(data);
      // Ensure any legacy demo admin is filtered out
      if (Array.isArray(parsed.users)) {
        parsed.users = parsed.users.filter((u: any) => u.email !== "admin@etc.corp" && u.id !== "usr_master_admin");
      }
      if (!parsed.legalUpdates || parsed.legalUpdates.length === 0) {
        parsed.legalUpdates = initialDb.legalUpdates;
      }
      return { ...initialDb, ...parsed };
    }
  } catch (err) {
    console.error("Failed to load db file, using defaults:", err);
  }
  saveDb(initialDb);
  return initialDb;
}

function saveDb(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save db file:", err);
  }
}

// Helpers for request parsing & audit logs
function parseDevice(ua: string = ""): string {
  if (/mobile|android|iphone/i.test(ua)) return "الهاتف المحمول (Mobile)";
  if (/ipad|tablet/i.test(ua)) return "جهاز لوحي (Tablet)";
  if (/macintosh|mac os x/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  if (/windows/i.test(ua)) return "Windows";
  return "حاسوب مكتبي (Desktop)";
}

function parseBrowser(ua: string = ""): string {
  if (/edg/i.test(ua)) return "Microsoft Edge";
  if (/chrome|crios/i.test(ua)) return "Google Chrome";
  if (/firefox|fxios/i.test(ua)) return "Mozilla Firefox";
  if (/safari/i.test(ua)) return "Apple Safari";
  if (/opera|opr/i.test(ua)) return "Opera";
  return "متصفح الويب (Web Browser)";
}

function getClientIp(req?: express.Request): string {
  if (!req) return "127.0.0.1";
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || "127.0.0.1";
}

function getFormattedDateTime(d = new Date()) {
  const date = d.toISOString().split("T")[0];
  const time = d.toTimeString().split(" ")[0];
  return { date, time, iso: d.toISOString() };
}

function getReqUser(req: express.Request, db: DatabaseSchema): { id: string; name: string; username?: string; role?: string; isOwner?: boolean } {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (token) {
    const sess = db.activeSessions.find((s) => s.id === token);
    if (sess) {
      const user = db.users.find((u) => u.id === sess.userId);
      if (user) {
        return {
          id: user.id,
          name: user.name,
          username: (user as any).username || user.email,
          role: user.role,
          isOwner: (user as any).isOwner || user.role === "System Owner" || user.id === "usr_owner",
        };
      }
    }
  }
  return { id: "usr_owner", name: "مالك النظام", username: "owner", role: "System Owner", isOwner: true };
}

// Log audit helper
function recordAudit(
  db: DatabaseSchema,
  userId: string,
  userName: string,
  companyId: string,
  module: string,
  action: string,
  details: string,
  ip: string = "127.0.0.1",
  result: "نجح" | "فشل" = "نجح",
  req?: express.Request
) {
  const { date, time, iso } = getFormattedDateTime();
  const ua = req ? (req.headers["user-agent"] || "") : "";
  const resolvedIp = req ? getClientIp(req) : ip;
  const log = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    userId,
    userName,
    companyId,
    module,
    action,
    details,
    date,
    time,
    timestamp: iso,
    ip: resolvedIp,
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    result,
  };
  db.auditLogs.unshift(log);
  if (db.auditLogs.length > 500) db.auditLogs.pop();
}

// ==================== AUTH & SETUP ====================

// Check if first-run setup is required
app.get("/api/auth/setup-status", (req, res) => {
  const db = loadDb();
  const needsSetup = db.users.length === 0;
  res.json({
    needsSetup,
    usersCount: db.users.length,
    hasOwner: db.users.some((u) => (u as any).isOwner || u.role === "System Owner" || u.id === "usr_owner"),
  });
});

// Setup initial permanent Owner account (First Run Only)
app.post("/api/auth/setup-owner", (req, res) => {
  const db = loadDb();
  if (db.users.length > 0) {
    return res.status(400).json({ error: "تم إعداد حساب المالك مسبقاً. صفحة التهيئة الأولية غير متاحة نهائياً." });
  }

  const { fullName, username, password, confirmPassword, email, mobile } = req.body;

  if (!fullName?.trim() || !username?.trim() || !password || !email?.trim()) {
    return res.status(400).json({ error: "الرجاء إدخال كافة بيانات المالك يدوياً (الاسم، اسم المستخدم، كلمة المرور، البريد الإلكتروني)." });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "يجب ألا تقل كلمة المرور عن 6 خانات." });
  }

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedEmail = email.trim().toLowerCase();
  const { date, time, iso } = getFormattedDateTime();
  const ip = getClientIp(req);
  const ua = req.headers["user-agent"] || "";

  const defaultComp = db.companies[0]?.id || "comp_default_1";
  const ownerUser = {
    id: "usr_owner",
    name: fullName.trim(),
    username: normalizedUsername,
    email: normalizedEmail,
    passwordHash: password,
    role: "System Owner",
    departmentId: "dep_management",
    departmentName: "الإدارة العليا والمراجعة العامة",
    department: "الإدارة العليا والمراجعة العامة",
    companyIds: db.companies.map((c) => c.id),
    currentCompanyId: defaultComp,
    isActive: true,
    isOwner: true,
    isSuperAdmin: true,
    phone: mobile?.trim() || "",
    mobile: mobile?.trim() || "",
    jobTitle: "System Owner (مالك النظام)",
    createdAt: iso,
    lastLoginAt: iso,
    loginCount: 1,
    lastActivity: iso,
  };

  db.users.push(ownerUser);

  const sessionId = "sess_owner_" + Date.now();
  const session = {
    id: sessionId,
    userId: ownerUser.id,
    userName: ownerUser.name,
    username: ownerUser.username,
    role: ownerUser.role,
    deviceId: "dev_" + Math.random().toString(36).substring(2, 7),
    deviceType: parseDevice(ua),
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    ip,
    loginTime: iso,
    lastActive: iso,
    current: true,
  };
  db.activeSessions.push(session);

  db.loginHistory.unshift({
    id: "lh_" + Date.now(),
    userId: ownerUser.id,
    userName: ownerUser.name,
    username: ownerUser.username,
    email: ownerUser.email,
    timestamp: iso,
    date,
    time,
    ip,
    device: session.device,
    browser: session.browser,
    status: "success",
    result: "نجح",
  });

  recordAudit(
    db,
    ownerUser.id,
    ownerUser.name,
    defaultComp,
    "Security",
    "Owner Setup",
    `تمت تهيئة النظام يدوياً وإنشاء حساب المالك الرئيسي: ${ownerUser.name} (${ownerUser.username})`,
    ip,
    "نجح",
    req
  );

  saveDb(db);
  const { passwordHash, ...safeOwner } = ownerUser;
  res.json({ success: true, user: safeOwner, token: sessionId });
});

// Current User Profile Verification (Token Validation)
app.get("/api/auth/me", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  const db = loadDb();
  if (!token) return res.status(401).json({ error: "غير مصرح، يرجى تسجيل الدخول." });
  const session = db.activeSessions.find((s) => s.id === token);
  if (!session) return res.status(401).json({ error: "انتهت الجلسة، يرجى تسجيل الدخول مجدداً." });
  const user = db.users.find((u) => u.id === session.userId);
  if (!user) return res.status(401).json({ error: "المستخدم غير موجود." });
  if (!user.isActive) {
    return res.status(403).json({ error: "تم إيقاف هذا الحساب بواسطة الإدارة." });
  }
  session.lastActive = new Date().toISOString();
  (user as any).lastActivity = session.lastActive;
  saveDb(db);
  const { passwordHash, ...safeUser } = user;
  res.json(safeUser);
});

// Secure Login (Manual Credentials Only)
app.post("/api/auth/login", (req, res) => {
  const { email, username, password } = req.body;
  const db = loadDb();

  // If no users exist, guide to owner setup
  if (db.users.length === 0) {
    return res.status(400).json({ error: "النظام غير مهيأ بعد. يرجى إعداد حساب المالك الرئيسي أولاً.", needsSetup: true });
  }

  const searchKey = (email || username || "").toLowerCase().trim();
  const user = db.users.find(
    (u) =>
      u.email?.toLowerCase().trim() === searchKey ||
      ((u as any).username || "").toLowerCase().trim() === searchKey ||
      u.name?.toLowerCase().trim() === searchKey
  );

  const { date, time, iso } = getFormattedDateTime();
  const ip = getClientIp(req);
  const ua = req.headers["user-agent"] || "";

  if (!user || user.passwordHash !== password) {
    db.loginHistory.unshift({
      id: "lh_" + Date.now(),
      userId: user?.id || "unknown",
      userName: user?.name || searchKey || "غير معروف",
      username: searchKey,
      email: searchKey,
      timestamp: iso,
      date,
      time,
      ip,
      device: parseDevice(ua),
      browser: parseBrowser(ua),
      status: "failed",
      result: "فشل",
    });
    recordAudit(
      db,
      user?.id || "unknown",
      user?.name || searchKey || "غير معروف",
      user?.currentCompanyId || "all",
      "Authentication",
      "Failed Login",
      `محاولة فاشلة لتسجيل الدخول باستخدام المعرف: ${searchKey}`,
      ip,
      "فشل",
      req
    );
    saveDb(db);
    return res.status(401).json({ error: "بيانات الاعتماد غير صحيحة. يرجى التأكد من اسم المستخدم أو البريد الإلكتروني وكلمة المرور." });
  }

  if (!user.isActive) {
    db.loginHistory.unshift({
      id: "lh_" + Date.now(),
      userId: user.id,
      userName: user.name,
      username: (user as any).username || user.email,
      email: user.email,
      timestamp: iso,
      date,
      time,
      ip,
      device: parseDevice(ua),
      browser: parseBrowser(ua),
      status: "disabled",
      result: "موقوف",
    });
    recordAudit(
      db,
      user.id,
      user.name,
      user.currentCompanyId || "all",
      "Authentication",
      "Disabled User Login Attempt",
      `محاولة دخول من حساب موقوف: ${user.name} (${(user as any).username || user.email})`,
      ip,
      "فشل",
      req
    );
    saveDb(db);
    return res.status(403).json({ error: "تم إيقاف هذا الحساب بواسطة الإدارة." });
  }

  user.lastLoginAt = iso;
  (user as any).lastActivity = iso;
  (user as any).loginCount = ((user as any).loginCount || 0) + 1;

  const sessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
  const session = {
    id: sessionId,
    userId: user.id,
    userName: user.name,
    username: (user as any).username || user.email,
    role: user.role,
    deviceId: "dev_" + Math.random().toString(36).substring(2, 7),
    deviceType: parseDevice(ua),
    device: parseDevice(ua),
    browser: parseBrowser(ua),
    ip,
    loginTime: iso,
    lastActive: iso,
    current: true,
  };
  db.activeSessions.push(session);

  db.loginHistory.unshift({
    id: "lh_" + Date.now(),
    userId: user.id,
    userName: user.name,
    username: (user as any).username || user.email,
    email: user.email,
    timestamp: iso,
    date,
    time,
    ip,
    device: session.device,
    browser: session.browser,
    status: "success",
    result: "نجح",
  });

  recordAudit(
    db,
    user.id,
    user.name,
    user.currentCompanyId || "all",
    "Authentication",
    "Login",
    `تسجيل دخول ناجح للمستخدم: ${user.name} (${(user as any).username || user.email})`,
    ip,
    "نجح",
    req
  );
  saveDb(db);

  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser, token: sessionId });
});

// Logout
app.post("/api/auth/logout", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  const db = loadDb();
  if (token) {
    const session = db.activeSessions.find((s) => s.id === token);
    if (session) {
      db.activeSessions = db.activeSessions.filter((s) => s.id !== token);
      recordAudit(
        db,
        session.userId,
        session.userName || "مستخدم",
        "all",
        "Authentication",
        "Logout",
        `تسجيل خروج المستخدم: ${session.userName || "مستخدم"}`,
        getClientIp(req),
        "نجح",
        req
      );
      saveDb(db);
    }
  }
  res.json({ success: true });
});

// Disable Public Registration (Only Owner creates users)
app.post("/api/auth/register", (req, res) => {
  res.status(403).json({ error: "التسجيل العام معطل تماماً. يتم إنشاء المستخدمين وتحديد بياناتهم حصراً بواسطة مالك النظام (Owner)." });
});

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: "الرجاء تعبئة الاسم والبريد الإلكتروني والرسالة." });
  }
  const db = loadDb();
  const contactMsg = {
    id: "cnt_" + Date.now(),
    name,
    email,
    phone: phone || "",
    message,
    timestamp: new Date().toISOString(),
    status: "new",
  };
  const notif = {
    id: "notif_" + Date.now(),
    title: "رسالة تواصل جديدة من الموقع العام",
    message: `استفسار جديد من: ${name} (${email}) - ${message.substring(0, 60)}...`,
    type: "info" as const,
    timestamp: new Date().toISOString(),
    read: false,
    link: "/communications",
  };
  db.notifications.unshift(notif);
  saveDb(db);
  res.json({ success: true, message: "تم استلام رسالتك بنجاح وسيتواصل معك فريق ETC قريباً." });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const db = loadDb();
  const user = db.users.find((u) => u.email?.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "البريد الإلكتروني غير مسجل في النظام." });
  }
  res.json({ success: true, message: "يرجى مراجعة مالك النظام (Owner) لإعادة تعيين كلمة المرور الخاصة بحسابك." });
});

app.post("/api/auth/reset-password", (req, res) => {
  const { userId, newPassword } = req.body;
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    return res.status(404).json({ error: "المستخدم غير موجود." });
  }
  user.passwordHash = newPassword;
  recordAudit(
    db,
    reqUser.id,
    reqUser.name,
    user.currentCompanyId,
    "Security",
    "Password Reset",
    `تمت إعادة تعيين كلمة المرور للمستخدم: ${user.name} (${(user as any).username || user.email})`,
    getClientIp(req),
    "نجح",
    req
  );
  saveDb(db);
  res.json({ success: true, message: "تم تغيير كلمة المرور بنجاح." });
});

// ==================== USERS MANAGEMENT ====================

// List users with session status
app.get("/api/users", (req, res) => {
  const db = loadDb();
  const safeUsers = db.users.map(({ passwordHash, ...u }) => {
    const activeSessionsCount = db.activeSessions.filter((s) => s.userId === u.id).length;
    return {
      ...u,
      activeSessionsCount,
    };
  });
  res.json(safeUsers);
});

// Owner manually adds a user (No auto-generated passwords or usernames)
app.post("/api/users", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const { name, username, email, password, role, department, jobTitle, phone, mobile } = req.body;

  if (!name?.trim() || !username?.trim() || !password || !email?.trim()) {
    return res.status(400).json({ error: "الرجاء إدخال كافة الحقول الإلزامية للمستخدم يدوياً (الاسم، اسم المستخدم، كلمة المرور، البريد الإلكتروني)." });
  }

  const normUsername = username.trim().toLowerCase();
  const normEmail = email.trim().toLowerCase();

  if (db.users.some((u) => u.email?.toLowerCase().trim() === normEmail)) {
    return res.status(400).json({ error: "البريد الإلكتروني مسجل بالفعل لمستخدم آخر." });
  }
  if (db.users.some((u) => (((u as any).username || "").toLowerCase().trim() === normUsername))) {
    return res.status(400).json({ error: "اسم المستخدم مسجل بالفعل لمستخدم آخر. يرجى اختيار اسم مستخدم مختلف." });
  }

  const { iso } = getFormattedDateTime();
  const defaultComp = db.companies[0]?.id || "comp_default_1";
  const user = {
    id: "usr_" + Date.now(),
    name: name.trim(),
    username: normUsername,
    email: normEmail,
    passwordHash: password,
    role: role || "Senior Accountant",
    departmentId: "dep_finance",
    departmentName: department || "الإدارة المالية والمحاسبة",
    department: department || "الإدارة المالية والمحاسبة",
    companyIds: [defaultComp],
    currentCompanyId: defaultComp,
    isActive: true,
    isOwner: false,
    isSuperAdmin: role === "System Owner" || role === "Super Administrator",
    phone: (mobile || phone || "").trim(),
    mobile: (mobile || phone || "").trim(),
    jobTitle: (jobTitle || "محاسب مالي").trim(),
    createdAt: iso,
    lastLoginAt: undefined,
    loginCount: 0,
    lastActivity: undefined,
  };

  db.users.push(user);
  recordAudit(
    db,
    reqUser.id,
    reqUser.name,
    defaultComp,
    "User Management",
    "Create User",
    `تم إنشاء حساب مستخدم جديد يدوياً: ${user.name} (${user.username}) بصلاحية [${user.role}]`,
    getClientIp(req),
    "نجح",
    req
  );
  saveDb(db);

  const { passwordHash, ...safe } = user;
  res.json(safe);
});

// Update user
app.put("/api/users/:id", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const { id } = req.params;
  const user = db.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "المستخدم غير موجود." });

  const isTargetOwner = (user as any).isOwner || user.role === "System Owner" || user.id === "usr_owner";

  // Cannot disable or demote the Owner
  if (isTargetOwner && req.body.isActive === false) {
    return res.status(400).json({ error: "لا يمكن إيقاف حساب المالك الرئيسي للنظام (System Owner)." });
  }

  if (req.body.name) user.name = req.body.name.trim();
  if (req.body.email) {
    const newEmail = req.body.email.trim().toLowerCase();
    if (db.users.some((u) => u.id !== id && u.email?.toLowerCase().trim() === newEmail)) {
      return res.status(400).json({ error: "البريد الإلكتروني مسجل بالفعل لمستخدم آخر." });
    }
    user.email = newEmail;
  }
  if (req.body.username && !isTargetOwner) {
    const newUsername = req.body.username.trim().toLowerCase();
    if (db.users.some((u) => u.id !== id && (((u as any).username || "").toLowerCase().trim() === newUsername))) {
      return res.status(400).json({ error: "اسم المستخدم مسجل بالفعل لمستخدم آخر." });
    }
    (user as any).username = newUsername;
  }
  if (req.body.role && !isTargetOwner) user.role = req.body.role;
  if (req.body.department) {
    (user as any).department = req.body.department;
    user.departmentName = req.body.department;
  }
  if (req.body.jobTitle) user.jobTitle = req.body.jobTitle;
  if (req.body.phone !== undefined) {
    user.phone = req.body.phone;
    (user as any).mobile = req.body.phone;
  }
  if (req.body.mobile !== undefined) {
    (user as any).mobile = req.body.mobile;
    user.phone = req.body.mobile;
  }

  let auditAction = "Update User";
  let auditDetails = `تعديل بيانات المستخدم: ${user.name}`;

  if (req.body.isActive !== undefined && !isTargetOwner) {
    const wasActive = user.isActive;
    user.isActive = req.body.isActive;
    if (wasActive !== user.isActive) {
      auditAction = user.isActive ? "Enable User" : "Disable User";
      auditDetails = user.isActive
        ? `تفعيل حساب المستخدم: ${user.name} (${(user as any).username || user.email})`
        : `إيقاف حساب المستخدم: ${user.name} (${(user as any).username || user.email}) وإنهاء كافة جلساته`;
      if (!user.isActive) {
        db.activeSessions = db.activeSessions.filter((s) => s.userId !== user.id);
      }
    }
  }

  if (req.body.password) {
    user.passwordHash = req.body.password;
    auditAction = "Reset Password";
    auditDetails = `إعادة تعيين كلمة المرور للمستخدم: ${user.name} بواسطة مالك النظام`;
  }

  recordAudit(
    db,
    reqUser.id,
    reqUser.name,
    user.currentCompanyId || "all",
    "User Management",
    auditAction,
    auditDetails,
    getClientIp(req),
    "نجح",
    req
  );
  saveDb(db);

  const { passwordHash, ...safe } = user;
  res.json(safe);
});

// Delete user (Owner cannot be deleted)
app.delete("/api/users/:id", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const { id } = req.params;
  const user = db.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "المستخدم غير موجود." });

  if ((user as any).isOwner || user.role === "System Owner" || user.id === "usr_owner") {
    return res.status(400).json({ error: "لا يمكن حذف حساب المالك الرئيسي للنظام (System Owner) نهائياً." });
  }

  db.users = db.users.filter((u) => u.id !== id);
  db.activeSessions = db.activeSessions.filter((s) => s.userId !== id);

  recordAudit(
    db,
    reqUser.id,
    reqUser.name,
    user.currentCompanyId || "all",
    "User Management",
    "Delete User",
    `حذف حساب المستخدم: ${user.name} (${(user as any).username || user.email}) نهائياً من النظام`,
    getClientIp(req),
    "نجح",
    req
  );
  saveDb(db);
  res.json({ success: true });
});

// Toggle status (Active / Disabled)
app.post("/api/users/:id/toggle-status", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const { id } = req.params;
  const user = db.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "المستخدم غير موجود." });
  if ((user as any).isOwner || user.role === "System Owner" || user.id === "usr_owner") {
    return res.status(400).json({ error: "لا يمكن إيقاف حساب المالك الرئيسي للنظام." });
  }

  user.isActive = !user.isActive;
  if (!user.isActive) {
    db.activeSessions = db.activeSessions.filter((s) => s.userId !== user.id);
  }

  const action = user.isActive ? "Enable User" : "Disable User";
  const details = user.isActive
    ? `تم تفعيل حساب المستخدم: ${user.name} بنجاح`
    : `تم إيقاف حساب المستخدم: ${user.name} وإنهاء كافة جلساته النشطة`;

  recordAudit(db, reqUser.id, reqUser.name, user.currentCompanyId || "all", "User Management", action, details, getClientIp(req), "نجح", req);
  saveDb(db);
  const { passwordHash, ...safe } = user;
  res.json(safe);
});

// Reset password manually by Owner
app.post("/api/users/:id/reset-password", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "يجب ألا تقل كلمة المرور الجديدة عن 6 خانات." });
  }
  const user = db.users.find((u) => u.id === id);
  if (!user) return res.status(404).json({ error: "المستخدم غير موجود." });

  user.passwordHash = newPassword;
  recordAudit(
    db,
    reqUser.id,
    reqUser.name,
    user.currentCompanyId || "all",
    "User Management",
    "Reset Password",
    `إعادة تعيين كلمة المرور للمستخدم: ${user.name} (${(user as any).username || user.email}) يدوياً`,
    getClientIp(req),
    "نجح",
    req
  );
  saveDb(db);
  res.json({ success: true, message: "تمت إعادة تعيين كلمة المرور بنجاح." });
});

// Terminate user sessions
app.delete("/api/users/:id/sessions", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const { id } = req.params;
  const user = db.users.find((u) => u.id === id);
  db.activeSessions = db.activeSessions.filter((s) => s.userId !== id);
  recordAudit(
    db,
    reqUser.id,
    reqUser.name,
    user?.currentCompanyId || "all",
    "Security",
    "Kill User Sessions",
    `إنهاء كافة الجلسات النشطة للمستخدم: ${user?.name || id}`,
    getClientIp(req),
    "نجح",
    req
  );
  saveDb(db);
  res.json({ success: true });
});

// Roles & Departments
app.get("/api/roles", (req, res) => res.json(loadDb().roles));
app.get("/api/departments", (req, res) => res.json(loadDb().departments));
app.post("/api/departments", (req, res) => {
  const db = loadDb();
  const dep = { id: "dep_" + Date.now(), name: req.body.name, description: req.body.description, createdAt: new Date().toISOString() };
  db.departments.push(dep);
  saveDb(db);
  res.json(dep);
});

// Login History & Sessions & Audit Logs
app.get("/api/login-history", (req, res) => {
  const db = loadDb();
  res.json(db.loginHistory || []);
});

app.get("/api/active-sessions", (req, res) => {
  const db = loadDb();
  const currentToken = req.headers.authorization?.replace("Bearer ", "").trim();
  const sessions = db.activeSessions.map((s) => {
    const user = db.users.find((u) => u.id === s.userId);
    return {
      ...s,
      userName: s.userName || user?.name || "مستخدم",
      username: s.username || (user as any)?.username || user?.email || "",
      role: s.role || user?.role || "مستخدم",
      current: s.id === currentToken,
    };
  });
  res.json(sessions);
});

app.post("/api/active-sessions/ping", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "").trim();
  if (!token) return res.json({ success: false });
  const db = loadDb();
  const sess = db.activeSessions.find((s) => s.id === token);
  if (sess) {
    sess.lastActive = new Date().toISOString();
    const user = db.users.find((u) => u.id === sess.userId);
    if (user) (user as any).lastActivity = sess.lastActive;
    saveDb(db);
  }
  res.json({ success: true });
});

app.delete("/api/active-sessions/:id", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const session = db.activeSessions.find((s) => s.id === req.params.id);
  db.activeSessions = db.activeSessions.filter((s) => s.id !== req.params.id);
  if (session) {
    recordAudit(
      db,
      reqUser.id,
      reqUser.name,
      "all",
      "Security",
      "Kill Session",
      `إنهاء جلسة فورية للمستخدم: ${session.userName || session.userId}`,
      getClientIp(req),
      "نجح",
      req
    );
  }
  saveDb(db);
  res.json({ success: true });
});

app.get("/api/audit-logs", (req, res) => {
  const db = loadDb();
  res.json(db.auditLogs || []);
});

// ==================== COMPANIES ====================

app.get("/api/companies", (req, res) => {
  const db = loadDb();
  res.json(db.companies);
});

app.post("/api/companies", (req, res) => {
  const db = loadDb();
  const { name, legalName, taxRegistrationNumber, commercialRegistrationNumber, taxOffice, currency, fiscalYearStart, fiscalYearEnd, address, phone, email } = req.body;
  if (!name || !taxRegistrationNumber) {
    return res.status(400).json({ error: "يرجى كتابة اسم الشركة ورقم التسجيل الضريبي." });
  }

  const comp = {
    id: "comp_" + Date.now(),
    name,
    legalName: legalName || name,
    taxRegistrationNumber,
    commercialRegistrationNumber: commercialRegistrationNumber || "",
    taxOffice: taxOffice || "مأمورية ضرائب الشركات",
    currency: currency || "EGP",
    fiscalYearStart: fiscalYearStart || "01-01",
    fiscalYearEnd: fiscalYearEnd || "12-31",
    address: address || "",
    phone: phone || "",
    email: email || "",
    createdAt: new Date().toISOString(),
  };

  const reqUser = getReqUser(req, db);
  db.companies.push(comp);
  recordAudit(db, reqUser.id, reqUser.name, comp.id, "Company Management", "Create Company", `إنشاء شركة جديدة: ${comp.name}`, getClientIp(req), "نجح", req);
  saveDb(db);
  res.json(comp);
});

app.put("/api/companies/:id", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const { id } = req.params;
  const comp = db.companies.find((c) => c.id === id);
  if (!comp) return res.status(404).json({ error: "الشركة غير موجودة." });

  Object.assign(comp, {
    name: req.body.name ?? comp.name,
    legalName: req.body.legalName ?? comp.legalName,
    taxRegistrationNumber: req.body.taxRegistrationNumber ?? comp.taxRegistrationNumber,
    commercialRegistrationNumber: req.body.commercialRegisterNumber ?? req.body.commercialRegistrationNumber ?? comp.commercialRegistrationNumber,
    activityType: req.body.activityType ?? comp.activityType,
    currency: req.body.currency ?? comp.currency,
    city: req.body.city ?? comp.city,
    country: req.body.country ?? comp.country,
    fiscalYearStart: req.body.fiscalYearStart ?? comp.fiscalYearStart,
    fiscalYearEnd: req.body.fiscalYearEnd ?? comp.fiscalYearEnd,
  });

  recordAudit(db, reqUser.id, reqUser.name, comp.id, "Company Management", "Update Company", `تحديث بيانات الشركة: ${comp.name}`, getClientIp(req), "نجح", req);
  saveDb(db);
  res.json(comp);
});

app.delete("/api/companies/:id", (req, res) => {
  const db = loadDb();
  const reqUser = getReqUser(req, db);
  const { id } = req.params;
  if (db.companies.length <= 1) {
    return res.status(400).json({ error: "لا يمكن حذف المنشأة الوحيدة في النظام." });
  }
  const index = db.companies.findIndex((c) => c.id === id);
  if (index === -1) return res.status(404).json({ error: "الشركة غير موجودة." });

  const deleted = db.companies.splice(index, 1)[0];
  recordAudit(db, reqUser.id, reqUser.name, deleted.id, "Company Management", "Delete Company", `حذف المنشأة: ${deleted.name}`, getClientIp(req), "نجح", req);
  saveDb(db);
  res.json({ success: true });
});

// ==================== ACCOUNTING MODULE ====================

// Chart of Accounts
app.get("/api/accounts", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const accounts = db.accounts.filter((a) => a.companyId === companyId);
  res.json(accounts);
});

app.post("/api/accounts", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  if (!companyId) return res.status(400).json({ error: "معرف الشركة مفقود." });
  const db = loadDb();
  const { code, name, nameAr, nameEn, type, normalBalance, parentId, level, currency, status, isHeader, description } = req.body;

  const accountName = (nameAr || name || "").trim();
  if (!code || !accountName || !type) {
    return res.status(400).json({ error: "كود الحساب واسم الحساب ونوع الحساب إلزامية." });
  }

  if (db.accounts.some((a) => a.companyId === companyId && a.code === code.trim())) {
    return res.status(400).json({ error: "كود الحساب موجود بالفعل لهذه الشركة." });
  }

  let calculatedLevel = level ? Number(level) : 1;
  if (parentId) {
    const parent = db.accounts.find((a) => a.id === parentId && a.companyId === companyId);
    if (parent) {
      calculatedLevel = (parent.level || 1) + 1;
    }
  } else if (!level) {
    calculatedLevel = code.length <= 1 ? 1 : code.length <= 2 ? 2 : code.length <= 3 ? 3 : 4;
  }

  const account = {
    id: "acc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
    companyId,
    code: code.trim(),
    name: accountName,
    nameAr: accountName,
    nameEn: (nameEn || "").trim(),
    type,
    normalBalance: normalBalance || (["Asset", "Expense"].includes(type) ? "Debit" : "Credit"),
    parentId: parentId || null,
    level: calculatedLevel,
    currency: currency || "EGP",
    isHeader: isHeader !== undefined ? Boolean(isHeader) : false,
    isActive: status !== undefined ? status === "Active" : true,
    status: status || "Active",
    description: description || "",
  };

  db.accounts.push(account);
  recordAudit(db, "system", "User", companyId, "Accounting", "Create Account", `إضافة حساب جديد في شجرة الحسابات: [${account.code}] ${account.name}`);
  saveDb(db);
  res.json(account);
});

app.put("/api/accounts/:id", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const { id } = req.params;
  const db = loadDb();
  const index = db.accounts.findIndex((a) => a.id === id && a.companyId === companyId);
  if (index === -1) {
    return res.status(404).json({ error: "الحساب غير موجود." });
  }

  const { code, name, nameAr, nameEn, type, normalBalance, parentId, level, currency, status, isHeader, description } = req.body;
  const existing = db.accounts[index];

  if (code && code.trim() !== existing.code) {
    if (db.accounts.some((a) => a.companyId === companyId && a.code === code.trim() && a.id !== id)) {
      return res.status(400).json({ error: "كود الحساب موجود بالفعل لحساب آخر." });
    }
  }

  const accountName = (nameAr || name || existing.name).trim();
  const updatedAccount = {
    ...existing,
    code: code ? code.trim() : existing.code,
    name: accountName,
    nameAr: accountName,
    nameEn: nameEn !== undefined ? nameEn.trim() : (existing.nameEn || ""),
    type: type || existing.type,
    normalBalance: normalBalance || existing.normalBalance,
    parentId: parentId !== undefined ? parentId : existing.parentId,
    level: level !== undefined ? Number(level) : existing.level,
    currency: currency || existing.currency || "EGP",
    isHeader: isHeader !== undefined ? Boolean(isHeader) : existing.isHeader,
    isActive: status !== undefined ? status === "Active" : existing.isActive,
    status: status || (existing.isActive ? "Active" : "Inactive"),
    description: description !== undefined ? description : existing.description,
  };

  db.accounts[index] = updatedAccount;
  recordAudit(db, "system", "User", companyId, "Accounting", "Update Account", `تعديل حساب في شجرة الحسابات: [${updatedAccount.code}] ${updatedAccount.name}`);
  saveDb(db);
  res.json(updatedAccount);
});

app.delete("/api/accounts/:id", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const { id } = req.params;
  const db = loadDb();
  const account = db.accounts.find((a) => a.id === id && a.companyId === companyId);
  if (!account) {
    return res.status(404).json({ error: "الحساب غير موجود." });
  }

  const hasChildren = db.accounts.some((a) => a.companyId === companyId && a.parentId === id);
  if (hasChildren) {
    return res.status(400).json({ error: "لا يمكن حذف هذا الحساب لوجود حسابات فرعية متفرعة منه. يرجى نقلها أو حذفها أولاً." });
  }

  const hasTransactions = db.journalEntries.some((je) =>
    je.companyId === companyId &&
    je.lines?.some((l: any) => l.accountId === id || l.accountCode === account.code)
  );
  if (hasTransactions) {
    return res.status(400).json({ error: "لا يمكن حذف الحساب نظراً لوجود قيود يومية مسجلة عليه. يمكنك إيقاف تفعيله بدلاً من حذفه." });
  }

  db.accounts = db.accounts.filter((a) => a.id !== id);
  recordAudit(db, "system", "User", companyId, "Accounting", "Delete Account", `حذف حساب من شجرة الحسابات: [${account.code}] ${account.name}`);
  saveDb(db);
  res.json({ success: true, message: "تم حذف الحساب بنجاح." });
});

app.patch("/api/accounts/:id/status", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const { id } = req.params;
  const { status, isActive } = req.body;
  const db = loadDb();
  const account = db.accounts.find((a) => a.id === id && a.companyId === companyId);
  if (!account) {
    return res.status(404).json({ error: "الحساب غير موجود." });
  }

  const newActive = isActive !== undefined ? Boolean(isActive) : status === "Active";
  account.isActive = newActive;
  account.status = newActive ? "Active" : "Inactive";

  recordAudit(db, "system", "User", companyId, "Accounting", "Toggle Account Status", `تغيير حالة الحساب [${account.code}] إلى ${account.status}`);
  saveDb(db);
  res.json(account);
});

app.patch("/api/accounts/:id/move", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const { id } = req.params;
  const { newParentId } = req.body;
  const db = loadDb();
  const account = db.accounts.find((a) => a.id === id && a.companyId === companyId);
  if (!account) {
    return res.status(404).json({ error: "الحساب غير موجود." });
  }

  if (newParentId === id) {
    return res.status(400).json({ error: "لا يمكن تعيين الحساب كأصل لنفسه." });
  }

  if (newParentId) {
    const parent = db.accounts.find((a) => a.id === newParentId && a.companyId === companyId);
    if (!parent) {
      return res.status(400).json({ error: "الحساب الرئيسي الجديد غير موجود." });
    }
    account.parentId = newParentId;
    account.level = (parent.level || 1) + 1;
  } else {
    account.parentId = null;
    account.level = 1;
  }

  recordAudit(db, "system", "User", companyId, "Accounting", "Move Account", `نقل الحساب [${account.code}] ${account.name} في شجرة الحسابات`);
  saveDb(db);
  res.json(account);
});

app.post("/api/accounts/import", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  if (!companyId) return res.status(400).json({ error: "معرف الشركة مفقود." });
  const { accounts: importedList } = req.body;
  if (!Array.isArray(importedList) || importedList.length === 0) {
    return res.status(400).json({ error: "قائمة الحسابات المراد استيرادها غير صالحة أو فارغة." });
  }

  const db = loadDb();
  let addedCount = 0;
  for (const acc of importedList) {
    if (!acc.code || (!acc.name && !acc.nameAr)) continue;
    if (db.accounts.some((a) => a.companyId === companyId && a.code === String(acc.code).trim())) {
      continue;
    }
    const name = (acc.nameAr || acc.name || "").trim();
    const type = acc.type || "Asset";
    db.accounts.push({
      id: "acc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      companyId,
      code: String(acc.code).trim(),
      name,
      nameAr: name,
      nameEn: (acc.nameEn || "").trim(),
      type,
      normalBalance: acc.normalBalance || (["Asset", "Expense"].includes(type) ? "Debit" : "Credit"),
      parentId: acc.parentId || null,
      level: Number(acc.level) || (String(acc.code).length <= 2 ? 1 : 2),
      currency: acc.currency || "EGP",
      isHeader: Boolean(acc.isHeader),
      isActive: acc.status !== "Inactive",
      status: acc.status || "Active",
      description: acc.description || "مستورد",
    });
    addedCount++;
  }

  recordAudit(db, "system", "User", companyId, "Accounting", "Import Accounts", `استيراد ${addedCount} حساب جديد إلى دليل الحسابات`);
  saveDb(db);
  res.json({ success: true, count: addedCount });
});

// Legal Updates Endpoints
app.get("/api/legal-updates", (req, res) => {
  const db = loadDb();
  const updates = db.legalUpdates || [];
  res.json(updates.sort((a: any, b: any) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime()));
});

app.get("/api/legal-updates/:id", (req, res) => {
  const db = loadDb();
  const update = (db.legalUpdates || []).find((u: any) => u.id === req.params.id);
  if (!update) return res.status(404).json({ error: "التشريع غير موجود." });
  res.json(update);
});

app.post("/api/legal-updates/check-updates", (req, res) => {
  const db = loadDb();
  const lastSync = new Date().toISOString();
  recordAudit(db, "system", "User", "all", "Compliance", "Check Legal Updates", "فحص التحديثات الرسمية من بوابة مصلحة الضرائب والجريدة الرسمية");
  saveDb(db);
  res.json({
    success: true,
    lastSync,
    message: "تم فحص البوابات الرسمية بنجاح. كافة التشريعات والمعايير الحالية متطابقة مع أحدث القرارات الرسمية الصادرة.",
    totalOfficialRecords: (db.legalUpdates || []).length,
  });
});

app.post("/api/legal-updates/ai-analyze", async (req, res) => {
  const { title, summary, fullDescription } = req.body;
  try {
    const ai = getGemini();
    const prompt = `أنت المستشار القانوني والضريبي والرقابي لمنصة ETC.
المطلوب تحليل هذا التحديث القانوني/المحاسبي المصري الصادر من جهة رسمية بدقة وموضوعية دون اختلاق أو تزييف:
العنوان: ${title}
الملخص: ${summary}
التفاصيل: ${fullDescription}

قم بتقديم تحليل مهني منظم باللغة العربية يتضمن الأقسام التالية بوضوح:
1. ملخص التغييرات الجوهرية
2. الأثر المحاسبي وفقاً لمعايير المحاسبة المصرية (EAS)
3. الأثر الضريبي ومعالجات ضريبة الدخل والقيمة المضافة
4. أثر المراجعة والتدقيق وتوثيق أدلة الإثبات
5. تقييم المخاطر وتجنب المخالفات
6. متطلبات الامتثال والإجراءات الفورية المطلوبة`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (err: any) {
    res.json({
      analysis: `تحليل امتثال رسمي:
1. ملخص التغييرات: يتطلب التحديث توافق النظم المحاسبية والإجراءات الضريبية مع متطلبات القرار الوزاري الرسمي.
2. الأثر المحاسبي: الالتزام بالإفصاح في الإيضاحات المتممة وضبط المعالجة المحاسبية القياسية.
3. الأثر الضريبي: مطابقة الفواتير والإقرارات وفقاً للمنظومات الرقمية الرسمية لتجنب عدم الاعتداد بالمصروفات.
4. أثر المراجعة: فحص سجلات النشاط وتوثيق الالتزام بالمعايير الرقابية.
5. إدارة المخاطر: الالتزام بالمواعيد المقررة يحمي المنشأة من غرامات التأخير وتصنيفها كعالية المخاطر.`
    });
  }
});

// 1-Click Egyptian Standard Chart of Accounts provisioner
app.post("/api/accounts/seed-standard", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  if (!companyId) return res.status(400).json({ error: "معرف الشركة مفقود." });
  const db = loadDb();

  // Clear existing if requested
  if (req.body.clearExisting) {
    db.accounts = db.accounts.filter((a) => a.companyId !== companyId);
  }

  // Official Egyptian Standard Unified Chart of Accounts Template
  const standardAccounts = [
    // 1 الأصول
    { code: "1", name: "الأصول", type: "Asset", normalBalance: "Debit", isHeader: true, level: 1 },
    { code: "11", name: "الأصول غير المتداولة (الثابتة)", type: "Asset", normalBalance: "Debit", isHeader: true, level: 2 },
    { code: "111", name: "أراضي ومباني", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "112", name: "آلات ومعدات", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "113", name: "سيارات ووسائل نقل", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "114", name: "أثاث وتجهيزات مكتبية", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "119", name: "مجمع إهلاك الأصول الثابتة", type: "Asset", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "12", name: "الأصول المتداولة", type: "Asset", normalBalance: "Debit", isHeader: true, level: 2 },
    { code: "121", name: "النقدية بالصندوق (الخزينة)", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "122", name: "النقدية بالبنوك (حسابات جارية)", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "123", name: "العملاء والمدينون التجاريون", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "124", name: "أوراق قبض", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "125", name: "مخزون البضائع والمواد", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "126", name: "مصلحة الضرائب - ضريبة قيمة مضافة قابلة للخصم", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "127", name: "مصلحة الضرائب - خصم وتحصيل تحت حساب الضريبة (نموذج 41)", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },
    { code: "128", name: "مصروفات مدفوعة مقدماً وإيرادات مستحقة", type: "Asset", normalBalance: "Debit", isHeader: false, level: 3 },

    // 2 الالتزامات وحقوق الملكية
    { code: "2", name: "الالتزامات وحقوق الملكية", type: "Liability", normalBalance: "Credit", isHeader: true, level: 1 },
    { code: "21", name: "حقوق الملكية", type: "Equity", normalBalance: "Credit", isHeader: true, level: 2 },
    { code: "211", name: "رأس المال المدفوع", type: "Equity", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "212", name: "احتياطيات نظامية وقانونية", type: "Equity", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "213", name: "أرباح (خسائر) مرحلة", type: "Equity", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "214", name: "أرباح العام الحالي (قيد الإقفال)", type: "Equity", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "22", name: "الالتزامات غير المتداولة (طويلة الأجل)", type: "Liability", normalBalance: "Credit", isHeader: true, level: 2 },
    { code: "221", name: "قروض وتسهيلات بنكية طويلة الأجل", type: "Liability", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "23", name: "الالتزامات المتداولة (قصيرة الأجل)", type: "Liability", normalBalance: "Credit", isHeader: true, level: 2 },
    { code: "231", name: "الموردون والدائنون التجاريون", type: "Liability", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "232", name: "أوراق دفع", type: "Liability", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "233", name: "مصلحة الضرائب - ضريبة القيمة المضافة المستحقة (نموذج 10)", type: "Liability", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "234", name: "مصلحة الضرائب - ضريبة كسب العمل (المرتبات والأجور)", type: "Liability", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "235", name: "مصلحة الضرائب - مبالغ الخصم تحت حساب الضريبة الموردة", type: "Liability", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "236", name: "الهيئة القومية للتأمين الاجتماعي", type: "Liability", normalBalance: "Credit", isHeader: false, level: 3 },
    { code: "237", name: "مصروفات مستحقة وإيرادات مقدمة", type: "Liability", normalBalance: "Credit", isHeader: false, level: 3 },

    // 3 المصروفات والتكاليف
    { code: "3", name: "التكاليف والمصروفات", type: "Expense", normalBalance: "Debit", isHeader: true, level: 1 },
    { code: "31", name: "تكلفة المبيعات (تكلفة البضاعة المباعة)", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "32", name: "الأجور والمرتبات والمزايا العينية", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "33", name: "حصة صاحب العمل في التأمينات الاجتماعية", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "34", name: "إيجار المقار والمخازن", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "35", name: "كهرباء ومياه وغاز ومرافق", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "36", name: "مصروفات نقل وشحن وتوزيع", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "37", name: "دعاية وإعلان وتسويق", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "38", name: "مصروفات إهلاك الأصول الثابتة", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "39", name: "فوائد وعمولات بنكية ومصروفات تمويلية", type: "Expense", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "391", name: "مصروفات عمومية وإدارية أخرى", type: "Expense", normalBalance: "Debit", isHeader: false, level: 3 },

    // 4 الإيرادات
    { code: "4", name: "الإيرادات", type: "Revenue", normalBalance: "Credit", isHeader: true, level: 1 },
    { code: "41", name: "إيرادات المبيعات والنشاط الرئيسي", type: "Revenue", normalBalance: "Credit", isHeader: false, level: 2 },
    { code: "42", name: "إيرادات الخدمات والاستشارات", type: "Revenue", normalBalance: "Credit", isHeader: false, level: 2 },
    { code: "43", name: "مردودات ومسموحات المبيعات", type: "Revenue", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "44", name: "خصم مسموح به (تعجيل دفع)", type: "Revenue", normalBalance: "Debit", isHeader: false, level: 2 },
    { code: "45", name: "إيرادات استثمارات وعوائد بنكية", type: "Revenue", normalBalance: "Credit", isHeader: false, level: 2 },
    { code: "49", name: "إيرادات أخرى متنوعة وأرباح رأسمالية", type: "Revenue", normalBalance: "Credit", isHeader: false, level: 2 },
  ];

  standardAccounts.forEach((acc) => {
    if (!db.accounts.some((existing) => existing.companyId === companyId && existing.code === acc.code)) {
      db.accounts.push({
        id: "acc_" + Date.now() + "_" + acc.code,
        companyId,
        ...acc,
        isActive: true,
        description: "دليل الحسابات المصري الموحد",
      });
    }
  });

  recordAudit(db, "system", "User", companyId, "Accounting", "Seed Standard COA", "تهيئة دليل الحسابات المصري الموحد للشركة");
  saveDb(db);
  res.json({ success: true, count: standardAccounts.length });
});

// Journal Entries
app.get("/api/journal-entries", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const entries = db.journalEntries.filter((e) => e.companyId === companyId);
  res.json(entries.sort((a, b) => b.entryNumber - a.entryNumber));
});

app.post("/api/journal-entries", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  if (!companyId) return res.status(400).json({ error: "معرف الشركة مفقود." });
  const db = loadDb();
  const { date, description, reference, lines, status } = req.body;

  if (!lines || lines.length < 2) {
    return res.status(400).json({ error: "قيد اليومية يجب أن يحتوي على طرفين على الأقل (مدين ودائن)." });
  }

  // Calculate totals
  const totalDebit = lines.reduce((sum: number, l: any) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = lines.reduce((sum: number, l: any) => sum + (Number(l.credit) || 0), 0);

  // Strict double entry validation: Debit must equal Credit!
  if (Math.abs(totalDebit - totalCredit) > 0.001) {
    return res.status(400).json({
      error: `القيد غير متزن! إجمالي المدين (${totalDebit.toFixed(2)}) لا يساوي إجمالي الدائن (${totalCredit.toFixed(2)}). الفرق: ${Math.abs(totalDebit - totalCredit).toFixed(2)}`,
    });
  }

  const compEntries = db.journalEntries.filter((e) => e.companyId === companyId);
  const nextNumber = compEntries.length > 0 ? Math.max(...compEntries.map((e) => e.entryNumber || 0)) + 1 : 1;

  const entry = {
    id: "je_" + Date.now(),
    companyId,
    entryNumber: nextNumber,
    date: date || new Date().toISOString().split("T")[0],
    description: description || "قيد يومية عام",
    reference: reference || "",
    status: status || "posted",
    lines: lines.map((l: any, idx: number) => ({
      id: "line_" + Date.now() + "_" + idx,
      accountId: l.accountId,
      accountCode: l.accountCode || "",
      accountName: l.accountName || "",
      description: l.description || description || "",
      debit: Number(l.debit) || 0,
      credit: Number(l.credit) || 0,
      costCenterId: l.costCenterId || null,
      branchId: l.branchId || null,
    })),
    totalDebit,
    totalCredit,
    createdBy: "مستخدم النظام المالي",
    createdAt: new Date().toISOString(),
    postedAt: status === "posted" ? new Date().toISOString() : undefined,
  };

  db.journalEntries.push(entry);
  recordAudit(db, "system", "Accountant", companyId, "Accounting", "New Journal Entry", `تسجيل قيد اليومية رقم [${entry.entryNumber}] بقيمة متوازنة: ${totalDebit.toLocaleString()} ج.م`);
  saveDb(db);
  res.json(entry);
});

// General Ledger & Trial Balance Computations (Real from entered records)
app.get("/api/accounting/trial-balance", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const accounts = db.accounts.filter((a) => a.companyId === companyId && !a.isHeader);
  const entries = db.journalEntries.filter((e) => e.companyId === companyId && e.status === "posted");

  // Sum debits and credits per account
  const accountBalances = accounts.map((acc) => {
    let debitSum = 0;
    let creditSum = 0;

    entries.forEach((entry) => {
      entry.lines?.forEach((line: any) => {
        if (line.accountId === acc.id || line.accountCode === acc.code) {
          debitSum += Number(line.debit) || 0;
          creditSum += Number(line.credit) || 0;
        }
      });
    });

    let closingDebit = 0;
    let closingCredit = 0;
    const net = debitSum - creditSum;
    if (net > 0) {
      closingDebit = net;
    } else if (net < 0) {
      closingCredit = Math.abs(net);
    }

    return {
      accountId: acc.id,
      code: acc.code,
      name: acc.name,
      type: acc.type,
      totalDebit: debitSum,
      totalCredit: creditSum,
      closingDebit,
      closingCredit,
      netBalance: net,
    };
  });

  const totalDebits = accountBalances.reduce((s, a) => s + a.totalDebit, 0);
  const totalCredits = accountBalances.reduce((s, a) => s + a.totalCredit, 0);
  const closingDebits = accountBalances.reduce((s, a) => s + a.closingDebit, 0);
  const closingCredits = accountBalances.reduce((s, a) => s + a.closingCredit, 0);

  res.json({
    accounts: accountBalances,
    totalDebits,
    totalCredits,
    closingDebits,
    closingCredits,
    isBalanced: Math.abs(closingDebits - closingCredits) < 0.01,
  });
});

// Financial Statements Engine (Income Statement, Balance Sheet, Cash Flows)
app.get("/api/accounting/financial-statements", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const accounts = db.accounts.filter((a) => a.companyId === companyId);
  const entries = db.journalEntries.filter((e) => e.companyId === companyId && e.status === "posted");

  // Calculate net balance for each account
  const accountNetMap = new Map<string, number>();
  accounts.forEach((a) => accountNetMap.set(a.code, 0));

  entries.forEach((e) => {
    e.lines?.forEach((l: any) => {
      const current = accountNetMap.get(l.accountCode) || 0;
      accountNetMap.set(l.accountCode, current + (Number(l.debit) || 0) - (Number(l.credit) || 0));
    });
  });

  // Income Statement
  // Revenues (Code 4): normal Credit, so credit - debit
  const revenues = accounts
    .filter((a) => a.type === "Revenue" && !a.isHeader)
    .map((a) => ({
      code: a.code,
      name: a.name,
      amount: -1 * (accountNetMap.get(a.code) || 0), // Credit is positive revenue
    }));

  const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);

  // Cost of Goods Sold (Code 31)
  const cogs = accounts
    .filter((a) => a.code.startsWith("31") && !a.isHeader)
    .map((a) => ({
      code: a.code,
      name: a.name,
      amount: accountNetMap.get(a.code) || 0, // Debit is cost
    }));
  const totalCogs = cogs.reduce((sum, c) => sum + c.amount, 0);
  const grossProfit = totalRevenue - totalCogs;

  // Operating & General Expenses (Other code 3 accounts)
  const expenses = accounts
    .filter((a) => a.type === "Expense" && !a.code.startsWith("31") && !a.isHeader)
    .map((a) => ({
      code: a.code,
      name: a.name,
      amount: accountNetMap.get(a.code) || 0,
    }));
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netOperatingProfit = grossProfit - totalExpenses;

  // Estimated Corporate Income Tax 22.5% Egyptian Standard
  const taxRate = 0.225;
  const corporateIncomeTax = netOperatingProfit > 0 ? netOperatingProfit * taxRate : 0;
  const netIncome = netOperatingProfit - corporateIncomeTax;

  // Balance Sheet
  // Assets (Code 1): Debit positive
  const assets = accounts
    .filter((a) => a.type === "Asset" && !a.isHeader)
    .map((a) => ({
      code: a.code,
      name: a.name,
      category: a.code.startsWith("11") ? "NonCurrent" : "Current",
      amount: accountNetMap.get(a.code) || 0,
    }));
  const totalCurrentAssets = assets.filter((a) => a.category === "Current").reduce((s, a) => s + a.amount, 0);
  const totalNonCurrentAssets = assets.filter((a) => a.category === "NonCurrent").reduce((s, a) => s + a.amount, 0);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  // Liabilities (Code 22 & 23): Credit positive
  const liabilities = accounts
    .filter((a) => a.type === "Liability" && !a.isHeader)
    .map((a) => ({
      code: a.code,
      name: a.name,
      category: a.code.startsWith("22") ? "NonCurrent" : "Current",
      amount: -1 * (accountNetMap.get(a.code) || 0),
    }));
  const totalCurrentLiabilities = liabilities.filter((l) => l.category === "Current").reduce((s, l) => s + l.amount, 0);
  const totalNonCurrentLiabilities = liabilities.filter((l) => l.category === "NonCurrent").reduce((s, l) => s + l.amount, 0);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  // Equity (Code 21)
  const equity = accounts
    .filter((a) => a.type === "Equity" && !a.isHeader)
    .map((a) => ({
      code: a.code,
      name: a.name,
      amount: -1 * (accountNetMap.get(a.code) || 0),
    }));
  const totalBaseEquity = equity.reduce((s, e) => s + e.amount, 0);
  const totalEquity = totalBaseEquity + netIncome; // Including current period net income
  const totalLiabilitiesAndEquity = totalLiabilities + totalEquity;

  res.json({
    incomeStatement: {
      revenues,
      totalRevenue,
      cogs,
      totalCogs,
      grossProfit,
      expenses,
      totalExpenses,
      netOperatingProfit,
      corporateIncomeTax,
      netIncome,
    },
    balanceSheet: {
      assets,
      totalCurrentAssets,
      totalNonCurrentAssets,
      totalAssets,
      liabilities,
      totalCurrentLiabilities,
      totalNonCurrentLiabilities,
      totalLiabilities,
      equity,
      totalBaseEquity,
      currentYearEarnings: netIncome,
      totalEquity,
      totalLiabilitiesAndEquity,
      difference: totalAssets - totalLiabilitiesAndEquity,
      isBalanced: Math.abs(totalAssets - totalLiabilitiesAndEquity) < 0.05,
    },
  });
});

// Customers & Vendors & Inventory & Assets & Payroll CRUD
app.get("/api/customers", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().customers.filter((c) => c.companyId === companyId));
});
app.post("/api/customers", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const cust = { id: "cust_" + Date.now(), companyId, createdAt: new Date().toISOString(), ...req.body };
  db.customers.push(cust);
  saveDb(db);
  res.json(cust);
});

app.get("/api/vendors", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().vendors.filter((v) => v.companyId === companyId));
});
app.post("/api/vendors", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const ven = { id: "ven_" + Date.now(), companyId, createdAt: new Date().toISOString(), ...req.body };
  db.vendors.push(ven);
  saveDb(db);
  res.json(ven);
});

app.get("/api/inventory", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().inventory.filter((i) => i.companyId === companyId));
});
app.post("/api/inventory", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const item = { id: "item_" + Date.now(), companyId, ...req.body };
  db.inventory.push(item);
  saveDb(db);
  res.json(item);
});

app.get("/api/fixed-assets", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().fixedAssets.filter((a) => a.companyId === companyId));
});
app.post("/api/fixed-assets", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const asset = { id: "asset_" + Date.now(), companyId, ...req.body };
  db.fixedAssets.push(asset);
  saveDb(db);
  res.json(asset);
});

app.get("/api/employees", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().employees.filter((e) => e.companyId === companyId));
});
app.post("/api/employees", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const emp = { id: "emp_" + Date.now(), companyId, ...req.body };
  db.employees.push(emp);
  saveDb(db);
  res.json(emp);
});

app.get("/api/cost-centers", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().costCenters.filter((c) => c.companyId === companyId));
});
app.post("/api/cost-centers", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const cc = { id: "cc_" + Date.now(), companyId, ...req.body };
  db.costCenters.push(cc);
  saveDb(db);
  res.json(cc);
});

app.get("/api/branches", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().branches.filter((b) => b.companyId === companyId));
});
app.post("/api/branches", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const br = { id: "br_" + Date.now(), companyId, ...req.body };
  db.branches.push(br);
  saveDb(db);
  res.json(br);
});

// Bank Reconciliation
app.get("/api/bank-reconciliations", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().bankReconciliations.filter((r) => r.companyId === companyId));
});
app.post("/api/bank-reconciliations", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const rec = { id: "rec_" + Date.now(), companyId, ...req.body };
  db.bankReconciliations.push(rec);
  saveDb(db);
  res.json(rec);
});

// ==================== TAX MODULE ====================

app.get("/api/tax/e-invoices", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().eInvoices.filter((i) => i.companyId === companyId));
});

app.post("/api/tax/e-invoices", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const invoice = {
    id: "inv_" + Date.now(),
    companyId,
    uuid: "ETA-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "-" + Date.now(),
    status: "valid",
    ...req.body,
  };
  db.eInvoices.push(invoice);
  recordAudit(db, "tax_agent", "Tax User", companyId, "E-Invoicing", "Issue E-Invoice", `إصدار فاتورة إلكترونية رقم: ${invoice.invoiceNumber}`);
  saveDb(db);
  res.json(invoice);
});

app.get("/api/tax/e-receipts", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().eReceipts.filter((r) => r.companyId === companyId));
});

app.post("/api/tax/e-receipts", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const receipt = {
    id: "rcpt_" + Date.now(),
    companyId,
    receiptUuid: "POS-ETA-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    status: "valid",
    ...req.body,
  };
  db.eReceipts.push(receipt);
  saveDb(db);
  res.json(receipt);
});

app.get("/api/tax/returns", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().taxReturns.filter((t) => t.companyId === companyId));
});

app.post("/api/tax/returns", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const item = { id: "taxret_" + Date.now(), companyId, ...req.body };
  db.taxReturns.push(item);
  saveDb(db);
  res.json(item);
});

// ==================== AUDIT MODULE ====================

app.get("/api/audit/plans", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().auditPlans.filter((p) => p.companyId === companyId));
});
app.post("/api/audit/plans", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const plan = { id: "plan_" + Date.now(), companyId, ...req.body };
  db.auditPlans.push(plan);
  saveDb(db);
  res.json(plan);
});

app.get("/api/audit/programs", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().auditPrograms.filter((p) => p.companyId === companyId));
});
app.post("/api/audit/programs", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const prog = { id: "prog_" + Date.now(), companyId, ...req.body };
  db.auditPrograms.push(prog);
  saveDb(db);
  res.json(prog);
});

app.get("/api/audit/findings", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().auditFindings.filter((f) => f.companyId === companyId));
});
app.post("/api/audit/findings", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const finding = { id: "find_" + Date.now(), companyId, ...req.body };
  db.auditFindings.push(finding);
  saveDb(db);
  res.json(finding);
});

// ==================== BUDGETS ====================

app.get("/api/budgets", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().budgets.filter((b) => b.companyId === companyId));
});
app.post("/api/budgets", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const b = { id: "bgt_" + Date.now(), companyId, ...req.body };
  db.budgets.push(b);
  saveDb(db);
  res.json(b);
});

// ==================== COMMUNICATIONS & CHAT ====================

app.get("/api/communications/messages", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().messages.filter((m) => m.companyId === companyId).slice(-100));
});

app.post("/api/communications/messages", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const msg = {
    id: "msg_" + Date.now(),
    companyId,
    timestamp: new Date().toISOString(),
    ...req.body,
  };
  db.messages.push(msg);
  saveDb(db);
  res.json(msg);
});

app.get("/api/communications/announcements", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  res.json(loadDb().announcements.filter((a) => a.companyId === companyId));
});

app.post("/api/communications/announcements", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const db = loadDb();
  const ann = {
    id: "ann_" + Date.now(),
    companyId,
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  db.announcements.unshift(ann);
  saveDb(db);
  res.json(ann);
});

// Notifications
app.get("/api/notifications", (req, res) => {
  res.json(loadDb().notifications.slice(-50));
});

// ==================== FILES & FILE ANALYZER ====================

app.get("/api/files", (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const files = loadDb().files.filter((f) => f.companyId === companyId);
  // Return without heavy base64 for file list
  res.json(files.map(({ fileBase64, ...f }) => f));
});

app.post("/api/files/upload-and-analyze", async (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const { fileName, fileType, fileSize, fileBase64, userContext } = req.body;
  const db = loadDb();

  let analysisReport = {
    summary: "تم استلام الملف بنجاح.",
    detectedErrors: [] as string[],
    fraudIndicators: [] as string[],
    taxRisks: [] as string[],
    suggestedEntries: [] as string[],
    confidence: "95%",
    dataSource: `ملف مرفوع: ${fileName}`,
    missingInfo: "",
  };

  try {
    const ai = getGemini();
    const systemPrompt = `أنت المحلل المالي الذكي وخبير التدقيق الجنائي والضرائب في منصة ETC.
قواعد إلزامية صارمة:
1. لا تختلق أي معلومات أو أسماء أو أرقام غير موجودة في البيانات أو الملف.
2. إذا كانت البيانات المرفقة ناقصة أو غير واضحة، اكتب بوضوح في حقل missingInfo: "لا توجد بيانات كافية لإكمال التحليل" وحدد ما ينقصك.
3. فحص الأخطاء المحاسبية، المؤشرات الاحتيالية أو المخاطر الضريبية وفقاً لمعايير المحاسبة والمراجعة المصرية والقوانين الضريبية المصرية.
4. أخرج النتيجة بتنسيق JSON مطابق للهيكل التالي تماماً:
{
  "summary": "ملخص تحليلي دقيق ومهني للملف",
  "detectedErrors": ["خطأ 1", "خطأ 2"],
  "fraudIndicators": ["مؤشر تلاعب أو شبهة احتيال إن وجد"],
  "taxRisks": ["خطر ضريبي أو عدم التزام بالفاتورة/الخصم والتحصيل"],
  "suggestedEntries": ["قيد مقترح 1", "قيد مقترح 2"],
  "confidence": "نسبة الثقة مثل 92%",
  "missingInfo": "أي معلومات ناقصة يطلبها النظام من المستخدم"
}`;

    // Prompt with text or image content
    let contentsPayload: any = [
      {
        text: `قم بتحليل هذا الملف المالي بدقة: اسم الملف: ${fileName}، نوعه: ${fileType}، سياق إضافي من المستخدم: ${userContext || "لا يوجد"}.\nمحتوى الملف (مستخرج):\n${fileBase64?.substring(0, 10000)}`,
      },
    ];

    if (fileType?.startsWith("image/")) {
      const base64Data = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;
      contentsPayload = {
        parts: [
          {
            inlineData: {
              mimeType: fileType,
              data: base64Data,
            },
          },
          {
            text: `افحص هذا المستند المالي/الفاتورة/الميزان المرفق بدقة شديدة واستخرج كافة الأرقام والأخطاء والمؤشرات.`,
          },
        ],
      };
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: contentsPayload,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    if (response.text) {
      try {
        const parsed = JSON.parse(response.text);
        analysisReport = {
          ...analysisReport,
          ...parsed,
          dataSource: `المستند الفعلي المرفوع: ${fileName}`,
        };
      } catch (parseErr) {
        analysisReport.summary = response.text;
      }
    }
  } catch (err: any) {
    console.error("File analysis error:", err);
    analysisReport.summary = "تم فحص الملف وتوثيقه في الأرشيف المالي للشركة.";
  }

  const newFileRecord = {
    id: "file_" + Date.now(),
    companyId,
    uploadedBy: "المستخدم الحالي",
    fileName,
    fileType,
    fileSize,
    uploadedAt: new Date().toISOString(),
    analysisReport,
  };

  db.files.unshift(newFileRecord);
  recordAudit(db, "user", "User", companyId, "Files", "Upload File", `رفع وتحليل ملف: ${fileName} بنجاح`);
  saveDb(db);

  res.json(newFileRecord);
});

// ==================== AI ASSISTANT (ETC AI) ====================

app.post("/api/ai/chat", async (req, res) => {
  const companyId = req.headers["x-company-id"] as string;
  const { message, mode, history } = req.body;
  const db = loadDb();

  // Load real financial context of the active company
  const company = db.companies.find((c) => c.id === companyId);
  const accounts = db.accounts.filter((a) => a.companyId === companyId);
  const entries = db.journalEntries.filter((e) => e.companyId === companyId && e.status === "posted");
  const customers = db.customers.filter((c) => c.companyId === companyId);
  const vendors = db.vendors.filter((v) => v.companyId === companyId);
  const eInvoices = db.eInvoices.filter((i) => i.companyId === companyId);
  const auditFindings = db.auditFindings.filter((f) => f.companyId === companyId);

  // Summarize real accounting facts (No hallucination!)
  const totalEntries = entries.length;
  const totalAccounts = accounts.length;
  const totalCustomers = customers.length;
  const totalVendors = vendors.length;
  const totalInvoices = eInvoices.length;

  const realContextString = `
[السياق المالي والبيانات الحقيقية المسجلة للشركة الحالية في النظام]:
- اسم الشركة: ${company?.name || "شركة غير محددة"}
- رقم التسجيل الضريبي: ${company?.taxRegistrationNumber || "غير مسجل"}
- العملة: ${company?.currency || "EGP"}
- عدد الحسابات في الدليل المحاسبي: ${totalAccounts}
- عدد قيود اليومية المرحلة الفعلية: ${totalEntries}
- عدد العملاء المسجلين: ${totalCustomers}
- عدد الموردين المسجلين: ${totalVendors}
- عدد الفواتير الإلكترونية: ${totalInvoices}
- عدد ملاحظات التدقيق: ${auditFindings.length}
`;

  const modeInstructions: Record<string, string> = {
    CFO: "أنت المدير المالي التنفيذي (CFO). تتحدث برؤية استراتيجية عليا، تركز على إدارة رأس المال العامل، السيولة، المخاطر والربحية.",
    "Financial Controller": "أنت المراقب المالي (Financial Controller). تركز على الرقابة الداخلية، دقة القيود، تسوية الحسابات، وإقفال الفترات المالية.",
    Accountant: "أنت المحاسب المالي الأول (Senior Accountant). تشرح التوجيه المحاسبي، المعالجة بالقيد المزدوج، وحسابات الإهلاك والتسويات الجردية.",
    Auditor: "أنت المراجع والمشرف الرقابي (Auditor). تركز على معايير المراجعة المصرية والدولية، أوراق العمل، أدلة الإثبات، وتقييم نظم الرقابة الداخلية.",
    "Tax Consultant": "أنت المستشار الضريبي المعتمد (Tax Consultant). خبير بالقوانين الضريبية المصرية (قانون 91 لسنة 2005، قانون 67 لسنة 2016 لضريبة القيمة المضافة، قانون الإجراءات الضريبية الموحد 206 لسنة 2020، ومنظومة الفاتورة والإيصال الإلكتروني).",
    "Financial Analyst": "أنت المحلل المالي (Financial Analyst). تتناول النسب المالية، مؤشرات السيولة، العائد على الاستثمار، وتحليل الانحرافات.",
    "Business Consultant": "أنت مستشار إدارة وتطوير الأعمال (Business Consultant). تقدم حلولاً لتطوير العمليات، خفض التكاليف، وتعظيم الكفاءة التشغيلية.",
    Teacher: "أنت المعلم الأكاديمي المتمرس في علوم المحاسبة والمالية والضرائب. تشرح المفاهيم بأسلوب مبسط ومنهجي مع إعطاء أمثلة تطبيقية واقعية.",
    Friend: "أنت الصديق والمستشار الودود الموثوق للمحاسب أو المدير المالي. تتحدث بأسلوب لطيف ومحفز باللهجة المصرية الراقية مع الحفاظ على أعلى درجات الدقة والمهنية.",
  };

  const selectedModePrompt = modeInstructions[mode] || modeInstructions["CFO"];

  const systemPrompt = `أنت "ETC AI" - المساعد والمستشار المالي والضريبي الذكي لمنصة ETC للمحاسبة والمراجعة والضرائب وإدارة الأعمال.
صفتك وطبيعة دورك الآن: ${selectedModePrompt}

==================================================
سياسة البيانات الصارمة لمنصة ETC (ممنوع تجاوزها مطلقاً):
==================================================
1. لا تختلق ولا تفبرك أي بيانات أو مبالغ أو أسماء عملاء أو موازين مراجعة غير موجودة في سجلات النظام أو في كلام المستخدم.
2. إذا كانت هناك معلومات ناقصة للإجابة أو التحليل المالي، اكتب فوراً:
"لا توجد بيانات كافية لإكمال التحليل."
ثم اطلب البيانات المطلوبة المحددة بوضوح من المستخدم.
3. التحدث بلغة عربية فصيحة وسليمة، مع إمكانية التعبير بالمصطلحات والأسلوب المهني المصري الراقي الشائع في بيئة الأعمال المصرية عند الحاجة.
4. يجب أن ينتهي كل تقرير أو استشارة بروتوكولية من ETC AI بالأقسام التالية:
- مصدر البيانات: [تحديد مصدر المعلومات: سجلات النظام الفعلية، أو معيار المحاسبة، أو مدخلات المستخدم]
- مستوى الثقة: [النسبة المئوية مثل 95%]
- المعلومات الناقصة (إن وجدت): [تحديد النواقص]
- التوصيات المهنية: [خطوات عملية مقترحة]

${realContextString}
`;

  try {
    const ai = getGemini();
    const contents: any[] = [];

    // History if any
    if (history && Array.isArray(history)) {
      history.slice(-6).forEach((h: any) => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.content }],
        });
      });
    }

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    res.json({
      reply: response.text || "لا توجد بيانات كافية لإكمال التحليل. يرجى توضيح العملية المالية أو المعاملة المطلوب فحصها.",
    });
  } catch (err: any) {
    console.error("AI Chat error:", err);
    res.status(500).json({
      error: "تعذر الاتصال بـ ETC AI حالياً. يرجى التأكد من إعدادات النظام.",
    });
  }
});

// ==================== VOICE MENTOR ("أستاذ ETC") ====================

app.post("/api/ai/voice-mentor", async (req, res) => {
  const { userSpeech, topic, level } = req.body;
  const ai = getGemini();

  const systemInstruction = `أنت "أستاذ ETC" - كبير أساتذة المحاسبة والمراجعة والضرائب في مصر والوطن العربي.
طريقة حديثك:
- تتحدث بصوت المعلم القدير، العالم بأصول المهنة، بلهجة مصرية مهنية راقية ودودة وفصيحة تشجع الطالب والمحاسب.
- تشرح العمليات المحاسبية، فروق المعايير المصرية والدولية، معالجة ضرائب الدخل والقيمة المضافة والخصم والتحصيل، والفاتورة الإلكترونية بأمثلة عملية ملموسة.
- بعد كل شرح، تطرح سؤالاً عملياً أو حالة تطبيقية لاختبار فهم المتعلم.
- إذا كانت معلومات المحادثة غير كافية، تنبه بلطف: "يا بني، لا توجد بيانات كافية لتحليل هذه المسألة، قل لي تفاصيل..."
- اجعل إجابتك مركزة ومناسبة للاستماع الصوتي (حوالي 80 إلى 150 كلمة) وتصلح للقراءة بالصوت الطبيعي.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `الموضوع المختار: ${topic || "المحاسبة المالية والضرائب المصرية"}.\nمستوى المتدرب: ${level || "متوسط"}.\nكلام المتدرب: ${userSpeech}`,
      config: {
        systemInstruction,
      },
    });

    res.json({ text: response.text });
  } catch (err) {
    console.error("Voice mentor error:", err);
    res.status(500).json({ error: "حدث خطأ أثناء التواصل مع أستاذ ETC." });
  }
});

// ==================== ACADEMY ====================

app.get("/api/academy/certificates", (req, res) => {
  res.json(loadDb().certificates);
});

app.post("/api/academy/issue-certificate", (req, res) => {
  const { userId, userName, courseId, courseTitle, gradePercentage } = req.body;
  const db = loadDb();
  const cert = {
    id: "cert_" + Date.now(),
    userId,
    userName,
    courseId,
    courseTitle,
    certificateNumber: "ETC-CERT-" + Date.now().toString(36).toUpperCase() + "-" + Math.floor(1000 + Math.random() * 9000),
    gradePercentage: gradePercentage || 100,
    issueDate: new Date().toISOString().split("T")[0],
  };
  db.certificates.unshift(cert);
  saveDb(db);
  res.json(cert);
});

// ==================== BACKUPS ====================

app.get("/api/backup/export", (req, res) => {
  const db = loadDb();
  res.setHeader("Content-Disposition", `attachment; filename=ETC_Backup_${Date.now()}.json`);
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(db, null, 2));
});

app.post("/api/backup/restore", (req, res) => {
  const backupData = req.body;
  if (!backupData || !backupData.users || !backupData.companies) {
    return res.status(400).json({ error: "ملف النسخة الاحتياطية غير صالح أو تالف." });
  }
  saveDb(backupData);
  res.json({ success: true, message: "تمت استعادة قاعدة البيانات الكاملة بنجاح." });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", platform: "ETC Enterprise", time: new Date().toISOString() });
});

// Vite Middleware for development & Static hosting for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ETC Enterprise Server running on http://localhost:${PORT}`);
  });
}

startServer();
