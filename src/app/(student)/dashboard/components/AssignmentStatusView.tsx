"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

const stats = [
  { label: "Upcoming", value: 4, color: "text-indigo-400",  bg: "bg-indigo-50/60",  bar: "bg-indigo-300"  },
  { label: "Overdue",  value: 1, color: "text-rose-400",    bg: "bg-rose-50/60",    bar: "bg-rose-300"    },
  { label: "Done",     value: 3, color: "text-emerald-400", bg: "bg-emerald-50/60", bar: "bg-emerald-300" },
];

const recent = {
  title:   "Contribution Accounting",
  subject: "Mathematics",
  due:     "Tomorrow",
  urgent:  true,
};

function CountUp({ value, className }: { value: number; className: string }) {
  const count   = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const ctrl = animate(count, value, { duration: 0.8, ease: "easeOut", delay: 0.3 });
    return () => ctrl.stop();
  }, [value, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

export default function AssignmentStatusView() {
  return (
    <div className="p-5 h-full flex flex-col">

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-violet-300" />
          <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Assignments
          </h2>
        </div>
        <a href="#" className="text-[11px] text-stone-400 hover:text-stone-600 font-medium transition-colors">
          View all →
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`${s.bg} rounded-xl p-3 flex flex-col`}
          >
            <CountUp value={s.value} className={`text-3xl font-black leading-none ${s.color} tabular-nums`} />
            <div className="mt-2 mb-1 h-[3px] rounded-full bg-black/5 overflow-hidden">
              <motion.div
                className={`h-full ${s.bar} rounded-full`}
                initial={{ width: "0%" }}
                animate={{ width: `${(s.value / 8) * 100}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.08 }}
              />
            </div>
            <span className={`text-[9px] font-bold uppercase tracking-[0.12em] opacity-50 ${s.color}`}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="group flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-stone-200 hover:bg-stone-50/60 transition-all mt-auto cursor-pointer">
        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 16 16" fill="none">
            <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-stone-700 truncate">{recent.title}</p>
          <p className="text-[10px] text-stone-400 mt-0.5">{recent.subject} · Due {recent.due}</p>
        </div>
        {recent.urgent && (
          <span className="shrink-0 text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200/70 px-2 py-0.5 rounded-full uppercase tracking-wide">
            Soon
          </span>
        )}
      </div>

    </div>
  );
}
