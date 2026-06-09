"use client";

import { motion } from "motion/react";
import { Assignments } from "@/types/assignmentType";

interface Props {
  assignments: Assignments[];
  loading: boolean;
}

function DonutRing({ pct, size = 84, stroke = 10 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const cx = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <defs>
        <linearGradient id="ring-grad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <motion.circle
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke="url(#ring-grad)"
        strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
        transition={{ duration: 1.3, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
      />
    </svg>
  );
}

function Skeleton() {
  return (
    <div className="p-5 h-full flex flex-col animate-pulse">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-[3px] h-5 rounded-full bg-stone-200" />
        <div className="h-4 w-16 bg-stone-200 rounded" />
      </div>
      <div className="flex items-center gap-4 flex-1">
        <div className="w-[84px] h-[84px] rounded-full bg-stone-200 shrink-0" />
        <div className="flex flex-col gap-2.5 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-stone-200 rounded" />
                <div className="h-3 w-6 bg-stone-200 rounded" />
              </div>
              <div className="h-[3px] bg-stone-200 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AssignmentProgressView({ assignments, loading }: Props) {
  if (loading) return <Skeleton />;

  const total = assignments.length;

  const done = assignments.filter((a) => a.status === "COMPLETED").length;
  const onTrack = assignments.filter((a) => a.status === "IN_PROGRESS" && a.progress >= 50).length;
  const behind =
    assignments.filter((a) => a.status === "OVERDUE").length +
    assignments.filter((a) => (a.status === "PENDING" || (a.status === "IN_PROGRESS" && a.progress < 50))).length;

  const overall = total > 0 ? Math.round((done / total) * 100) : 0;

  const legend = [
    { label: "On track", value: onTrack, color: "bg-indigo-500", text: "text-indigo-600", track: "bg-indigo-100" },
    { label: "Behind", value: behind, color: "bg-rose-400", text: "text-rose-600", track: "bg-rose-100" },
    { label: "Done", value: done, color: "bg-emerald-500", text: "text-emerald-600", track: "bg-emerald-100" },
  ];

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-[3px] h-5 rounded-full bg-emerald-500" />
        <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
          Progress
        </h2>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2">
          <DonutRing pct={0} />
          <p className="text-xs text-stone-500 -mt-1">No assignments to track yet</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-[84px] h-[84px] shrink-0">
            <DonutRing pct={overall} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-stone-800 leading-none tabular-nums">{overall}%</span>
              <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-stone-500 mt-0.5">done</span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 flex-1">
            {legend.map((l, i) => (
              <div key={l.label}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${l.color}`} />
                    <span className="text-[11px] text-stone-600">{l.label}</span>
                  </div>
                  <span className={`text-xs font-bold tabular-nums ${l.text}`}>{l.value}</span>
                </div>
                <div className={`h-[3px] rounded-full ${l.track} overflow-hidden`}>
                  <motion.div
                    className={`h-full rounded-full ${l.color}`}
                    initial={{ width: "0%" }}
                    animate={{ width: total > 0 ? `${(l.value / total) * 100}%` : "0%" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 + i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
