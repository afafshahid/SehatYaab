import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Stethoscope, 
  Send, 
  AlertTriangle, 
  User as UserIcon, 
  CheckCircle2, 
  Flame, 
  Info,
  ChevronRight,
  ArrowRight,
  Loader2
} from "lucide-react";
import { auth, db, collection, addDoc, serverTimestamp } from "../lib/firebase";

interface AnalysisResult {
  causes: string[];
  severity: string;
  precautions: string[];
  specialists: string[];
}

export default function AICopilot() {
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    setLoading(true);
    setResult(null);
    setRequestSent(false);
    try {
      const response = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          symptoms: symptoms.split(","), 
          age: 30, // Default for now
          history: [] 
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  const requestCheckup = async () => {
    if (!auth.currentUser || !result) return;
    setRequestLoading(true);
    try {
      await addDoc(collection(db, "checkup_requests"), {
        patientId: auth.currentUser.uid,
        patientName: auth.currentUser.displayName || "Patient",
        patientEmail: auth.currentUser.email,
        symptoms: symptoms,
        severity: result.severity,
        status: "pending",
        urgency: result.severity.toLowerCase(),
        createdAt: serverTimestamp()
      });
      setRequestSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setRequestLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-100 text-teal-700 rounded-full text-sm font-bold">
          <Stethoscope className="w-4 h-4" />
          <span>Advanced Diagnostic AI</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 px-4">
          How are you feeling <br />
          <span className="gradient-text">today?</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Describe your symptoms in detail. Our AI will analyze them and provide 
          preliminary guidance and recommended next steps.
        </p>
      </div>

      <div className="grid gap-8">
        {/* Input Region */}
        <div className="glass-card p-6 shadow-2xl shadow-teal-500/10">
          <div className="relative">
            <textarea 
              rows={4}
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g. I have a persistent dry cough, slight fever, and feel very tired for the past 3 days..."
              className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 outline-hidden focus:ring-4 focus:ring-teal-500/10 focus:border-teal-400 transition-all text-slate-700 placeholder:text-slate-300 text-lg resize-none"
            />
            <button 
              onClick={analyzeSymptoms}
              disabled={loading || !symptoms.trim()}
              className="absolute bottom-4 right-4 flex items-center gap-2 bg-teal-500 text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-teal-200 hover:bg-teal-600 disabled:bg-slate-200 disabled:shadow-none transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin w-5 h-5" />
                  Analyzing...
                </div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Region */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Severity & Causes */}
              <div className="glass-card p-8 bg-white space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-800">Assessment Detail</h3>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                    result.severity.toLowerCase() === 'high' ? 'bg-rose-100 text-rose-600' :
                    result.severity.toLowerCase() === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                  }`}>
                    <Flame className="w-4 h-4" />
                    Severity: {result.severity}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Potential Causes</p>
                  <div className="space-y-2">
                    {result.causes.map((cause, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <CheckCircle2 className="w-5 h-5 text-teal-500" />
                        <span className="font-medium text-slate-700">{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Specialists to see</p>
                  <div className="flex flex-wrap gap-2">
                    {result.specialists.map((spec, i) => (
                      <span key={i} className="px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm font-bold border border-teal-100">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Precautions */}
              <div className="space-y-6">
                <div className="glass-card p-8 bg-linear-to-br from-teal-50 to-emerald-50 border-teal-100">
                  <h3 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
                    <Info className="w-6 h-6" />
                    Immediate Precautions
                  </h3>
                  <ul className="space-y-4">
                    {result.precautions.map((prec, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 flex-shrink-0" />
                        <span className="text-teal-800 font-medium leading-relaxed">{prec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-card p-6 border-l-4 border-l-rose-500 bg-rose-50/30">
                  <div className="flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-rose-500 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-rose-900">Disclaimer</p>
                      <p className="text-sm text-rose-700 mt-1">
                        SehatYaab AI provides preliminary information. This is not a diagnosis. 
                        In case of emergency, please visit a hospital immediately.
                      </p>
                    </div>
                  </div>
                </div>

                {requestSent ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-center text-emerald-800 font-bold">
                    Checkup Request Sent Successfully!
                  </div>
                ) : (
                  <button 
                    onClick={requestCheckup}
                    disabled={requestLoading}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
                  >
                    {requestLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <Stethoscope className="w-4 h-4" />}
                    {requestLoading ? "Processing..." : "Request Physician Checkup"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!result && !loading && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <SuggestionBox icon={<Flame color="#f43f5e" size={20}/>} text="Fever & Aches" />
          <SuggestionBox icon={<AlertTriangle color="#f59e0b" size={20}/>} text="Sudden Pain" />
          <SuggestionBox icon={<Stethoscope color="#10b981" size={20}/>} text="Flu Symptoms" />
          <SuggestionBox icon={<Info color="#3b82f6" size={20}/>} text="Skin Rash" />
        </section>
      )}
    </div>
  );
}

function SuggestionBox({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="p-4 bg-white rounded-2xl border border-slate-100 flex flex-col items-center gap-2 cursor-pointer hover:border-teal-500 transition-all shadow-sm">
      {icon}
      <span className="text-xs font-bold text-slate-600">{text}</span>
    </div>
  );
}
