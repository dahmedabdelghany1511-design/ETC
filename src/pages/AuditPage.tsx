import React, { useEffect, useState } from "react";
import { Company, AuditPlan, AuditProgramItem, AuditFinding } from "../types";
import { api } from "../services/api";
import {
  Search,
  Plus,
  ShieldAlert,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ClipboardList,
  Printer,
  FileText
} from "lucide-react";
import { formatNumber } from "../utils/formatters";

interface AuditPageProps {
  activeCompany: Company | null;
}

export const AuditPage: React.FC<AuditPageProps> = ({ activeCompany }) => {
  const [activeTab, setActiveTab] = useState<"plans" | "programs" | "findings" | "report">("plans");
  const [plans, setPlans] = useState<AuditPlan[]>([]);
  const [programs, setPrograms] = useState<AuditProgramItem[]>([]);
  const [findings, setFindings] = useState<AuditFinding[]>([]);
  const [loading, setLoading] = useState(false);

  // New Finding Modal
  const [showFindingModal, setShowFindingModal] = useState(false);
  const [newFinding, setNewFinding] = useState({
    title: "",
    category: "Internal Control" as const,
    severity: "Medium" as const,
    description: "",
    risk: "",
    recommendation: "",
    managementResponse: "",
  });

  // New Plan Modal
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [newPlan, setNewPlan] = useState({
    title: "",
    fiscalYear: new Date().getFullYear(),
    scope: "",
    materialityThreshold: 50000,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (activeCompany) {
      loadAuditData();
    }
  }, [activeCompany?.id]);

  const loadAuditData = async () => {
    setLoading(true);
    try {
      const [pl, pr, fn] = await Promise.all([
        api.getAuditPlans(),
        api.getAuditPrograms(),
        api.getAuditFindings(),
      ]);
      setPlans(pl);
      setPrograms(pr);
      setFindings(fn);
    } catch (err) {
      console.error("Failed to load audit data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAuditPlan({
        ...newPlan,
        status: "Draft",
        team: ["المراجع الرئيسي", "مساعد مراجع"],
      });
      setShowPlanModal(false);
      loadAuditData();
    } catch (err: any) {
      alert(err.message || "فشل إنشاء خطة المراجعة");
    }
  };

  const handleCreateFinding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAuditFinding({
        ...newFinding,
        status: "Open",
      });
      setShowFindingModal(false);
      setNewFinding({
        title: "",
        category: "Internal Control",
        severity: "Medium",
        description: "",
        risk: "",
        recommendation: "",
        managementResponse: "",
      });
      loadAuditData();
    } catch (err: any) {
      alert(err.message || "فشل تسجيل الملاحظة");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Search className="w-6 h-6 text-[#0A4DA3]" />
            <span>منصة المراجعة والتدقيق والرقابة الداخلية (Audit Suite)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            خطط المراجعة، برامج الفحص لأرصدة القوائم، أوراق العمل الموثقة، ومصفوفة تقييم المخاطر والملاحظات.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFindingModal(true)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>تسجيل ملاحظة رقابية / ثغرة</span>
          </button>
          <button
            onClick={() => setShowPlanModal(true)}
            className="px-3.5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء خطة مراجعة</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        {[
          { id: "plans", label: "خطط المراجعة وتحديد الأهمية النسبية" },
          { id: "programs", label: "برامج الفحص وأوراق العمل" },
          { id: "findings", label: "مصفوفة الملاحظات والمخاطر" },
          { id: "report", label: "تقرير المراجعة المستقل" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all ${
              activeTab === tab.id
                ? "bg-[#0A4DA3] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: PLANS */}
      {activeTab === "plans" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">خطط المراجعة والتكليفات الرسمية</h3>
              <p className="text-[11px] text-slate-500">
                تحديد نطاق الفحص، مستوى الأهمية النسبية (Materiality)، وجداول الزيارات الميدانية
              </p>
            </div>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-black text-slate-800">لا توجد بيانات حتى الآن</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">أنشئ خطة مراجعة سنوية أو دورية لتوزيع المهام على فريق العمل.</p>
              <button
                onClick={() => setShowPlanModal(true)}
                className="px-4 py-2 bg-[#0A4DA3] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 mx-auto"
              >
                <span>➕ إنشاء خطة مراجعة جديدة</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-bold text-sm text-slate-900">{p.title}</h4>
                    <span className="text-[10px] bg-blue-50 text-[#0A4DA3] font-bold px-2 py-0.5 rounded">
                      عام {p.fiscalYear}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{p.scope}</p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t text-slate-500 font-mono">
                    <span>الأهمية النسبية: {formatNumber(p.materialityThreshold)} ج.م</span>
                    <span className="text-emerald-700 font-bold font-sans">الحالة: {p.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROGRAMS */}
      {activeTab === "programs" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">إجراءات وبرامج فحص الحسابات (Audit Procedures)</h3>
            <p className="text-[11px] text-slate-500">
              التحقق من وجود، واكتمال، وملكية، ودقة تقييم بنود القوائم المالية والمصادقات الخارجية
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-xs text-right divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 font-bold">
                <tr>
                  <th className="py-3 px-4">منطقة الفحص</th>
                  <th className="py-3 px-4">الإجراء الرقابي المطلوب</th>
                  <th className="py-3 px-4">تأكيد الهدف (Assertion)</th>
                  <th className="py-3 px-4">حجم العينة</th>
                  <th className="py-3 px-4">حالة الإنجاز</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-[#0A4DA3]">النقدية والبنوك</td>
                  <td className="py-2.5 px-4">إرسال مصادقات بنكية مباشرة لجميع البنوك ومطابقة مذكرات التسوية</td>
                  <td className="py-2.5 px-4">الوجود والاكتمال</td>
                  <td className="py-2.5 px-4 font-mono">100% لكافة البنوك</td>
                  <td className="py-2.5 px-4 text-emerald-600 font-bold">مكتمل</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-[#0A4DA3]">العملاء والمدينون</td>
                  <td className="py-2.5 px-4">مصادقات العملاء الموجبة وفحص التحصيلات اللاحقة بعد تاريخ الميزانية</td>
                  <td className="py-2.5 px-4">قابلية التحصيل والتقييم</td>
                  <td className="py-2.5 px-4 font-mono">عينة 80% من الأرصدة</td>
                  <td className="py-2.5 px-4 text-amber-600 font-bold">قيد الفحص</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-[#0A4DA3]">المخزون السلعي</td>
                  <td className="py-2.5 px-4">حضور الجرد الفعلي السنوي وفحص الرواكد وتقييم صافي القيمة البيعية (NRV)</td>
                  <td className="py-2.5 px-4">الوجود والتقييم</td>
                  <td className="py-2.5 px-4 font-mono">عينة ممثلة 75%</td>
                  <td className="py-2.5 px-4 text-slate-400">مجدول بنهاية الفترة</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FINDINGS & RISK MATRIX */}
      {activeTab === "findings" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">مصفوفة الملاحظات والثغرات الرقابية (Audit Findings)</h3>
              <p className="text-[11px] text-slate-500">
                تسجيل المخاطر، درجة الأثر، التوصيات المهنية، وردود الإدارة التنفيذية
              </p>
            </div>
            <button
              onClick={() => setShowFindingModal(true)}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة ملاحظة جديدة</span>
            </button>
          </div>

          {findings.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-black text-slate-800">لا توجد بيانات حتى الآن</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">سجل أي ملاحظة تكتشفها أثناء فحص المستندات لإدراجها في تقرير المراجعة.</p>
              <button
                onClick={() => setShowFindingModal(true)}
                className="px-4 py-2 bg-[#0A4DA3] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 mx-auto"
              >
                <span>➕ إضافة ملاحظة رقابية جديدة</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {findings.map((f) => (
                <div key={f.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        f.severity === "High" ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        خطر {f.severity === "High" ? "مرتفع" : "متوسط"}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900">{f.title}</h4>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">حالة: {f.status}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{f.description}</p>
                  <div className="bg-blue-50/50 p-3 rounded-lg text-xs space-y-1">
                    <p className="text-slate-800"><strong>المخاطر المحتملة:</strong> {f.risk}</p>
                    <p className="text-[#0A4DA3]"><strong>توصية المراجع:</strong> {f.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: AUDIT REPORT */}
      {activeTab === "report" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-4 text-xs text-slate-800 leading-relaxed max-w-4xl mx-auto shadow-sm">
          <div className="text-center space-y-1 border-b pb-4">
            <h3 className="text-base font-black">تقرير مراقب الحسابات المستقل</h3>
            <p className="text-slate-500">إلى السادة مساهمي / شركاء {activeCompany?.name}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-black text-sm text-[#0A4DA3] mb-1">الرأي (Opinion)</h4>
              <p>
                لقد راجعنا القوائم المالية لشركة {activeCompany?.name} والمتمثلة في قائمة المركز المالي، وقائمة الدخل الشامل، وقائمة التدفقات النقدية عن الفترة المنتهية. وفي رأينا، أن القوائم المالية تعبر بوضوح وعدالة في كافة جوانبها الجوهرية عن المركز المالي للمنشأة وأدائها المالي وتدفقاتها النقدية وفقاً لمعايير المحاسبة المصرية وفي ضوء القوانين واللوائح المصرية ذات الصلة.
              </p>
            </div>

            <div>
              <h4 className="font-black text-sm text-[#0A4DA3] mb-1">أساس الرأي (Basis for Opinion)</h4>
              <p>
                تمت مراجعتنا وفقاً لمعايير المراجعة المصرية والدولية. ونحن مستقلون عن الشركة وفقاً لقواعد السلوك المهني وآداب مهنة المحاسبة والمراجعة، وقد حصلنا على أدلة إثبات كافية ومناسبة توفر أساساً معقولاً لإبداء رأينا.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t flex items-center justify-between text-slate-500">
            <div>
              <p className="font-bold text-slate-800">مراقب الحسابات المقيد بسجل المحاسبين والمراجعين</p>
              <p className="font-mono text-[11px] mt-0.5">سجل عام: 42890 | وزارة المالية</p>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة التقرير</span>
            </button>
          </div>
        </div>
      )}

      {/* Modal: New Finding */}
      {showFindingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">تسجيل ملاحظة مراجعة / ثغرة رقابية</h3>
            <form onSubmit={handleCreateFinding} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الملاحظة</label>
                <input
                  type="text"
                  required
                  value={newFinding.title}
                  onChange={(e) => setNewFinding({ ...newFinding, title: e.target.value })}
                  placeholder="غياب الفصل بين المهام في استلام النقدية / نقص فواتير إلكترونية"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">مستوى الخطورة</label>
                  <select
                    value={newFinding.severity}
                    onChange={(e) => setNewFinding({ ...newFinding, severity: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right"
                  >
                    <option value="High">مرتفعة (High)</option>
                    <option value="Medium">متوسطة (Medium)</option>
                    <option value="Low">منخفضة (Low)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">تصنيف الملاحظة</label>
                  <select
                    value={newFinding.category}
                    onChange={(e) => setNewFinding({ ...newFinding, category: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right"
                  >
                    <option value="Internal Control">رقابة داخلية</option>
                    <option value="Compliance">امتثال وقوانين</option>
                    <option value="Financial">قوائم وقيود مالية</option>
                    <option value="Operational">تشغيل وإجراءات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">وصف الملاحظة والواقعة</label>
                <textarea
                  rows={2}
                  required
                  value={newFinding.description}
                  onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الأثر والمخاطر المحتملة</label>
                <input
                  type="text"
                  required
                  value={newFinding.risk}
                  onChange={(e) => setNewFinding({ ...newFinding, risk: e.target.value })}
                  placeholder="خطر عدم اعتماد التكاليف ضريبياً / خطر عجز نقدي"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">توصية المراجع التصحيحية</label>
                <input
                  type="text"
                  required
                  value={newFinding.recommendation}
                  onChange={(e) => setNewFinding({ ...newFinding, recommendation: e.target.value })}
                  placeholder="تفعيل الختم الإلكتروني الفوري / تعيين أمين خزينة مستقل"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowFindingModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
                >
                  حفظ الملاحظة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Plan */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 text-right shadow-2xl">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2">إنشاء خطة مراجعة جديدة</h3>
            <form onSubmit={handleCreatePlan} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">مسمى الخطة</label>
                <input
                  type="text"
                  required
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  placeholder="خطة المراجعة المالية السنوية"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">السنة المالية</label>
                  <input
                    type="number"
                    required
                    value={newPlan.fiscalYear}
                    onChange={(e) => setNewPlan({ ...newPlan, fiscalYear: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الأهمية النسبية (ج.م)</label>
                  <input
                    type="number"
                    required
                    value={newPlan.materialityThreshold}
                    onChange={(e) => setNewPlan({ ...newPlan, materialityThreshold: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نطاق الفحص</label>
                <textarea
                  rows={2}
                  required
                  value={newPlan.scope}
                  onChange={(e) => setNewPlan({ ...newPlan, scope: e.target.value })}
                  placeholder="مراجعة دورات المبيعات والمتحصلات، المشتريات والمدفوعات، الأصول الثابتة، والالتزامات الضريبية"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0]"
                >
                  اعتماد الخطة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
