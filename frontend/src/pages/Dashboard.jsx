import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Mic, Settings2, LogOut, ClipboardList, Copy, Trash2,
  FileText, History, ArrowRight, Loader2
} from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transcripts, setTranscripts] = useState(
    JSON.parse(localStorage.getItem("transcripts") || "[]")
  );

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate("/login", { replace: true });
        } else {
          setUser(session.user);
          setLoading(false);
        }
      } catch (err) {
        navigate("/login", { replace: true });
      }
    };
    getUser();
  }, [navigate]);

  const logout = async () => {
    const logoutToast = toast.loading("Signing out...");
    try {
      // 1. Attempt server-side logout (this might fail with 403 in Tauri if session is flaky)
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Supabase signOut error:", error.message);
    } finally {
      // 2. FORCE clear local storage to ensure ProtectedRoute/Login see a logged-out state
      localStorage.clear(); 
      
      // 3. Clear the toast and show success
      toast.dismiss(logoutToast);
      toast.success("Logged out successfully");

      // 4. Use a small timeout to ensure state is settled before navigating
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 100);
    }
  };

  const deleteSingle = (indexToDelete) => {
    const updated = transcripts.filter((_, index) => index !== indexToDelete);
    setTranscripts(updated);
    localStorage.setItem("transcripts", JSON.stringify(updated));
    toast.success("Transcript deleted");
  };

  const clearAllHistory = () => {
    if (window.confirm("Are you sure you want to delete ALL transcripts?")) {
      setTranscripts([]);
      localStorage.setItem("transcripts", "[]");
      toast.success("All transcripts cleared");
    }
  };

  const copyAllToClipboard = () => {
    const allText = transcripts.join("\n\n");
    navigator.clipboard.writeText(allText);
    toast.success("Full history copied");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-indigo-600">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Mic size={18} className="text-white" />
            </div>
            <span className="tracking-tight text-lg">VoxScribe</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Hey, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}
          </h1>
          <p className="text-slate-500 font-medium">Ready to capture your next big idea?</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <button
            onClick={() => navigate("/recorder")}
            className="md:col-span-2 group relative overflow-hidden flex items-center p-8 bg-slate-900 rounded-3xl transition-all hover:-translate-y-1 active:scale-[0.98] shadow-2xl shadow-slate-200 text-left"
          >
            <div className="relative z-10">
              <h3 className="text-white font-bold text-xl mb-1">Start New Recording</h3>
              <p className="text-slate-400 text-sm mb-4">High-fidelity live transcription</p>
              <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold group-hover:bg-indigo-50 transition-colors">
                Launch Recorder <ArrowRight size={16} />
              </div>
            </div>
            <Mic size={140} className="absolute -right-4 -bottom-4 text-slate-800 opacity-50 group-hover:scale-110 transition-transform duration-500" />
          </button>

          <button
            onClick={() => navigate("/mic-check")}
            className="group flex flex-col justify-between p-8 bg-white border border-slate-200 rounded-3xl hover:border-indigo-200 transition-all hover:-translate-y-1 shadow-sm active:scale-[0.98] text-left"
          >
            <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <Settings2 size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Mic Check</h3>
              <p className="text-slate-500 text-sm">Optimize audio input</p>
            </div>
          </button>
        </div>

        <section>
          <div className="flex justify-between items-end mb-6 px-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border border-slate-200 rounded-xl">
                <History size={20} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-xl tracking-tight">Recent Activity</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{transcripts.length} Saved Items</p>
              </div>
            </div>

            {transcripts.length > 0 && (
              <div className="flex gap-2">
                <button onClick={copyAllToClipboard} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
                  <ClipboardList size={14} /> Copy All
                </button>
                <button onClick={clearAllHistory} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 bg-white border border-slate-200 rounded-xl hover:bg-red-50 transition-all">
                  <Trash2 size={14} /> Clear
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            {transcripts.length === 0 ? (
              <div className="py-24 flex flex-col items-center text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                  <FileText size={40} strokeWidth={1} />
                </div>
                <h4 className="text-slate-800 font-bold">No transcripts yet</h4>
                <p className="text-slate-400 text-sm mt-1">Start recording to build your audio history.</p>
              </div>
            ) : (
              [...transcripts].reverse().map((text, revIdx) => {
                const originalIdx = transcripts.length - 1 - revIdx;
                return (
                  <div key={originalIdx} className="flex items-center gap-6 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group">
                    <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                      <FileText size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 font-semibold truncate group-hover:text-indigo-600 transition-colors">{text}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-slate-400">{text.split(' ').length} words</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }} className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Copy size={18} /></button>
                      <button onClick={() => deleteSingle(originalIdx)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </main>
    </div>
  );
}