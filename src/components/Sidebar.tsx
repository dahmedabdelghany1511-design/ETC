import React from "react";
import {
  Home,
  Bot,
  GraduationCap,
  BookOpen,
  FileSpreadsheet,
  BarChart3,
  Receipt,
  Search,
  TrendingUp,
  PieChart,
  FolderOpen,
  FileText,
  MessageSquare,
  Bell,
  Library,
  Users,
  Settings,
  Sparkles,
  Mic,
  Building2
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onSelectPage: (page: string) => void;
  unreadCount?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  unreadCount = 0,
  isOpen = false,
  onClose,
}) => {
  const menuItems = [
    { id: "dashboard", label: "الرئيسية", icon: Home, badge: null, category: "core" },
    { id: "ai", label: "ETC AI", icon: Bot, badge: "ذكاء اصطناعي", highlight: true, category: "ai" },
    { id: "voice-mentor", label: "أستاذ ETC", icon: Mic, badge: "صوتي", highlight: true, category: "ai" },
    { id: "academy", label: "أكاديمية ETC", icon: GraduationCap, badge: "8 مسارات", category: "learning" },
    { id: "accounting", label: "المحاسبة", icon: FileSpreadsheet, badge: null, category: "financial" },
    { id: "financial-statements", label: "القوائم المالية", icon: BarChart3, badge: null, category: "financial" },
    { id: "tax", label: "الضرائب", icon: Receipt, badge: "فاتورة إلكترونية", category: "financial" },
    { id: "audit", label: "المراجعة", icon: Search, badge: null, category: "compliance" },
    { id: "financial-analysis", label: "التحليل المالي", icon: TrendingUp, badge: null, category: "compliance" },
    { id: "budgets", label: "الموازنات", icon: PieChart, badge: null, category: "compliance" },
    { id: "files", label: "مركز الملفات", icon: FolderOpen, badge: "محلل ذكي", category: "tools" },
    { id: "reports", label: "مركز التقارير", icon: FileText, badge: null, category: "tools" },
    { id: "communications", label: "المحادثات", icon: MessageSquare, badge: null, category: "workspace" },
    { id: "notifications", label: "الإشعارات", icon: Bell, badge: unreadCount > 0 ? String(unreadCount) : null, category: "workspace" },
    { id: "knowledge-base", label: "مركز المعرفة", icon: Library, badge: "معايير وقوانين", category: "learning" },
    { id: "companies", label: "إدارة الشركات", icon: Building2, badge: null, category: "admin" },
    { id: "users", label: "إدارة المستخدمين", icon: Users, badge: null, category: "admin" },
    { id: "settings", label: "الإعدادات", icon: Settings, badge: null, category: "admin" },
  ];

  return (
    <aside className="w-64 bg-white border-l border-slate-200 flex flex-col h-[calc(100vh-4rem)] sticky top-16 shadow-sm overflow-hidden select-none shrink-0">
      {/* Platform Title Banner in Sidebar */}
      <div className="p-3 border-b border-slate-100 bg-[#F8FAFC]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0A4DA3]"></span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            منظومة الأعمال المتكاملة ERP
          </span>
        </div>
      </div>

      {/* Nav List with custom scrollbar */}
      <div className="flex-1 overflow-y-auto py-2 px-2.5 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#0A4DA3] text-white shadow-sm shadow-blue-900/20"
                  : item.highlight
                  ? "text-[#0A4DA3] hover:bg-blue-50/80 bg-blue-50/40"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isActive ? "text-white" : item.highlight ? "text-[#0A4DA3]" : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : item.highlight
                      ? "bg-blue-100 text-[#0A4DA3]"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-100 bg-[#F8FAFC] text-[10px] text-slate-500 text-center flex items-center justify-between">
        <span className="font-bold text-[#0A4DA3]">ETC Platform v4.0</span>
        <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">
          متصل
        </span>
      </div>
    </aside>
  );
};
