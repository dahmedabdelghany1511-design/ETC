import React, { useState } from "react";
import { BluePyramidLogo } from "../BluePyramidLogo";
import { 
  Lock, 
  UserPlus, 
  Menu, 
  X, 
  Home, 
  Info, 
  Layers, 
  PhoneCall, 
  Sparkles,
  ChevronLeft
} from "lucide-react";

export type PublicNavView = "home" | "about" | "services" | "contact" | "login" | "register";

interface PublicNavbarProps {
  activeView: PublicNavView;
  onNavigate: (view: PublicNavView) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ activeView, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PublicNavView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "about", label: "عن ETC", icon: Info },
    { id: "services", label: "الخدمات والحلول", icon: Layers },
    { id: "contact", label: "تواصل معنا", icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-[#0A4DA3] via-[#1565C0] to-[#0A4DA3] text-white py-1.5 px-4 text-xs font-medium text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] text-blue-100">
              متوافق بالكامل مع معايير المحاسبة المصرية (EAS) ومنظومة الفاتورة والإيصال الإلكتروني ETA
            </span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-3 text-[11px]">
            <span className="text-blue-200">الدعم الفني والمهني:</span>
            <a href="tel:+201000000000" className="hover:text-white font-bold text-white transition-colors" dir="ltr">
              +20 (10) 0000-0000
            </a>
            <span className="text-blue-300">|</span>
            <span className="text-blue-100">القاهرة، مصر</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-3 group text-right focus:outline-hidden"
          >
            <BluePyramidLogo size="md" textColor="dark" showSubtitle={true} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    isActive
                      ? "bg-[#EAF4FF] text-[#0A4DA3] shadow-xs"
                      : "text-slate-600 hover:text-[#0A4DA3] hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#0A4DA3]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onNavigate("login")}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-[#0A4DA3] bg-[#EAF4FF] hover:bg-[#d8eaff] border border-blue-200 rounded-xl transition-all shadow-xs hover:shadow-md"
            >
              <Lock className="w-4 h-4" />
              <span>تسجيل الدخول</span>
            </button>

            <button
              onClick={() => onNavigate("register")}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-[#0A4DA3] to-[#1565C0] hover:from-[#093c80] hover:to-[#0f4d95] rounded-xl transition-all shadow-md shadow-blue-900/20 hover:shadow-lg hover:-translate-y-0.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>إنشاء حساب</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onNavigate("login")}
              className="px-3 py-1.5 text-xs font-bold text-[#0A4DA3] bg-[#EAF4FF] rounded-lg"
            >
              دخول
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-[#0A4DA3] hover:bg-slate-100 transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-colors ${
                  isActive ? "bg-[#EAF4FF] text-[#0A4DA3]" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#0A4DA3]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>
            );
          })}

          <div className="pt-4 grid grid-cols-2 gap-2 border-t border-slate-100">
            <button
              onClick={() => {
                onNavigate("login");
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-xs font-bold text-[#0A4DA3] bg-[#EAF4FF] rounded-xl"
            >
              تسجيل الدخول
            </button>
            <button
              onClick={() => {
                onNavigate("register");
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-xs font-bold text-white bg-[#0A4DA3] rounded-xl"
            >
              إنشاء حساب جديد
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
