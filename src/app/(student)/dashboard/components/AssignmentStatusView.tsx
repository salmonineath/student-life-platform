"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

const stats = [
  { label: "Upcoming", value: 4, color: "text-indigo-600", bg: "bg-indigo-50" },
  { label: "Overdue",  value: 1, color: "text-red-500",    bg: "bg-red-50"    },
  { label: "Done",     value: 3, color: "text-emerald-600",bg: "bg-emerald-50"},
];

const recent = {
  title:   "Contribution Accounting",
  subject: "Mathematics",
  due:     "Tomorrow",
};

const tileVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.25 } },
};

const tileItem = {
  hidden:  { opacity: 0, y: 10, scale: 0.96 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

// Count-up number that animates from 0 to target on mount
function CountUp({ value, className }: { value: number; className: string }) {
  const count   = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.7, ease: "easeOut", delay: 0.3 });
    return () => controls.stop();
  }, [value, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

export default function AssignmentStatusView() {
  return (
    <div className="p-5 h-full flex flex-col">

      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-600 mb-0.5">
            Status
          </p>
          <h2 className="text-base font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Assignments
          </h2>
        </div>
        <a href="#" className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
          View all →
        </a>
      </div>

      {/* Stat tiles — stagger in + count-up numbers */}
      <motion.div
        className="flex gap-2 mb-4"
        variants={tileVariants}
        initial="hidden"
        animate="visible"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={tileItem}
            className={`flex-1 ${s.bg} rounded-xl p-3 flex flex-col gap-1`}
          >
            <CountUp value={s.value} className={`text-2xl font-bold leading-none ${s.color}`} />
            <span className={`text-[9px] font-bold uppercase tracking-wider opacity-60 ${s.color}`}>
              {s.label}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent item */}
      <div className="group flex items-center gap-2.5 p-2.5 bg-stone-100 hover:bg-stone-100 rounded-xl cursor-pointer transition-colors mt-auto">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
          ✓
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-stone-700 truncate">{recent.title}</p>
          <p className="text-[10px] text-stone-600 mt-0.5">{recent.subject} &middot; Due {recent.due}</p>
        </div>
        <span className="text-stone-500 group-hover:text-indigo-400 text-sm transition-colors shrink-0">→</span>
      </div>

    </div>
  );
}
