import { useNavigate } from "react-router-dom";
import { useMicrophone } from "../hooks/useMicrophone";
import { toast } from "sonner";
import { 
  Mic, Square, ChevronLeft, Save, Trash2, Sparkles 
} from "lucide-react";

export default function Recorder() {
  const navigate = useNavigate();
  const { 
    startRecording, stopRecording, isRecording,
    finalTranscript, interimTranscript, clearTranscript 
  } = useMicrophone();

  const handleManualSave = () => {
    if (!finalTranscript || !finalTranscript.trim()) {
      toast.error("No transcript to save");
      return;
    }

    const existing = JSON.parse(localStorage.getItem("transcripts") || "[]");
    localStorage.setItem(
      "transcripts",
      JSON.stringify([...existing, finalTranscript])
    );

    toast.success("Transcript saved successfully");
    clearTranscript();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-all font-medium mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 text-center relative overflow-hidden">
          
          {/* Subtle Background Decoration */}
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Sparkles size={120} />
          </div>

          <header className="mb-10 relative">
            <h2 className="text-2xl font-bold text-slate-800">Dictation Mode</h2>
            <p className="text-slate-500 text-sm mt-1">Press and hold to transcribe your voice</p>
          </header>

          {/* Large Recording Trigger */}
          <div className="relative flex flex-col justify-center items-center mb-12">
            
            {/* Pulsing Aura */}
            {isRecording && (
              <div className="absolute w-44 h-44 bg-indigo-400/20 rounded-full animate-ping" />
            )}
            
            <button
              onMouseDown={startRecording} 
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl active:scale-90 select-none touch-none
                ${isRecording 
                  ? "bg-red-500 shadow-red-200 scale-110" 
                  : "bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700"}`}
            >
              {isRecording ? (
                <Square size={40} fill="white" className="text-white" />
              ) : (
                <Mic size={44} className="text-white" />
              )}
            </button>

            {/* Visual Waveform (Animated bars) */}
            <div className={`flex gap-1 mt-6 h-4 items-center transition-opacity duration-300 ${isRecording ? 'opacity-100' : 'opacity-0'}`}>
               {[1, 2, 3, 4, 5, 4, 3, 2, 1].map((h, i) => (
                 <div 
                   key={i} 
                   className="w-1 bg-indigo-500 rounded-full animate-bounce" 
                   style={{ height: `${h * 25}%`, animationDelay: `${i * 0.1}s` }}
                 />
               ))}
            </div>
          </div>

          {/* Transcript Display Area */}
          <div className="relative group text-left">
            <div className="absolute -top-3 left-6 px-2 bg-white text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] z-10">
              Live Capture
            </div>
            <div className="min-h-45 w-full p-6 bg-slate-50 border-2 border-slate-100 rounded-2xl transition-all group-hover:border-indigo-100 group-hover:bg-white group-hover:shadow-inner overflow-y-auto">
              {(!finalTranscript && !interimTranscript) ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 gap-2 mt-8">
                   <Mic size={32} strokeWidth={1} />
                   <p className="italic">Waiting for input...</p>
                </div>
              ) : (
                <p className="text-slate-700 leading-relaxed text-lg">
                  {finalTranscript}
                  <span className="text-indigo-400 font-medium"> {interimTranscript}</span>
                </p>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
               onClick={handleManualSave} 
               disabled={!finalTranscript}
               className={`flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-sm flex-1
                 ${!finalTranscript 
                   ? "bg-slate-100 text-slate-400 cursor-not-allowed" 
                   : "bg-slate-900 text-white hover:bg-indigo-600 hover:shadow-indigo-100 active:scale-95"}`}
            >
              <Save size={18} />
              Save Transcript
            </button>
            
            <button 
              onClick={clearTranscript}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-slate-500 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-95 flex-1"
            >
              <Trash2 size={18} />
              Discard
            </button>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 text-slate-400 text-xs">
          <span className="flex items-center gap-1"><Sparkles size={12} /> AI Enhanced</span>
          <span className="w-1 h-1 bg-slate-300 rounded-full" />
          <span>Local Storage Secure</span>
        </div>
      </div>
    </div>
  );
}