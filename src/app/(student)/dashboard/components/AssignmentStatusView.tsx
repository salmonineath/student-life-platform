"use client";

import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";
import { Assignments } from "@/types/assignmentType";

interface Props {
  assignments: Assignments[];
  loading: boolean;
}

function CountUp({ value, className }: { value: number; className: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    const ctrl = animate(count, value, { duration: 0.8, ease: "easeOut", delay: 0.3 });
    return () => ctrl.stop();
  }, [value, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

function Skeleton() {
  return (
    <div className="p-5 h-full flex flex-col animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-stone-200" />
          <div className="h-4 w-24 bg-stone-200 rounded" />
        </div>
        <div className="h-3 w-12 bg-stone-200 rounded" />
      </div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-stone-100 rounded-xl p-3 space-y-2">
            <div className="h-8 w-8 bg-stone-200 rounded" />
            <div className="h-[3px] bg-stone-200 rounded-full" />
            <div className="h-2 w-12 bg-stone-200 rounded" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 mt-auto">
        <div className="w-8 h-8 rounded-xl bg-stone-200" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 w-3/4 bg-stone-200 rounded" />
          <div className="h-2.5 w-1/2 bg-stone-200 rounded" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-4">
      <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-violet-300" viewBox="0 0 20 20" fill="none">
          <path d="M6 10h8M6 6h8M6 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
      <p className="text-xs font-medium text-stone-500">No assignments yet</p>
    </div>
  );
}

export default function AssignmentStatusView({ assignments, loading }: Props) {
  if (loading) return <Skeleton />;

  const upcoming = assignments.filter((a) => a.status === "PENDING" || a.status === "IN_PROGRESS").length;
  const overdue = assignments.filter((a) => a.status === "OVERDUE").length;
  const done = assignments.filter((a) => a.status === "COMPLETED").length;
  const total = assignments.length;

  const stats = [
    { label: "Upcoming", value: upcoming, color: "text-indigo-600", bg: "bg-indigo-100", bar: "bg-indigo-500" },
    { label: "Overdue", value: overdue, color: "text-rose-600", bg: "bg-rose-100", bar: "bg-rose-500" },
    { label: "Done", value: done, color: "text-emerald-600", bg: "bg-emerald-100", bar: "bg-emerald-500" },
  ];

  const featured = assignments
    .filter((a) => a.status !== "COMPLETED")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0] ?? null;

  const isUrgent = featured
    ? (new Date(featured.dueDate).getTime() - Date.now()) / 86_400_000 <= 2
    : false;

  const dueDateLabel = featured
    ? (() => {
        const diff = Math.ceil((new Date(featured.dueDate).getTime() - Date.now()) / 86_400_000);
        if (diff <= 0) return "Today";
        if (diff === 1) return "Tomorrow";
        return `in ${diff}d`;
      })()
    : "";

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-violet-300" />
          <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Assignments
          </h2>
        </div>
        <a href="/assignments" className="text-[11px] text-stone-400 hover:text-stone-600 font-medium transition-colors">
          View all →
        </a>
      </div>

      {total === 0 ? (
        <EmptyState />
      ) : (
        <>
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
                <div className="mt-2 mb-1 h-[3px] rounded-full bg-black/10 overflow-hidden">
                  <motion.div
                    className={`h-full ${s.bar} rounded-full`}
                    initial={{ width: "0%" }}
                    animate={{ width: total > 0 ? `${(s.value / total) * 100}%` : "0%" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.08 }}
                  />
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-[0.12em] ${s.color}`}>
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>

          {featured && (
            <div className="group flex items-center gap-3 p-3 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-all mt-auto cursor-pointer">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-emerald-400" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3.5 3.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-stone-700 truncate">{featured.title}</p>
                <p className="text-[10px] text-stone-500 mt-0.5">
                  {featured.subject} · Due {dueDateLabel}
                </p>
              </div>
              {isUrgent && (
                <span className="shrink-0 text-[9px] font-bold text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Soon
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
