import React from "react";
import { BluePyramidLogo } from "../../components/BluePyramidLogo";
import { PublicNavView } from "../../components/public/PublicNavbar";
import { 
  Eye, 
  Target, 
  Layers, 
  Sparkles, 
  Scale, 
  Receipt, 
  ShieldCheck, 
  BrainCircuit, 
  CheckCircle2, 
  ArrowLeft,
  BookOpen,
  Award,
  Lock,
  Cpu
} from "lucide-react";

interface AboutPageProps {
  onNavigate: (view: PublicNavView) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header Header */}
      <div className="text-center max-w-3xl mx-auto pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF4FF] text-[#0A4DA3] font-bold text-xs">
          <BluePyramidLogo size="sm" textColor="dark" showText={false} />
          <span>منظومة متخصصة لإدارة الأعمال والمحاسبة المصرية</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0A4DA3]">
          عن منصة ETC
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          منصة ETC الذكية للمحاسبة والمراجعة والضرائب وإدارة الأعمال، صُممت لتكون حجر الزاوية للمؤسسات والشركات الطامحة لأعلى درجات الدقة المحاسبية والامتثال التشريعي.
        </p>
      </div>

      {/* 1. رؤية المنصة & 2. أهداف المنصة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* رؤية المنصة */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF4FF] text-[#0A4DA3] flex items-center justify-center font-bold text-2xl shadow-inner">
            <Eye className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">رؤية المنصة (Vision)</h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            أن نكون المنظومة المحاسبية والرقابية والضريبية الرقمية الأولى في مصر والشرق الأوسط، التي تدمج الصرامة المهنية وفقاً لمعايير المحاسبة المصرية (EAS) مع الذكاء الاصطناعي المسؤول والواعي بالبيانات الواقعية، بما يحقق الحوكمة المالية المطلقة وينهي الأخطاء المحاسبية تماماً.
          </p>
          <div className="pt-2 text-xs font-bold text-[#0A4DA3] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>ريادة مهنية معتمدة من كبار خبراء المحاسبة</span>
          </div>
        </div>

        {/* أهداف المنصة */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl shadow-inner">
            <Target className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">أهداف المنصة (Objectives)</h2>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">1</span>
              <span>أتمتة العمليات المحاسبية بنظام القيد المزدوج المتوازن بنسبة 100% دون فوارق ميزان.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">2</span>
              <span>الامتثال اللحظي مع منظومة الفاتورة والإيصال الإلكتروني لمصلحة الضرائب المصرية ETA.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">3</span>
              <span>تمكين المراجعين الداخليين والخارجيين من أدوات فحص وتخطيط متوافقة مع معايير المراجعة.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold">4</span>
              <span>توفير مستشار ذكاء اصطناعي حقيقي يعتمد فقط على المستندات والبيانات المسجلة.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. المميزات الرئيسية */}
      <div className="bg-[#F8FAFC] p-8 sm:p-12 rounded-3xl border border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#0A4DA3] uppercase tracking-wider">التميز المؤسسي</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">أبرز مميزات منصة ETC</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-2xl">🏛️</div>
            <h3 className="font-bold text-slate-900 text-base">دليل محاسبي مصري موحد</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              شجرة حسابات مبوبة بدقة للأصول والالتزامات وحقوق الملكية والإيرادات والمصروفات.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-2xl">⚖️</div>
            <h3 className="font-bold text-slate-900 text-base">رقابة ميزان المراجعة</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              توليد فوري لميزان المراجعة بالمجاميع والأرصدة مع التحقق الدائم من انعدام الفروق.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-2xl">🏢</div>
            <h3 className="font-bold text-slate-900 text-base">تعدد الشركات والفروع</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              عزل تام لكافة الحركات والقيود والسجلات لكل شركة مع التبديل السلس بين المنشآت.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <div className="text-2xl">🔐</div>
            <h3 className="font-bold text-slate-900 text-base">صلاحيات دقيقة (RBAC)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              مصفوفة أدوار احترافية مستوحاة من Microsoft Dynamics مع تعقب دقيق لكافة الجلسات.
            </p>
          </div>
        </div>
      </div>

      {/* 4. الحلول المحاسبية & 5. الحلول الضريبية & 6. الحلول الرقابية & 7. الذكاء الاصطناعي */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#0A4DA3] uppercase tracking-wider">الحلول التخصصية</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">أعمدة الحلول الأربعة في ETC</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* الحلول المحاسبية */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A4DA3] flex items-center justify-center font-bold">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">الحلول المحاسبية (Accounting)</h3>
                <p className="text-xs text-slate-500">معايير المحاسبة المصرية (EAS)</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              توفير محرك محاسبي كامل يشمل قيود اليومية، دفاتر الأستاذ العام، دفاتر الأستاذ المساعد، إدارة حسابات العملاء والموردين، إدارة المخزون وتقييمه بالمتوسط المرجح، والأصول الثابتة وحساب الإهلاك الآلي.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">القيد المزدوج</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">مراكز التكلفة</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">التسويات الجردية</span>
            </div>
          </div>

          {/* الحلول الضريبية */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">الحلول الضريبية (Tax Compliance)</h3>
                <p className="text-xs text-slate-500">قوانين الضرائب المصرية ومصلحة الضرائب ETA</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              تكامل شامل مع الفاتورة والإيصال الإلكتروني، واحتساب آلي لضريبة القيمة المضافة 14%، ضرائب كسب العمل، ضرائب الخصم والإضافة (نموذج 41)، وإعداد الإقرار الضريبي السنوي لضريبة أرباح الشركات 22.5%.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">الفاتورة الإلكترونية B2B</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">الإيصال الإلكتروني B2C</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">نموذج (10) و (41)</span>
            </div>
          </div>

          {/* الحلول الرقابية */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">الحلول الرقابية والمراجعة (Audit)</h3>
                <p className="text-xs text-slate-500">المراجعة الداخلية والخارجية والحوكمة</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              أدوات تخطيط مهام المراجعة وتحديد حد الأهمية النسبية (Materiality)، برامج التدقيق، مصفوفة تقييم المخاطر، توثيق أوراق العمل، ورصد الثغرات الرقابية والتوصيات وصولاً إلى تقرير مراقب الحسابات المستقل.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">الأهمية النسبية</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">برامج الفحص</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">تقرير مراقب الحسابات</span>
            </div>
          </div>

          {/* الذكاء الاصطناعي المسؤول */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">الذكاء الاصطناعي المسؤول (ETC AI)</h3>
                <p className="text-xs text-slate-500">مستشار متخصص يعتمد على البيانات الحقيقية فقط</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              نظام استشاري يتقمص 9 أدوار مهنية تنفيذية (CFO، خبير ضرائب، مراجع خارجي، إلخ)، يحلل ملفاتك والقيود، يكشف مؤشرات الاحتيال، ويشير بوضوح عند غياب المستندات دون أي تخمين أو تأليف.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">9 أدوار قيادية</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">محلل ملفات Excel و PDF</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700">كشف الاحتيال</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-[#0A4DA3] text-white p-8 sm:p-10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-right">
          <h3 className="text-2xl font-black">جاهز لاستكشاف المنصة بنفسك؟</h3>
          <p className="text-blue-100 text-sm">سجل دخولك الآن إلى لوحة التحكم أو تواصل مع مستشارينا المعتمدين.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("login")}
            className="px-6 py-3 bg-white text-[#0A4DA3] font-bold rounded-xl text-sm hover:bg-blue-50 transition-all shadow-md"
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => onNavigate("contact")}
            className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl text-sm hover:bg-blue-950 border border-white/20 transition-all"
          >
            تواصل معنا
          </button>
        </div>
      </div>
    </div>
  );
};
