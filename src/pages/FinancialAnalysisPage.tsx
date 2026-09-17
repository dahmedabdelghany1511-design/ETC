import React, { useEffect, useState } from "react";
import { Company } from "../types";
import { api } from "../services/api";
import {
  TrendingUp,
  Scale,
  DollarSign,
  Activity,
  Percent,
  CheckCircle2,
  AlertCircle,
  BarChart2
} from "lucide-react";
import { formatNumber } from "../utils/formatters";

interface FinancialAnalysisPageProps {
  activeCompany: Company | null;
}

export const FinancialAnalysisPage: React.FC<FinancialAnalysisPageProps> = ({ activeCompany }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (activeCompany) {
      loadAnalysisData();
    }
  }, [activeCompany?.id]);

  const loadAnalysisData = async () => {
    setLoading(true);
    try {
      const res = await api.getFinancialStatements();
      setData(res);
    } catch (err) {
      console.error("Failed to load analysis data:", err);
    } finally {
      setLoading(false);
    }
  };

  const revenues = data?.incomeStatement?.revenues || 0;
  const netProfit = data?.incomeStatement?.netProfit || 0;
  const assets = data?.balanceSheet?.assets || 0;
  const liabilities = data?.balanceSheet?.liabilities || 0;
  const equity = data?.balanceSheet?.equity || 0;

  // Real calculations
  const netProfitMargin = revenues > 0 ? ((netProfit / revenues) * 100).toFixed(1) : "0.0";
  const currentRatio = liabilities > 0 ? (assets / liabilities).toFixed(2) : assets > 0 ? "سليم (بدون التزامات)" : "0.0";
  const debtToEquity = equity > 0 ? ((liabilities / equity) * 100).toFixed(1) : "0.0";
  const roa = assets > 0 ? ((netProfit / assets) * 100).toFixed(1) : "0.0";
  const workingCapital = assets - liabilities;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-[#0A4DA3]" />
          <span>التحليل المالي المتقدم وإدارة الأداء (Financial Analysis & Ratios)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          محسوبة تلقائياً من واقع بيانات القوائم المالية الفعلية للمنشأة (السيولة، الربحية، الملاءة، ورأس المال العامل).
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">هامش صافي الربح (Net Profit Margin)</span>
          <p className="text-2xl font-black text-slate-800 font-mono">{netProfitMargin}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">نسبة صافي الربح إلى إجمالي الإيرادات</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">نسبة التداول والسيولة (Current Ratio)</span>
          <p className="text-2xl font-black text-[#0A4DA3] font-mono">{currentRatio}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">الأصول المتداولة / الالتزامات المتداولة</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">صافي رأس المال العامل (Working Capital)</span>
          <p className="text-2xl font-black text-emerald-700 font-mono">
            {formatNumber(workingCapital)} {activeCompany?.currency || "ج.م"}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">الأصول المتداولة - الالتزامات المتداولة</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-500 block mb-1">العائد على الأصول (ROA)</span>
          <p className="text-2xl font-black text-indigo-700 font-mono">{roa}%</p>
          <span className="text-[11px] text-slate-400 mt-1 block">صافي الدخل / إجمالي الأصول</span>
        </div>
      </div>

      {/* DuPont Model & Structural Analysis */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#0A4DA3]" />
          <span>تحليل هيكل رأس المال والملاءة المالية (Solvency & Capital Structure)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700 block mb-1">نسبة الديون إلى حقوق الملكية (D/E)</span>
            <span className="font-mono text-lg font-black text-slate-800">{debtToEquity}%</span>
            <p className="text-[11px] text-slate-500 mt-1">تقيس درجة الاعتماد على أموال الغير في تمويل أصول الشركة.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700 block mb-1">معدل دوران الأصول (Asset Turnover)</span>
            <span className="font-mono text-lg font-black text-slate-800">
              {assets > 0 ? (revenues / assets).toFixed(2) : "0.00"} مرة
            </span>
            <p className="text-[11px] text-slate-500 mt-1">كفاءة المنشأة في توليد مبيعات وإيرادات من أصولها المتاحة.</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="font-bold text-slate-700 block mb-1">مؤشر سلامة السيولة النقدية</span>
            <span className="font-bold text-emerald-700 block mt-1">
              {workingCapital >= 0 ? "فائض في رأس المال العامل" : "عجز نقدي محتمل"}
            </span>
            <p className="text-[11px] text-slate-500 mt-1">القدرة على الوفاء بالالتزامات قصيرة الأجل فور استحقاقها.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
