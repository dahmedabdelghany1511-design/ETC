import React, { useState } from "react";
import { Company, User } from "../types";
import { api } from "../services/api";
import { 
  Building2, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  X, 
  Check, 
  Globe, 
  MapPin, 
  FileText 
} from "lucide-react";

interface CompaniesPageProps {
  companies: Company[];
  activeCompany: Company | null;
  onCompanyCreated: (comp: Company) => void;
  onCompanyUpdated?: (comp: Company) => void;
  onCompanyDeleted?: (id: string) => void;
  onSelectCompany: (comp: Company) => void;
  currentUser?: User;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({
  companies,
  activeCompany,
  onCompanyCreated,
  onCompanyUpdated,
  onCompanyDeleted,
  onSelectCompany,
  currentUser,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    legalName: "",
    taxRegistrationNumber: "",
    commercialRegisterNumber: "",
    activityType: "Commercial",
    currency: "EGP",
    city: "القاهرة",
    country: "مصر",
    fiscalYearStart: "01-01",
    fiscalYearEnd: "12-31",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.taxRegistrationNumber && c.taxRegistrationNumber.includes(searchTerm)) ||
      (c.commercialRegisterNumber && c.commercialRegisterNumber.includes(searchTerm))
  );

  const handleCreateOrSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    try {
      if (editingCompany) {
        // Edit existing company
        const updated = await api.updateCompany(editingCompany.id, formData);
        if (onCompanyUpdated) onCompanyUpdated(updated);
        setEditingCompany(null);
        setMsg("تم حفظ وتعديل بيانات الشركة بنجاح.");
      } else {
        // Add new company
        const created = await api.createCompany(formData);
        onCompanyCreated(created);
        setShowAddModal(false);
        setMsg("تمت إضافة الشركة وتفعيل بيئة العمل المعزولة بنجاح.");
      }
      resetForm();
    } catch (err: any) {
      alert(err.message || "فشلت العملية");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (comp: Company) => {
    setEditingCompany(comp);
    setFormData({
      name: comp.name || "",
      legalName: comp.legalName || comp.name || "",
      taxRegistrationNumber: comp.taxRegistrationNumber || "",
      commercialRegisterNumber: comp.commercialRegisterNumber || "",
      activityType: comp.activityType || "Commercial",
      currency: comp.currency || "EGP",
      city: comp.city || "القاهرة",
      country: comp.country || "مصر",
      fiscalYearStart: comp.fiscalYearStart || "01-01",
      fiscalYearEnd: comp.fiscalYearEnd || "12-31",
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (companies.length <= 1) {
      alert("لا يمكن حذف الشركة الوحيدة المتبقية في النظام.");
      return;
    }

    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف شركة "${name}" نهائياً؟`)) {
      return;
    }

    try {
      await api.deleteCompany(id);
      if (onCompanyDeleted) onCompanyDeleted(id);
      setMsg(`تم حذف شركة "${name}" بنجاح.`);
    } catch (err: any) {
      alert(err.message || "فشل حذف الشركة");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      legalName: "",
      taxRegistrationNumber: "",
      commercialRegisterNumber: "",
      activityType: "Commercial",
      currency: "EGP",
      city: "القاهرة",
      country: "مصر",
      fiscalYearStart: "01-01",
      fiscalYearEnd: "12-31",
    });
    setEditingCompany(null);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-[#0A4DA3]" />
            <span>إدارة الشركات والمنشآت المعزولة (Multi-Tenant)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة المنشآت القانونية مع عزل فيزيائي تام للدفاتر والقيود والحسابات والتقارير المالية.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2.5 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة شركة جديدة</span>
        </button>
      </div>

      {msg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{msg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ابحث بالاسم أو رقم التسجيل الضريبي أو السجل التجاري..."
          className="w-full text-xs bg-transparent border-none focus:outline-hidden text-right"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            مسح
          </button>
        )}
      </div>

      {/* Empty State vs List */}
      {filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#0A4DA3] flex items-center justify-center mx-auto shadow-inner">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchTerm ? "لا توجد نتائج تطابق بحثك" : "لا توجد بيانات حتى الآن"}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? "جرّب تعديل كلمات البحث أو مسح حقل البحث."
              : "ابدأ بتأسيس أول منشأة لك لبدء الدورة المحاسبية والقيد المزدوج."}
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="px-5 py-2.5 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>➕ إضافة شركة</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((comp) => {
            const isSelected = activeCompany?.id === comp.id;
            return (
              <div
                key={comp.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs transition-all flex flex-col justify-between ${
                  isSelected ? "border-[#0A4DA3] ring-2 ring-[#0A4DA3]/20" : "border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A4DA3] font-black flex items-center justify-center text-sm shadow-inner">
                        {comp.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{comp.name}</h3>
                        <p className="text-[11px] text-slate-500 font-medium">{comp.legalName || comp.name}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        النشطة حالياً
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">التسجيل الضريبي:</span>
                      <span className="font-mono text-slate-800">{comp.taxRegistrationNumber || "غير محدد"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">السجل التجاري:</span>
                      <span className="font-mono text-slate-800">{comp.commercialRegisterNumber || "غير محدد"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">العملة الأساسية:</span>
                      <span className="font-bold text-[#0A4DA3]">{comp.currency || "EGP"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">النشاط:</span>
                      <span>{comp.activityType === "Industrial" ? "صناعي" : comp.activityType === "Service" ? "خدمي" : "تجاري"}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectCompany(comp)}
                    disabled={isSelected}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-slate-100 text-slate-400 cursor-default"
                        : "bg-[#EAF4FF] text-[#0A4DA3] hover:bg-blue-100"
                    }`}
                  >
                    {isSelected ? "الشركة الحالية" : "تفعيل الشركة"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => startEdit(comp)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="تعديل"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(comp.id, comp.name)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#0A4DA3]" />
                <span>{editingCompany ? "تعديل بيانات المنشأة" : "إضافة منشأة / شركة جديدة"}</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">اسم الشركة التجاري *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="شركة الأمل للتجارة"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">الاسم القانوني المسجل</label>
                  <input
                    type="text"
                    value={formData.legalName}
                    onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                    placeholder="شركة الأمل للتجارة والتوزيع ش.م.م"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم التسجيل الضريبي (ETA)</label>
                  <input
                    type="text"
                    value={formData.taxRegistrationNumber}
                    onChange={(e) => setFormData({ ...formData, taxRegistrationNumber: e.target.value })}
                    placeholder="123-456-789"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] text-right font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">رقم السجل التجاري</label>
                  <input
                    type="text"
                    value={formData.commercialRegisterNumber}
                    onChange={(e) => setFormData({ ...formData, commercialRegisterNumber: e.target.value })}
                    placeholder="45678"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] text-right font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">نوع النشاط</label>
                  <select
                    value={formData.activityType}
                    onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Commercial">تجاري</option>
                    <option value="Industrial">صناعي</option>
                    <option value="Service">خدمي / مهني</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">العملة الأساسية</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="EUR">يورو (EUR)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">المدينة / المحافظة</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="القاهرة"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-right"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? "جارٍ الحفظ..." : editingCompany ? "حفظ التعديلات" : "إنشاء المنشأة"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
