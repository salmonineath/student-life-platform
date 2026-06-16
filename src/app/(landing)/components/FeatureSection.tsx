"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import Reveal from "./Reveal";

type FeatureId = "schedule" | "assignments" | "groups";

const FEATURES = [
  {
    id: "schedule" as FeatureId,
    icon: "📅",
    title: "Smart Schedule",
    desc: "See your entire week at a glance. Add classes, set reminders, never miss a lecture.",
    color: "#3B82F6",
  },
  {
    id: "assignments" as FeatureId,
    icon: "📝",
    title: "Assignment Tracker",
    desc: "Every deadline in one place. Track progress and get nudged before things pile up.",
    color: "#F59E0B",
  },
  {
    id: "groups" as FeatureId,
    icon: "👥",
    title: "Study Groups",
    desc: "Chat with classmates, share notes, and coordinate — without leaving the app.",
    color: "#10B981",
  },
];

// ── Preview panels ─────────────────────────────────────────────────────────────

function SchedulePreview() {
  const rows = [
    { color: "#3B82F6", title: "Math Analysis",   time: "08:00 – 09:30", room: "Room 201", done: false },
    { color: "#10B981", title: "Physics Lab",     time: "10:00 – 11:30", room: "Lab A",    done: true  },
    { color: "#6366F1", title: "CS Algorithms",   time: "14:00 – 15:30", room: "B203",     done: false },
    { color: "#F59E0B", title: "English Writing", time: "16:00 – 17:00", room: "Room 105", done: false },
  ];
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-slate-400">Today</p>
          <p className="font-sora text-[15px] font-bold text-[#080C14] mt-0.5">Monday, Apr 7</p>
        </div>
        <div className="flex gap-1">
          {["M","T","W","T","F"].map((d, i) => (
            <div
              key={i}
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold ${
                i === 0 ? "bg-[#2563EB] text-white" : "text-slate-400"
              }`}
            >
              {d}
            </div>
          ))}
        </div>
      </div>
      {rows.map((row, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0"
        >
          <div className="w-[3px] h-8 rounded-full flex-shrink-0" style={{ background: row.color }} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-gray-800 truncate">{row.title}</p>
            <p className="text-[11px] text-gray-400">{row.time} · {row.room}</p>
          </div>
          {row.done && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
              Done
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function AssignmentsPreview() {
  const items = [
    { title: "Physics Lab Report",   due: "Tomorrow", progress: 65, color: "#F59E0B" },
    { title: "Math Problem Set 4",   due: "Apr 10",   progress: 30, color: "#3B82F6" },
    { title: "English Essay Draft",  due: "Apr 14",   progress: 0,  color: "#6366F1" },
    { title: "CS Project — Phase 1", due: "Apr 20",   progress: 80, color: "#10B981" },
  ];
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="p-3.5 rounded-xl bg-gray-50 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-[13px] font-semibold text-gray-800 flex-1 truncate pr-2">{item.title}</p>
            <span className="text-[11px] text-gray-400 flex-shrink-0">Due {item.due}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <motion.div
              className="h-1.5 rounded-full"
              style={{ background: item.color }}
              initial={{ width: "0%" }}
              animate={{ width: `${item.progress}%` }}
              transition={{ duration: 0.9, delay: 0.15 + i * 0.1, ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{item.progress}% complete</p>
        </motion.div>
      ))}
    </div>
  );
}

function GroupsPreview() {
  const messages = [
    { sender: "Dara",     color: "#3B82F6", text: "Did everyone finish the lab report?",  isMe: false },
    { sender: "You",      color: "#6366F1", text: "Almost done, just need the conclusion", isMe: true  },
    { sender: "Sreyleak", color: "#10B981", text: "I can share my notes from Tuesday 📝",  isMe: false },
    { sender: "You",      color: "#6366F1", text: "That would be super helpful, thanks!",  isMe: true  },
  ];
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-4 pb-4 border-b border-gray-100">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-sm">👥</div>
        <div>
          <p className="text-[13px] font-bold text-gray-800">CS Study Group</p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[11px] text-gray-400">4 members online</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 overflow-hidden">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`flex gap-2 ${msg.isMe ? "flex-row-reverse" : ""}`}
          >
            {!msg.isMe && (
              <div
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-bold mt-0.5"
                style={{ background: msg.color }}
              >
                {msg.sender[0]}
              </div>
            )}
            <div className={`max-w-[78%] flex flex-col ${msg.isMe ? "items-end" : "items-start"}`}>
              {!msg.isMe && <p className="text-[10px] text-gray-400 mb-0.5 ml-1">{msg.sender}</p>}
              <div
                className={`px-3 py-2 rounded-2xl text-[12px] leading-relaxed ${
                  msg.isMe
                    ? "bg-[#2563EB] text-white rounded-tr-sm"
                    : "bg-gray-100 text-gray-800 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const PREVIEWS: Record<FeatureId, React.ReactNode> = {
  schedule:    <SchedulePreview />,
  assignments: <AssignmentsPreview />,
  groups:      <GroupsPreview />,
};

// ── Main component ─────────────────────────────────────────────────────────────

export default function FeatureSection() {
  const [active, setActive] = useState<FeatureId>("schedule");
  const [cycleKey, setCycleKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });

  const handleSelect = (id: FeatureId) => {
    setActive(id);
    setCycleKey((k) => k + 1);
  };

  useEffect(() => {
    if (!inView) return;
    const ids: FeatureId[] = ["schedule", "assignments", "groups"];
    const timer = setInterval(() => {
      setActive((prev) => ids[(ids.indexOf(prev) + 1) % ids.length]);
    }, 3500);
    return () => clearInterval(timer);
  }, [inView, cycleKey]);

  const activeFeature = FEATURES.find((f) => f.id === active)!;

  return (
    <section ref={sectionRef} id="features" className="py-24 md:py-32 px-6" style={{ background: "#EBF0FF" }}>
      <div className="max-w-[1160px] mx-auto">

        {/* Header */}
        <Reveal>
          <div className="mb-16">
            <span className="block text-[12px] font-bold uppercase tracking-[2px] text-[#2563EB] mb-4">
              Core Features
            </span>
            <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-16">
              <h2
                className="font-sora text-[clamp(32px,4vw,52px)] font-extrabold text-[#080C14] leading-[1.1] flex-shrink-0"
                style={{ letterSpacing: "-2px" }}
              >
                Everything you need,
                <br />
                nothing you don't.
              </h2>
              <p className="text-[16px] text-slate-500 leading-[1.75] max-w-[360px] pb-1">
                Stop juggling Telegram, Facebook groups, and notebooks.
                One clean place for your entire academic life.
              </p>
            </div>
          </div>
        </Reveal>

        {/* Layout: left tabs + right preview */}
        <div className="grid md:grid-cols-[1fr_1.25fr] gap-6 items-start">

          {/* Left: clickable feature tabs */}
          <div className="flex flex-col gap-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.id} delay={i * 80}>
                <button
                  onClick={() => handleSelect(f.id)}
                  className="w-full text-left p-5 rounded-2xl transition-all duration-300 overflow-hidden"
                  style={{
                    background: active === f.id ? "white" : "rgba(255,255,255,0.45)",
                    border: `1.5px solid ${active === f.id ? f.color + "35" : "transparent"}`,
                    boxShadow: active === f.id ? `0 4px 20px ${f.color}14` : "none",
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Animated accent bar */}
                    <motion.div
                      className="w-[3px] rounded-full flex-shrink-0 mt-0.5"
                      animate={{
                        height: active === f.id ? 44 : 28,
                        background: active === f.id ? f.color : "#CBD5E1",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base">{f.icon}</span>
                        <p className="font-sora font-bold text-[15px] text-[#080C14]">{f.title}</p>
                        {active === f.id && (
                          <motion.span
                            layoutId="active-dot"
                            className="w-1.5 h-1.5 rounded-full ml-auto flex-shrink-0"
                            style={{ background: f.color }}
                          />
                        )}
                      </div>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>

                  {/* Auto-cycle progress bar */}
                  {active === f.id && (
                    <motion.div
                      key={`${f.id}-${cycleKey}`}
                      className="h-[2px] rounded-full mt-3.5 ml-7 origin-left"
                      style={{ background: f.color }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 3.5, ease: "linear" }}
                    />
                  )}
                </button>
              </Reveal>
            ))}
          </div>

          {/* Right: animated preview panel */}
          <Reveal direction="right">
            <div
              className="relative rounded-[24px] p-7 border overflow-hidden"
              style={{
                background: "white",
                borderColor: activeFeature.color + "25",
                boxShadow: `0 8px 40px ${activeFeature.color}10`,
                minHeight: 420,
              }}
            >
              {/* Color accent glow */}
              <motion.div
                className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
                animate={{ background: `radial-gradient(circle, ${activeFeature.color}18 0%, transparent 70%)` }}
                transition={{ duration: 0.5 }}
              />

              {/* Panel header */}
              <div className="relative z-10 flex items-center gap-2.5 mb-5">
                <motion.div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  animate={{ background: activeFeature.color + "18" }}
                  transition={{ duration: 0.3 }}
                >
                  {activeFeature.icon}
                </motion.div>
                <p className="font-sora font-bold text-[14px] text-[#080C14]">{activeFeature.title}</p>
                <motion.div
                  className="h-[2px] flex-1 rounded-full ml-1"
                  animate={{ background: activeFeature.color + "30" }}
                />
              </div>

              {/* Preview content */}
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: "easeInOut" }}
                  >
                    {PREVIEWS[active]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
