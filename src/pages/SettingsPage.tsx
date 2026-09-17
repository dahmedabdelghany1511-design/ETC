import React, { useState } from "react";
import { Company, User } from "../types";
import { api } from "../services/api";
import {
  Settings,
  Building2,
  Download,
  Upload,
  Plus,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  HardDrive
} from "lucide-react";

interface SettingsPageProps {
  companies: Company[];
  activeCompany: Company | null;
  onCompanyCreated: (c: Company) => void;
  onRefreshData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  companies,
  activeCompany,
  onCompanyCreated,
  onRefreshData,
}) => {
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    legalName: "",
    taxRegistrationNumber: "",
    commercialRegister: "",
    fiscalYearStart: "01-01",
    fiscalYearEnd: "12-31",
    currency: "EGP",
    country: "مصر",
    standard: "Egyptian Accounting Standards (EAS)" as const,
  });

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createCompany(newCompany);
      onCompanyCreated(created);
      setShowAddCompanyModal(false);
      setNewCompany({
        name: "",
        legalName: "",
        taxRegistrationNumber: "",
        commercialRegister: "",
        fiscalYearStart: "01-01",
        fiscalYearEnd: "12-31",
        currency: "EGP",
        country: "مصر",
        standard: "Egyptian Accounting Standards (EAS)",
      });
      alert("تم إنشاء الشركة بنجاح وتخصيص دليل محاسبي موحد لها!");
    } catch (err: any) {
      alert(err.message || "فشل إضافة الشركة");
    }
  };

  const handleExportBackup = async () => {
    try {
      const data = await api.getBackup();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ETC_Backup_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("فشل تنزيل النسخة الاحتياطية.");
    }
  };

  const handleRestoreBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        await api.restoreBackup(json);
        alert("تم استعادة النسخة الاحتياطية بنجاح!");
        onRefreshData();
      } catch (err: any) {
        alert("فشل استعادة النسخة الاحتياطية: تأكد من صحة ملف JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#0A4DA3]" />
            <span>إعدادات النظام والشركات والنسخ الاحتياطي (System Settings)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة المنشآت والشركات المتعددة، التهيئة الضريبية، والنسخ الاحتياطي لقاعدة البيانات.
          </p>
        </div>

        <button
          onClick={() => setShowAddCompanyModal(true)}
          className="px-3.5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة منشأة / شركة جديدة</span>
        </button>
      </div>

      {/* Current Company Settings */}
      {activeCompany && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#0A4DA3]" />
            <span>بيانات المنشأة النشطة حالياً ({activeCompany.name})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">الاسم القانوني المسجل:</span>
              <strong className="text-slate-800 text-sm mt-0.5 block">{activeCompany.legalName}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">رقم التسجيل الضريبي:</span>
              <strong className="text-slate-800 font-mono text-sm mt-0.5 block">
                {activeCompany.taxRegistrationNumber}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">رقم السجل التجاري:</span>
              <strong className="text-slate-800 font-mono text-sm mt-0.5 block">
                {activeCompany.commercialRegister}
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">العملة الأساسية:</span>
              <strong className="text-slate-800 text-sm mt-0.5 block">{activeCompany.currency}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">المعيار المحاسبي:</span>
              <strong className="text-slate-800 text-sm mt-0.5 block">{activeCompany.standard}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-500 block">السنة المالية:</span>
              <strong className="text-slate-800 font-mono text-sm mt-0.5 block">
                تبدأ {activeCompany.fiscalYearStart} وتنتهي {activeCompany.fiscalYearEnd}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Backup & Disaster Recovery */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-emerald-600" />
          <span>إدارة النسخ الاحتياطي واستعادة البيانات (Backup & Restore)</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          حفاظاً على أمان بياناتك، يمكنك تنزيل نسخة احتياطية كاملة ومطابقة لقاعدة بيانات النظام بما يشمل (الشركات، دليل الحسابات، قيود اليومية، الفواتير الإلكترونية، ملفات التحليل، والمستخدمين) واستعادتها في أي وقت.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <button
            onClick={handleExportBackup}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>تصدير نسخة احتياطية كاملة (JSON Backup)</span>
          </button>

          <label className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-300">
            <Upload className="w-4 h-4 text-[#0A4DA3]" />
            <span>استعادة نسخة احتياطية من ملف</span>
            <input
              type="file"
              accept=".json"
              onChange={handleRestoreBackup}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Modal: Add Company */}
      {showAddCompanyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 text-right shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#0A4DA3]" />
              <span>إضافة منشأة / شركة جديدة للنظام</span>
            </h3>

            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم التجاري المختصر</label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  placeholder="مجموعة النور للاستثمار"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">الاسم القانوني الرسمي الكامل</label>
                <input
                  type="text"
                  required
                  value={newCompany.legalName}
                  onChange={(e) => setNewCompany({ ...newCompany, legalName: e.target.value })}
                  placeholder="شركة النور للاستيراد والتصدير والتجارة العامة ش.م.م"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم التسجيل الضريبي</label>
                  <input
                    type="text"
                    required
                    value={newCompany.taxRegistrationNumber}
                    onChange={(e) => setNewCompany({ ...newCompany, taxRegistrationNumber: e.target.value })}
                    placeholder="999-888-777"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">رقم السجل التجاري</label>
                  <input
                    type="text"
                    required
                    value={newCompany.commercialRegister}
                    onChange={(e) => setNewCompany({ ...newCompany, commercialRegister: e.target.value })}
                    placeholder="123456"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">عملة القيد الأساسية</label>
                  <select
                    value={newCompany.currency}
                    onChange={(e) => setNewCompany({ ...newCompany, currency: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right"
                  >
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الدولة والتنظيم</label>
                  <input
                    type="text"
                    disabled
                    value={newCompany.country}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-slate-100 text-slate-500 text-right"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddCompanyModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0]"
                >
                  تأكيد وإنشاء الشركة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
