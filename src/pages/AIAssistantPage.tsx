import React, { useState } from "react";
import { Company, User } from "../types";
import { api } from "../services/api";
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  RefreshCw,
  User as UserIcon
} from "lucide-react";

interface AIAssistantPageProps {
  activeCompany: Company | null;
  currentUser: User;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({ activeCompany, currentUser }) => {
  const [mode, setMode] = useState<
    | "CFO"
    | "Financial Controller"
    | "Chief Accountant"
    | "External Auditor"
    | "Internal Auditor"
    | "Tax Consultant"
    | "Cost Accountant"
    | "Financial Analyst"
    | "Business Consultant"
  >("CFO");

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; time: string }>>([
    {
      sender: "ai",
      text: `أهلاً بك يا أستاذ ${currentUser.name}. أنا مستشارك الذكي في منصة ETC بصفتي (${mode}). كيف يمكنني مساعدتك في الشؤون المالية أو المحاسبية أو الضريبية لشركة ${activeCompany?.name}؟\n\nنظامنا يلتزم الصرامة التامة: لن يتم اختلاق أي أرقام أو أرصدة وهمية. في حال نقص أي بيان، سأطلب منك المستندات المطلوبة فوراً.`,
      time: new Date().toLocaleTimeString("ar-EG"),
    },
  ]);
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: "CFO", label: "المدير المالي التنفيذي (CFO)", desc: "القرارات الاستراتيجية والسيولة والتمويل" },
    { id: "Financial Controller", label: "المراقب المالي", desc: "حوكمة العمليات والرقابة على القوائم" },
    { id: "Chief Accountant", label: "رئيس الحسابات", desc: "التوجيه المحاسبي وقيود الإقفال والتسويات" },
    { id: "External Auditor", label: "مراقب الحسابات الخارجي", desc: "معايير المراجعة وأدلة الإثبات والتقرير" },
    { id: "Internal Auditor", label: "المراجع الداخلي", desc: "تقييم الرقابة الداخلية وإدارة المخاطر" },
    { id: "Tax Consultant", label: "المستشار الضريبي", desc: "قوانين الضرائب المصرية والفاتورة الإلكترونية" },
    { id: "Cost Accountant", label: "محاسب التكاليف", desc: "نقطة التعادل وتكاليف الأوامر والمراحل" },
    { id: "Financial Analyst", label: "المحلل المالي", desc: "النسب المالية ونماذج التقييم والتنبؤ" },
    { id: "Business Consultant", label: "مستشار الأعمال", desc: "إعادة الهيكلة وتطوير نماذج الأعمال" },
  ];

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage;
    setInputMessage("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, time: new Date().toLocaleTimeString("ar-EG") },
    ]);
    setLoading(true);

    try {
      const res = await api.sendAIChat({
        message: userText,
        mode: mode,
        history: messages.map((m) => ({ role: m.sender === "user" ? "user" : "model", text: m.text })),
      });

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.reply, time: new Date().toLocaleTimeString("ar-EG") },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `عذراً، حدث خطأ أثناء معالجة الاستشارة: ${err.message || "فشل الاتصال بمحرك ETC AI"}`,
          time: new Date().toLocaleTimeString("ar-EG"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Bot className="w-6 h-6 text-[#0A4DA3]" />
            <span>ETC AI - المستشار الذكي متعدد الأدوار (Intelligent Advisor)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            مستشار مالي ورقابي وضريبي معتمد يعمل بـ 9 أدوار تنفيذية مع الالتزام التام بسياسة عدم اختلاق البيانات.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-50 text-emerald-800 font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>سياسة بيانات صارمة مفعلة</span>
          </span>
        </div>
      </div>

      {/* Role Switcher Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold scrollbar-thin">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setMode(r.id as any)}
            className={`px-3 py-2 rounded-xl whitespace-nowrap transition-all border ${
              mode === r.id
                ? "bg-[#0A4DA3] text-white border-[#0A4DA3] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Chat Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
        {/* Chat Active Mode Bar */}
        <div className="bg-slate-50 p-3.5 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-800">
              الدور النشط: {roles.find((r) => r.id === mode)?.label}
            </span>
          </div>
          <span className="text-slate-400 font-medium text-[11px]">
            {roles.find((r) => r.id === mode)?.desc}
          </span>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed max-w-3xl ${
                m.sender === "user" ? "mr-auto flex-row-reverse" : "ml-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${
                  m.sender === "user"
                    ? "bg-[#0A4DA3] text-white"
                    : "bg-blue-100 text-[#0A4DA3]"
                }`}
              >
                {m.sender === "user" ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl whitespace-pre-wrap ${
                  m.sender === "user"
                    ? "bg-[#0A4DA3] text-white rounded-tr-none"
                    : "bg-slate-100/80 text-slate-800 rounded-tl-none border border-slate-200/60"
                }`}
              >
                {m.text}
                <span
                  className={`block text-[10px] mt-2 font-mono ${
                    m.sender === "user" ? "text-blue-200" : "text-slate-400"
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#0A4DA3]" />
              <span>جاري صياغة الرأي المهني من واقع معايير المحاسبة والضرائب...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`اطرح سؤالك أو استشارتك على (${roles.find((r) => r.id === mode)?.label})...`}
            className="flex-1 py-2.5 px-4 bg-white border border-slate-300 rounded-xl text-xs text-right focus:outline-none focus:ring-2 focus:ring-[#0A4DA3]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="px-4 py-2.5 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
};
