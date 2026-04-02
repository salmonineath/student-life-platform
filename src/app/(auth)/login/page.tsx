"use client";

import { useState } from "react";
import {
  GraduationCap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/redux";
import { fetchMe } from "@/features/auth/authSlice";
import { loginUser } from "@/features/auth/authSlice";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await dispatch(
        loginUser({ email_or_username: emailOrUsername, password }),
      ).unwrap();

      await dispatch(fetchMe());

      // Small wait to let the browser commit the HTTP-only cookies
      // before middleware checks them on the next request
      // await new Promise((resolve) => setTimeout(resolve, 100));

      // router.push("/dashboard");

      // Step 2: Redirect — AuthContext in (student) layout will auto-fetch /me
      // Use window.location.href instead of router.push
      // This forces a full page reload so the browser fully commits
      // the HTTP-only cookies before the next request hits middleware
      window.location.href = "/dashboard";
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || "Login failed");
      } else if (err.request) {
        setError("No response from server");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-sky-50">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all duration-500">
        {/* LEFT */}
        <div className="relative flex flex-col justify-center items-center bg-[#0F172A] text-white p-10 overflow-hidden">
          {/* Background decorative circles */}
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl" />

          {/* Icon */}
          <div className="relative inline-flex bg-gradient-to-br from-blue-500 to-sky-400 p-4 rounded-2xl mb-6 shadow-lg shadow-blue-500/40 hover:scale-105 transition-transform duration-300">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="relative text-3xl font-extrabold tracking-tight">
            Student Life
          </h1>

          <p className="relative mt-4 text-center text-slate-400 text-sm max-w-xs leading-relaxed">
            Manage your schedule, assignments, and study groups all in one
            place.
          </p>

          {/* Bottom feature pills */}
          <div className="relative mt-8 flex flex-wrap justify-center gap-2">
            {["Schedule", "Assignments", "Study Groups", "AI Chat"].map(
              (feature) => (
                <span
                  key={feature}
                  className="text-xs bg-white/10 text-slate-300 px-3 py-1 rounded-full border border-white/10"
                >
                  {feature}
                </span>
              ),
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-10 flex flex-col justify-center">
          {/* Back button */}
          <Link
            href="/student-life"
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-sky-500 hover:-translate-x-1 transition-all duration-200 mb-6 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <h2 className="text-3xl font-bold text-slate-800 mb-1">
            Welcome Back!
          </h2>
          <p className="text-sm text-gray-400 mb-8">
            Sign in to continue your journey
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-600 mb-1.5 block">
              Email or Username
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-transparent hover:border-sky-300 transition-all duration-200 bg-gray-50 focus-within:bg-white">
              <Mail className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="example@email.com"
                className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <Link
                href="/forget-password"
                className="text-xs text-sky-500 hover:text-sky-600 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-sky-400 focus-within:border-transparent hover:border-sky-300 transition-all duration-200 bg-gray-50 focus-within:bg-white">
              <Lock className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full outline-none text-sm bg-transparent text-gray-700 placeholder-gray-400"
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
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 relative bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 active:scale-[0.98] text-white py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-md shadow-sky-200 hover:shadow-sky-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "LOGIN"
            )}
          </button>

          {/* Register */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-sky-500 font-medium hover:text-sky-600 hover:underline transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
