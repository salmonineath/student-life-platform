"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import axios, { AxiosError } from 'axios';

export default function LoginPage() {
  const router = useRouter();

  // 1. State Management
  const [formData, setFormData] = useState({
    email_or_username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. The Login Logic
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(
        'https://studentlifeapis.onrender.com/api/v1/auth/login',
        formData,
        {
          withCredentials: true, // sends & receives HTTP-only cookies
        }
      );

      router.push('/dashboard');
    } catch (err) {
      const axiosErr = err as AxiosError<{ message: string }>;
      const message =
        axiosErr.response?.data?.message ||
        'Invalid email/username or password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden transition-all">

        {/* Header Section */}
        <div className="p-10 text-center bg-[#0F172A] text-white">
          <div className="inline-flex bg-blue-600 p-4 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Student Life</h1>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-semibold">Member Login</p>
        </div>

        {/* Form Section */}
        <div className="p-10">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-center gap-3 rounded-r-xl animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
           {/* Email Field */}
<div className="space-y-2">
  <label className="text-xs font-semibold text-slate-700 uppercase ml-1">
    Email Address
  </label>

  <div className="relative group">
    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />

    <input
      required
      name="Email or username"
      type="text"
      value={formData.email_or_username}
      onChange={handleChange}
      placeholder="name@university.edu.kh"
      className="w-full pl-12 pr-4 py-4 
                 bg-white 
                 border border-slate-300 
                 text-slate-900
                 rounded-2xl 
                 outline-none 
                 transition-all

                 placeholder:text-slate-500

                 hover:border-slate-400
                 focus:border-blue-600 
                 focus:ring-2 focus:ring-blue-500/20"
    />
  </div>
</div>

{/* Password Field */}
<div className="space-y-2">
  <div className="flex justify-between items-center ml-1">
    <label className="text-xs font-semibold text-slate-700 uppercase">
      Password
    </label>

    <button
      type="button"
      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
    >
      Forgot?
    </button>
  </div>

  <div className="relative group">
    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />

    <input
      required
      name="password"
      type="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Enter your password"
      className="w-full pl-12 pr-4 py-4 
                 bg-white 
                 border border-slate-300 
                 text-slate-900
                 rounded-2xl 
                 outline-none 
                 transition-all

                 placeholder:text-slate-500

                 hover:border-slate-400
                 focus:border-blue-600 
                 focus:ring-2 focus:ring-blue-500/20"
    />
  </div>
</div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="text-center mt-10 text-sm text-slate-500 font-medium">
            New student? 
            <button onClick={() => router.push("/register")} 
              className="text-blue-600 font-bold hover:underline"> Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
