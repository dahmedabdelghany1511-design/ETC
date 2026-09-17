import React, { useEffect, useState } from "react";
import { Company, BudgetItem } from "../types";
import { api } from "../services/api";
import {
  PieChart,
  Plus,
  TrendingUp,
  TrendingDown,
  Scale,
  AlertCircle
} from "lucide-react";
import { formatNumber } from "../utils/formatters";

interface BudgetsPageProps {
  activeCompany: Company | null;
}

export const BudgetsPage: React.FC<BudgetsPageProps> = ({ activeCompany }) => {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newBudget, setNewBudget] = useState({
    title: "",
    accountCode: "411",
    accountName: "إيرادات المبيعات",
    type: "Revenue" as const,
    budgetedAmount: 500000,
    fiscalYear: new Date().getFullYear(),
    period: "Annual" as const,
  });

  useEffect(() => {
    if (activeCompany) {
      loadBudgets();
    }
  }, [activeCompany?.id]);

  const loadBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.getBudgets();
      setBudgets(res);
    } catch (err) {
      console.error("Failed to load budgets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createBudget({
        ...newBudget,
        actualAmount: 0,
        variance: -newBudget.budgetedAmount,
        variancePercentage: -100,
      });
      setShowNewModal(false);
      loadBudgets();
    } catch (err: any) {
      alert(err.message || "فشل إضافة الموازنة");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-[#0A4DA3]" />
            <span>الموازنات التقديرية وتحليل الانحرافات (Operating Budgets)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إعداد الموازنات التشغيلية والرأسمالية ومقارنة المخطط بالفعلي لتحديد الانحرافات الملائمة وغير الملائمة.
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-3.5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة بند موازنة جديد</span>
        </button>
      </div>

      {budgets.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
          <PieChart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-700">لا توجد موازنات تقديرية محددة حالياً</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">أضف خطط الإيرادات والمصروفات المستهدفة للمقارنة مع القيود المحاسبية الفعلية.</p>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 bg-[#0A4DA3] text-white rounded-xl text-xs font-bold"
          >
            إضافة بند الموازنة الأول
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-xs text-right divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 font-bold">
              <tr>
                <th className="py-3 px-4">البند المستهدف</th>
                <th className="py-3 px-4">الحساب المرتبط</th>
                <th className="py-3 px-4">السنة المالية</th>
                <th className="py-3 px-4">المبلغ المخطط</th>
                <th className="py-3 px-4">المبلغ الفعلي المسجل</th>
                <th className="py-3 px-4">الانحراف (Variance)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {budgets.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-900">{b.title}</td>
                  <td className="py-2.5 px-4 font-mono text-[#0A4DA3]">[{b.accountCode}] {b.accountName}</td>
                  <td className="py-2.5 px-4 font-mono">{b.fiscalYear}</td>
                  <td className="py-2.5 px-4 font-mono font-bold text-slate-800">
                    {formatNumber(Number(b.budgetedAmount))} {activeCompany?.currency || "ج.م"}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">
                    {formatNumber(Number(b.actualAmount))} {activeCompany?.currency || "ج.م"}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold">
                    <span className={b.variance >= 0 ? "text-emerald-700" : "text-red-700"}>
                      {formatNumber(Number(b.variance))} ({b.variancePercentage}%)
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">إضافة بند موازنة تقديرية</h3>
            <form onSubmit={handleCreateBudget} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مسمى البند المستهدف</label>
                <input
                  type="text"
                  required
                  value={newBudget.title}
                  onChange={(e) => setNewBudget({ ...newBudget, title: e.target.value })}
                  placeholder="مبيعات الربع الأول / موازنة الحملات التسويقية"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">المبلغ المخطط له</label>
                  <input
                    type="number"
                    required
                    value={newBudget.budgetedAmount}
                    onChange={(e) => setNewBudget({ ...newBudget, budgetedAmount: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">السنة المالية</label>
                  <input
                    type="number"
                    required
                    value={newBudget.fiscalYear}
                    onChange={(e) => setNewBudget({ ...newBudget, fiscalYear: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0]"
                >
                  حفظ بند الموازنة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
