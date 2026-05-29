"use client";

import { motion } from "motion/react";

const upcoming = [
  {
    id: 1,
    title:    "Math Assignment",
    subject:  "Mathematics",
    dueLabel: "Due tomorrow",
    tag:      "Overdue",
    tagClass: "text-red-500 bg-red-50",
    strip:    "bg-red-400",
  },
  {
    id: 2,
    title:    "History Quiz",
    subject:  "History",
    dueLabel: "Due Wednesday",
    tag:      "Due soon",
    tagClass: "text-amber-500 bg-amber-50",
    strip:    "bg-amber-400",
  },
  {
    id: 3,
    title:    "Physics Project",
    subject:  "Physics",
    dueLabel: "Group · Due Friday",
    tag:      "Group",
    tagClass: "text-cyan-600 bg-cyan-50",
    strip:    "bg-cyan-400",
  },
];

export default function UpComingReport() {
  return (
    <div className="p-6 h-full flex flex-col">

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-600 mb-1">
            Upcoming
          </p>
          <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Deadlines
          </h2>
        </div>
        <a href="#" className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
          View all →
        </a>
      </div>

      <ul className="flex flex-col gap-1 flex-1">
        {upcoming.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.35 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <div className={`w-[3px] self-stretch rounded-full shrink-0 ${item.strip}`} />
            <div className="flex-1 min-w-0 pl-1">
              <p className="text-sm font-semibold text-stone-800 truncate">{item.title}</p>
              <p className="text-xs text-stone-600 mt-0.5">{item.subject} &middot; {item.dueLabel}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${item.tagClass}`}>
              {item.tag}
            </span>
          </motion.li>
        ))}
      </ul>

    </div>
  );
}
