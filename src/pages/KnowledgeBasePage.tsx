import React, { useState, useEffect } from "react";
import { KNOWLEDGE_BASE, KnowledgeArticle } from "../data/knowledgeBase";
import { LegalUpdate } from "../types";
import { api } from "../services/api";
import { formatDate } from "../utils/formatters";
import {
  Library,
  BookOpen,
  Search,
  Scale,
  Receipt,
  FileCheck,
  ChevronLeft,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Building2,
  AlertCircle,
  CheckCircle2,
  Bot,
  FileText,
  Filter,
  Check,
  Layers,
  ArrowRight,
  Info
} from "lucide-react";

export const KnowledgeBasePage: React.FC = () => {
  // Navigation Tabs: 'updates' (مركز التشريعات والتحديثات الرسمية) | 'encyclopedia' (الموسوعة والمعايير المحاسبية والضريبية)
  const [mainView, setMainView] = useState<"updates" | "encyclopedia">("updates");

  // State for Official Legal Updates
  const [legalUpdates, setLegalUpdates] = useState<LegalUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState<boolean>(true);
  const [checkingSync, setCheckingSync] = useState<boolean>(false);
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [selectedLegalUpdate, setSelectedLegalUpdate] = useState<LegalUpdate | null>(null);
  const [updateSearchQuery, setUpdateSearchQuery] = useState<string>("");
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>("ALL");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");

  // State for AI Analysis of Legal Update
  const [isAnalyzingAI, setIsAnalyzingAI] = useState<boolean>(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);

  // State for Knowledge Base Articles
  const [encyclopediaCategory, setEncyclopediaCategory] = useState<string>("ALL");
  const [encyclopediaSearch, setEncyclopediaSearch] = useState<string>("");
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(KNOWLEDGE_BASE[0]);

  // Load official legal updates on mount
  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    try {
      setLoadingUpdates(true);
      const updates = await api.getLegalUpdates();
      setLegalUpdates(updates);
      if (updates.length > 0 && !selectedLegalUpdate) {
        setSelectedLegalUpdate(updates[0]);
      }
    } catch (err) {
      console.error("Failed to load legal updates:", err);
    } finally {
      setLoadingUpdates(false);
    }
  };

  const handleCheckOfficialUpdates = async () => {
    try {
      setCheckingSync(true);
      setSyncStatusMessage("جارٍ التحقق من البوابات والجريدة الرسمية واللوائح الوزارية...");
      const res = await api.checkOfficialLegalUpdates();
      if (res.success) {
        setSyncStatusMessage(`تم التحقق بنجاح: ${res.message}`);
        await loadUpdates();
      }
    } catch (err) {
      setSyncStatusMessage("تعذر التحقق من التحديثات في الوقت الحالي.");
    } finally {
      setCheckingSync(false);
      setTimeout(() => {
        setSyncStatusMessage(null);
      }, 5000);
    }
  };

  const handleRunAiAnalysis = async (update: LegalUpdate) => {
    try {
      setIsAnalyzingAI(true);
      setAiAnalysisResult(null);
      const res = await api.analyzeLegalUpdateAI({
        title: update.title,
        summary: update.summary,
        fullDescription: update.fullDescription
      });
      setAiAnalysisResult(res.analysis);
    } catch (err) {
      setAiAnalysisResult("حدث خطأ أثناء إجراء التحليل الذكي للقرار التشريعي.");
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  // Filtered legal updates
  const filteredUpdates = legalUpdates.filter((up) => {
    const matchesSource =
      selectedSourceFilter === "ALL" || up.officialSource.includes(selectedSourceFilter);
    const matchesCategory =
      selectedCategoryFilter === "ALL" || up.category === selectedCategoryFilter;
    const matchesSearch =
      up.title.toLowerCase().includes(updateSearchQuery.toLowerCase()) ||
      up.decisionNumber.toLowerCase().includes(updateSearchQuery.toLowerCase()) ||
      up.summary.toLowerCase().includes(updateSearchQuery.toLowerCase()) ||
      (up.referenceNumber && up.referenceNumber.toLowerCase().includes(updateSearchQuery.toLowerCase()));
    return matchesSource && matchesCategory && matchesSearch;
  });

  // Filtered encyclopedia articles
  const filteredArticles = KNOWLEDGE_BASE.filter((art) => {
    const matchesCat = encyclopediaCategory === "ALL" || art.category === encyclopediaCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(encyclopediaSearch.toLowerCase()) ||
      art.summary.toLowerCase().includes(encyclopediaSearch.toLowerCase()) ||
      (art.standardNumber && art.standardNumber.toLowerCase().includes(encyclopediaSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right" dir="rtl">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0A4DA3] text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>مصادر رسمية موثقة ومعتمدة قانونياً</span>
              </span>
              <span className="text-slate-300 text-xs hidden sm:inline">
                الجريدة الرسمية • مصلحة الضرائب • الهيئة العامة للرقابة المالية • وزارة المالية
              </span>
            </div>

            {/* Check for updates button */}
            <button
              onClick={handleCheckOfficialUpdates}
              disabled={checkingSync}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-2 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingSync ? "animate-spin" : ""}`} />
              <span>{checkingSync ? "جارٍ المزامنة الرسمية..." : "التحقق من التحديثات الرسمية"}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            مركز القوانين والتشريعات والموسوعة المحاسبية والضريبية
          </h1>
          <p className="text-slate-200 text-xs sm:text-sm max-w-3xl leading-relaxed">
            المنصة المرجعية الرسمية لمكتب المستشار المحاسبي: تتبع فوري لقرارات وزير المالية، قوانين الضرائب، واللوائح التنفيذية الصادرة بالجريدة الرسمية، مع دليل معايير المحاسبة والمراجعة المصرية (EAS) والدولية (IFRS).
          </p>

          {syncStatusMessage && (
            <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2 mt-2 font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{syncStatusMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Switcher: Official Legal Updates vs. Encyclopedia */}
      <div className="flex border-b border-slate-200 bg-slate-100/70 p-1.5 rounded-2xl gap-1">
        <button
          onClick={() => {
            setMainView("updates");
            setAiAnalysisResult(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            mainView === "updates"
              ? "bg-white text-[#0A4DA3] shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Scale className="w-4 h-4 text-[#0A4DA3]" />
          <span>مركز التشريعات والتحديثات الرسمية (Official Regulatory Tracker)</span>
          <span className="bg-blue-100 text-[#0A4DA3] text-[10px] font-mono px-2 py-0.5 rounded-full">
            {legalUpdates.length}
          </span>
        </button>

        <button
          onClick={() => {
            setMainView("encyclopedia");
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 ${
            mainView === "encyclopedia"
              ? "bg-white text-[#0A4DA3] shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-700" />
          <span>الموسوعة والمعايير المحاسبية والضريبية (Knowledge Base & Standards)</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded-full">
            {KNOWLEDGE_BASE.length}
          </span>
        </button>
      </div>

      {/* VIEW 1: OFFICIAL LEGAL UPDATES TRACKER */}
      {mainView === "updates" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={updateSearchQuery}
                onChange={(e) => setUpdateSearchQuery(e.target.value)}
                placeholder="ابحث برقم القرار، القانون، أو الكلمات الدلالية..."
                className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-right focus:outline-none focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white transition-all font-sans"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>

            {/* Filter by Authority / Source */}
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 text-xs">
              <label className="text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>الجهة المصدرة:</span>
              </label>
              <select
                value={selectedSourceFilter}
                onChange={(e) => setSelectedSourceFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A4DA3]"
              >
                <option value="ALL">جميع الجهات الرسمية</option>
                <option value="الضرائب">مصلحة الضرائب المصرية (ETA)</option>
                <option value="الرقابة المالية">الهيئة العامة للرقابة المالية (FRA)</option>
                <option value="الوقائع المصرية">الجريدة الرسمية / الوقائع المصرية</option>
                <option value="وزارة المالية">وزارة المالية المصرية</option>
              </select>

              <label className="text-slate-500 font-bold whitespace-nowrap mr-2">التصنيف:</label>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                className="p-2 border border-slate-200 rounded-xl bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A4DA3]"
              >
                <option value="ALL">كافة التصنيفات</option>
                <option value="ضرائب الدخل">ضرائب الدخل والشرائح</option>
                <option value="الضريبة على القيمة المضافة">القيمة المضافة</option>
                <option value="الفاتورة والإيصال الإلكتروني">الفاتورة الإلكترونية</option>
                <option value="معايير المحاسبة المصرية">معايير المحاسبة</option>
                <option value="الرسوم الجمركية والاستيراد">الجمارك والاستيراد</option>
              </select>
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* List Column (Left / 5 cols) */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {loadingUpdates ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                  <RefreshCw className="w-8 h-8 text-[#0A4DA3] animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-bold">جارٍ تحميل التحديثات الرسمية الموثقة...</p>
                </div>
              ) : filteredUpdates.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
                  <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">لا توجد تحديثات مطابقة لمعايير البحث الحالية.</p>
                  <p className="text-[11px] text-slate-400 mt-1">جرّب اختيار جهة أخرى أو إفراغ خانة البحث.</p>
                </div>
              ) : (
                filteredUpdates.map((update) => {
                  const isSelected = selectedLegalUpdate?.id === update.id;
                  return (
                    <div
                      key={update.id}
                      onClick={() => {
                        setSelectedLegalUpdate(update);
                        setAiAnalysisResult(null);
                      }}
                      className={`cursor-pointer p-4 rounded-2xl border transition-all text-right space-y-2 ${
                        isSelected
                          ? "bg-blue-50/70 border-[#0A4DA3] ring-1 ring-[#0A4DA3] shadow-sm"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">
                          {update.decisionNumber}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          {update.category}
                        </span>
                      </div>

                      <h3 className={`text-xs font-black leading-snug ${isSelected ? "text-[#0A4DA3]" : "text-slate-800"}`}>
                        {update.title}
                      </h3>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {update.summary}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          سريان: {formatDate(update.effectiveDate)}
                        </span>
                        <span className="truncate max-w-[160px] text-slate-600 font-sans font-bold">
                          {update.officialSource}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Detail Column (Right / 7 cols) */}
            <div className="lg:col-span-7">
              {selectedLegalUpdate ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm text-right sticky top-4">
                  {/* Title & Official Tags */}
                  <div className="border-b border-slate-100 pb-4 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold bg-blue-100 text-[#0A4DA3] px-2.5 py-1 rounded-lg">
                          {selectedLegalUpdate.decisionNumber}
                        </span>
                        <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                          مرجع: {selectedLegalUpdate.referenceNumber}
                        </span>
                      </div>

                      <a
                        href={selectedLegalUpdate.officialLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-[#0A4DA3] hover:text-blue-800 flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>الاطلاع على الأصل الرسمي</span>
                      </a>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                      {selectedLegalUpdate.title}
                    </h2>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs pt-1">
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">الجهة المصدرة</span>
                        <strong className="text-slate-800">{selectedLegalUpdate.officialSource}</strong>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 block">تاريخ النشر</span>
                        <strong className="font-mono text-slate-800">{formatDate(selectedLegalUpdate.publicationDate)}</strong>
                      </div>
                      <div className="bg-emerald-50/70 p-2 rounded-xl border border-emerald-100 col-span-2 sm:col-span-1">
                        <span className="text-[10px] text-emerald-600 block">تاريخ بدء السريان</span>
                        <strong className="font-mono text-emerald-800">{formatDate(selectedLegalUpdate.effectiveDate)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Description */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0A4DA3]" />
                      <span>الملخص التنفيذي للقرار:</span>
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                      {selectedLegalUpdate.summary}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#0A4DA3]" />
                      <span>الأحكام والتفاصيل القانونية المعتمدة:</span>
                    </h4>
                    <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                      {selectedLegalUpdate.fullDescription}
                    </div>
                  </div>

                  {/* Impact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {selectedLegalUpdate.accountingImpact && (
                      <div className="bg-blue-50/60 border border-blue-200/80 p-3 rounded-xl text-xs space-y-1">
                        <div className="font-black text-blue-900 flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-[#0A4DA3]" />
                          <span>الأثر المحاسبي والدفتري:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{selectedLegalUpdate.accountingImpact}</p>
                      </div>
                    )}

                    {selectedLegalUpdate.taxImpact && (
                      <div className="bg-emerald-50/60 border border-emerald-200/80 p-3 rounded-xl text-xs space-y-1">
                        <div className="font-black text-emerald-900 flex items-center gap-1.5">
                          <Receipt className="w-3.5 h-3.5 text-emerald-700" />
                          <span>الأثر الضريبي والإقرارات:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{selectedLegalUpdate.taxImpact}</p>
                      </div>
                    )}

                    {selectedLegalUpdate.auditImpact && (
                      <div className="bg-amber-50/60 border border-amber-200/80 p-3 rounded-xl text-xs space-y-1">
                        <div className="font-black text-amber-900 flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-amber-700" />
                          <span>أثر المراجعة والرقابة:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{selectedLegalUpdate.auditImpact}</p>
                      </div>
                    )}

                    {selectedLegalUpdate.complianceRequirements && (
                      <div className="bg-purple-50/60 border border-purple-200/80 p-3 rounded-xl text-xs space-y-1">
                        <div className="font-black text-purple-900 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
                          <span>إجراءات الامتثال الفوري:</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed">{selectedLegalUpdate.complianceRequirements}</p>
                      </div>
                    )}
                  </div>

                  {/* AI Analysis Action */}
                  <div className="border-t border-slate-100 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-[#0A4DA3]" />
                          <span>تحليل الأثر المؤسسي بواسطة ETC AI</span>
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          توليد تقرير استشاري يوضح خطة العمل المحاسبية الواجب اتخاذها لشركاتكم
                        </p>
                      </div>

                      <button
                        onClick={() => handleRunAiAnalysis(selectedLegalUpdate)}
                        disabled={isAnalyzingAI}
                        className="px-3.5 py-1.5 bg-[#0A4DA3] hover:bg-[#1565C0] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-60"
                      >
                        <Sparkles className={`w-3.5 h-3.5 ${isAnalyzingAI ? "animate-spin" : ""}`} />
                        <span>{isAnalyzingAI ? "جارٍ التحليل الذكي..." : "إجراء التحليل الاستشاري"}</span>
                      </button>
                    </div>

                    {aiAnalysisResult && (
                      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 p-4 rounded-2xl text-xs text-slate-800 leading-relaxed space-y-2 animate-fadeIn">
                        <div className="flex items-center gap-2 font-black text-[#0A4DA3]">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>الرأي الاستشاري الذكي (مبني على النصوص الرسمية):</span>
                        </div>
                        <div className="whitespace-pre-line text-slate-700">
                          {aiAnalysisResult}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400">
                  <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700">اختر قراراً أو تشريعاً من القائمة</h4>
                  <p className="text-xs text-slate-400 mt-1">لاستعراض النص الرسمي الموثق وبيانات الجريدة الرسمية وتاريخ بدء السريان.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ACCOUNTING & TAX ENCYCLOPEDIA */}
      {mainView === "encyclopedia" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={encyclopediaSearch}
                onChange={(e) => setEncyclopediaSearch(e.target.value)}
                placeholder="ابحث برقم المعيار (مثال: معيار 1، معيار 48، IFRS 15)..."
                className="w-full pl-3 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-right focus:outline-none focus:ring-2 focus:ring-[#0A4DA3] focus:bg-white transition-all font-sans"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs font-bold scrollbar-thin">
              {[
                { id: "ALL", label: "جميع المراجع" },
                { id: "EAS", label: "معايير المحاسبة المصرية (EAS)" },
                { id: "Tax Law", label: "التشريعات والضرائب" },
                { id: "E-Invoice", label: "الفاتورة والإيصال الإلكتروني" },
                { id: "Auditing", label: "معايير المراجعة المصرية" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEncyclopediaCategory(tab.id)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all border ${
                    encyclopediaCategory === tab.id
                      ? "bg-[#0A4DA3] text-white border-[#0A4DA3] shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Master-Detail Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* List Column */}
            <div className="lg:col-span-5 space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredArticles.map((art) => {
                const isSelected = selectedArticle?.id === art.id;
                return (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className={`cursor-pointer p-4 rounded-2xl border transition-all text-right space-y-1.5 ${
                      isSelected
                        ? "bg-blue-50/70 border-[#0A4DA3] ring-1 ring-[#0A4DA3] shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        {art.standardNumber || art.categoryArabic}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {art.category}
                      </span>
                    </div>

                    <h3 className={`text-xs font-black leading-snug ${isSelected ? "text-[#0A4DA3]" : "text-slate-800"}`}>
                      {art.title}
                    </h3>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Detail Column */}
            <div className="lg:col-span-7">
              {selectedArticle ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-sm text-right sticky top-4">
                  {/* Article Title & Headers */}
                  <div className="border-b border-slate-100 pb-3 space-y-1">
                    <span className="text-[10px] bg-blue-100 text-[#0A4DA3] font-bold px-2.5 py-1 rounded-lg">
                      {selectedArticle.categoryArabic}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-2">
                      {selectedArticle.title}
                    </h3>
                    {selectedArticle.standardNumber && (
                      <span className="text-slate-500 font-mono text-xs block">
                        {selectedArticle.standardNumber}
                      </span>
                    )}
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-1.5 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-[#0A4DA3]" />
                      <span>نطاق وملخص المعيار / القانون:</span>
                    </h4>
                    <p className="bg-slate-50 p-3.5 rounded-xl text-slate-700 leading-relaxed border border-slate-100 text-xs">
                      {selectedArticle.summary}
                    </p>
                  </div>

                  {/* Key Points */}
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>أهم المبادئ والقواعد الإلزامية:</span>
                    </h4>
                    <ul className="space-y-2 bg-slate-50/60 p-4 rounded-xl border border-slate-100 text-xs text-slate-700">
                      {selectedArticle.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[#0A4DA3] font-bold mt-0.5">•</span>
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Practical Implications */}
                  {selectedArticle.practicalImplications && (
                    <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl text-amber-950 text-xs space-y-1">
                      <strong className="block font-black text-amber-900">
                        التطبيق العملي والتوجيه للمحاسب المالي:
                      </strong>
                      <p className="leading-relaxed text-amber-900/90">{selectedArticle.practicalImplications}</p>
                    </div>
                  )}

                  {/* Egyptian Context */}
                  {selectedArticle.egyptianContext && (
                    <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-xl text-blue-950 text-xs space-y-1">
                      <strong className="block font-black text-blue-900">
                        الخصوصية والتطبيق في بيئة الأعمال المصرية واللوائح المحلية:
                      </strong>
                      <p className="leading-relaxed text-blue-900/90">{selectedArticle.egyptianContext}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center text-slate-400">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-slate-700">اختر معياراً أو قانوناً من القائمة</h4>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
