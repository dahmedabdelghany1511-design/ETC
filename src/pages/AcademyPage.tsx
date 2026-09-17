import React, { useState, useEffect } from "react";
import { User, UserCertificate } from "../types";
import { ACADEMY_COURSES } from "../data/academyCourses";
import { api } from "../services/api";
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  Printer,
  Sparkles,
  ChevronLeft,
  ArrowRight
} from "lucide-react";

interface AcademyPageProps {
  currentUser: User;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ currentUser }) => {
  const [selectedCourse, setSelectedCourse] = useState(ACADEMY_COURSES[0]);
  const [activeLesson, setActiveLesson] = useState<any>(
    ACADEMY_COURSES[0].modules[0]?.lessons[0] || null
  );

  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [certificates, setCertificates] = useState<UserCertificate[]>([]);
  const [viewCertificate, setViewCertificate] = useState<UserCertificate | null>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      const res = await api.getCertificates();
      setCertificates(res);
    } catch (err) {
      console.error("Failed to load certificates:", err);
    }
  };

  const handleCourseChange = (course: any) => {
    setSelectedCourse(course);
    setActiveLesson(course.modules[0]?.lessons[0] || null);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleIssueCertificate = async () => {
    try {
      const cert = await api.issueCertificate({
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        grade: "امتياز (98%)",
      });
      setCertificates((prev) => [...prev, cert]);
      setViewCertificate(cert);
    } catch (err: any) {
      alert(err.message || "فشل إصدار الشهادة");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-700" />
            <span>أكاديمية ETC للمال والأعمال والمحاسبة المتقدمة (ETC Academy)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            8 مسارات مهنية متخصصة تؤهلك لسوق العمل والامتحانات المهنية مع شهادات إتمام موثقة برقم تسلسلي.
          </p>
        </div>

        {certificates.length > 0 && (
          <button
            onClick={() => setViewCertificate(certificates[certificates.length - 1])}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Award className="w-4 h-4" />
            <span>عرض شهاداتي المعتمدة ({certificates.length})</span>
          </button>
        )}
      </div>

      {/* Courses Track Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold scrollbar-thin">
        {ACADEMY_COURSES.map((course) => (
          <button
            key={course.id}
            onClick={() => handleCourseChange(course)}
            className={`px-3.5 py-2.5 rounded-xl whitespace-nowrap transition-all border ${
              selectedCourse.id === course.id
                ? "bg-emerald-800 text-white border-emerald-800 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            {course.title}
          </button>
        ))}
      </div>

      {/* Lesson View Split */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Course Modules & Lessons List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="border-b pb-2">
            <h3 className="font-bold text-xs text-slate-800">{selectedCourse.title}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{selectedCourse.duration} • {selectedCourse.level}</p>
          </div>

          <div className="space-y-2">
            {selectedCourse.modules.map((m) => (
              <div key={m.id} className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 block">{m.title}</span>
                {m.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(lesson);
                      setSelectedQuizAnswer(null);
                      setQuizSubmitted(false);
                    }}
                    className={`w-full text-right p-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeLesson?.id === lesson.id
                        ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span className="truncate">{lesson.title}</span>
                    <PlayCircle className="w-3.5 h-3.5 shrink-0 opacity-60" />
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Issue Certificate Action */}
          <div className="pt-3 border-t">
            <button
              onClick={handleIssueCertificate}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Award className="w-4 h-4" />
              <span>إصدار شهادة اجتياز المسار</span>
            </button>
          </div>
        </div>

        {/* Active Lesson Content & Interactive Quiz */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          {activeLesson ? (
            <div className="space-y-6">
              <div className="border-b pb-4">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                  المحاضرة التطبيقية
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-1">{activeLesson.title}</h3>
                <span className="text-xs text-slate-400 mt-0.5 block font-mono">المدة المقدرة: {activeLesson.duration}</span>
              </div>

              {/* Lesson Body */}
              <div className="text-xs text-slate-700 leading-relaxed space-y-3">
                <h4 className="font-bold text-slate-900 text-sm">المحتوى الأكاديمي والمعياري:</h4>
                <p className="bg-slate-50 p-4 rounded-xl border border-slate-100 leading-loose">
                  {activeLesson.content}
                </p>
              </div>

              {/* Practical Case Study */}
              {activeLesson.practicalCase && (
                <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 space-y-1">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>حالة تطبيقية واقعية:</span>
                  </h4>
                  <p className="leading-relaxed">{activeLesson.practicalCase}</p>
                </div>
              )}

              {/* Interactive Quiz Question */}
              {activeLesson.quiz && activeLesson.quiz.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-700" />
                    <span>اختبار التحصيل السريع للمحاضرة:</span>
                  </h4>

                  {activeLesson.quiz.map((q: any, idx: number) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-xl space-y-3 border border-slate-200">
                      <p className="text-xs font-bold text-slate-900">{q.question}</p>
                      <div className="space-y-1.5">
                        {q.options.map((opt: string, optIdx: number) => (
                          <button
                            key={optIdx}
                            onClick={() => {
                              setSelectedQuizAnswer(optIdx);
                              setQuizSubmitted(true);
                            }}
                            className={`w-full text-right p-2.5 rounded-lg text-xs transition-all border ${
                              quizSubmitted && optIdx === q.correctIndex
                                ? "bg-emerald-100 border-emerald-400 text-emerald-900 font-bold"
                                : quizSubmitted && selectedQuizAnswer === optIdx && optIdx !== q.correctIndex
                                ? "bg-red-100 border-red-400 text-red-900"
                                : selectedQuizAnswer === optIdx
                                ? "bg-blue-50 border-blue-300"
                                : "bg-white border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <span>{opt}</span>
                          </button>
                        ))}
                      </div>

                      {quizSubmitted && (
                        <p className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                          <strong>التوضيح المحاسبي:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              اختر درساً من القائمة لبدء الدراسة.
            </div>
          )}
        </div>
      </div>

      {/* Official Certificate Modal */}
      {viewCertificate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 text-center shadow-2xl space-y-6 relative border-8 border-emerald-800/20">
            <div className="space-y-1">
              <div className="w-14 h-14 bg-emerald-800 text-white rounded-2xl flex items-center justify-center mx-auto text-xl font-black shadow">
                ETC
              </div>
              <h3 className="text-xl font-black text-emerald-950 mt-2">شهادة إتمام معتمدة</h3>
              <p className="text-xs text-slate-500">أكاديمية ETC للعلوم المالية والمحاسبية</p>
            </div>

            <div className="space-y-3 py-4 border-y border-slate-200 text-xs leading-relaxed text-slate-700">
              <p>تشهد المنصة بأن المتدرب / المحاسب:</p>
              <h4 className="text-lg font-black text-slate-900">{viewCertificate.studentName}</h4>
              <p>قد أتم بنجاح متطلبات المسار التدريبي المهني المكثف في:</p>
              <h5 className="text-base font-bold text-emerald-800">{viewCertificate.courseTitle}</h5>
              <p>بتقدير عام: <strong>{viewCertificate.grade}</strong></p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>رقم الشهادة: {viewCertificate.certificateNumber}</span>
              <span>تاريخ الإصدار: {viewCertificate.issuedAt}</span>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الشهادة (Print)</span>
              </button>
              <button
                onClick={() => setViewCertificate(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
