"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { registerAction } from "../core/action";
import { GraduationCap, Mail, Lock, Eye, EyeOff, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const CARD_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const ERROR_VARIANTS: Variants = {
  hidden: { opacity: 0, height: 0, marginTop: 0 },
  visible: { opacity: 1, height: "auto", marginTop: 16, transition: { duration: 0.2 } },
};

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "", username: "", email: "", password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    const { fullname, username, email, password } = formData;
    if (!fullname.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await dispatch(registerAction(formData));
      if (registerAction.fulfilled.match(result)) {
        window.location.href = "/dashboard";
      } else {
        setError((result.payload as string) || "Registration failed. Please try again.");
      }
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400";
  const fieldClass = "flex items-center border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-transparent focus-within:bg-white hover:border-sky-300 transition-all duration-200 group";
  const iconClass = "w-4 h-4 text-gray-400 mr-2 shrink-0 group-focus-within:text-sky-500 transition-colors duration-200";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 to-sky-50">
      <motion.div
        variants={CARD_VARIANTS}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2"
      >
        {/* LEFT */}
        <div className="relative flex flex-col justify-center items-center bg-[#0F172A] text-white p-8 sm:p-10 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />

          <div className="relative inline-flex bg-gradient-to-br from-blue-500 to-sky-400 p-4 rounded-2xl mb-6 shadow-lg shadow-blue-500/40 transition-transform duration-200 hover:scale-105 hover:rotate-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="relative text-3xl font-extrabold tracking-tight">Student Life</h1>

          <p className="relative mt-4 text-center text-slate-400 text-sm max-w-xs leading-relaxed">
            Manage your schedule, assignments, and study groups all in one place.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-2">
            {["Schedule", "Assignments", "Study Groups", "AI Chat"].map((f) => (
              <span
                key={f}
                className="text-xs bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10 transition-transform duration-150 hover:scale-105 cursor-default"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <Link
            href="/student-life"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-sky-500 hover:-translate-x-1 transition-all duration-200 mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <h2 className="text-3xl font-bold text-slate-800 mb-6">Create Account</h2>

          <div className="flex flex-col gap-4">
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Full Name</label>
              <div className={fieldClass}>
                <User className={iconClass} />
                <input type="text" name="fullname" value={formData.fullname} onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  placeholder="John Doe" autoComplete="name" className={inputClass} />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Username</label>
              <div className={fieldClass}>
                <User className={iconClass} />
                <input type="text" name="username" value={formData.username} onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  placeholder="john_doe" autoComplete="username" className={inputClass} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Email</label>
              <div className={fieldClass}>
                <Mail className={iconClass} />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  placeholder="example@gmail.com" autoComplete="email" className={inputClass} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-600 mb-1.5 block">Password</label>
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
                  className="ml-2 text-gray-400 hover:text-sky-500 transition-colors duration-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          <motion.div
            variants={ERROR_VARIANTS}
            initial="hidden"
            animate={error ? "visible" : "hidden"}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          </motion.div>

          {/* Register Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-6 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md shadow-sky-200 hover:shadow-sky-300 hover:-translate-y-px active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Registering...
              </span>
            ) : "Register"}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-sky-500 font-medium hover:text-sky-600 hover:underline transition-colors">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;