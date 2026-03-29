"use client";

import { useState } from "react";
import { GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

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

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData, {
        withCredentials: true,
      });

      console.log("Registration successful:", res.data);

      // after registration success redirect to dashboard
      router.push("/dashboard");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data?.message || "Register failed");
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
            Create your account
          </h2>

          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Fullname</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Username</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="john_doe"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <Mail className="w-4 h-4 text-gray-400 mr-2" />
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@gmail.com"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
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

          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">
              Phone Number
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(optional)"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">
              University
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="(optional)"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Major</label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="(optional)"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">
              Academic Year
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-sky-400">
              <input
                type="text"
                name="academicYear"
                value={formData.academicYear}
                onChange={handleChange}
                placeholder="(optional)"
                className="w-full outline-none text-sm"
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Login Button */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="mt-6 bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "REGISTER"}
          </button>

          {/* Register */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{" "}
            <span className="text-sky-500 cursor-pointer hover:underline">
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
