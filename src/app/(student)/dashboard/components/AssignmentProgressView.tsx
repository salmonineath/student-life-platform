"use client";

import { motion } from "motion/react";

const overall = 75;
const assignmentsPct = 65;

function DonutRing({
  pct,
  size = 120,
  stroke = 11,
  color = "#4f46e5",
}: {
  pct: number;
  size?: number;
  stroke?: number;
  color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const cx = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke="#f5f5f4"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={cx}
        cy={cx}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        initial={{ strokeDasharray: `0 ${circ}` }}
        animate={{ strokeDasharray: `${dash} ${circ - dash}` }}
        transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
      />
    </svg>
  );
}

const legend = [
  { label: "On track", value: 6, color: "bg-indigo-500" },
  { label: "Behind", value: 1, color: "bg-red-400" },
  { label: "Done", value: 3, color: "bg-emerald-500" },
];

export default function AssignmentProgressView() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-5">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-1">
          Overview
        </p>
        <h2 className="text-xl font-bold text-stone-900">Progress</h2>
      </div>

      <div className="relative w-[120px] h-[120px] mx-auto mb-5">
        <DonutRing pct={overall} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-stone-900 leading-none">
            {overall}%
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-1">
            overall
          </span>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-medium text-stone-500">Assignments</span>
          <span className="text-xs font-bold text-stone-800">{assignmentsPct}%</span>
        </div>
        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-linear-to-r from-indigo-500 to-violet-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${assignmentsPct}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
        </div>
      </div>

      <div className="h-px bg-stone-100 mb-4" />

      <div className="flex flex-col gap-2.5 mt-auto">
        {legend.map((l) => (
          <div key={l.label} className="flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full shrink-0 ${l.color}`} />
            <span className="text-xs text-stone-500 flex-1">{l.label}</span>
            <span className="text-xs font-bold text-stone-800">{l.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
