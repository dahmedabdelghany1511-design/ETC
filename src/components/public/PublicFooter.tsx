import React from "react";
import { BluePyramidLogo } from "../BluePyramidLogo";
import { 
  ShieldCheck, 
  FileCheck2, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Lock, 
  Sparkles, 
  Scale, 
  ArrowUpRight 
} from "lucide-react";
import { PublicNavView } from "./PublicNavbar";

interface PublicFooterProps {
  onNavigate: (view: PublicNavView) => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#062552] text-white border-t border-blue-900/50 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-blue-800/40">
          {/* Col 1 & 2: Branding & Vision */}
          <div className="lg:col-span-2 space-y-4">
            <BluePyramidLogo size="lg" textColor="white" showSubtitle={true} />
            <p className="text-slate-300 text-sm leading-relaxed max-w-md pt-2">
              منصة ETC الذكية المتكاملة للمحاسبة والمراجعة والضرائب وإدارة الأعمال، مبنية بدقة صارمة وفقاً لمعايير المحاسبة المصرية (EAS)، وتلتزم التزاماً تاماً بنظام القيد المزدوج والبيانات الحقيقية دون أي اصطناع للبيانات أو التخمين.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-xs text-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>تشفير مصرفي 256-bit</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-xs text-blue-200">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                <span>معايير المحاسبة المصرية EAS</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-xs text-blue-200">
                <Scale className="w-3.5 h-3.5 text-amber-400" />
                <span>تكامل الفاتورة الإلكترونية ETA</span>
              </div>
            </div>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 border-b border-blue-500/30 pb-2">
              الخدمات المتخصصة
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-blue-400">📑</span> المحاسبة والقيد المزدوج
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-blue-400">🧾</span> الضرائب والفاتورة الإلكترونية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-blue-400">🔍</span> المراجعة والتدقيق والرقابة
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-blue-400">📊</span> التحليل المالي والمؤشرات
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-blue-400">🤖</span> مستشار ETC AI (9 أدوار)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-blue-400">🎓</span> أكاديمية ETC والشهادات
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Quick Navigation */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 border-b border-blue-500/30 pb-2">
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>
                <button onClick={() => onNavigate("home")} className="hover:text-white transition-colors">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("about")} className="hover:text-white transition-colors">
                  عن منصة ETC ورؤيتها
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("contact")} className="hover:text-white transition-colors">
                  طلب عرض توضيحي وتواصل
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("login")} className="hover:text-white transition-colors font-bold text-blue-300">
                  تسجيل الدخول للمنصة
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate("register")} className="hover:text-white transition-colors">
                  إنشاء حساب مستخدم جديد
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 border-b border-blue-500/30 pb-2">
              التواصل والدعم
            </h4>
            <ul className="space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                <span>القاهرة الجديدة / مصر الجديدة، جمهورية مصر العربية</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span dir="ltr">+20 10 0000 0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@etc.corp</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                <span>الدعم الفني متاح 24/7 للمؤسسات</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} لمنصة ETC الذكية للمحاسبة والمراجعة والضرائب وإدارة الأعمال.
          </p>
          <div className="flex items-center gap-6">
            <span>الامتثال والسرية المهنية</span>
            <span>سياسة البيانات والحوكمة</span>
            <span>معايير EAS & ETA</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
