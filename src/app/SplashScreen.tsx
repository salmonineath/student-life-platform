"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { GraduationCap } from "lucide-react";

const LETTERS = "Student Life".split("");
const PILLS = [
  { icon: "📅", label: "Schedule" },
  { icon: "📝", label: "Assignments" },
  { icon: "👥", label: "Study Groups" },
  { icon: "🤖", label: "AI Tools" },
];

export default function SplashScreen() {
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Skip splash for returning visitors in the same session
    if (sessionStorage.getItem("splashShown")) {
      setDone(true);
      return;
    }
    sessionStorage.setItem("splashShown", "1");
    const t1 = setTimeout(() => setExiting(true), 2600);
    const t2 = setTimeout(() => setDone(true), 2600 + 540);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (done) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex items-center justify-center overflow-hidden select-none"
      style={{ background: "#080C14" }}
      initial={{ y: 0 }}
      animate={exiting ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.52, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* ── Background orbs (static — no JS animation needed) ── */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 720, height: 720,
          top: "50%", left: "50%",
          translate: "-50% -50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.17) 0%, transparent 68%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 480, height: 480, top: "-8%", right: "-4%",
          background: "radial-gradient(circle, rgba(99,102,241,0.11) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 400, height: 400, bottom: "-6%", left: "-4%",
          background: "radial-gradient(circle, rgba(14,165,233,0.09) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Content ── */}
      <div className="relative flex flex-col items-center">

        {/* Logo with spinning ring */}
        <div className="relative w-[82px] h-[82px] mb-7">
          {/* Spinning conic ring */}
          <motion.div
            className="absolute rounded-[26px] pointer-events-none"
            style={{
              inset: -3,
              background:
                "conic-gradient(from 0deg, transparent 45%, rgba(96,165,250,0.9) 72%, rgba(56,189,248,1) 85%, transparent 100%)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
          />

          {/* Glow pulse */}
          <motion.div
            className="absolute inset-0 rounded-[22px] pointer-events-none"
            animate={{
              boxShadow: [
                "0 0 0px 0px rgba(59,130,246,0)",
                "0 0 0px 10px rgba(59,130,246,0.18)",
                "0 0 0px 0px rgba(59,130,246,0)",
              ],
            }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          />

          {/* Icon */}
          <motion.div
            initial={{ scale: 0.2, opacity: 0, rotate: -16 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.08 }}
            className="relative w-full h-full bg-gradient-to-br from-blue-500 to-sky-400 rounded-[22px] flex items-center justify-center"
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.45), 0 0 24px rgba(59,130,246,0.3)" }}
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Letter stagger */}
        <div className="flex mb-3">
          {LETTERS.map((char, i) => (
            <motion.span
              key={i}
              initial={{ y: 36, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.55,
                delay: 0.28 + i * 0.042,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-white font-bold text-[26px] leading-none tracking-tight"
              style={{ fontFamily: "var(--font-sora)", width: char === " " ? "0.55ch" : undefined }}
            >
              {char === " " ? " " : char}
            </motion.span>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.5, ease: "easeOut" }}
          className="text-slate-500 text-[13px] tracking-wide mb-7"
        >
          Your university life, organized.
        </motion.p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-[300px]">
          {PILLS.map((p, i) => (
            <motion.span
              key={p.label}
              initial={{ opacity: 0, scale: 0.65, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                delay: 1.08 + i * 0.09,
                duration: 0.45,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-[12px] text-slate-400 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04]"
            >
              {p.icon} {p.label}
            </motion.span>
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-[170px] h-[2px] rounded-full overflow-hidden"
          style={{ background: "rgba(255,255,255,0.07)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #3b82f6, #38bdf8, #3b82f6)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, delay: 0.55, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
