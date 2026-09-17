import React, { useState } from "react";
import { api } from "../../services/api";
import { User } from "../../types";
import { BluePyramidLogo } from "../../components/BluePyramidLogo";
import { 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  Briefcase, 
  Building2, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

interface PublicAuthPageProps {
  initialMode?: "login" | "register" | "forgot";
  onLoginSuccess: (user: User) => void;
  onBackToWebsite: () => void;
}

export const PublicAuthPage: React.FC<PublicAuthPageProps> = ({
  initialMode = "login",
  onLoginSuccess,
  onBackToWebsite,
}) => {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);

  // Login Form States
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Register Form States
  const [regFullName, setRegFullName] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regJobTitle, setRegJobTitle] = useState("");
  const [regDepartment, setRegDepartment] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Forgot Form States
  const [forgotEmail, setForgotEmail] = useState("");

  // Status & Feedback States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const res = await api.login({
        email: identifier,
        username: identifier,
        password,
        rememberMe,
      });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMsg(err.message || "فشل تسجيل الدخول. يرجى التحقق من اسم المستخدم أو البريد وكلمة المرور.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (regPassword !== regConfirmPassword) {
      setErrorMsg("كلمة المرور وتأكيد كلمة المرور غير متطابقتين.");
      return;
    }

    if (regPassword.length < 6) {
      setErrorMsg("يجب أن تكون كلمة المرور 6 خانات على الأقل.");
      return;
    }

    setLoading(true);

    try {
      await api.register({
        name: regFullName,
        username: regUsername || regEmail.split("@")[0],
        email: regEmail,
        phone: regPhone,
        jobTitle: regJobTitle,
        department: regDepartment,
        password: regPassword,
      });

      setSuccessMsg("تم إنشاء حسابك بنجاح! يمكنك الآن تسجيل الدخول مباشرة.");
      setIdentifier(regEmail);
      setPassword(regPassword);
      setMode("login");
    } catch (err: any) {
      setErrorMsg(err.message || "فشل إنشاء الحساب. تأكد من أن البريد واسم المستخدم غير مستخدمين.");
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
      setSuccessMsg(res.message || "تم إرسال رابط وتفاصيل استعادة كلمة المرور إلى بريدك المسجل.");
    } catch (err: any) {
      setErrorMsg(err.message || "البريد الإلكتروني المدخل غير مسجل بالنظام.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#0A4DA3] selection:text-white"
    >
      {/* Back to website top nav link */}
      <div className="w-full max-w-[1100px] mb-4 flex items-center justify-between">
        <button
          onClick={onBackToWebsite}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0A4DA3] transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى الموقع الرئيسي</span>
        </button>

        <div className="text-xs text-slate-500 font-medium hidden sm:block">
          منصة محاسبية معتمدة وفقاً لمعايير المحاسبة المصرية (EAS)
        </div>
      </div>

      {/* Main Container Blueprint */}
      <div className="w-full max-w-[1100px] min-h-[660px] bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col lg:flex-row transition-all">
        {/* Left Side: Blue Brand Panel */}
        <div className="lg:w-1/2 bg-gradient-to-br from-[#0A4DA3] via-[#1565C0] to-[#0A4DA3] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-blue-300/10 blur-3xl pointer-events-none"></div>

          <div>
            {/* Pyramid Logo */}
            <div className="mb-6">
              <BluePyramidLogo size="xl" textColor="white" showText={false} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3">
              ETC
            </h1>

            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-8 font-medium">
              منصة ETC الذكية للمحاسبة والمراجعة والضرائب وإدارة الأعمال
            </p>

            {/* Checklist of features requested */}
            <ul className="space-y-3.5 text-sm sm:text-base font-semibold text-blue-50">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-emerald-300 shrink-0 text-sm">
                  ✓
                </span>
                <span>إدارة الحسابات والقيد المزدوج المتوازن</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-emerald-300 shrink-0 text-sm">
                  ✓
                </span>
                <span>المراجعة الداخلية والخارجية والأهمية النسبية</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-emerald-300 shrink-0 text-sm">
                  ✓
                </span>
                <span>الضرائب المصرية والفاتورة والإيصال الإلكتروني</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-emerald-300 shrink-0 text-sm">
                  ✓
                </span>
                <span>التحليل المالي والمؤشرات والقوائم المالية</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-emerald-300 shrink-0 text-sm">
                  ✓
                </span>
                <span>ETC AI المستشار الذكي بـ 9 أدوار مهنية</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center text-emerald-300 shrink-0 text-sm">
                  ✓
                </span>
                <span>أستاذ ETC التفاعلي والمعلم الصوتي</span>
              </li>
            </ul>
          </div>

          {/* Left Footer Note */}
          <div className="pt-8 border-t border-white/15 mt-8 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>بيئة تشغيل آمنة ومشفرة</span>
            </div>
            <span>EAS & ETA Compliant</span>
          </div>
        </div>

        {/* Right Side: Form Card */}
        <div className="lg:w-1/2 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="w-full max-w-md mx-auto">
            {/* Error Message */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </div>
            )}

            {/* ================= MODE: LOGIN ================= */}
            {mode === "login" && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A4DA3] text-center mb-6">
                  تسجيل الدخول
                </h2>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      اسم المستخدم أو البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="أدخل اسم المستخدم أو البريد"
                        className="w-full pl-3 pr-10 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                      />
                      <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      كلمة المرور
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور"
                        className="w-full pl-10 pr-10 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right font-mono"
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 p-1"
                        aria-label="إظهار كلمة المرور"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Options: Remember me & Forgot password */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 text-[#0A4DA3] rounded border-slate-300 focus:ring-[#0A4DA3]"
                      />
                      <span>تذكرني</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-[#1565C0] hover:underline font-bold"
                    >
                      نسيت كلمة المرور؟
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-base font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-3 disabled:opacity-50"
                  >
                    {loading ? "جاري المصادقة والتحقق..." : "دخول"}
                  </button>

                  {/* Switch to Register */}
                  <div className="pt-4 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-600">
                      ليس لديك حساب مصرح به؟{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("register");
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className="text-[#1565C0] font-bold hover:underline"
                      >
                        إنشاء حساب جديد
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* ================= MODE: REGISTER ================= */}
            {mode === "register" && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A4DA3] text-center mb-6">
                  إنشاء حساب
                </h2>

                <form onSubmit={handleRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      الاسم بالكامل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        placeholder="أحمد محمد السيد"
                        className="w-full pl-3 pr-9 py-2 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                      />
                      <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        اسم المستخدم <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        placeholder="ahmed_acc"
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="01012345678"
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] text-right"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-3 pr-9 py-2 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        الوظيفة
                      </label>
                      <input
                        type="text"
                        value={regJobTitle}
                        onChange={(e) => setRegJobTitle(e.target.value)}
                        placeholder="مدير حسابات / مراجع"
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        القسم
                      </label>
                      <input
                        type="text"
                        value={regDepartment}
                        onChange={(e) => setRegDepartment(e.target.value)}
                        placeholder="الإدارة المالية"
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] text-right"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        كلمة المرور <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] text-right font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        تأكيد كلمة المرور <span className="text-red-500">*</span>
                      </label>
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-[#F8FAFC] border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-[#0A4DA3] text-right font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="text-[11px] text-slate-500 hover:text-slate-700 flex items-center gap-1.5"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      <span>{showRegPassword ? "إخفاء كلمات المرور" : "إظهار كلمات المرور"}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
                  </button>

                  <div className="pt-3 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-600">
                      لديك حساب بالفعل؟{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setErrorMsg("");
                          setSuccessMsg("");
                        }}
                        className="text-[#1565C0] font-bold hover:underline"
                      >
                        تسجيل الدخول
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            )}

            {/* ================= MODE: FORGOT ================= */}
            {mode === "forgot" && (
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0A4DA3] text-center mb-3">
                  استعادة كلمة المرور
                </h2>
                <p className="text-xs text-slate-600 text-center mb-6 leading-relaxed">
                  أدخل بريدك الإلكتروني المسجل في منصة ETC وسنرسل لك رابطاً مشفراً لتعيين كلمة مرور جديدة.
                </p>

                <form onSubmit={handleForgot} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      البريد الإلكتروني المسجل
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-3 pr-10 py-3 bg-[#F8FAFC] border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white text-right"
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? "جاري المعالجة..." : "إرسال رابط الاستعادة"}
                  </button>

                  <div className="pt-3 text-center border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setErrorMsg("");
                        setSuccessMsg("");
                      }}
                      className="text-xs text-[#1565C0] font-bold hover:underline"
                    >
                      العودة إلى تسجيل الدخول
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Footer Copyright */}
            <div className="mt-8 text-center text-xs text-slate-400">
              ETC © جميع الحقوق محفوظة
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
