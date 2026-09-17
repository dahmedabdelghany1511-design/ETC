import React from "react";
import { BluePyramidLogo } from "../../components/BluePyramidLogo";
import { PublicNavView } from "../../components/public/PublicNavbar";
import { 
  FileSpreadsheet, 
  Receipt, 
  ShieldCheck, 
  BarChart3, 
  BrainCircuit, 
  Mic, 
  GraduationCap, 
  CheckCircle2, 
  ArrowLeft,
  Lock,
  Layers,
  Sparkles,
  Calculator,
  Scale,
  FileCheck2,
  FileText
} from "lucide-react";

interface ServicesPageProps {
  onNavigate: (view: PublicNavView) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const serviceList = [
    {
      id: "accounting",
      icon: FileSpreadsheet,
      emoji: "📑",
      name: "المحاسبة المالية والقيد المزدوج",
      subtitle: "النواة المحاسبية الصارمة وفقاً لمعايير المحاسبة المصرية (EAS)",
      color: "blue",
      details: [
        "شجرة حسابات موحدة ومطابقة للدليل المحاسبي المصري الموحد مقسمة لخمسة مستويات رئيسية.",
        "نظام قيود اليومية المزدوجة المتوازنة (Double-Entry) مع إلزامية تساوي الجانب المدين والدائن.",
        "دفاتر أستاذ عام وأستاذ مساعد لحظية مع كشوف حساب تفصيلية للعملاء والموردين.",
        "ميزان مراجعة فوري بالمجاميع والأرصدة يمنع حدوث أي فوارق حسابية غير مبررة.",
        "إدارة الأصول الثابتة وحساب الإهلاك الآلي وإدارة المخزون السلعي بالمتوسط المرجح.",
      ],
      standards: "معيار المحاسبة المصري رقم (1) - عرض القوائم المالية، ومعيار رقم (2) - المخزون",
    },
    {
      id: "tax",
      icon: Receipt,
      emoji: "🧾",
      name: "الضرائب المصرية والفاتورة الإلكترونية",
      subtitle: "التكامل الرقمي الشامل مع منظومة مصلحة الضرائب المصرية (ETA)",
      color: "emerald",
      details: [
        "إصدار الفواتير الضريبية الإلكترونية (B2B) بتوقيع رقمي ورمز UUID فريد معتمد.",
        "دعم منظومة الإيصال الإلكتروني لنقاط البيع (B2C) مع توليد رمز الاستجابة السريع QR المشفر.",
        "احتساب ضريبة القيمة المضافة 14% تلقائياً وإعداد نموذج (10) لضريبة القيمة المضافة.",
        "إعداد نموذج (41) لضريبة الخصم والإضافة بنسبها القانونية (1% توريدات، 3% خدمات، 5% مهن حرة).",
        "تجهيز الإقرار الضريبي السنوي لضريبة أرباح الشركات 22.5% مع التعديلات المحاسبية والضريبية.",
      ],
      standards: "قانون الإجراءات الضريبية الموحد رقم 206 لسنة 2020، وقانون الضريبة على الدخل رقم 91 لسنة 2005",
    },
    {
      id: "audit",
      icon: ShieldCheck,
      emoji: "🔍",
      name: "المراجعة والتدقيق والرقابة الداخلية",
      subtitle: "أدوات الفحص والرقابة المعتمدة وفقاً لمعايير المراجعة المصرية والدولية",
      color: "amber",
      details: [
        "تخطيط مهمة المراجعة وتحديد نطاق الفحص وحساب حد الأهمية النسبية (Materiality Threshold).",
        "برامج فحص مفصلة تغطي تأكيدات القوائم المالية: الوجود، الاكتمال، الملكية، والتقييم.",
        "مصفوفة تقييم المخاطر (Risk Matrix) وتوثيق أوراق العمل والأدلة الثبوتية.",
        "تسجيل الثغرات الرقابية والتوصيات وإعداد خطابات الإدارة (Management Letters).",
        "نموذج معتمد لتقرير مراقب الحسابات المستقل الجاهز للطباعة والاعتماد.",
      ],
      standards: "معايير المراجعة المصرية الصادرة بقرار وزير الاستثمار",
    },
    {
      id: "analysis",
      icon: BarChart3,
      emoji: "📊",
      name: "التحليل المالي والمؤشرات التنفيذية",
      subtitle: "رؤية استراتيجية لصناع القرار والمدراء التنفيذيين ومجالس الإدارة",
      color: "indigo",
      details: [
        "توليد القوائم المالية الأربع: قائمة الدخل، المركز المالي، التدفقات النقدية، وحقوق الملكية.",
        "حساب نسب السيولة والتداول: النسبة الجارية، النسبة السريعة، ورأس المال العامل.",
        "تحليل هوامش الربحية: هامش مجمل الربح، هامش التشغيل، وصافي هامش الربح بعد الضرائب.",
        "نموذج DuPont التفكيكي لقياس العائد على الأصول (ROA) والعائد على حقوق الملكية (ROE).",
        "الموازنات التقديرية والتنبؤ المالي مع تحليل الانحرافات بين الفعلي والمخطط.",
      ],
      standards: "النمذجة المالية القياسية ومؤشرات الأداء المالي CFO KPIs",
    },
    {
      id: "ai",
      icon: BrainCircuit,
      emoji: "🤖",
      name: "مستشار ETC AI الذكي",
      subtitle: "9 أدوار استشارية مالية ورقابية مدعومة بمحرك ذكاء اصطناعي صارم",
      color: "purple",
      details: [
        "التفكير المتخصص عبر 9 أدوار: المدير المالي CFO، المراقب المالي، المراجع الخارجي، مستشار الضرائب، محاسب التكاليف، وغيرها.",
        "صرامة مطلقة: لا يولد قيوداً وهمية ولا يبتدع بيانات، بل يطالب بالمستندات عند نقص البيانات.",
        "فحص موازين المراجعة، كشف الأخطاء الحسابية، واقتراح قيود التسوية العكسية.",
        "تحليل الملفات والمرفقات بصيغ Excel و PDF و Word وكشف مؤشرات الاحتيال والتلاعب.",
        "استخراج البيانات الضريبية ومطابقتها مع المعاملات الدفترية الرسمية.",
      ],
      standards: "حظر اصطناع البيانات المالية والالتزام بالأدلة المستندية الرسمية",
    },
    {
      id: "mentor",
      icon: Mic,
      emoji: "👨‍🏫",
      name: "أستاذ ETC (المعلم الصوتي التفاعلي)",
      subtitle: "تدريب عملي تفاعلي صوتي يحاكي بيئة العمل والشركات المصرية",
      color: "sky",
      details: [
        "محادثة صوتية ذكية باللهجة المهنية المصرية تشرح المعالجات المحاسبية بدقة.",
        "دراسة حالات عملية وفحص دفاتر واقعية خطوة بخطوة بالصوت التفاعلي.",
        "تصحيح إجابات المحاسب وإرشاده للقيود المحاسبية الصحيحة وطرق الترحيل.",
        "اختبارات شفوية لتقييم الجاهزية للفحص الضريبي واجتماعات المراجعة الدورية.",
      ],
      standards: "تقنيات الصوت الحديثة Web Speech مع قاعدة المعرفة المحاسبية المصرية",
    },
    {
      id: "academy",
      icon: GraduationCap,
      emoji: "🎓",
      name: "أكاديمية ETC والشهادات المهنية",
      subtitle: "8 مسارات تدريبية وتأهيلية معتمدة لإعداد قادة الإدارات المالية",
      color: "rose",
      details: [
        "مسارات متخصصة: المحاسبة المالية، التكاليف، المراجعة، الضرائب والفاتورة الإلكترونية، Excel المالي، و Power BI.",
        "محاضرات نظرية وحالات تطبيقية واقعية مستمدة من كبرى الشركات الصناعية والتجارية.",
        "نظام امتحانات تقييمية إلكترونية صارمة لقياس الاستيعاب الحقيقي للمتدرب.",
        "إصدار شهادات إتمام رقمية رسمية برقم تسلسلي موثق يمكن التحقق من صحته وطباعته.",
      ],
      standards: "شهادات معتمدة وفقاً للكود المهني للتعليم المستمر (CPE)",
    },
  ];

