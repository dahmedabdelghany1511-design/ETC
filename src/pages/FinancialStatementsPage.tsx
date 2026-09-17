import React, { useEffect, useState } from "react";
import { Company } from "../types";
import { api } from "../services/api";
import {
  BarChart3,
  Printer,
  Download,
  Scale,
  CheckCircle,
  AlertTriangle,
  FileText,
  Building2,
  Calendar
} from "lucide-react";
import { formatNumber } from "../utils/formatters";

interface FinancialStatementsPageProps {
  activeCompany: Company | null;
}

export const FinancialStatementsPage: React.FC<FinancialStatementsPageProps> = ({
  activeCompany,
}) => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"income" | "balance-sheet" | "cash-flow" | "notes">("income");
  const [data, setData] = useState<{
    incomeStatement: {
      revenues: number;
      expenses: number;
      netIncomeBeforeTax: number;
      taxExpense: number;
      netProfit: number;
    };
    balanceSheet: {
      assets: number;
      liabilities: number;
      equity: number;
      isBalanced: boolean;
    };
  } | null>(null);

  useEffect(() => {
    if (activeCompany) {
      loadStatements();
    }
  }, [activeCompany?.id]);

  const loadStatements = async () => {
    setLoading(true);
    try {
      const res = await api.getFinancialStatements();
      setData(res);
    } catch (err) {
      console.error("Failed to load statements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currency = activeCompany?.currency || "ج.م";

  if (!activeCompany) {
    return (
      <div className="p-12 text-center max-w-xl mx-auto space-y-4">
        <BarChart3 className="w-16 h-16 text-slate-300 mx-auto" />
        <h3 className="text-lg font-black text-slate-800">لا توجد بيانات حتى الآن</h3>
        <p className="text-xs text-slate-500">يرجى اختيار منشأة أو إضافة شركة لعرض وتوليد القوائم المالية المعتمدة.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 text-right print:p-0 print:m-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 print:hidden">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#0A4DA3]" />
            <span>القوائم المالية الختامية (Financial Statements)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            معدة ومحسوبة تلقائياً من واقع قيود اليومية المعتمدة طبقاً لمعايير المحاسبة المصرية (EAS) والدولية (IFRS).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة القوائم / تصدير PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Company Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center space-y-1 shadow-sm">
        <h3 className="text-lg font-black text-slate-900">{activeCompany?.name}</h3>
        <p className="text-xs text-slate-500 font-medium">
          السجل التجاري: {activeCompany?.commercialRegistration || "غير مسجل"} | الرقم الضريبي: {activeCompany?.taxRegistrationNumber || "غير مسجل"}
        </p>
        <p className="text-xs font-bold text-[#0A4DA3] pt-1">
          عن الفترة المالية المنتهية في {new Date().toLocaleDateString("ar-EG")} (المبالغ بالجنيه المصري)
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 print:hidden text-xs font-bold">
        {[
          { id: "income", label: "قائمة الدخل الشامل (الأرباح والخسائر)" },
          { id: "balance-sheet", label: "قائمة المركز المالي (الميزانية العمومية)" },
          { id: "cash-flow", label: "قائمة التدفقات النقدية" },
          { id: "notes", label: "الإيضاحات المتممة للقوائم" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === t.id
                ? "border-[#0A4DA3] text-[#0A4DA3] bg-blue-50/50"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* INCOME STATEMENT */}
      {activeTab === "income" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-black text-sm text-slate-800">قائمة الدخل (الأرباح أو الخسائر)</h4>
            <span className="text-xs text-slate-500">وفقاً لمعيار المحاسبة المصري (1)</span>
          </div>

          <div className="p-6 divide-y divide-slate-100 text-xs">
            {/* Revenues */}
            <div className="py-3 flex items-center justify-between font-bold text-slate-900">
              <span className="text-sm">إجمالي الإيرادات والمبيعات التشغيلية</span>
              <span className="font-mono text-sm text-emerald-700">
                {formatNumber(data?.incomeStatement.revenues)} {currency}
              </span>
            </div>

            {/* Expenses */}
            <div className="py-3 flex items-center justify-between text-slate-700">
              <span>يخصم: تكلفة النشاط والمصروفات الإدارية والعمومية</span>
              <span className="font-mono text-red-600">
                ({formatNumber(data?.incomeStatement.expenses)}) {currency}
              </span>
            </div>

            {/* Net Before Tax */}
            <div className="py-3 flex items-center justify-between font-bold bg-slate-50 px-3 rounded-lg">
              <span>صافي أرباح / (خسائر) النشاط قبل الضريبة</span>
              <span className="font-mono text-sm">
                {formatNumber(data?.incomeStatement.netIncomeBeforeTax)} {currency}
              </span>
            </div>

            {/* Tax Expense */}
            <div className="py-3 flex items-center justify-between text-slate-700">
              <span>ضريبة الدخل المستحقة (22.5% وفقاً للقانون 91 لسنة 2005)</span>
              <span className="font-mono text-amber-700">
                ({formatNumber(data?.incomeStatement.taxExpense)}) {currency}
              </span>
            </div>

            {/* Final Net Profit */}
            <div className="py-4 flex items-center justify-between font-black text-base bg-blue-50/50 px-4 rounded-xl border border-blue-100">
              <span className="text-[#0A4DA3]">صافي الربح / (الخسارة) للفترة المحاسبية</span>
              <span className={`font-mono text-lg ${
                (data?.incomeStatement.netProfit || 0) >= 0 ? "text-emerald-700" : "text-red-700"
              }`}>
                {formatNumber(data?.incomeStatement.netProfit)} {currency}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* BALANCE SHEET */}
      {activeTab === "balance-sheet" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-black text-sm text-slate-800">قائمة المركز المالي (Balance Sheet)</h4>
            <div>
              {data?.balanceSheet.isBalanced ? (
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  الميزانية متزنة تماماً (الأصول = الالتزامات + حقوق الملكية)
                </span>
              ) : (
                <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  يوجد عدم اتزان في القيود المرحّلة
                </span>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Side 1: Assets */}
            <div className="space-y-4 border-l border-slate-100 pl-4">
              <h5 className="font-bold text-sm text-[#0A4DA3] border-b pb-2">الأصول (Assets)</h5>
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-600">الأصول غير المتداولة (أصول ثابتة ومشروعات تحت التنفيذ)</span>
                  <span className="font-mono font-bold">-</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-600">الأصول المتداولة (نقدية، بنوك، عملاء، مخزون)</span>
                  <span className="font-mono font-bold">{formatNumber(data?.balanceSheet.assets)} {currency}</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-sm bg-blue-50 p-3 rounded-xl border border-blue-100">
                <span>إجمالي الأصول</span>
                <span className="font-mono text-blue-900">{formatNumber(data?.balanceSheet.assets)} {currency}</span>
              </div>
            </div>

            {/* Side 2: Liabilities & Equity */}
            <div className="space-y-4">
              <h5 className="font-bold text-sm text-emerald-800 border-b pb-2">الالتزامات وحقوق الملكية</h5>
              <div className="space-y-2">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-600">الالتزامات المتداولة (موردون، أوراق دفع، ضرائب مستحقة)</span>
                  <span className="font-mono font-bold">{formatNumber(data?.balanceSheet.liabilities)} {currency}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-600">حقوق الملكية ورأس المال المدفوع وصافي أرباح الفترة</span>
                  <span className="font-mono font-bold">{formatNumber(data?.balanceSheet.equity)} {currency}</span>
                </div>
              </div>
              <div className="flex justify-between font-black text-sm bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                <span>إجمالي الالتزامات وحقوق الملكية</span>
                <span className="font-mono text-emerald-900">
                  {formatNumber((data?.balanceSheet.liabilities || 0) + (data?.balanceSheet.equity || 0))} {currency}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CASH FLOW */}
      {activeTab === "cash-flow" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
          <h4 className="font-black text-sm text-slate-800 border-b pb-2">
            قائمة التدفقات النقدية (الطريقة غير المباشرة وفقاً لمعيار المحاسبة المصري رقم 4)
          </h4>
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">1. التدفقات النقدية من الأنشطة التشغيلية:</span>
              <div className="flex justify-between py-1 text-slate-600">
                <span>صافي ربح الفترة قبل الضريبة</span>
                <span className="font-mono">{formatNumber(data?.incomeStatement.netIncomeBeforeTax)} {currency}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-600">
                <span>التغيرات في رأس المال العامل (العملاء والموردون والمخزون)</span>
                <span className="font-mono">-</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">2. التدفقات النقدية من الأنشطة الاستثمارية:</span>
              <div className="flex justify-between py-1 text-slate-600">
                <span>المدفوعات لشراء أصول ثابتة</span>
                <span className="font-mono">-</span>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="font-bold text-slate-700 block mb-1">3. التدفقات النقدية من الأنشطة التمويلية:</span>
              <div className="flex justify-between py-1 text-slate-600">
                <span>متحصلات / (سداد) القروض وزيادة رأس المال</span>
                <span className="font-mono">-</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NOTES */}
      {activeTab === "notes" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs text-slate-700 leading-relaxed">
          <h4 className="font-black text-sm text-slate-800 border-b pb-2">
            الإيضاحات المتممة للقوائم المالية
          </h4>
          <div className="space-y-3">
            <div>
              <h5 className="font-bold text-slate-900">إيضاح (1) - معلومات عامة عن المنشأة</h5>
              <p className="text-slate-600 mt-1">
                تأسست شركة {activeCompany?.name} وفقاً للقوانين المصرية، ونشاطها الرئيسي هو {activeCompany?.notes || "الأنشطة التجارية والصناعية والخدمية المسجلة بالسجل التجاري"}.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900">إيضاح (2) - أسس إعداد القوائم المالية والسياسات المحاسبية الهامة</h5>
              <p className="text-slate-600 mt-1">
                أُعدت هذه القوائم المالية وفقاً لمعايير المحاسبة المصرية (EAS) والقوانين واللوائح السارية في جمهورية مصر العربية، على أساس التكلفة التاريخية ومبدأ الاستحقاق وفرض الاستمرارية.
              </p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900">إيضاح (3) - الضرائب والفحص</h5>
              <p className="text-slate-600 mt-1">
                تحتسب ضريبة الدخل وفقاً لأحكام القانون رقم 91 لسنة 2005 وتعديلاته بسعر 22.5% من صافي الربح الخاضع للضريبة. كما تلتزم المنشأة بتقديم إقرارات ضريبة القيمة المضافة (نموذج 10) شهرياً وإصدار الفواتير الإلكترونية المعتمدة برقم UUID رسمي.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
