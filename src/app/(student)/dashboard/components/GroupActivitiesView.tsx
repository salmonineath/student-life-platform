"use client";

import { motion } from "motion/react";

const activities = [
  {
    id:          1,
    name:        "Emma B.",
    initials:    "EB",
    avatarBg:    "bg-indigo-100",
    avatarText:  "text-indigo-600",
    action:      "shared a file in",
    target:      "Physics Project",
    targetColor: "text-indigo-400",
    time:        "2h ago",
    dot:         "bg-indigo-300",
  },
  {
    id:          2,
    name:        "James K.",
    initials:    "JK",
    avatarBg:    "bg-sky-100",
    avatarText:  "text-sky-600",
    action:      "commented on",
    target:      "History Quiz Notes",
    targetColor: "text-sky-400",
    time:        "5h ago",
    dot:         "bg-sky-300",
  },
  {
    id:          3,
    name:        "Mia R.",
    initials:    "MR",
    avatarBg:    "bg-violet-100",
    avatarText:  "text-violet-600",
    action:      "completed task in",
    target:      "Math Assignment",
    targetColor: "text-emerald-400",
    time:        "Yesterday",
    dot:         "bg-emerald-300",
  },
];

export default function GroupActivitiesView() {
  return (
    <div className="p-5 h-full flex flex-col">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-sky-300" />
          <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Group Activity
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-500 bg-emerald-50 border border-emerald-200/50 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          2 active
        </div>
      </div>

      {/* Timeline feed */}
      <div className="relative flex-1">
        <div className="absolute left-[19px] top-5 bottom-5 w-px bg-stone-100" />

        <ul className="flex flex-col gap-1">
          {activities.map((a, i) => (
            <motion.li
              key={a.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
            >
              <div className={`relative z-10 w-10 h-10 rounded-xl ${a.avatarBg} ${a.avatarText} flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-white`}>
                {a.initials}
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${a.dot} ring-2 ring-white`} />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm text-stone-500 leading-snug">
                  <span className="font-semibold text-stone-800">{a.name}</span>{" "}
                  {a.action}{" "}
                  <span className={`font-semibold ${a.targetColor}`}>{a.target}</span>
                </p>
                <span className="inline-block mt-1 text-[10px] font-medium text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded-md">
                  {a.time}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <a
        href="#"
        className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-stone-100 text-[11px] font-semibold text-stone-400 hover:text-stone-600 transition-colors"
      >
        Open study groups
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>

    </div>
  );
}
