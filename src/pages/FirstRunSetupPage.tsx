import React, { useState } from "react";
import { User } from "../types";
import { api } from "../services/api";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  User as UserIcon,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Info,
  Check,
} from "lucide-react";

interface FirstRunSetupPageProps {
  onSetupComplete: (user: User) => void;
}

export const FirstRunSetupPage: React.FC<FirstRunSetupPageProps> = ({ onSetupComplete }) => {
  const [fullName, setFullName] = useState("محمد عبد الغني");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !username.trim() || !password || !confirmPassword || !email.trim()) {
      setErrorMsg("الرجاء إدخال كافة الحقول الإلزامية يدوياً.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("كلمة المرور وتأكيد كلمة المرور غير متطابقتين.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("يجب ألا تقل كلمة المرور عن 6 خانات.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.setupOwner({
        fullName: fullName.trim(),
        username: username.trim(),
        password,
        confirmPassword,
        email: email.trim(),
        mobile: mobile.trim(),
      });
      if (res.user) {
        onSetupComplete(res.user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "فشلت تهيئة النظام. يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl grid grid-cols-1 lg:grid-cols-12">
        {/* Left Information Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0A4DA3] via-[#083a7a] to-[#041c3d] p-8 sm:p-10 flex flex-col justify-between text-white border-b lg:border-b-0 lg:border-l border-white/10">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wide text-blue-200 mb-6">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>التهيئة الأولية لنظام ETC</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-3">
              تهيئة النظام وتعيين مالك النظام
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed opacity-90 mb-6">
              يبدأ النظام بقاعدة بيانات فارغة تماماً دون أي مستخدمين أو بيانات وهمية. يرجى إدخال بيانات مالك النظام (Owner) يدوياً لتولي الإدارة الكاملة.
            </p>

            <div className="space-y-3 bg-black/20 p-4 rounded-2xl border border-white/10 text-xs">
              <div className="font-bold text-emerald-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                صلاحيات مالك النظام (System Owner):
              </div>
              <ul className="space-y-1.5 text-blue-100 text-[11px] leading-relaxed">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>التحكم الشامل وغير المقيد في كافة الوحدات</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>إدارة المستخدمين والأدوار وتعيين الصلاحيات</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>تفعيل وإيقاف الحسابات وإعادة تعيين كلمات المرور</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>مراقبة سجلات الدخول وتتبع النشاط المالي والإداري</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-[11px] text-blue-200 flex items-center justify-between">
            <span>تظهر هذه الشاشة مرة واحدة فقط</span>
            <span className="font-mono text-emerald-400">System State: Clean</span>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-800">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <KeyRound className="w-6 h-6 text-blue-400" />
              <span>إدخال بيانات مالك النظام</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              جميع الحقول إلزامية. لن يتم إنشاء أي حساب أو كلمة مرور تلقائياً.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-2xl bg-red-900/30 border border-red-500/40 text-red-200 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                الاسم الكامل (Full Name)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Owner"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                اسم المستخدم (Username)
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="مثال: owner أو admin"
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
              </div>
            </div>

            {/* Email & Mobile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  البريد الإلكتروني (Email)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@example.com"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left dir-ltr"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  رقم الهاتف / الجوال (Mobile)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left dir-ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  كلمة المرور (Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left dir-ltr"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  تأكيد كلمة المرور (Confirm Password)
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-left dir-ltr"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900"
                />
                <span>إظهار كلمة المرور</span>
              </label>
              <div className="text-[11px] text-slate-500">الحد الأدنى 6 خانات</div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A4DA3] hover:bg-[#083a7a] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-900/40 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <span>جاري إنشاء حساب المالك وتهيئة النظام...</span>
                ) : (
                  <>
                    <span>تهيئة النظام وتعيين المالك (Initialize System)</span>
                    <ArrowRight className="w-4 h-4 rotate-180" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
