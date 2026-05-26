"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { usePageTransition } from "@/app/PageTransitionProvider";

const FEATURE_PILLS = [
  { icon: "📅", label: "Schedule" },
  { icon: "📝", label: "Assignments" },
  { icon: "👥", label: "Study Groups" },
  { icon: "🤖", label: "AI Tools" },
];

const SCHEDULE_ITEMS = [
  { color: "#3B82F6", title: "Math Analysis", time: "08:00 – 09:30", room: "Room 201", done: false },
  { color: "#10B981", title: "Physics Lab",   time: "10:00 – 11:30", room: "Lab A",    done: true  },
  { color: "#6366F1", title: "CS Algorithms", time: "14:00 – 15:30", room: "B203",     done: false },
];

// ── Right-side app preview ───────────────────────────────────────────────────

function AppPreview() {
  return (
    <section id="hero" className="relative w-full h-[500px] select-none">
      {/* Soft radial glow behind the cards */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 55% 45%, rgba(37,99,235,0.13) 0%, rgba(99,102,241,0.09) 50%, transparent 75%)",
        }}
      />


      {/* ── AI badge — top right ── */}
      <motion.div
        className="absolute top-0 right-0 z-30"
        initial={{ opacity: 0, y: -12, scale: 0.88 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-2xl px-4 py-3 shadow-2xl border border-white/10"
          style={{ background: "#0D1117" }}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">AI Active</span>
          </div>
          <p className="text-[12px] font-semibold leading-snug text-white">Study plan generated ✨</p>
        </div>
      </motion.div>

      {/* ── Main schedule card ── */}
      <motion.div
        className="absolute top-12 left-0 right-14 z-10"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-[22px] p-5 border"
          style={{
            background: "#0D1117",
            borderColor: "rgba(255,255,255,0.07)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.45)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-slate-500">This Week</p>
              <p className="font-sora text-[15px] font-bold text-white mt-0.5">Monday, Apr 7</p>
            </div>
            <span
              className="text-[11px] font-bold px-2.5 py-1 rounded-xl"
              style={{ color: "#60A5FA", background: "rgba(96,165,250,0.12)", border: "1px solid rgba(96,165,250,0.2)" }}
            >
              3 classes
            </span>
          </div>

          <div className="space-y-0.5">
            {SCHEDULE_ITEMS.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors cursor-default"
                style={{ background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
              >
                <div
                  className="w-[3px] h-8 rounded-full flex-shrink-0"
                  style={{ background: item.color }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-slate-200 truncate">{item.title}</p>
                  <p className="text-[11px] text-slate-500">{item.time} · {item.room}</p>
                </div>
                {item.done && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ color: "#34D399", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.2)" }}
                  >
                    Done
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Assignment card — bottom left ── */}
      <motion.div
        className="absolute bottom-14 left-0 w-[195px] z-20"
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: "#0D1117",
            borderColor: "rgba(251,191,36,0.18)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-sm">📝</span>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Due Tomorrow</span>
          </div>
          <p className="text-[13px] font-semibold text-slate-200 mb-3">Physics Lab Report</p>
          <div className="w-full rounded-full h-1.5 mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: "65%" }} />
          </div>
          <p className="text-[10px] text-slate-500">65% complete</p>
        </div>
      </motion.div>

      {/* ── Study group card — bottom right ── */}
      <motion.div
        className="absolute bottom-0 right-4 w-[172px] z-20"
        initial={{ opacity: 0, x: 14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="rounded-2xl p-4 border"
          style={{
            background: "#0D1117",
            borderColor: "rgba(52,211,153,0.18)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="text-sm">👥</span>
            <span className="text-[12px] font-bold text-slate-200">CS Study Group</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {["#3B82F6", "#10B981", "#F59E0B", "#6366F1"].map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full border-2"
                  style={{ background: color, borderColor: "#0D1117" }}
                />
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-slate-400">4 online</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

// ── Main HeroSection ─────────────────────────────────────────────────────────

export default function HeroSection() {
  const { navigate, transitionReady } = usePageTransition();

  useEffect(() => { transitionReady(); }, [transitionReady]);

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden bg-white">
      {/* ── Layer 1: dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.18) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Layer 2: static color orbs ── */}
      {/* Blue — top right */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 640, height: 640,
          top: "-15%", right: "-8%",
          background: "rgba(37,99,235,0.18)",
          filter: "blur(110px)",
        }}
      />
      {/* Indigo — mid right */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 520, height: 520,
          bottom: "5%", right: "8%",
          background: "rgba(99,102,241,0.13)",
          filter: "blur(100px)",
        }}
      />
      {/* Emerald — bottom left, very subtle */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 420, height: 420,
          bottom: "-10%", left: "-6%",
          background: "rgba(16,185,129,0.09)",
          filter: "blur(90px)",
        }}
      />

      {/* ── Layer 3: radial light on the left to keep text readable ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 90% at 0% 50%, rgba(255,255,255,0.92) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1160px] mx-auto px-6 py-16 w-full grid lg:grid-cols-[1fr_1.15fr] gap-12 xl:gap-20 items-center">

        {/* ── LEFT: copy ── */}
        <div>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-white border border-black/8 shadow-sm px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1.5 bg-[#2563EB] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                Free Forever
              </span>
              🇰🇭 Built for Cambodian Students
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="font-sora text-[clamp(36px,4.5vw,60px)] font-extrabold text-[#080C14] leading-[1.07] mb-5"
            style={{ letterSpacing: "-2px" }}
          >
            Your entire
            <br />
            university life,
            <br />
            <span className="text-[#2563EB]">finally organized.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-[16px] text-slate-500 leading-[1.8] mb-8 max-w-[420px]"
          >
            Schedule, assignments, study groups, and AI tools — all in one
            place. 100% free for every student, no credit card ever.
          </motion.p>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-9"
          >
            {FEATURE_PILLS.map((pill, i) => (
              <motion.span
                key={pill.label}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 text-slate-600 hover:text-blue-600 text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-default"
              >
                {pill.icon} {pill.label}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA row */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.46 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/register")}
              className="font-sora group relative overflow-hidden inline-flex items-center gap-2.5 bg-[#080C14] hover:bg-[#2563EB] text-white px-8 py-3.5 rounded-2xl font-semibold text-[15px] transition-all duration-200 shadow-xl shadow-slate-900/20"
            >
              Get Started Free
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </motion.button>

            <button
              onClick={() => navigate("/login")}
              className="text-[14px] font-medium text-slate-400 hover:text-[#080C14] transition-colors duration-200"
            >
              Already have an account?{" "}
              <span className="underline underline-offset-2">Sign in</span>
            </button>
          </motion.div>

          {/* Trust micro-copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-5 mt-8 text-[12px] text-slate-400"
          >
            {["No credit card", "Free forever", "Made for Cambodia"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: App preview (desktop only) ── */}
        <motion.div
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
          className="hidden lg:block"
        >
          <AppPreview />
        </motion.div>
      </div>
    </section>
  );
}