  return (
    <div className="space-y-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF4FF] text-[#0A4DA3] font-bold text-xs">
          <BluePyramidLogo size="sm" textColor="dark" showText={false} />
          <span>خدمات وحلول منصة ETC المتكاملة</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0A4DA3]">
          الخدمات والحلول المهنية
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          نقدم باقة خدمات شاملة تغطي المحاسبة، الضرائب، المراجعة، التحليل المالي، الذكاء الاصطناعي، التدريب الصوتي، والأكاديمية المعتمدة.
        </p>
      </div>

      {/* Services Detailed Cards List */}
      <div className="space-y-12">
        {serviceList.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-xs hover:shadow-xl transition-all relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                {/* Left (or Right in RTL): Icon & Title */}
                <div className="lg:w-1/3 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#EAF4FF] text-[#0A4DA3] flex items-center justify-center font-bold text-3xl shadow-inner shrink-0">
                      <span>{service.emoji}</span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-400">الخدمة #{index + 1}</span>
                      <h2 className="text-2xl font-black text-slate-900">{service.name}</h2>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-[#0A4DA3] leading-relaxed">
                    {service.subtitle}
                  </p>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 block">المرجعية المعيارية والتشريعية:</span>
                    <span className="text-slate-500">{service.standards}</span>
                  </div>

                  <button
                    onClick={() => onNavigate("login")}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>تشغيل الخدمة في المنصة</span>
                  </button>
                </div>

                {/* Right: Features details */}
                <div className="lg:w-2/3 space-y-4 bg-slate-50/70 p-6 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>القدرات الوظيفية والمخرجات المعتمدة:</span>
                  </h3>

                  <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                    {service.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#0A4DA3] shrink-0 mt-2"></span>
                        <span className="leading-relaxed">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#062552] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl">
        <h3 className="text-2xl sm:text-3xl font-black">
          هل تحتاج لحل مخصص أو ربط مباشر مع أنظمة شركتك؟
        </h3>
        <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
          فريقنا الاستشاري التقني والمحاسبي مستعد لتقديم المشورة ودراسة متطلبات منشأتك لتفعيل المنظومة بكفاءة وسرعة.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => onNavigate("contact")}
            className="px-8 py-3.5 bg-white text-[#0A4DA3] hover:bg-blue-50 font-black rounded-2xl shadow-lg transition-all text-sm"
          >
            تواصل معنا الآن
          </button>
          <button
            onClick={() => onNavigate("login")}
            className="px-8 py-3.5 bg-blue-900/80 hover:bg-blue-900 border border-white/20 text-white font-bold rounded-2xl transition-all text-sm"
          >
            تسجيل الدخول للمنصة
          </button>
        </div>
      </div>
    </div>
  );
};
