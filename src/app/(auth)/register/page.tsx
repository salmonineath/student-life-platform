"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  User,
  Lock,
  Mail,
  Phone,
  BookOpen,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axios, { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();

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
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(
        "https://studentlifeapis.onrender.com/api/v1/auth/register",
        formData,
        { withCredentials: true }
      );

      router.push("/");
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      setError(
        axiosErr.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">

      {/* Header (same as login) */}
      <div className="p-10 text-center bg-[#0F172A] text-white">
        <div className="inline-flex bg-blue-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">
          Student Life
        </h1>
        <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-semibold">
          Member Register
        </p>
      </div>

      {/* Form */}
      <div className="p-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 rounded-r-xl">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">

          {/* Fullname */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            <input
              name="fullname"
              type="text"
              placeholder="Full Name"
              value={formData.fullname}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Username */}
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            <input
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Phone */}
          <div className="relative group">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            <input
              name="phone"
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* University */}
          <div className="relative group">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            <input
              name="university"
              type="text"
              placeholder="University"
              value={formData.university}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Major */}
          <div className="relative group">
            <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            <input
              name="major"
              type="text"
              placeholder="Major"
              value={formData.major}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Academic Year */}
          <div className="relative group">
            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
            <input
              name="academicYear"
              type="text"
              placeholder="Academic Year (e.g. 1,2,3,4)"
              value={formData.academicYear}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center mt-8 text-sm text-slate-500">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/")}
            className="text-blue-600 font-bold hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
