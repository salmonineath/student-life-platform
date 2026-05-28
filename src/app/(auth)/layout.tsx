"use client";

import React from "react";
import { motion } from "motion/react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden p-4 sm:p-6"
      style={{ background: "linear-gradient(150deg, #f8f4ff 0%, #fef0fb 45%, #fff8f0 100%)" }}
    >
      {/* Soft lavender blob — top left */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 700,
          height: 700,
          top: "-20%",
          left: "-12%",
          background: "radial-gradient(circle, rgba(167,139,250,0.45) 0%, transparent 65%)",
          filter: "blur(50px)",
          willChange: "transform",
        }}
        animate={{ x: ["0%", "14%", "-6%", "0%"], y: ["0%", "18%", "-10%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft peach blob — bottom right */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 600,
          height: 600,
          bottom: "-15%",
          right: "-10%",
          background: "radial-gradient(circle, rgba(251,146,60,0.38) 0%, transparent 65%)",
          filter: "blur(50px)",
          willChange: "transform",
        }}
        animate={{ x: ["0%", "-18%", "8%", "0%"], y: ["0%", "-16%", "12%", "0%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft sky blob — center right */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 480,
          height: 480,
          top: "20%",
          right: "8%",
          background: "radial-gradient(circle, rgba(125,211,252,0.4) 0%, transparent 65%)",
          filter: "blur(48px)",
          willChange: "transform",
        }}
        animate={{ x: ["-6%", "12%", "-6%"], y: ["8%", "-20%", "8%"], scale: [1, 1.15, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Soft rose blob — bottom left */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 380,
          height: 380,
          bottom: "8%",
          left: "6%",
          background: "radial-gradient(circle, rgba(249,168,212,0.4) 0%, transparent 65%)",
          filter: "blur(48px)",
          willChange: "transform",
        }}
        animate={{ x: ["0%", "16%", "0%"], y: ["0%", "-14%", "0%"], scale: [1, 1.1, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.15) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 w-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
