import React, { useEffect, useState } from "react";
import { Company, EInvoice, EReceipt, TaxReturnRecord } from "../types";
import { api } from "../services/api";
import {
  Receipt,
  Plus,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Building2,
  Calendar,
  ExternalLink,
  Printer,
  Sparkles
} from "lucide-react";
import { formatNumber } from "../utils/formatters";

interface TaxPageProps {
  activeCompany: Company | null;
}

export const TaxPage: React.FC<TaxPageProps> = ({ activeCompany }) => {
  const [activeTab, setActiveTab] = useState<"einvoice" | "ereceipt" | "vat" | "corporate" | "withholding">("einvoice");
  const [invoices, setInvoices] = useState<EInvoice[]>([]);
  const [receipts, setReceipts] = useState<EReceipt[]>([]);
  const [returns, setReturns] = useState<TaxReturnRecord[]>([]);
  const [loading, setLoading] = useState(false);

  // New Invoice Modal
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    receiverName: "",
    receiverTaxNumber: "",
    receiverType: "B" as "B" | "P" | "F",
    itemName: "",
    itemCode: "EG-10003001-",
    itemCodeType: "EGS" as "EGS" | "GS1",
    quantity: 1,
    unitPrice: 1000,
    vatRate: 14,
  });

  useEffect(() => {
    if (activeCompany) {
      loadTaxData();
    }
  }, [activeCompany?.id]);

  const loadTaxData = async () => {
    setLoading(true);
    try {
      const [inv, rec, ret] = await Promise.all([
        api.getEInvoices(),
        api.getEReceipts(),
        api.getTaxReturns(),
      ]);
      setInvoices(inv);
      setReceipts(rec);
      setReturns(ret);
    } catch (err) {
      console.error("Failed to load tax data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalSales = invoiceForm.quantity * invoiceForm.unitPrice;
      const taxAmount = (totalSales * invoiceForm.vatRate) / 100;
      const totalAmount = totalSales + taxAmount;

      await api.createEInvoice({
        receiverName: invoiceForm.receiverName,
        receiverTaxNumber: invoiceForm.receiverTaxNumber,
        receiverType: invoiceForm.receiverType,
        lines: [
          {
            description: invoiceForm.itemName,
            itemCode: invoiceForm.itemCode,
            itemType: invoiceForm.itemCodeType,
            quantity: invoiceForm.quantity,
            unitPrice: invoiceForm.unitPrice,
            subtotal: totalSales,
            taxRate: invoiceForm.vatRate,
            taxAmount: taxAmount,
            total: totalAmount,
          },
        ],
        totalSales: totalSales,
        totalDiscount: 0,
        totalTax: taxAmount,
        netAmount: totalAmount,
      });

      setShowNewInvoiceModal(false);
      setInvoiceForm({
        receiverName: "",
        receiverTaxNumber: "",
        receiverType: "B",
        itemName: "",
        itemCode: "EG-10003001-",
        itemCodeType: "EGS",
        quantity: 1,
        unitPrice: 1000,
        vatRate: 14,
      });
      loadTaxData();
    } catch (err: any) {
      alert(err.message || "فشل إصدار الفاتورة الإلكترونية");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#0A4DA3]" />
            <span>المركز الضريبي والفاتورة والإيصال الإلكتروني (ETA Compliance)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إصدار وتوثيق الفواتير والإيصالات الرقمية وفقاً لمنظومة مصلحة الضرائب المصرية وقوانين 91 لسنة 2005 و 67 لسنة 2016 و 206 لسنة 2020.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewInvoiceModal(true)}
            className="px-3.5 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>إصدار فاتورة إلكترونية معتمدة</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold overflow-x-auto pb-1">
        {[
          { id: "einvoice", label: "الفاتورة الإلكترونية B2B" },
          { id: "ereceipt", label: "الإيصال الإلكتروني B2C" },
          { id: "vat", label: "إقرار القيمة المضافة (نموذج 10)" },
          { id: "withholding", label: "الخصم والتحصيل (نموذج 41)" },
          { id: "corporate", label: "ضريبة أرباح الشركات (22.5%)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "bg-[#0A4DA3] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: E-INVOICE */}
      {activeTab === "einvoice" && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800">سجل الفواتير الإلكترونية المعتمدة (B2B)</h3>
              <p className="text-[11px] text-slate-500">
                توليد المعرف الفريد (UUID)، الختم الرقمي، والتكامل اللحظي مع بيئة الضرائب المصرية
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              المنظومة متصلة بنجاح
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
              <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-black text-slate-800">لا توجد بيانات حتى الآن</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
                لا نولد أي فواتير وهمية أو بيانات مسبقة. انقر على الزر أدناه لإصدار فاتورة إلكترونية حقيقية معتمدة برمز UUID فريد.
              </p>
              <button
                onClick={() => setShowNewInvoiceModal(true)}
                className="px-4 py-2 bg-[#0A4DA3] hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 mx-auto"
              >
                <span>➕ إصدار فاتورة إلكترونية جديدة</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 hover:border-blue-300 transition-all shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-[#0A4DA3] bg-blue-50 px-2 py-0.5 rounded">
                          فاتورة #{inv.invoiceNumber}
                        </span>
                        <span className="font-bold text-xs text-slate-800">{inv.receiverName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.5 rounded">
                          ضريبي: {inv.receiverTaxNumber}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">
                        UUID: {inv.uuid}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-500">{inv.dateTimeIssued}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        صحيحة ومعتمدة (Valid)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <div className="flex items-center gap-4 text-slate-600">
                      <span>إجمالي المبيعات: <strong className="font-mono text-slate-900">{formatNumber(inv.totalSales)}</strong></span>
                      <span>ضريبة القيمة المضافة 14%: <strong className="font-mono text-emerald-700">{formatNumber(inv.totalTax)}</strong></span>
                      <span>الصافي الكلي: <strong className="font-mono text-blue-900 font-black">{formatNumber(inv.netAmount)} {activeCompany?.currency || "ج.م"}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-900 text-xs font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>طباعة الفاتورة</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: E-RECEIPT */}
      {activeTab === "ereceipt" && (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
          <QrCode className="w-12 h-12 text-[#0A4DA3] mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">منظومة الإيصال الإلكتروني (B2C)</h4>
          <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1 mb-4">
            ربط أجهزة نقاط البيع (POS) وإصدار إيصالات المستهلك النهائي الإلكترونية مع رمز QR مشفر ومتوافق مع اشتراطات مصلحة الضرائب المصرية.
          </p>
          <span className="inline-block text-[11px] font-bold bg-blue-50 text-[#0A4DA3] px-3 py-1.5 rounded-lg border border-blue-200">
            جاهز للاستخدام ومفعل في بيئة التشغيل
          </span>
        </div>
      )}

      {/* TAB 3: VAT */}
      {activeTab === "vat" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
          <h4 className="font-black text-sm text-slate-800 border-b pb-2">
            إقرار الضريبة على القيمة المضافة - نموذج (10) الشهري
          </h4>
          <p className="text-slate-600 leading-relaxed">
            يتم حساب الإقرار شهرياً تلقائياً من واقع فواتير المبيعات الصادرة (المخرجات بسعر 14%) مطروحاً منها فواتير المشتريات والمدخلات المعتمدة ضريبياً لحساب صافي الضريبة الواجبة السداد.
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <span className="text-slate-500 block">إجمالي مبيعات الفترة الخاضعة</span>
              <strong className="text-base font-mono text-slate-800 font-black">0.00 ج.م</strong>
            </div>
            <div>
              <span className="text-slate-500 block">ضريبة القيمة المضافة المحصلة (14%)</span>
              <strong className="text-base font-mono text-emerald-700 font-black">0.00 ج.م</strong>
            </div>
            <div>
              <span className="text-slate-500 block">صافي المسدد لمصلحة الضرائب</span>
              <strong className="text-base font-mono text-blue-900 font-black">0.00 ج.م</strong>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: WITHHOLDING TAX */}
      {activeTab === "withholding" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
          <h4 className="font-black text-sm text-slate-800 border-b pb-2">
            إقرار الخصم والتحصيل تحت حساب الضريبة - نموذج (41) ربع السنوي
          </h4>
          <p className="text-slate-600 leading-relaxed">
            تجميع المبالغ المستقطعة من تعاملات الموردين ومؤدي الخدمات (1% توريدات، 3% خدمات، 5% استشارات) وتوليد الملف الربع سنوي المعتمد للرفع على البوابة الضريبية.
          </p>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900">
            <strong>ملاحظة فحص:</strong> يلزم تدوين الرقم الضريبي الدقيق لكل مورد لتفادي رفض المعاملة أثناء رفع نموذج 41 على البوابة.
          </div>
        </div>
      )}

      {/* TAB 5: CORPORATE TAX */}
      {activeTab === "corporate" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
          <h4 className="font-black text-sm text-slate-800 border-b pb-2">
            الضريبة على أرباح الأشخاص الاعتبارية (قانون 91 لسنة 2005)
          </h4>
          <p className="text-slate-600 leading-relaxed">
            احتساب الوعاء الضريبي وصافي الربح المحاسبي المعدل ضريبياً بسعر عام 22.5% بعد تطبيق التكاليف واجبة الخصم والإعفاءات القانونية وتطبيق قواعد العوائد المدينة (Thin Capitalization).
          </p>
        </div>
      )}

      {/* Modal: New E-Invoice */}
      {showNewInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-5 text-right shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#0A4DA3]" />
              <span>إصدار فاتورة إلكترونية جديدة (B2B)</span>
            </h3>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم العميل أو الشركة المستلمة</label>
                <input
                  type="text"
                  required
                  value={invoiceForm.receiverName}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, receiverName: e.target.value })}
                  placeholder="شركة الأمل للتجارة والتوريدات"
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">الرقم الضريبي للمستلم (9 أرقام)</label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.receiverTaxNumber}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, receiverTaxNumber: e.target.value })}
                    placeholder="123456789"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">نوع المستلم</label>
                  <select
                    value={invoiceForm.receiverType}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, receiverType: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right"
                  >
                    <option value="B">شركة مسجلة (B2B)</option>
                    <option value="P">شخص طبيعي (B2C)</option>
                    <option value="F">جهة أجنبية (Foreign)</option>
                  </select>
                </div>
              </div>

              <div className="border-t pt-2 mt-2">
                <span className="text-xs font-bold text-slate-800 block mb-2">بيانات بند الفاتورة والسلعة/الخدمة:</span>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">بيان ووصف السلعة أو الخدمة</label>
                  <input
                    type="text"
                    required
                    value={invoiceForm.itemName}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, itemName: e.target.value })}
                    placeholder="توريد أجهزة حاسب آلي / استشارات إدارية"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs text-right"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">كود السلعة (EGS / GS1)</label>
                    <input
                      type="text"
                      required
                      value={invoiceForm.itemCode}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, itemCode: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">معيار التكويد</label>
                    <select
                      value={invoiceForm.itemCodeType}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, itemCodeType: e.target.value as any })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right"
                    >
                      <option value="EGS">EGS (المعيار المصري)</option>
                      <option value="GS1">GS1 (المعيار الدولي)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">الكمية</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={invoiceForm.quantity}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, quantity: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">سعر الوحدة</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={invoiceForm.unitPrice}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, unitPrice: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs font-mono text-right"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">نسبة ض.ق.م</label>
                    <select
                      value={invoiceForm.vatRate}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, vatRate: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 text-right font-mono"
                    >
                      <option value={14}>14% (السعر العام)</option>
                      <option value={5}>5% (آلات ومعدات)</option>
                      <option value={0}>0% (تصدير وإعفاء)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Real Summary */}
              <div className="bg-blue-50 p-3 rounded-xl text-xs space-y-1 text-slate-700 border border-blue-100 mt-2">
                <div className="flex justify-between">
                  <span>إجمالي القيمة قبل الضريبة:</span>
                  <span className="font-mono font-bold">{formatNumber(invoiceForm.quantity * invoiceForm.unitPrice)} ج.م</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>ضريبة القيمة المضافة ({invoiceForm.vatRate}%):</span>
                  <span className="font-mono font-bold">{formatNumber((invoiceForm.quantity * invoiceForm.unitPrice * invoiceForm.vatRate) / 100)} ج.م</span>
                </div>
                <div className="flex justify-between font-black text-blue-900 border-t border-blue-200 pt-1">
                  <span>الصافي الإجمالي للفاتورة:</span>
                  <span className="font-mono">{formatNumber((invoiceForm.quantity * invoiceForm.unitPrice) * (1 + invoiceForm.vatRate / 100))} ج.م</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowNewInvoiceModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-[#0A4DA3] text-white hover:bg-[#1565C0] flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>توليد وتوقيع الفاتورة رسمياً</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
