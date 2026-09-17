import React, { useState } from "react";
import { Company } from "../types";
import {
  FileText,
  Printer,
  Download,
  Calendar,
  Filter,
  CheckCircle,
  BarChart3,
  Receipt,
  Search,
  Scale
} from "lucide-react";

interface ReportsPageProps {
  activeCompany: Company | null;
  onNavigate: (page: string) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ activeCompany, onNavigate }) => {
  const [selectedReport, setSelectedReport] = useState("trial-balance");

  const reportsList = [
    { id: "trial-balance", title: "تقرير ميزان المراجعة بالمجاميع والأرصدة", icon: Scale, page: "accounting" },
    { id: "income-statement", title: "تقرير قائمة الدخل الشامل (الأرباح والخسائر)", icon: BarChart3, page: "financial-statements" },
    { id: "balance-sheet", title: "تقرير المركز المالي (الميزانية العمومية)", icon: BarChart3, page: "financial-statements" },
    { id: "vat-report", title: "تقرير إقرار ضريبة القيمة المضافة (نموذج 10)", icon: Receipt, page: "tax" },
    { id: "e-invoice-register", title: "سجل الفواتير الإلكترونية المعتمدة (ETA)", icon: Receipt, page: "tax" },
    { id: "audit-report", title: "تقرير المراجعة المستقل ومصفوفة المخاطر", icon: Search, page: "audit" },
  ];

  if (!activeCompany) {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4">
        <FileText className="w-16 h-16 text-slate-300 mx-auto" />
        <h3 className="text-lg font-black text-slate-800">لا توجد بيانات حتى الآن</h3>
        <p className="text-xs text-slate-500">يرجى إضافة أو تحديد شركة لاستعراض واستخراج التقارير المالية والضريبية المعتمدة.</p>
        <button
          onClick={() => onNavigate("companies")}
          className="px-4 py-2 bg-[#0A4DA3] text-white rounded-xl text-xs font-bold shadow-sm"
        >
          ➕ إضافة أو اختيار شركة
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#0A4DA3]" />
            <span>مركز التقارير المالية والضريبية المعتمدة (Reports Center)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            استخراج وطباعة وتصدير كافة التقارير الرسمية الموثقة برقم تسجيل الشركة ورمز الاعتماد.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة التقرير الحالي</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportsList.map((r) => {
          const Icon = r.icon;
          return (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A4DA3] flex items-center justify-center font-bold mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">{r.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  بيانات فورية محسوبة من قيود شركة {activeCompany?.name}.
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => onNavigate(r.page)}
                  className="text-xs font-bold text-[#0A4DA3] hover:underline"
                >
                  فتح واستعراض التقرير
                </button>
                <button
                  onClick={() => window.print()}
                  className="text-slate-400 hover:text-slate-700"
                  title="طباعة"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
