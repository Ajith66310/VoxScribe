import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Standard premium icons
import { 
  Mic, 
  ChevronLeft, 
  CheckCircle, 
  AlertCircle, 
  Volume2, 
  Activity 
} from "lucide-react";

const MicCheck = () => {
  const [level, setLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let animationFrame;
    let audioContext;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setHasPermission(true);
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const mic = audioContext.createMediaStreamSource(stream);
        mic.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          setLevel(Math.max(...data));
          animationFrame = requestAnimationFrame(tick);
        };

        tick();
      })
      .catch(() => setHasPermission(false));

    // Cleanup logic to stop the mic when leaving the page
    return () => {
      cancelAnimationFrame(animationFrame);
      if (audioContext) audioContext.close();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        
        {/* Navigation Link */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-medium mb-8 mx-auto group"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-10 text-center">
          
          {/* Icon Header */}
          <div className="relative mx-auto w-24 h-24 mb-6">
             <div className="absolute inset-0 bg-indigo-100 rounded-3xl rotate-6 group-hover:rotate-12 transition-transform"></div>
             <div className="relative bg-indigo-600 text-white w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Mic size={40} />
             </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-slate-800">Microphone Test</h2>
          <p className="text-slate-500 text-sm mt-2 mb-10">
            Speak clearly to ensure your audio levels are hitting the "Safe Zone."
          </p>

          {/* Level Meter UI */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-3">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Activity size={12} className="text-indigo-500" /> Live Input
              </span>
              <span className={`text-[10px] font-bold uppercase transition-colors ${level > 5 ? 'text-emerald-500' : 'text-slate-300'}`}>
                {level > 5 ? "Sound Detected" : "Silence"}
              </span>
            </div>

            {/* Meter Bar Container */}
            <div className="relative h-6 w-full bg-slate-200 rounded-xl overflow-hidden shadow-inner">
              {/* Target "Safe Zone" Marker */}
              <div className="absolute left-[30%] right-[10%] inset-y-0 bg-emerald-500/10 border-x border-emerald-500/20 z-0"></div>
              
              {/* Actual Level Bar */}
              <div 
                className={`h-full transition-all duration-75 ease-out relative z-10 shadow-lg
                  ${level > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                style={{ width: `${Math.min(level, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-300">
               <span>MIN</span>
               <span>IDEAL RANGE</span>
               <span>MAX</span>
            </div>
          </div>

          {/* Error Message Handling */}
          {hasPermission === false && (
            <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100">
              <AlertCircle size={16} />
              Mic access denied. Please check browser settings.
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={() => navigate("/recorder")}
            className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            <CheckCircle size={20} />
            Continue to Recorder
          </button>
        </div>

        <p className="mt-8 text-center text-slate-400 text-[11px] leading-relaxed italic">
          "Your audio data is processed locally and never stored <br/> 
          without your explicit save command."
        </p>
      </div>
    </div>
  );
};

export default MicCheck;