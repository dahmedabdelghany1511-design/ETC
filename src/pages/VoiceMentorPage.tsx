import React, { useState, useEffect, useRef } from "react";
import { Company, User } from "../types";
import { api } from "../services/api";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  GraduationCap,
  Play,
  RotateCcw,
  CheckCircle2,
  HelpCircle
} from "lucide-react";

interface VoiceMentorPageProps {
  activeCompany: Company | null;
  currentUser: User;
}

export const VoiceMentorPage: React.FC<VoiceMentorPageProps> = ({ currentUser }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mentorReply, setMentorReply] = useState(
    `أهلاً بيك يا بشمهندس ويا أستاذ ${currentUser.name}! أنا أستاذك وزميلك في منصة ETC.. عاوزك تسألني في أي قيد محاسبي واقف معاك، أو حالة فحص ضريبي في نموذج 10 أو الفاتورة الإلكترونية، وهشرحلك المعالجة بالبلدي وبالأصول المهنية خطوة بخطوة!`
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("شرح عملي للقيود");

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup Web Speech Recognition if available
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "ar-EG";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleSendVoiceInput(text);
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error:", e);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
      } catch (err) {
        alert("يرجى التأكد من تفعيل إذن الميكروفون في المتصفح.");
      }
    }
  };

  const handleSendVoiceInput = async (spokenText: string) => {
    if (!spokenText.trim()) return;
    setLoading(true);

    try {
      const res = await api.sendVoiceMentor({
        userSpeech: spokenText,
        topic: selectedTopic,
        level: "محترف",
      });

      setMentorReply(res.text);
      speakText(res.text);
    } catch (err: any) {
      setMentorReply("يا أستاذنا حصل خطأ بسيط في الاتصال.. جرب تاني وأنا سامعك!");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-EG";
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const cases = [
    {
      title: "معالجة شراء أصل ثابت وسداد جزء نقداً والباقي بالتقسيط",
      prompt: "يا أستاذنا اشترينا ماكينة بـ 200 ألف جنيه، دفعنا 50 ألف بشيك والباقي كمبيالات على سنتين.. قيد اليومية يتعمل إزاي؟",
    },
    {
      title: "معاملة ضريبة القيمة المضافة 14% على المشتريات",
      prompt: "لو اشترينا بضاعة بـ 100 ألف وعليها 14% ضريبة قيمة مضافة.. أسجل الـ 14 ألف مصروف ولا على حساب الضريبة؟",
    },
    {
      title: "التسوية البنكية وفروق الشيكات الصادرة",
      prompt: "عندي شيك طلع لمورد بـ 30 ألف بس لسه ما صرفهوش من البنك، دا هيظهر إزاي في مذكرة التسوية؟",
    },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <Mic className="w-6 h-6 text-amber-600" />
          <span>أستاذ ETC - المعلم الصوتي وخبير الحالات العملية</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          جلسات تدريبية تفاعلية صوتية باللهجة المصرية المهنية، شرح حالات الفحص الواقعية، وحل التحديات المحاسبية.
        </p>
      </div>

      {/* Main Mentor Interaction Box */}
      <div className="bg-gradient-to-b from-amber-500/10 via-white to-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-md text-center space-y-6">
        {/* Mentor Avatar Visual */}
        <div className="relative inline-block">
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white flex items-center justify-center font-black text-3xl shadow-xl mx-auto ${
              isSpeaking ? "ring-8 ring-amber-300/60 animate-pulse scale-105" : ""
            } transition-all`}
          >
            ETC
          </div>
          <span className="absolute bottom-0 right-0 bg-emerald-500 border-2 border-white w-5 h-5 rounded-full"></span>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">أستاذ ETC - المحاسب القانوني</h3>
          <p className="text-xs text-amber-800 font-medium">جاهز للإجابة الصوتية على أسئلتك المحاسبية والضريبية</p>
        </div>

        {/* Reply Bubble */}
        <div className="max-w-2xl mx-auto bg-white border border-amber-200/80 rounded-2xl p-6 shadow-sm text-right text-xs leading-relaxed text-slate-800 relative">
          <p className="whitespace-pre-wrap font-medium">{mentorReply}</p>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">اللهجة المصرية المهنية المعيارية</span>
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <button
                  onClick={stopSpeaking}
                  className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>إيقاف الصوت</span>
                </button>
              ) : (
                <button
                  onClick={() => speakText(mentorReply)}
                  className="px-3 py-1 bg-amber-100 text-amber-900 hover:bg-amber-200 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>استماع للصوت</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Input & Microphone Trigger */}
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center justify-center">
            <button
              onClick={toggleRecording}
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${
                isRecording
                  ? "bg-red-600 text-white animate-bounce ring-8 ring-red-200"
                  : "bg-amber-600 hover:bg-amber-700 text-white ring-4 ring-amber-100"
              }`}
              title={isRecording ? "إيقاف التسجيل" : "تحدث بالصوت"}
            >
              {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
          </div>
          <p className="text-xs text-slate-600 font-bold">
            {isRecording
              ? "أنا سامعك يا أستاذنا.. اتفضل اتكلم!"
              : loading
              ? "جاري التفكير وصياغة الشرح..."
              : "اضغط على الميكروفون واسأل أستاذ ETC صوتياً"}
          </p>

          {transcript && (
            <p className="text-xs bg-slate-100 text-slate-700 p-2 rounded-xl italic">
              " {transcript} "
            </p>
          )}
        </div>

        {/* Quick Practice Case Prompts */}
        <div className="pt-4 border-t border-amber-100 text-right">
          <h4 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>أمثلة لحالات عملية يمكنك مناقشتها مع الأستاذ فوراً:</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            {cases.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  setTranscript(c.prompt);
                  handleSendVoiceInput(c.prompt);
                }}
                className="p-3 bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 rounded-xl text-right transition-all text-slate-700 font-medium"
              >
                <p className="font-bold text-slate-900 text-xs">{c.title}</p>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{c.prompt}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
