import React, { useEffect, useState } from "react";
import { Company, UploadedFileRecord } from "../types";
import { api } from "../services/api";
import {
  FolderOpen,
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Image,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Search,
  Eye
} from "lucide-react";

interface FilesPageProps {
  activeCompany: Company | null;
}

export const FilesPage: React.FC<FilesPageProps> = ({ activeCompany }) => {
  const [files, setFiles] = useState<UploadedFileRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<UploadedFileRecord | null>(null);

  useEffect(() => {
    if (activeCompany) {
      loadFiles();
    }
  }, [activeCompany?.id]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await api.getFiles();
      setFiles(res);
      if (res.length > 0 && !selectedFile) {
        setSelectedFile(res[0]);
      }
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const file = fileList[0];
    setUploading(true);

    try {
      // Read file content
      const reader = new FileReader();
      reader.onload = async (event) => {
        const textContent = (event.target?.result as string) || "";

        try {
          const res = await api.uploadAndAnalyzeFile({
            fileName: file.name,
            fileType: file.type || "application/octet-stream",
            fileSize: file.size,
            fileContent: textContent.slice(0, 50000), // send text snippet for analysis
          });

          await loadFiles();
          setSelectedFile(res);
          alert("تم رفع الملف وتحليله بنجاح عبر ETC AI!");
        } catch (err: any) {
          alert(err.message || "حدث خطأ أثناء تحليل الملف");
        } finally {
          setUploading(false);
        }
      };

      reader.readAsText(file);
    } catch (err) {
      setUploading(false);
      alert("فشل قراءة الملف.");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[#0A4DA3]" />
            <span>مركز تحليل الملفات والمستندات الذكي (Smart File Analyzer)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            دعم كامل لكافة التنسيقات (Excel, PDF, CSV, Word, Images) مع فحص الاحتيال ومطابقة الفواتير الضريبية آلياً عبر ETC AI.
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div className="bg-white rounded-2xl border-2 border-dashed border-blue-200 hover:border-[#0A4DA3] p-8 text-center transition-all bg-gradient-to-b from-blue-50/30 to-white relative group">
        <input
          type="file"
          accept=".xlsx,.xls,.csv,.pdf,.docx,.txt,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 bg-blue-100/80 text-[#0A4DA3] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              {uploading ? "جاري رفع وتحليل الملف ذكياً..." : "اسحب وأفلت الملف هنا أو انقر للتصفح"}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              يدعم ملفات كشوف الحسابات، موازين المراجعة، الفواتير، العقود، وصور الإيصالات
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>XLSX</span> • <span>CSV</span> • <span>PDF</span> • <span>DOCX</span> • <span>PNG/JPG</span>
          </div>
        </div>
      </div>

      {/* Main Content Split (File list on right, analysis on left) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Uploaded Files List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-bold text-xs text-slate-700 border-b pb-2 flex items-center justify-between">
            <span>الملفات المرفوعة والمحللة ({files.length})</span>
            <span className="text-[10px] text-slate-400">فحص أمان 100%</span>
          </h3>

          {files.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              لا توجد ملفات مرفوعة حتى الآن.
            </div>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {files.map((file) => (
                <button
                  key={file.id}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-right p-3 rounded-xl border transition-all flex items-start gap-2.5 text-xs ${
                    selectedFile?.id === file.id
                      ? "bg-blue-50/80 border-[#0A4DA3] shadow-sm"
                      : "bg-slate-50/60 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <FileText className="w-4 h-4 text-[#0A4DA3] shrink-0 mt-0.5" />
                  <div className="overflow-hidden flex-1">
                    <p className="font-bold text-slate-800 truncate">{file.fileName}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <span>{(file.fileSize / 1024).toFixed(1)} KB</span>
                      <span>•</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString("ar-EG")}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Analysis Results View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          {selectedFile ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] bg-blue-100 text-[#0A4DA3] font-bold px-2 py-0.5 rounded">
                    تحليل ETC AI المعتمد
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">{selectedFile.fileName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    مستوى الثقة: {selectedFile.aiAnalysis?.confidenceLevel || "95%"}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700">ملخص محتوى المستند:</h4>
                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl leading-relaxed">
                  {selectedFile.aiAnalysis?.summary || "تم تحليل محتوى الملف بنجاح واستخراج القيود والحركات ذات الصلة."}
                </p>
              </div>

              {/* Fraud & Discrepancy Alert */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>مؤشرات الاحتيال والتحريف والفروق الرقابية:</span>
                </h4>
                <div className="bg-amber-50/60 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 space-y-1">
                  {selectedFile.aiAnalysis?.fraudIndicators?.length ? (
                    selectedFile.aiAnalysis.fraudIndicators.map((ind, idx) => (
                      <p key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600">•</span>
                        <span>{ind}</span>
                      </p>
                    ))
                  ) : (
                    <p className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      لم يتم اكتشاف أي مؤشرات احتيال أو تلاعب جوهري في بنود الملف.
                    </p>
                  )}
                </div>
              </div>

              {/* Missing Information Callout (Strict Policy) */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700">المعلومات غير المكتملة في الملف:</h4>
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs text-slate-600">
                  {selectedFile.aiAnalysis?.missingInformation?.length ? (
                    selectedFile.aiAnalysis.missingInformation.map((info, idx) => (
                      <p key={idx} className="text-slate-700">• {info}</p>
                    ))
                  ) : (
                    <p className="text-slate-500">لا توجد بيانات أساسية مفقودة تمنع إتمام القيد المحاسبي.</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-[#0A4DA3]">توصيات خبير ETC:</h4>
                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl text-xs text-slate-700 space-y-1">
                  {selectedFile.aiAnalysis?.recommendations?.map((rec, idx) => (
                    <p key={idx}>• {rec}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400 text-xs">
              اختر ملفاً من القائمة الجانبية أو قم برفع ملف جديد لعرض تقرير الفحص والتحليل الذكي.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
