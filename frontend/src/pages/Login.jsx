import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Zap,
  Target,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const demoAccounts = [
    {
      role: "admin",
      label: "Admin",
      icon: ShieldCheck,
      desc: "School & Curriculum Management",
      email: "admin@classgap.test",
      password: "password",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
    {
      role: "teacher",
      label: "Teacher",
      icon: GraduationCap,
      desc: "Diagnostics & Interventions",
      email: "teacher@classgap.test",
      password: "password",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      role: "student",
      label: "Student",
      icon: BookOpen,
      desc: "Take Tests & View Progress",
      email: "john@student.classgap.test",
      password: "password",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
  ];

  const handleFillDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "teacher") {
        navigate("/teacher/dashboard");
      } else if (user.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-500 to-indigo-400 text-xl font-extrabold text-white shadow-lg shadow-indigo-500/30">
            C
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">ClassGap</span>
            <span className="ml-2 rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
              v2.0
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-indigo-200 backdrop-blur-md border border-white/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Learning Gap & Diagnostic Intelligence
          </div>

          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Close learning gaps before they widen.
          </h2>

          <p className="text-base text-indigo-200/80 leading-relaxed">
            Diagnose student understanding at topic level, automatically identify learning gaps, 
            and execute targeted personalized interventions with measurable learning gains.
          </p>

          {/* Feature badges */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10 flex items-start gap-3">
              <Zap className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-indigo-300 font-semibold">Topic Diagnostics</p>
                <p className="text-xs text-slate-300 mt-0.5">Granular mastery score per topic</p>
              </div>
            </div>
            <div className="rounded-xl bg-white/5 p-3.5 backdrop-blur-sm border border-white/10 flex items-start gap-3">
              <Target className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-indigo-300 font-semibold">Target Interventions</p>
                <p className="text-xs text-slate-300 mt-0.5">Structured plans & follow-up tests</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-400">
          © 2026 ClassGap Learning Intelligence. All rights reserved.
        </div>
      </div>

      {/* Right Login Container */}
      <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-md">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ClassGap</span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold tracking-tight text-white">Welcome back</h1>
              <p className="mt-1.5 text-sm text-slate-400">
                Sign in to your ClassGap account to continue.
              </p>
            </div>

            {/* Quick Demo Switcher */}
            <div className="mb-6 rounded-2xl bg-slate-800/60 p-3.5 border border-slate-700/60">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
                  Quick Demo Accounts (1-Click Fill)
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {demoAccounts.map((demo) => {
                  const DemoIcon = demo.icon;
                  return (
                    <button
                      key={demo.role}
                      type="button"
                      onClick={() => handleFillDemo(demo)}
                      className="flex flex-col items-center justify-center rounded-xl bg-slate-800 p-2.5 text-center transition hover:bg-slate-700 active:scale-95 border border-slate-700 hover:border-indigo-500/50"
                    >
                      <DemoIcon className="h-4 w-4 text-indigo-400 mb-1" />
                      <span className="text-xs font-semibold text-slate-200">{demo.label}</span>
                      <span className="text-[10px] text-slate-400 truncate w-full mt-0.5 capitalize">{demo.role}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-3 rounded-xl bg-red-500/10 p-4 border border-red-500/20 text-red-300 text-sm">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@classgap.test"
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs text-indigo-400 hover:text-indigo-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember me</span>
                </label>
                <span className="text-xs text-slate-400">
                  Default: <code className="text-indigo-300">password</code>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to ClassGap</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Quick info note */}
          <div className="mt-6 text-center text-xs text-slate-500">
            Need help? Contact the school administration office.
          </div>
        </div>
      </div>
    </div>
  );
}