"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerAction } from "../core/action";
import { markWelcomePending } from "@/lib/welcome";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
  Calendar,
  BookOpen,
  Users,
  Zap,
  ArrowRight,
} from "lucide-react";
import { motion, type Variants } from "motion/react";
import { usePageTransition } from "@/app/PageTransitionProvider";

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const ERROR_VARIANTS: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: { opacity: 1, height: "auto", marginTop: 12, transition: { duration: 0.2 } },
};

const FEATURES = [
  { icon: Calendar, title: "Smart Schedule", desc: "Never miss a class or deadline" },
  { icon: BookOpen, title: "Assignments", desc: "Track all your tasks in one place" },
  { icon: Users, title: "Study Groups", desc: "Collaborate with your peers" },
  { icon: Zap, title: "AI Assistant", desc: "Get instant homework help" },
];

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullname: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { navigate } = usePageTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { fullname, username, email, password } = formData;
    if (!fullname.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("Please complete every field to create your account.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await dispatch(registerAction(formData));
      if (registerAction.fulfilled.match(result)) {
        // Arm the one-time welcome toast shown on first dashboard load.
        markWelcomePending();
        window.location.href = "/dashboard";
      } else {
        setError(
          (result.payload as string) ||
            "We couldn't create your account. Please try again.",
        );
      }
    } catch {
      setError("Something interrupted sign-up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fieldClass =
    "flex items-center gap-2.5 border border-slate-200 rounded-lg px-4 py-3 bg-slate-50 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10 hover:border-slate-300 transition-all duration-150 group";
  const inputClass =
    "flex-1 outline-none text-sm bg-transparent text-slate-800 placeholder-slate-400";
  const iconClass =
    "w-4 h-4 text-slate-400 shrink-0 group-focus-within:text-blue-500 transition-colors";
  const labelClass =
    "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        variants={CARD_VARIANTS}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl grid grid-cols-1 md:grid-cols-5"
      >
        {/* LEFT PANEL */}
        <div className="hidden md:flex md:col-span-2 relative flex-col justify-between bg-[#0F172A] text-white p-8 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-600/25 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-12 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl" />

          <div className="relative z-10">
            <div className="inline-flex bg-gradient-to-br from-blue-500 to-sky-400 p-3 rounded-xl shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <p className="mt-4 font-bold text-xl tracking-tight">Student Life</p>
            <p className="text-slate-400 text-sm mt-1">Your academic companion</p>
          </div>

          <div className="relative z-10 space-y-5">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-4 h-4 text-sky-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10">
            <div className="h-px bg-white/10 mb-4" />
            <p className="text-xs text-slate-500">Free for all students · No credit card required</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-span-full md:col-span-3 bg-white p-8 sm:p-10 flex flex-col justify-center">
          <button
            onClick={() => navigate("/student-life")}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-700 transition-colors duration-200 mb-8 w-fit group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            Back to home
          </button>

          <div className="mb-7">
            <div className="inline-flex items-center gap-1.5 bg-sky-50 text-sky-600 text-xs font-medium px-3 py-1 rounded-full border border-sky-100 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
              Join for free
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="text-sm text-slate-500 mt-1">Start organizing your student life today</p>
          </div>

          <div className="space-y-4">
            {/* Full Name + Username side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <div className={fieldClass}>
                  <User className={iconClass} />
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                    placeholder="John Doe"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Username</label>
                <div className={fieldClass}>
                  <User className={iconClass} />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                    placeholder="john_doe"
                    autoComplete="username"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Email</label>
              <div className={fieldClass}>
                <Mail className={iconClass} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  placeholder="example@gmail.com"
                  autoComplete="email"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Password</label>
              <div className={fieldClass}>
                <Lock className={iconClass} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <motion.div
            variants={ERROR_VARIANTS}
            initial="hidden"
            animate={error ? "visible" : "hidden"}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg px-3.5 py-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          </motion.div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-6 w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating account...
              </span>
            ) : (
              <>
                Create Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </>
            )}
          </button>

          <p className="text-center text-xs text-slate-400 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-sky-500 font-semibold hover:text-sky-600 transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
