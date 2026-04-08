"use client";

import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// ─────────────────────────────────────────────
// Reusable Input Field
// ─────────────────────────────────────────────

const InputField = ({
  label,
  icon: Icon,
  optional,
  children,
}: {
  label: string;
  icon?: any;
  optional?: boolean;
  children: React.ReactNode;
}) => (
  <div>
    <label className="text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-1.5">
      {label}
      {optional && (
        <span className="text-xs text-gray-400 font-normal">(optional)</span>
      )}
    </label>
    <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-transparent hover:border-sky-300 transition-all duration-200 bg-gray-50 focus-within:bg-white">
      {Icon && <Icon className="w-4 h-4 text-gray-400 mr-2 shrink-0" />}
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────────
// Register Page
// ─────────────────────────────────────────────

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    university: "",
    major: "",
    academicYear: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const validateRequiredFields = (): boolean => {
    if (!formData.fullname.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.password.trim()) {
      setError("Password is required");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError("");

    if (!validateRequiredFields()) return;

    setLoading(true);

    try {
      // TODO: add your API logic here
      // e.g. await dispatch(registerUser(formData)).unwrap();
      // e.g. window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-slate-100 to-sky-50">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* ── LEFT PANEL ── */}
        <div className="relative flex flex-col justify-center items-center bg-[#0F172A] text-white p-8 sm:p-10 overflow-hidden">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl" />

          <div className="relative inline-flex bg-gradient-to-br from-blue-500 to-sky-400 p-4 rounded-2xl mb-6 shadow-lg shadow-blue-500/40 hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="relative text-3xl font-extrabold tracking-tight">
            Student Life
          </h1>

          <p className="relative mt-4 text-center text-slate-400 text-sm max-w-xs leading-relaxed">
            Manage your schedule, assignments, and study groups all in one place.
          </p>

          <div className="relative mt-8 flex flex-wrap justify-center gap-2">
            {["Schedule", "Assignments", "Study Groups", "AI Chat"].map((f) => (
              <span
                key={f}
                className="text-xs bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          <Link
            href="/student-life"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-sky-500 hover:-translate-x-1 transition-all duration-200 mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>

          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Create Account
          </h2>

          <div className="flex flex-col gap-4">
            <InputField label="Full Name" icon={User}>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                placeholder="John Doe"
                className={inputClass}
              />
            </InputField>

            <InputField label="Username" icon={User}>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="john_doe"
                className={inputClass}
              />
            </InputField>

            <InputField label="Email" icon={Mail}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                className={inputClass}
              />
            </InputField>

            <InputField label="Password" icon={Lock}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-sky-500 transition-colors duration-200"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </InputField>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-6 bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 active:scale-[0.98] text-white py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md shadow-sky-200 hover:shadow-sky-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Registering...
              </span>
            ) : (
              "REGISTER"
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-sky-500 font-medium hover:text-sky-600 hover:underline transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;