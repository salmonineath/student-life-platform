"use client";

import { motion } from "motion/react";
import Reveal from "./Reveal";

const PLAN_DAYS = [
  { day: "Mon", task: "Read chapter 7–8",         duration: "1h",   done: true  },
  { day: "Tue", task: "Work through problems",     duration: "45m",  done: true  },
  { day: "Wed", task: "Write intro & method",      duration: "1h",   done: false, active: true },
  { day: "Thu", task: "Full draft",                duration: "2h",   done: false },
  { day: "Fri", task: "Review & submit",           duration: "30m",  done: false },
];

const CHAT = [
  { role: "user", text: "Explain Newton's second law with a Cambodia example" },
  { role: "ai",   text: "F = ma — force equals mass × acceleration. Imagine a tuk-tuk: a heavier one needs more engine force to speed up at the same rate. The same concept applies to your physics problems! 🛺" },
  { role: "user", text: "Can you make a short summary I can use for my notes?" },
];

export default function AIToolsSection() {
  return (
    <section
      id="ai"
      className="py-24 md:py-32 px-6 relative overflow-hidden"
      style={{ background: "#080C14" }}
    >
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft blue glow, top left */}
      <div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 65%)",
          filter: "blur(40px)",
        }}
      />

      <div className="max-w-[1160px] mx-auto relative z-10">
        {/* Header */}
        <Reveal>
          <div className="mb-16">
            <span className="block text-[12px] font-bold uppercase tracking-[2px] text-[#60A5FA] mb-4">
              ✦ AI Features
            </span>
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
              <h2
                className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold text-white leading-[1.1] flex-shrink-0"
                style={{ letterSpacing: "-2px" }}
              >
                Study smarter,
                <br />
                not harder.
              </h2>
              <p className="text-[16px] text-slate-500 leading-[1.75] max-w-[360px] pb-1">
                Powerful AI tools built right in — always optional,
                never overwhelming, and completely free.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* ── Card 1: AI Study Plan ── */}
          <Reveal delay={0}>
            <div
              className="ai-card-glow relative rounded-3xl p-7 overflow-hidden h-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Top label */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <span className="text-[12px] font-bold text-blue-400 uppercase tracking-wider">AI Study Plan</span>
              </div>

              <h3 className="font-sora text-[20px] font-bold text-white mb-2">
                Generate a plan from your deadline.
              </h3>
              <p className="text-[14px] text-slate-500 leading-[1.7] mb-6">
                Create an assignment, click "Generate Plan". Get a personalized daily breakdown built around your actual deadline.
              </p>

              {/* Visual: study plan timeline */}
              <div
                className="rounded-2xl p-4 space-y-1"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Physics Lab Report</p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ color: "#FB923C", background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.2)" }}
                  >
                    Due Tomorrow
                  </span>
                </div>
                {PLAN_DAYS.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors"
                    style={{
                      background: item.active ? "rgba(37,99,235,0.12)" : "transparent",
                      border: item.active ? "1px solid rgba(37,99,235,0.2)" : "1px solid transparent",
                      opacity: item.done ? 0.5 : 1,
                    }}
                  >
                    <span
                      className="text-[11px] font-bold w-8 flex-shrink-0"
                      style={{ color: item.active ? "#60A5FA" : "#475569" }}
                    >
                      {item.day}
                    </span>
                    <span
                      className="flex-shrink-0 text-sm"
                    >
                      {item.done ? "✓" : item.active ? "●" : "○"}
                    </span>
                    <span className="flex-1 text-[13px] text-slate-300 truncate">{item.task}</span>
                    <span className="text-[11px] text-slate-600 flex-shrink-0">{item.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── Card 2: AI Chat ── */}
          <Reveal delay={100}>
            <div
              className="ai-card-glow relative rounded-3xl p-7 overflow-hidden h-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Top label */}
              <div className="flex items-center gap-2 mb-5">
                <div className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <span className="text-sm">💬</span>
                </div>
                <span className="text-[12px] font-bold text-indigo-400 uppercase tracking-wider">AI Chat Tutor</span>
              </div>

              <h3 className="font-sora text-[20px] font-bold text-white mb-2">
                Ask anything. Get real answers.
              </h3>
              <p className="text-[14px] text-slate-500 leading-[1.7] mb-6">
                Upload your notes, ask questions, get step-by-step solutions, or have the AI summarize your entire lecture in seconds.
              </p>

              {/* Visual: chat interface */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Chat header */}
                <div
                  className="flex items-center gap-2.5 px-4 py-3 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-xs">🤖</div>
                  <span className="text-[12px] font-semibold text-slate-300">Student Life AI</span>
                  <div className="flex items-center gap-1 ml-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-500">Online</span>
                  </div>
                </div>

                {/* Messages */}
                <div className="p-4 space-y-3">
                  {CHAT.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-[12px] leading-relaxed"
                        style={
                          msg.role === "user"
                            ? { background: "rgba(37,99,235,0.25)", color: "#BFDBFE", borderRadius: "18px 18px 4px 18px" }
                            : { background: "rgba(255,255,255,0.07)", color: "#CBD5E1", borderRadius: "18px 18px 18px 4px" }
                        }
                      >
                        {msg.text}
                        {msg.role === "ai" && i === 1 && (
                          <motion.span
                            className="inline-block w-1 h-3.5 rounded-sm ml-1 align-middle"
                            style={{ background: "#6366F1" }}
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.9, repeat: Infinity }}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input bar */}
                <div
                  className="px-4 py-3 border-t flex items-center gap-2"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="flex-1 rounded-xl px-3 py-2 text-[12px]"
                    style={{ background: "rgba(255,255,255,0.05)", color: "#475569" }}
                  >
                    Ask anything about your studies…
                  </div>
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(99,102,241,0.3)" }}
                  >
                    <span className="text-indigo-300 text-sm">↑</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
