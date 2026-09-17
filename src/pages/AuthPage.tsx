import React, { useState } from "react";
import { api } from "../services/api";
import { User } from "../types";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Briefcase, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound,
  Eye,
  EyeOff
} from "lucide-react";

interface AuthPageProps {
  onLoginSuccess: (user: User) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");
  
  // Login Form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register Form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regJobTitle, setRegJobTitle] = useState("");

  // Forgot Form
  const [forgotEmail, setForgotEmail] = useState("");

  // Status & Feedback
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await api.login({ email, password, rememberMe });
      localStorage.setItem("etc_auth_token", res.token);
      localStorage.setItem("etc_current_user", JSON.stringify(res.user));
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMsg(err.message || "فشل تسجيل الدخول. تحقق من بيانات الاعتماد.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      await api.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone,
        jobTitle: regJobTitle,
      });
      setSuccessMsg("تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.");
      setEmail(regEmail);
      setPassword(regPassword);
      setMode("login");
    } catch (err: any) {
      setErrorMsg(err.message || "فشل إنشاء الحساب.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await api.forgotPassword(forgotEmail);
      setSuccessMsg(res.message || "تم إرسال التعليمات إلى بريدك المسجل.");
    } catch (err: any) {
      setErrorMsg(err.message || "البريد الإلكتروني غير مسجل.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A4DA3] via-[#1565C0] to-[#0A4DA3] flex flex-col justify-center items-center p-4 selection:bg-white selection:text-[#0A4DA3]">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-300 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 relative z-10 transition-all">
        {/* Header Header */}
        <div className="bg-[#0A4DA3] p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 font-black text-2xl tracking-wider text-white shadow-inner mb-3">
            ETC
          </div>
          <h2 className="text-xl font-black">منصة ETC الذكية</h2>
          <p className="text-xs text-blue-100 mt-1 font-medium">
            للمحاسبة والمراجعة والضرائب وإدارة الأعمال
          </p>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] bg-black/20 py-1.5 px-3 rounded-full text-blue-100 max-w-xs mx-auto border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>تسجيل دخول مشفر ومحمي برقم سري</span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                  اسم المستخدم أو البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="اسم المستخدم أو البريد الإلكتروني المسجل"
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-right">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#0A4DA3] rounded border-slate-300 focus:ring-[#0A4DA3]"
                  />
                  <span>تذكرني على هذا الجهاز</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-[#0A4DA3] hover:underline font-semibold"
                >
                  نسيت كلمة المرور؟
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {loading ? "جاري التحقق والمصادقة..." : "تسجيل الدخول إلى المنصة"}
              </button>

              <div className="border-t border-slate-100 pt-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 leading-normal">
                  <ShieldCheck className="w-4 h-4 text-[#0A4DA3] shrink-0" />
                  <span>حسابات المستخدمين تدار يدوياً وبشكل حصري من قبل مالك النظام (محمد عبد الغني)</span>
                </div>
              </div>
            </form>
          )}

          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="أحمد محمود المحاسب"
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                  />
                  <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="accountant@company.com"
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                  كلمة المرور
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3 pr-9 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right font-mono"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                    المسمى الوظيفي
                  </label>
                  <input
                    type="text"
                    value={regJobTitle}
                    onChange={(e) => setRegJobTitle(e.target.value)}
                    placeholder="محاسب أول / مراجع"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-right"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="010..."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-1 disabled:opacity-50"
              >
                {loading ? "جاري إنشاء الحساب..." : "تسجيل مستخدم جديد"}
              </button>

              <div className="border-t border-slate-100 pt-3 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className="text-xs text-[#0A4DA3] font-bold hover:underline"
                >
                  العودة لتسجيل الدخول
                </button>
              </div>
            </form>
          )}

          {mode === "forgot" && (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="text-right">
                <p className="text-xs text-slate-600 leading-relaxed">
                  أدخل بريدك الإلكتروني المسجل في النظام وسنقوم بإرسال رابط ورسالة استعادة كلمة المرور المعتمدة.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 text-right">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0A4DA3] text-right"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-sm font-bold shadow-lg transition-all"
              >
                {loading ? "جاري الإرسال..." : "إرسال طلب استعادة كلمة المرور"}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                  }}
                  className="text-xs text-[#0A4DA3] font-bold hover:underline"
                >
                  العودة لصفحة الدخول
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Security Footer Note */}
        <div className="bg-slate-50 border-t border-slate-100 p-3 text-center text-[10px] text-slate-400">
          منظومة ETC للأعمال المعتمدة | تشفير 256-bit | متوافق مع معايير الحوكمة والامتثال الضريبي المصري
        </div>
      </div>
    </div>
  );
};
