import React from "react";
import { AppNotification } from "../types";
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface NotificationsPageProps {
  notifications: AppNotification[];
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ notifications }) => {
  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 text-right">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Bell className="w-6 h-6 text-[#0A4DA3]" />
          <span>مركز الإشعارات والتنبيهات الرقابية (Notifications Center)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          إشعارات القيود المرحّلة، تنبيهات الإقرارات الضريبية، ومتابعة العمليات اليومية.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="py-20 text-center text-slate-400 text-xs">
            لا توجد إشعارات جديدة حالياً.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#0A4DA3] flex items-center justify-center shrink-0 mt-0.5">
                <Info className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">{n.title}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {new Date(n.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
