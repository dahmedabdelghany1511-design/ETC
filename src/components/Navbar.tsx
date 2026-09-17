import React, { useState } from "react";
import { User, Company, AppNotification } from "../types";
import { BluePyramidLogo } from "./BluePyramidLogo";
import { 
  Building2, 
  Bell, 
  Search, 
  ShieldCheck, 
  Laptop, 
  LogOut, 
  ChevronDown, 
  Plus, 
  Sparkles, 
  CheckCircle,
  AlertTriangle,
  User as UserIcon,
  Menu
} from "lucide-react";

interface NavbarProps {
  user?: User;
  currentUser?: User;
  companies: Company[];
  activeCompany: Company | null;
  onSelectCompany: (company: Company) => void;
  onOpenNewCompanyModal?: () => void;
  onLogout: () => void;
  notifications?: AppNotification[];
  unreadNotificationsCount?: number;
  onNavigate: (page: string) => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  currentUser,
  companies,
  activeCompany,
  onSelectCompany,
  onOpenNewCompanyModal,
  onLogout,
  notifications = [],
  unreadNotificationsCount,
  onNavigate,
  onToggleSidebar,
}) => {
  const actualUser = user || currentUser;
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = unreadNotificationsCount !== undefined 
    ? unreadNotificationsCount 
    : notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 bg-[#0A4DA3] text-white flex items-center justify-between px-4 sm:px-6 shadow-md z-30 sticky top-0">
      {/* Brand & Platform Name */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            aria-label="القائمة"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <BluePyramidLogo size="sm" textColor="white" showText={false} />
          <div className="hidden sm:block">
            <h1 className="text-base font-bold leading-none tracking-tight flex items-center gap-1.5">
              <span>ETC</span>
              <span className="text-xs text-blue-200 font-normal">| منصة ERP الذكية</span>
            </h1>
            <p className="text-[11px] text-blue-100 font-medium mt-0.5 opacity-90">
              للمحاسبة والمراجعة والضرائب وإدارة الأعمال
            </p>
          </div>
        </div>

        {/* Company Switcher Pill */}
        <div className="relative mr-4">
          <button
            onClick={() => setShowCompanyMenu(!showCompanyMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 transition-all text-xs sm:text-sm font-semibold max-w-[220px] sm:max-w-xs truncate"
            title="تغيير المنشأة / الشركة المعزولة"
          >
            <Building2 className="w-4 h-4 text-blue-200 shrink-0" />
            <span className="truncate">{activeCompany ? activeCompany.name : "اختر شركة"}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70 shrink-0" />
          </button>

          {showCompanyMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-right">
              <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">الشركات والمنشآت المسجلة</span>
                <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">
                  عزل كامل للبيانات
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto py-1">
                {companies.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCompany(c);
                      setShowCompanyMenu(false);
                    }}
                    className={`w-full text-right px-3 py-2.5 hover:bg-slate-50 flex items-start gap-2 text-xs transition-colors ${
                      activeCompany?.id === c.id ? "bg-blue-50/80 font-bold text-[#0A4DA3]" : "text-slate-700"
                    }`}
                  >
                    <Building2 className="w-4 h-4 mt-0.5 text-blue-600 shrink-0" />
                    <div className="overflow-hidden">
                      <p className="truncate font-semibold">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        رقم ضريبي: {c.taxRegistrationNumber || "غير مسجل"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="border-t border-slate-100 px-2 pt-2 mt-1">
                <button
                  onClick={() => {
                    setShowCompanyMenu(false);
                    onOpenNewCompanyModal();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة شركة جديدة للنظام</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center / Search & Live Status */}
      <div className="hidden lg:flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-black/15 px-3 py-1.5 rounded-full text-xs text-blue-100 border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>نظام مشفر ومؤمن بالكامل</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1"></span>
        </div>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* ETC AI Quick Launcher */}
        <button
          onClick={() => onNavigate("ai")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#0A4DA3] hover:bg-blue-50 text-xs font-bold shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>ETC AI</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center relative transition-colors"
            title="الإشعارات"
          >
            <Bell className="w-4 h-4 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-[#0A4DA3]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute left-0 sm:right-auto sm:left-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-right">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs text-slate-700">مركز التنبيهات والإشعارات</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                  {notifications.length} إشعار
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">لا توجد إشعارات جديدة حالياً</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <p className="text-xs font-bold text-slate-800">{n.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                      <span className="text-[9px] text-slate-400 mt-1 block font-mono">
                        {new Date(n.createdAt).toLocaleTimeString("ar-EG")}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Current User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 pl-2.5 rounded-lg bg-white/10 hover:bg-white/15 transition-all text-right"
          >
            <div className="w-8 h-8 rounded-full bg-white text-[#0A4DA3] font-black text-xs flex items-center justify-center shadow">
              {actualUser?.name ? actualUser.name.charAt(0) : "U"}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold leading-none truncate max-w-[120px]">{actualUser?.name || "المستخدم"}</p>
              <p className="text-[10px] text-blue-200 leading-none mt-1 font-semibold">{actualUser?.role || "مستخدم"}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-blue-200" />
          </button>

          {showUserMenu && (
            <div className="absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-right">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{actualUser?.name}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{actualUser?.email}</p>
                <span className="inline-block mt-1.5 text-[10px] bg-blue-50 text-[#0A4DA3] font-bold px-2 py-0.5 rounded border border-blue-100">
                  {actualUser?.role}
                </span>
                {actualUser?.isSuperAdmin && (
                  <span className="mr-1.5 inline-block text-[10px] bg-amber-50 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-200">
                    حساب رئيسي (Master)
                  </span>
                )}
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate("users");
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span>إدارة المستخدمين والصلاحيات</span>
                </button>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onNavigate("settings");
                  }}
                  className="w-full text-right px-4 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2"
                >
                  <Laptop className="w-4 h-4 text-slate-400" />
                  <span>إعدادات النظام والنسخ الاحتياطي</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    onLogout();
                  }}
                  className="w-full text-right px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2 text-xs font-bold transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>تسجيل الخروج من المنصة</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
