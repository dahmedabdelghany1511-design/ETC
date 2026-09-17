import React, { useState } from "react";
import { BluePyramidLogo } from "../../components/BluePyramidLogo";
import { PublicNavView } from "../../components/public/PublicNavbar";
import { api } from "../../services/api";
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Building2, 
  MessageSquare,
  ShieldCheck
} from "lucide-react";

interface ContactPageProps {
  onNavigate: (view: PublicNavView) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await api.sendContact({ name, email, phone, message });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pt-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF4FF] text-[#0A4DA3] font-bold text-xs">
          <BluePyramidLogo size="sm" textColor="dark" showText={false} />
          <span>قنوات الاتصال المباشرة لمنصة ETC</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#0A4DA3]">
          تواصل معنا
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          يسعدنا استقبال استفساراتكم حول المنظومة، طلبات العروض التوضيحية للشركات، أو الدعم الفني والاستشاري.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0A4DA3] text-white p-8 rounded-3xl shadow-xl space-y-6">
            <h2 className="text-2xl font-black">المقر الرئيسي وقنوات الخدمة</h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              فريقنا المحاسبي والاستشاري متاح لخدمتكم طوال أيام الأسبوع لدعم مسار التحول الرقمي لمنشأتكم.
            </p>

            <ul className="space-y-4 text-sm text-blue-100">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">العنوان:</span>
                  <span>مجمع الأعمال - القاهرة الجديدة / مصر الجديدة، القاهرة، جمهورية مصر العربية</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">الهاتف المباشر والدعم:</span>
                  <span dir="ltr" className="font-mono text-white">+20 10 0000 0000 / +20 2 0000 0000</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">البريد الإلكتروني الرسمي:</span>
                  <span className="text-white">info@etc.corp / support@etc.corp</span>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">مواعيد العمل:</span>
                  <span>من الأحد إلى الخميس: 9:00 ص - 6:00 م (الدعم الطارئ للمؤسسات 24/7)</span>
                </div>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/20 flex items-center gap-2 text-xs text-blue-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>سرية تامة وتشفير كامل لكافة المراسلات</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-2">
            <h3 className="font-bold text-slate-900 text-sm">مستعد للبدء الفوري؟</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              إذا كان لديك حساب مسجل بالفعل، يمكنك تسجيل الدخول مباشرة والوصول إلى لوحة التحكم.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate("login")}
                className="w-full py-2.5 bg-[#EAF4FF] text-[#0A4DA3] hover:bg-blue-100 font-bold rounded-xl text-xs transition-colors"
              >
                تسجيل الدخول إلى حسابك
              </button>
            </div>
          </div>
        </div>

        {/* Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-1">أرسل استفسارك أو طلبك</h2>
            <p className="text-sm text-slate-500">
              املأ الحقول التالية وسيتواصل معك أحد مستشارينا المعتمدين خلال 24 ساعة عمل.
            </p>
          </div>

          {success && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">تم إرسال رسالتك بنجاح!</h4>
                <p className="text-xs text-emerald-700 mt-0.5">
                  شكراً لتواصلك مع منصة ETC. سيتواصل معك فريق الاستشارات المحاسبية والتقنية في أقرب وقت.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 1. الاسم */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الاسم بالكامل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أدخل اسمك الكريم"
                  className="w-full pl-3 pr-10 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* 2. البريد الإلكتروني */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-3 pr-10 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* 3. رقم الهاتف */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                رقم الهاتف
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01012345678"
                  className="w-full pl-3 pr-10 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                />
                <PhoneCall className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
              </div>
            </div>

            {/* 4. الرسالة */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                الرسالة أو تفاصيل الاستفسار <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="اكتب تفاصيل استفسارك أو طلبك هنا..."
                  className="w-full p-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                />
              </div>
            </div>

            {/* Button: إرسال */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-base font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? "جاري إرسال الرسالة..." : "إرسال"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
