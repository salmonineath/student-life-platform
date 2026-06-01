"use client";

import { motion } from "motion/react";

const items = [
  {
    id:          1,
    title:       "Math Assignment",
    subject:     "Mathematics",
    due:         "Tomorrow",
    stripe:      "bg-rose-200",
    subjectChip: "bg-rose-50 text-rose-400",
    dueColor:    "text-rose-400",
    label:       "Overdue",
    labelBg:     "bg-rose-300",
  },
  {
    id:          2,
    title:       "History Quiz",
    subject:     "History",
    due:         "Wednesday",
    stripe:      "bg-amber-200",
    subjectChip: "bg-amber-50 text-amber-500",
    dueColor:    "text-amber-400",
    label:       "Due soon",
    labelBg:     "bg-amber-300",
  },
  {
    id:          3,
    title:       "Physics Project",
    subject:     "Physics",
    due:         "Friday",
    stripe:      "bg-sky-200",
    subjectChip: "bg-sky-50 text-sky-500",
    dueColor:    "text-sky-400",
    label:       "Group",
    labelBg:     "bg-sky-300",
  },
];

export default function UpComingReport() {
  return (
    <div className="p-5 h-full flex flex-col">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-amber-300" />
          <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Deadlines
          </h2>
        </div>
        <a href="#" className="text-[11px] text-stone-400 hover:text-stone-600 font-medium transition-colors">
          View all →
        </a>
      </div>

      <ul className="flex flex-col gap-2 flex-1">
        {items.map((item, i) => (
          <motion.li
            key={item.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.38, delay: 0.3 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            className="group flex items-stretch gap-0 rounded-xl border border-stone-100 hover:border-stone-200 hover:bg-stone-50/50 overflow-hidden cursor-pointer transition-all"
          >
            <div className={`w-[4px] shrink-0 ${item.stripe}`} />
            <div className="flex items-center gap-3 flex-1 px-3 py-2.5">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800 truncate">{item.title}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${item.subjectChip}`}>
                    {item.subject}
                  </span>
                  <span className="text-stone-300 text-[10px]">·</span>
                  <span className={`text-[11px] font-medium ${item.dueColor}`}>Due {item.due}</span>
                </div>
              </div>
              <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded-full ${item.labelBg}`}>
                {item.label}
              </span>
            </div>
          </motion.li>
        ))}
      </ul>

    </div>
  );
}
