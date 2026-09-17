import React, { useState } from "react";
import { BluePyramidLogo } from "../../components/BluePyramidLogo";
import { PublicNavView } from "../../components/public/PublicNavbar";
import { 
  Lock, 
  UserPlus, 
  PhoneCall, 
  Info, 
  ShieldCheck, 
  FileSpreadsheet, 
  Calculator, 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  Building2, 
  Layers, 
  BrainCircuit, 
  GraduationCap, 
  Mic, 
  BarChart3, 
  FileCheck2,
  Users,
  Award,
  Globe2,
  Cpu,
  ReceiptText
} from "lucide-react";

interface HomePageProps {
  onNavigate: (view: PublicNavView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const stats = [
    { label: "معايير المحاسبة المصرية (EAS)", value: "100%", sub: "توافق كامل مع أحدث التعديلات" },
    { label: "منظومة مصلحة الضرائب (ETA)", value: "B2B & B2C", sub: "الفاتورة والإيصال الإلكتروني" },
    { label: "أدوار المستشار الذكي المتخصص", value: "9 أدوار", sub: "CFO، مراقب، مراجع، مستشار" },
    { label: "مصداقية البيانات المحاسبية", value: "0% وهمي", sub: "اعتماد حصري على السجلات الفعلية" },
  ];

  const services = [
    {
      id: "accounting",
      title: "📑 المحاسبة المالية والقيد المزدوج",
      desc: "شجرة حسابات موحدة، قيود يومية متوازنة، دفاتر الأستاذ العام، وميزان مراجعة لحظي يمنع أي خلل رياضي.",
      badge: "EAS Compliant",
    },
    {
      id: "tax",
      title: "🧾 الضرائب المصرية والفاتورة الإلكترونية",
      desc: "احتساب ضريبة القيمة المضافة 14%، ضرائب الخصم والتحصيل، الإقرارات الضريبية، وتوليد الفواتير برمز UUID وQR.",
      badge: "ETA Certified",
    },
    {
      id: "audit",
      title: "🔍 المراجعة والتدقيق والرقابة الداخلية",
      desc: "تخطيط مهام المراجعة، حساب الأهمية النسبية، برامج الفحص، مصفوفة المخاطر، وإصدار تقرير مراقب الحسابات.",
      badge: "Audit Standards",
    },
    {
      id: "analysis",
      title: "📊 التحليل المالي والمؤشرات التنفيذية",
      desc: "القوائم المالية الأربع (الدخل، المركز المالي، التدفقات، الملكية)، مؤشرات السيولة، والربحية، ونموذج DuPont.",
      badge: "Executive KPIs",
    },
    {
      id: "ai",
      title: "🤖 ETC AI (المستشار المالي الذكي)",
      desc: "نواة ذكاء اصطناعي تفكر كمدير مالي CFO وخبير ضرائب ومراجع، تعتمد حصراً على المستندات الحقيقية بدون تلفيق.",
      badge: "Real-Data AI",
    },
    {
      id: "mentor",
      title: "👨‍🏫 أستاذ ETC (المعلم الصوتي التفاعلي)",
      desc: "تدريب تطبيقي صوتي تفاعلي لحالات فحص وقيود محاسبية واقعية من بيئة الشركات المصرية.",
      badge: "Voice Training",
    },
    {
      id: "academy",
      title: "🎓 أكاديمية ETC والشهادات المهنية",
      desc: "8 مسارات تدريبية معتمدة، اختبارات إلكترونية صارمة، وإصدار شهادات معتمدة برقم تسلسلي موثق.",
      badge: "Accredited Tracks",
    },
  ];

  const faqs = [
    {
      q: "هل تتوافق منصة ETC مع أحدث معايير المحاسبة المصرية (EAS)؟",
      a: "نعم، تم تصميم منصة ETC بالكامل لتتوافق حرفياً مع أحدث تعديلات معايير المحاسبة المصرية، حيث تتضمن دليلاً محاسبياً مصرياً موحداً وقوائم مالية تطابق متطلبات الهيئة العامة للرقابة المالية ومصلحة الضرائب المصرية.",
    },
    {
      q: "كيف تدعم المنصة منظومة الفاتورة والإيصال الإلكتروني بمصلحة الضرائب؟",
      a: "المنصة مجهزة بآلية متطورة لإنشاء الفواتير الإلكترونية المعتمدة (B2B) برمز UUID مشفر، وتكويد الأصناف بنظامي EGS وGS1، إلى جانب دعم نقاط بيع الإيصال الإلكتروني (B2C) مع توليد رمز الاستجابة السريع QR المشفر واحتساب ضريبة القيمة المضافة 14% تلقائياً.",
    },
    {
      q: "ما هي سياسة الذكاء الاصطناعي الصارمة في المنصة (ETC AI)؟",
      a: "تتبع المنصة سياسة صارمة تنص على: عدم اختلاق أي أرقام أو قيود أو حسابات من العدم، والاعتماد حصراً على البيانات المدخلة والمستندات المرفوعة. وفي حال غياب المستندات الكافية، يطالب النظام صراحة بتقديم المستند المؤيد ومستوى الثقة ولا يولد تقارير خيالية.",
    },
    {
      q: "هل يمكن إدارة أكثر من شركة وفروع متعددة على نفس النظام؟",
      a: "بالتأكيد. تدعم ETC معمارية تعدد المنشآت (Multi-Tenant Architecture) مع عزل فيزيائي وقانوني كامل لبيانات كل منشأة، مع إمكانية التبديل السريع بين الشركات للمستخدمين المصرح لهم.",
    },
    {
      q: "ما هي درجات الأمان وحماية سرية البيانات المالية؟",
      a: "تعتمد المنصة على تشفير قياسي 256-bit، ونظام صلاحيات هرمي متعدد المستويات (RBAC) يتوافق مع أفضل ممارسات Microsoft Dynamics وSAP، ومراقبة فورية للجلسات النشطة وسجلات تدقيق كاملة لكافة العمليات.",
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 lg:pt-20 pb-16 bg-gradient-to-b from-white via-[#F8FAFC] to-white">
        {/* Background Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Pyramid Emblem & Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#EAF4FF] border border-blue-200 shadow-xs animate-in fade-in duration-500">
              <BluePyramidLogo size="sm" textColor="dark" showText={false} />
              <span className="text-xs sm:text-sm font-bold text-[#0A4DA3]">
                المنظومة الأولى المعتمدة وفقاً لمعايير المحاسبة والضرائب المصرية
              </span>
            </div>

            {/* Hero Main Heading */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#0A4DA3] tracking-tight leading-tight sm:leading-none">
              ETC
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 leading-snug">
              منصة ETC الذكية للمحاسبة والمراجعة والضرائب وإدارة الأعمال
            </p>

            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              منظومة تخطيط الموارد المؤسسية (ERP) المتقدمة، تجمع بين الصرامة المحاسبية المصرية، الامتثال الضريبي الكامل، الرقابة الداخلية، والمستشار المالي الذكي المدعوم بالبيانات الحقيقية.
            </p>

            {/* Action Buttons as explicitly requested */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate("login")}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-2xl text-base font-bold shadow-lg shadow-blue-900/25 transition-all hover:-translate-y-0.5"
              >
                <Lock className="w-5 h-5 text-blue-200" />
                <span>تسجيل الدخول</span>
              </button>

              <button
                onClick={() => onNavigate("register")}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#0A4DA3] border-2 border-[#0A4DA3] rounded-2xl text-base font-bold shadow-sm transition-all hover:-translate-y-0.5"
              >
                <UserPlus className="w-5 h-5 text-[#0A4DA3]" />
                <span>إنشاء حساب</span>
              </button>

              <button
                onClick={() => onNavigate("contact")}
                className="flex items-center gap-2 px-5 py-3.5 bg-[#EAF4FF] hover:bg-[#d5e8ff] text-[#0A4DA3] border border-blue-200 rounded-2xl text-sm sm:text-base font-bold transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>تواصل معنا</span>
              </button>

              <button
                onClick={() => onNavigate("about")}
                className="flex items-center gap-2 px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-sm sm:text-base font-bold transition-all"
              >
                <Info className="w-4 h-4 text-slate-500" />
                <span>تعرف على ETC</span>
              </button>
            </div>
          </div>

          {/* Stats Badges Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((st, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-1 hover:border-blue-300 transition-colors"
              >
                <div className="text-2xl sm:text-3xl font-black text-[#0A4DA3]" dir="ltr">
                  {st.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-800">{st.label}</div>
                <div className="text-[11px] text-slate-400">{st.sub}</div>
              </div>
            ))}
          </div>

          {/* Interactive ERP Mockup Showcase */}
          <div className="mt-12 max-w-5xl mx-auto rounded-3xl bg-slate-900 p-2 sm:p-4 shadow-2xl border border-slate-800 relative">
            {/* Window chrome header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
                <span className="mr-2 text-slate-300 font-mono">ETC Enterprise Hub | Egyptian Accounting Standards</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>قاعدة بيانات نشطة - قيد مزدوج متوازن</span>
              </div>
            </div>

            {/* Screen Mock Body */}
            <div className="bg-[#0b172a] p-4 sm:p-6 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
              {/* Card 1: Balance Sheet Check */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-300 font-bold">المعادلة المحاسبية للمركز المالي</span>
                  <span className="text-[10px] px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono">متزنة 100%</span>
                </div>
                <div className="text-lg font-black text-white">
                  الأصول = الالتزامات + حقوق الملكية
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden flex">
                  <div className="w-1/2 bg-blue-500"></div>
                  <div className="w-1/2 bg-emerald-500"></div>
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>الجانب المدين المعتمد</span>
                  <span>الجانب الدائن المعتمد</span>
                </div>
              </div>

              {/* Card 2: ETA e-Invoice */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-300 font-bold">الفاتورة الضريبية الإلكترونية</span>
                  <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded">UUID معتمد</span>
                </div>
                <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                  <div className="flex justify-between">
                    <span>ضريبة القيمة المضافة:</span>
                    <span className="text-emerald-400 font-bold">14.0% VAT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ضريبة الخصم والتحصيل:</span>
                    <span className="text-amber-400">1.0% WHT</span>
                  </div>
                  <div className="flex justify-between">
                    <span>تكويد السلع الموحد:</span>
                    <span className="text-slate-300">EGS / GS1 Validated</span>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 border-t border-slate-700 pt-2 flex items-center justify-between">
                  <span>ختم إلكتروني مصلحة الضرائب</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Card 3: Strict AI Intelligence */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-300 font-bold">ETC AI - مستشار التحليل المالي</span>
                  <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded">CFO Mode</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "فحص ميزان المراجعة يؤكد سلامة قيود الإقفال الشهري وتطابق ضريبة المخرجات مع نموذج (10) دون فروق تسوية."
                </p>
                <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>استناد قطعي لمستندات الدفاتر الفعلية</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#0A4DA3] bg-[#EAF4FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            المعايير المؤسسية الفائقة
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            لماذا تختار المؤسسات الكبرى منصة ETC؟
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            تم بناء المنصة بأيدي خبراء محاسبة وقانونيين في مصر، لتكون المرجع الرقمي الأوثق لإدارة كافة العمليات المحاسبية والرقابية والضريبية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0A4DA3] flex items-center justify-center font-bold text-2xl shadow-inner">
              <Scale className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">دقة القيد المزدوج الصارم</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              لا يمكن ترحيل أو حفظ أي قيد يومية إلا إذا تساوى الجانب المدين مع الجانب الدائن بدقة مطلقة. النظام يمنع التلاعب ويمنع إنشاء أي بيانات وهمية.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl shadow-inner">
              <ReceiptText className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">امتثال ضريبي شامل ETA</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              تجهيز وإصدار الفواتير والإيصالات الإلكترونية المعتمدة طبقاً لمواصفات مصلحة الضرائب المصرية، مع إعداد نماذج الإقرارات الشهرية والسنوية.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-2xl shadow-inner">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">ذكاء اصطناعي قائم على الدليل</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              مستشار مالي ورقابي فوري لا يخمن ولا يبتدع قوانين. يعتمد مباشرة على ملفاتك ومستنداتك وسجلات الدفاتر لتقديم تحليلات وتوصيات مدعومة بالأدلة.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SERVICES SECTION ================= */}
      <section className="bg-[#F8FAFC] py-20 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0A4DA3] bg-[#EAF4FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                منظومة الحلول المتكاملة
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                خدمات منصة ETC الاحترافية
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl">
                باقة متكاملة تغطي كافة متطلبات الإدارات المالية، مكاتب المحاسبة والمراجعة، والإدارة العليا.
              </p>
            </div>

            <button
              onClick={() => onNavigate("services")}
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0A4DA3] hover:underline"
            >
              <span>عرض تفاصيل كافة الخدمات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:border-[#0A4DA3] hover:shadow-lg transition-all space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-[#EAF4FF] text-[#0A4DA3]">
                      {srv.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{srv.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{srv.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onNavigate("services")}
                    className="text-xs font-bold text-[#0A4DA3] hover:text-[#1565C0] flex items-center gap-1"
                  >
                    <span>تفاصيل الخدمة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onNavigate("login")}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800"
                  >
                    دخول المنصة
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-[#0A4DA3] bg-[#EAF4FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            ثقة قادة المهنة
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            ماذا يقول كبار المحاسبين ومراقبي الحسابات؟
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            شهادات حقيقية من مدراء ماليين ومراقبين قانونيين يعتمدون على المنظومة في أعمالهم اليومية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative">
            <div className="text-amber-400 text-2xl font-serif">★★★★★</div>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "منصة ETC غيّرت مفهوم العمل المحاسبي في مجموعتنا؛ الصرامة في اشتراط توازن القيود وتوافق ميزان المراجعة مع معايير EAS أوقف تماماً أخطاء التسويات السنوية."
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0A4DA3] font-bold flex items-center justify-center text-sm">
                م.ع
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">أ. د. محمود عبد العزيز</h4>
                <p className="text-xs text-slate-500">مدير مالي تنفيذي (CFO) - مجموعة صناعية</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative">
            <div className="text-amber-400 text-2xl font-serif">★★★★★</div>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "كمراقب حسابات خارجي، ميزة تخطيط مهمة المراجعة وحساب الأهمية النسبية ومصفوفة المخاطر داخل ETC وفرت على فريق المراجعة أكثر من 40% من وقت الفحص الميداني."
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-sm">
                ط.س
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">أ. طارق السعدني</h4>
                <p className="text-xs text-slate-500">مراقب حسابات ومحاسب قانوني مقيد</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative">
            <div className="text-amber-400 text-2xl font-serif">★★★★★</div>
            <p className="text-sm text-slate-700 leading-relaxed italic">
              "التكامل الحقيقي مع الفاتورة والإيصال الإلكتروني وتجهيز نماذج (10) و (41) جعل الفحص الضريبي سلساً بدون أي غرامات تأخير أو مطالبات غير متطابقة."
            </p>
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                م.ش
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">أ. منى الشاذلي</h4>
                <p className="text-xs text-slate-500">مستشارة ضرائب وخبيرة التحول الرقمي</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold text-[#0A4DA3] bg-[#EAF4FF] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            الأسئلة الشائعة
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
            كل ما تود معرفته عن منصة ETC
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            إجابات واضحة ومباشرة عن الاستفسارات الأكثر تكراراً لدى العملاء والشركات.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-right font-bold text-slate-900 hover:text-[#0A4DA3] flex items-center justify-between gap-4 transition-colors"
                >
                  <span className="text-base">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#0A4DA3] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-50 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0A4DA3] via-[#1565C0] to-[#0A4DA3] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">
              ابدأ الآن بالانضمام إلى أرقى منظومة محاسبية في مصر
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              سجل حسابك المهني اليوم أو اطلب جلسة عرض تقديمي متخصصة لمؤسستك للتعرف على حلول ETC المعتمدة.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate("register")}
                className="px-8 py-3.5 bg-white text-[#0A4DA3] hover:bg-blue-50 font-black rounded-2xl shadow-lg transition-all text-sm sm:text-base"
              >
                إنشاء حساب جديد للمنشأة
              </button>
              <button
                onClick={() => onNavigate("contact")}
                className="px-8 py-3.5 bg-blue-900/60 hover:bg-blue-900/80 border border-white/20 text-white font-bold rounded-2xl transition-all text-sm sm:text-base"
              >
                تواصل مع مستشار ETC
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
