"use client";

import { useEffect, useRef, useState } from "react";

// ── Reusable scroll-reveal wrapper ──────────────────────────────────────────
function Reveal({
  children,
  direction = "up",
  delay = 0,
}: {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const transforms: Record<string, string> = {
    up: visible ? "opacity-1 translate-y-0" : "opacity-0 translate-y-10",
    left: visible ? "opacity-1 translate-x-0" : "opacity-0 -translate-x-10",
    right: visible ? "opacity-1 translate-x-0" : "opacity-0 translate-x-10",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${transforms[direction]}`}
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : 0 }}
    >
      {children}
    </div>
  );
}

// ── Feature cards data ───────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "📅",
    iconBg: "#EFF6FF",
    title: "Smart Schedule",
    desc: "Weekly timetable with your classes. Add, edit, and get smart reminders so you never miss a lecture again.",
  },
  {
    icon: "📝",
    iconBg: "#FFFBEB",
    title: "Assignment Tracker",
    desc: "Never miss a deadline. Track assignments, set due dates, mark as done, and see everything at a glance.",
  },
  {
    icon: "👥",
    iconBg: "#ECFDF5",
    title: "Study Groups",
    desc: "Create or join study groups. Chat, share files, and collaborate effortlessly with your classmates.",
  },
];

// ── Mock app UI rows ─────────────────────────────────────────────────────────
const MOCK_ROWS = [
  {
    dot: "#3B82F6",
    title: "Math Analysis — Lecture",
    sub: "08:00 – 09:30 · Room 201",
    badge: "Today",
    badgeBg: "rgba(59,130,246,0.15)",
    badgeColor: "#60A5FA",
  },
  {
    dot: "#F59E0B",
    title: "Physics Assignment Due",
    sub: "Tomorrow · 23:59",
    badge: "Due Soon",
    badgeBg: "rgba(245,158,11,0.15)",
    badgeColor: "#F59E0B",
  },
  {
    dot: "#10B981",
    title: "CS Study Group",
    sub: "Wed 14:00 · Library B3",
    badge: "Joined",
    badgeBg: "rgba(16,185,129,0.15)",
    badgeColor: "#34D399",
  },
  {
    dot: "#6366F1",
    title: "AI Chat — Exam Prep",
    sub: "Anytime · No schedule",
    badge: "",
    badgeBg: "",
    badgeColor: "",
    dim: true,
  },
];

export default function FeatureSection() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');
        .feat-card:hover { border-color: #BFDBFE; transform: translateX(8px); box-shadow: 0 8px 32px rgba(37,99,235,0.08); background: #F4F7FF; }
        .feat-card { transition: all 0.3s cubic-bezier(.16,1,.3,1); }
        .feat-card:hover .feat-icon { transform: scale(1.1) rotate(-3deg); }
        .feat-icon { transition: transform 0.3s; }
      `}</style>

      <section id="features" className="py-24 md:py-32 px-6 bg-white">
        <div className="max-w-[1160px] mx-auto">
          {/* Header */}
          <Reveal>
            <div className="max-w-[520px] mb-20">
              <span className="block text-[12px] font-bold uppercase tracking-[2px] text-[#2563EB] mb-4">
                Core Features
              </span>
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  letterSpacing: "-2px",
                }}
                className="text-[clamp(32px,4vw,52px)] font-extrabold text-[#080C14] leading-[1.1] mb-5"
              >
                Everything in
                <br />
                one place.
              </h2>
              <p className="text-[17px] text-slate-500 leading-[1.75]">
                Stop juggling between Telegram, Facebook groups, and notebooks.
                Student Life brings your entire academic life together.
              </p>
            </div>
          </Reveal>

          {/* Layout: cards + dark mock UI */}
          <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-center">
            {/* Feature cards */}
            <div className="flex flex-col gap-4">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 100}>
                  <div className="feat-card flex gap-5 items-start p-7 rounded-2xl border-[1.5px] border-transparent cursor-default">
                    <div
                      className="feat-icon w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: f.iconBg }}
                    >
                      {f.icon}
                    </div>
                    <div>
                      <h3
                        style={{ fontFamily: "'Sora', sans-serif" }}
                        className="text-[17px] font-bold text-[#080C14] mb-1.5"
                      >
                        {f.title}
                      </h3>
                      <p className="text-[14px] text-slate-500 leading-relaxed">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Light mock UI panel */}
            <Reveal direction="right">
              <div className="relative rounded-[28px] p-10 overflow-hidden min-h-[400px] flex flex-col justify-center bg-white border border-gray-100 shadow-xl">
                {/* Soft glow */}
                <div
                  className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%)",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span
                      style={{ fontFamily: "'Sora', sans-serif" }}
                      className="text-base font-bold text-gray-800"
                    >
                      This Week
                    </span>
                    <span className="text-xs text-gray-400">Mon, Apr 7</span>
                  </div>

                  {MOCK_ROWS.map((row, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl mb-2.5 bg-gray-50 border border-gray-100"
                      style={{
                        opacity: row.dim ? 0.5 : 1,
                      }}
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: row.dot }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-gray-800 truncate">
                          {row.title}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          {row.sub}
                        </div>
                      </div>
                      {row.badge && (
                        <span
                          className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-lg flex-shrink-0"
                          style={{
                            background: row.badgeBg,
                            color: row.badgeColor,
                          }}
                        >
                          {row.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
