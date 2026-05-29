"use client";

import { motion } from "motion/react";

const overall = 75;

const legend = [
  { label: "On track", value: 6, color: "bg-indigo-500" },
  { label: "Behind",   value: 1, color: "bg-red-400"    },
  { label: "Done",     value: 3, color: "bg-emerald-500" },
];

function DonutRing({
  pct,
  size = 90,
  stroke = 9,
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
        cx={cx} cy={cx} r={r}
        fill="none"
        stroke="#f5f5f4"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={cx} cy={cx} r={r}
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

export default function AssignmentProgressView() {
  return (
    <div className="p-5 h-full flex flex-col">

      <div className="mb-4">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-600 mb-0.5">
          Overview
        </p>
        <h2
          className="text-base font-bold text-stone-900"
          style={{ fontFamily: "var(--font-sora)" }}
        >
          Progress
        </h2>
      </div>

      {/* Horizontal: donut left, legend right */}
      <div className="flex items-center gap-5 flex-1">
        <div className="relative w-[90px] h-[90px] shrink-0">
          <DonutRing pct={overall} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-stone-900 leading-none tabular-nums">
              {overall}%
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-stone-600 mt-0.5">
              done
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {legend.map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shrink-0 ${l.color}`} />
              <span className="text-xs text-stone-500 flex-1">{l.label}</span>
              <span className="text-xs font-bold text-stone-800 tabular-nums">
                {l.value}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
