import React, { useState, useEffect } from "react";
import { Account, JournalLine } from "../types";
import { api } from "../services/api";
import {
  FileSpreadsheet,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Save,
  Scale
} from "lucide-react";
import { formatNumber } from "../utils/formatters";

interface NewJournalEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NewJournalEntryModal: React.FC<NewJournalEntryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [reference, setReference] = useState("");
  const [lines, setLines] = useState<
    Array<{
      accountCode: string;
      description: string;
      debit: number;
      credit: number;
    }>
  >([
    { accountCode: "", description: "", debit: 0, credit: 0 },
    { accountCode: "", description: "", debit: 0, credit: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadAccounts();
    }
  }, [isOpen]);

  const loadAccounts = async () => {
    try {
      const accs = await api.getAccounts();
      setAccounts(accs);
      if (accs.length >= 2 && lines[0].accountCode === "") {
        setLines([
          { accountCode: accs[0].code, description: "", debit: 0, credit: 0 },
          { accountCode: accs[1]?.code || accs[0].code, description: "", debit: 0, credit: 0 },
        ]);
      }
    } catch (err) {
      console.error("Failed to load accounts for journal entry:", err);
    }
  };

  const addLine = () => {
    setLines((prev) => [
      ...prev,
      {
        accountCode: accounts[0]?.code || "",
        description: "",
        debit: 0,
        credit: 0,
      },
    ]);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 2) {
      alert("يتطلب القيد المزدوج طرفين على الأقل (مدين ودائن).");
      return;
    }
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: string, value: any) => {
    setLines((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const totalDebits = lines.reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredits = lines.reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.001 && totalDebits > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!isBalanced) {
      setErrorMsg("القيد غير متزن! يجب أن يتساوى إجمالي المدين مع إجمالي الدائن.");
      return;
    }

    const hasEmptyAccount = lines.some((l) => !l.accountCode);
    if (hasEmptyAccount) {
      setErrorMsg("يرجى اختيار الحساب لجميع أطراف القيد.");
      return;
    }

    setSubmitting(true);
    try {
      await api.createJournalEntry({
        date,
        description: description || "قيد تسوية / إثبات يدوي",
        reference,
        source: "Manual",
        lines: lines.map((l) => {
          const acc = accounts.find((a) => a.code === l.accountCode);
          return {
            accountCode: l.accountCode,
            accountName: acc?.name || "",
            description: l.description || description,
            debit: Number(l.debit) || 0,
            credit: Number(l.credit) || 0,
          };
        }),
      });

      alert("تم ترحيل قيد اليومية بنجاح إلى دفتر الأستاذ العام وميزان المراجعة.");
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء حفظ القيد.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-[#0A4DA3]" />
            <span>تسجيل قيد يومية عامة جديد (Double-Entry)</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">تاريخ القيد *</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A4DA3] text-right font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">البيان / الشرح *</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="إثبات مصروفات إدارية / إثبات مبيعات نقدية..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">رقم المرجع / المستند (اختياري)</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="فاتورة رقم INV-001 أو إيصال قبض"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0A4DA3] text-right"
            />
          </div>

          {/* Lines Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">الحساب المالي</th>
                  <th className="py-2.5 px-3">البيان التحليلي</th>
                  <th className="py-2.5 px-3 w-28 text-center">مدين</th>
                  <th className="py-2.5 px-3 w-28 text-center">دائن</th>
                  <th className="py-2.5 px-2 text-center w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="p-2">
                      <select
                        value={line.accountCode}
                        onChange={(e) => updateLine(idx, "accountCode", e.target.value)}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="">-- اختر الحساب --</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.code}>
                            {acc.code} - {acc.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-2">
                      <input
                        type="text"
                        value={line.description}
                        onChange={(e) => updateLine(idx, "description", e.target.value)}
                        placeholder="شرح البند إن وجد"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-right"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={line.debit || ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          updateLine(idx, "debit", val);
                          if (val > 0) updateLine(idx, "credit", 0);
                        }}
                        placeholder="0.00"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-center font-mono"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        value={line.credit || ""}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          updateLine(idx, "credit", val);
                          if (val > 0) updateLine(idx, "debit", 0);
                        }}
                        placeholder="0.00"
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-center font-mono"
                      />
                    </td>

                    <td className="p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeLine(idx)}
                        className="p-1 text-slate-300 hover:text-red-500 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addLine}
            className="text-xs font-bold text-[#0A4DA3] hover:text-[#1565C0] flex items-center gap-1 py-1"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة طرف آخر للقيد</span>
          </button>

          {/* Balancing Footer */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 font-mono font-bold">
              <span>إجمالي المدين: <strong className="text-blue-700">{formatNumber(totalDebits)}</strong></span>
              <span>إجمالي الدائن: <strong className="text-emerald-700">{formatNumber(totalCredits)}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              {isBalanced ? (
                <span className="text-emerald-700 font-bold bg-emerald-100/70 px-3 py-1 rounded-lg flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  القيد متزن وجاهز للترحيل
                </span>
              ) : (
                <span className="text-red-600 font-bold bg-red-100/70 px-3 py-1 rounded-lg flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  الفرق: {formatNumber(Math.abs(totalDebits - totalCredits))}
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={submitting || !isBalanced}
              className="px-6 py-2.5 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-40"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? "جارٍ الترحيل..." : "ترحيل وحفظ القيد"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
