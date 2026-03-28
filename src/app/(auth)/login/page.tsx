"use client";

import { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axiosInstance from "@/lib/axios";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      // Step 1: Login — backend sets accessToken + refreshToken in cookies
      await axiosInstance.post("/auth/login", {
        email_or_username: emailOrUsername,
        password: password,
      });

      // Step 2: Redirect — AuthContext in (student) layout will auto-fetch /me
      router.push("/dashboard");
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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col justify-center items-center bg-[#0F172A] text-white p-10">
          <div className="inline-flex bg-blue-600 p-4 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">
            Student Life
          </h1>

          <div className="mt-4 text-center text-slate-400 text-sm max-w-xs">
            Manage your schedule, assignments, and study groups all in one
            place.
          </div>
        </div>

        {/* RIGHT */}
        <div className="p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-sky-600 mb-2">
            Welcome Back!
          </h2>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">
              Email or Username
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                placeholder="example@email.com"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-2">
            <label className="text-sm text-gray-500 mb-1 block">Password</label>

            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <Lock className="w-4 h-4 text-gray-400 mr-2" />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full outline-none text-sm"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 text-gray-400 hover:text-gray-600"
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
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-6 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          {/* Register */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Don't have account?{" "}
            <Link
              href="/register"
              className="text-sky-500 cursor-pointer hover:underline"
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
