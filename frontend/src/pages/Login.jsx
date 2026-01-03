import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Mic, Mail, Lock, ArrowRight, Sparkles } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (email && password.length >= 6) {
      localStorage.setItem(
        "user",
        JSON.stringify({ email, loginTime: new Date().toISOString() })
      );
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid email or password (min 6 chars)");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-6 font-sans">
      {/* Brand Logo Area */}
      <div className="mb-8 flex flex-col items-center">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200 mb-4 transform hover:rotate-12 transition-transform">
          <Mic size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          VoxScribe <Sparkles size={20} className="text-amber-400 fill-amber-400" />
        </h1>
        <p className="text-slate-500 font-medium mt-1">Capture your thoughts at the speed of sound.</p>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-md">
        <h2 className="text-xl font-bold text-slate-800 mb-8 text-center">Sign in to your account</h2>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email Input */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="email" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400 font-medium"
              required
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400 font-medium"
              required
            />
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
              Forgot Password?
            </button>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="group mt-2 w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-100 transition-all active:scale-[0.98]"
          >
            Sign In
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account? <button className="text-indigo-600 font-bold hover:underline">Create one</button>
          </p>
        </div>
      </div>

      {/* Trust Footer */}
      <div className="mt-12 flex items-center gap-6 text-slate-400">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
           Secure Storage
        </div>
        <div className="w-1 h-1 bg-slate-300 rounded-full" />
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
           Privacy First
        </div>
      </div>
    </div>
  );
}