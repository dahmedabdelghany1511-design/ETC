import React, { useState, useEffect, useRef } from "react";
import { Company, User, ChatMessage, Announcement } from "../types";
import { api } from "../services/api";
import {
  MessageSquare,
  Send,
  Mic,
  MicOff,
  Paperclip,
  Bell,
  User as UserIcon,
  Play,
  Square,
  CheckCheck
} from "lucide-react";

interface CommunicationsPageProps {
  activeCompany: Company | null;
  currentUser: User;
}

export const CommunicationsPage: React.FC<CommunicationsPageProps> = ({
  activeCompany,
  currentUser,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (activeCompany) {
      loadComms();
    }
  }, [activeCompany?.id]);

  const loadComms = async () => {
    try {
      const [msg, ann] = await Promise.all([
        api.getMessages(),
        api.getAnnouncements(),
      ]);
      setMessages(msg);
      setAnnouncements(ann);
    } catch (err) {
      console.error("Failed to load communications:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !voiceAudioUrl) return;

    try {
      const newMsg = await api.sendMessage({
        senderName: currentUser.name,
        type: voiceAudioUrl ? "Voice" : "Text",
        content: inputText || "رسالة صوتية مسجلة",
        audioUrl: voiceAudioUrl || undefined,
      });

      setMessages((prev) => [...prev, newMsg]);
      setInputText("");
      setVoiceAudioUrl(null);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setVoiceAudioUrl(audioUrl);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecordingVoice(true);
    } catch (err) {
      alert("يرجى إعطاء صلاحية الميكروفون لتسجيل الرسائل الصوتية.");
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && isRecordingVoice) {
      mediaRecorderRef.current.stop();
      setIsRecordingVoice(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#0A4DA3]" />
          <span>منظومة المحادثات وفرق العمل والرسائل الصوتية (Workspace Hub)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          قناة التواصل الداخلي لشركة {activeCompany?.name}، التعاميم الإدارية، وتبادل المستندات والرسائل الصوتية.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[550px] overflow-hidden">
          <div className="bg-slate-50 p-3.5 border-b border-slate-200 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">غرفة المحادثة العامة لفريق المحاسبة والمالية</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
              متصلون الآن
            </span>
          </div>

          {/* Messages scroll */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="py-20 text-center text-slate-400 text-xs">
                لا توجد رسائل سابقة. ابدأ المحادثة مع فريقك الآن.
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-md text-xs ${isMe ? "mr-auto items-end" : "ml-auto items-start"}`}
                  >
                    <span className="text-[10px] text-slate-400 mb-0.5 px-1">{m.senderName}</span>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        isMe
                          ? "bg-[#0A4DA3] text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      }`}
                    >
                      <p>{m.content}</p>
                      {m.audioUrl && (
                        <div className="mt-2 pt-1 border-t border-white/20">
                          <audio controls src={m.audioUrl} className="w-48 h-8" />
                        </div>
                      )}
                      <span className={`block text-[9px] mt-1 font-mono ${isMe ? "text-blue-200" : "text-slate-400"}`}>
                        {new Date(m.createdAt).toLocaleTimeString("ar-EG")}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Voice preview indicator */}
          {voiceAudioUrl && (
            <div className="bg-blue-50 px-4 py-2 border-t border-blue-200 flex items-center justify-between text-xs text-blue-900">
              <span className="font-bold">تم تسجيل رسالة صوتية وجاهزة للإرسال</span>
              <button
                type="button"
                onClick={() => setVoiceAudioUrl(null)}
                className="text-red-600 hover:underline font-bold"
              >
                إلغاء
              </button>
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب رسالتك لزملائك في الفريق..."
              className="flex-1 py-2 px-3 bg-white border border-slate-300 rounded-xl text-xs text-right focus:outline-none focus:ring-2 focus:ring-[#0A4DA3]"
            />

            {/* Voice Record Button */}
            <button
              type="button"
              onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
              className={`p-2.5 rounded-xl transition-all ${
                isRecordingVoice
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-slate-200 hover:bg-slate-300 text-slate-700"
              }`}
              title={isRecordingVoice ? "إيقاف التسجيل" : "تسجيل رسالة صوتية"}
            >
              {isRecordingVoice ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="submit"
              disabled={!inputText.trim() && !voiceAudioUrl}
              className="px-4 py-2 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>إرسال</span>
            </button>
          </form>
        </div>

        {/* Announcements & Bulletins */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-bold text-xs text-slate-800 border-b pb-2 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-amber-600" />
            <span>التعاميم والإعلانات الإدارية</span>
          </h3>

          <div className="space-y-2">
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <span className="font-bold block">مواعيد تقديم إقرار القيمة المضافة لشهر الجرد</span>
              <p className="text-[11px] leading-relaxed text-amber-800">
                يرجى موافاة الإدارة المالية بكافة فواتير المشتريات المعتمدة قبل نهاية الأسبوع لاعتماد نموذج (10) على المنظومة.
              </p>
            </div>

            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
              <span className="font-bold block">بدء الجرد السنوي للأصول والمخازن</span>
              <p className="text-[11px] leading-relaxed text-blue-800">
                تم تشكيل لجان الجرد السنوي لمطابقة الأرصدة الدفترية بالأرصدة الفعلية في كافة فروع المنشأة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
