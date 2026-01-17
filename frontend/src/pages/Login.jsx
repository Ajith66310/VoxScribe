import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Mic, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import googleIcon from "../assets/google.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const navigate = useNavigate();

  // Check existing session on load
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard", { replace: true });
      } else {
        setAuthChecking(false);
      }
    };

    checkSession();
  }, [navigate]);

  // Listen for OAuth login success
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          toast.success("Welcome!");
          navigate("/dashboard", { replace: true });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  // Email + password login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  // Google OAuth
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "voxscribe://auth-callback",
        skipBrowserRedirect: false,
      },
    });

    if (error) toast.error(error.message);
  };

  if (authChecking) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col justify-center items-center px-6 font-sans overflow-hidden">
      {/* Brand Header */}
      <div className="mb-6 flex flex-col items-center">
        <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-200 mb-3 transform hover:rotate-12 transition-transform">
          <Mic size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">VoxScribe</h1>
        <p className="text-slate-500 text-sm font-medium mt-1 text-center">Capture thoughts at the speed of sound.</p>
      </div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/50 border border-slate-100 w-full max-w-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 text-center">Sign in to your account</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group mt-2 w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-indigo-600 transition-all active:scale-[0.98] disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : "Sign In"}
            {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-white px-2 text-slate-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-100 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm"
        >
          <img src={googleIcon} alt="Google" className="w-4 h-4" />
          Google
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}