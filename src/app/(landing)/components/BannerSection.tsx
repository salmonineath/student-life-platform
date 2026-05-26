"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import Reveal from "./Reveal";

const UNIVERSITIES = [
  { abbr: "CADT",     name: "Digital Technology",   color: "#3B82F6" },
  { abbr: "EHT",      name: "Hôtellerie & Tourisme", color: "#10B981" },
  { abbr: "IMSE",     name: "Management Science",    color: "#F59E0B" },
  { abbr: "PSE-WMAD", name: "Web & Mobile Dev",      color: "#6366F1", },
];

const STATS = [
  { value: "100%", label: "Free forever",  color: "#3B82F6" },
  { value: "4+",   label: "Universities",  color: "#10B981" },
  { value: "AI",   label: "Built-in tools",color: "#6366F1" },
  { value: "🇰🇭",  label: "Made for Cambodia", color: "#F59E0B" },
];

function StatCard({ value, label, color, delay }: { value: string; label: string; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center p-5 rounded-2xl border border-blue-100/60 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-default" style={{ background: "white" }}
    >
      <span
        className="font-sora text-[26px] font-extrabold leading-none mb-1"
        style={{ color }}
      >
        {value}
      </span>
      <span className="text-[11px] text-slate-400 font-medium text-center">{label}</span>
    </motion.div>
  );
}

export default function BannerSection() {
  return (
    <section
      id="for-students"
      className="py-24 md:py-32 px-6 relative overflow-hidden"
      style={{ background: "#EBF0FF" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(37,99,235,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, #EBF0FF, transparent 30%, transparent 70%, #EBF0FF)" }} />

      <div className="max-w-[1160px] mx-auto relative z-10 grid md:grid-cols-2 gap-16 md:gap-24 items-center">

        {/* ── Left: copy ── */}
        <Reveal direction="left">
          <span className="block text-[12px] font-bold uppercase tracking-[2px] text-[#2563EB] mb-4">
            For Students
          </span>
          <h2
            className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold text-[#080C14] leading-[1.1] mb-6"
            style={{ letterSpacing: "-2px" }}
          >
            Built for
            <br />
            university life
            <br />
            in Cambodia.
          </h2>
          <p className="text-[16px] text-slate-500 leading-[1.8] mb-8 max-w-[400px]">
            Managing university is hard when everything is scattered across
            Telegram, Facebook groups, and notebooks. Student Life brings it
            all into one clean, reliable platform.
          </p>

          {/* Quote */}
          <div
            className="rounded-2xl p-5 border-l-4"
            style={{
              background: "#EEF4FF",
              borderColor: "#2563EB",
            }}
          >
            <p className="text-[14px] text-slate-600 leading-relaxed italic mb-2">
              "Finally a tool that gets it — I manage my whole semester from one place now."
            </p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[10px] font-bold">L</div>
              <span className="text-[12px] font-semibold text-slate-500">Linda — CADT, Year 1</span>
            </div>
          </div>
        </Reveal>

        {/* ── Right: stats + university cards ── */}
        <Reveal direction="right">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {STATS.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.08} />
            ))}
          </div>

          {/* University cards */}
          <div className="grid grid-cols-2 gap-3">
            {UNIVERSITIES.map((uni, i) => (
              <motion.div
                key={uni.abbr}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3 }}
                className="uni-card border-[1.5px] border-blue-100/50 rounded-2xl px-4 py-4 flex items-center gap-3 cursor-default overflow-hidden relative" style={{ background: "white" }}
              >
                {/* Color accent */}
                <div
                  className="w-[3px] h-8 rounded-full flex-shrink-0"
                  style={{ background: uni.color }}
                />
                <div className="min-w-0">
                  <p className="font-sora font-extrabold text-[14px] text-[#080C14] truncate">{uni.abbr}</p>
                  <p className="text-[11px] text-slate-400 truncate">{uni.name}</p>
                </div>
                {/* Subtle bg tint */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-12 pointer-events-none"
                  style={{ background: `linear-gradient(to left, ${uni.color}08, transparent)` }}
                />
              </motion.div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
