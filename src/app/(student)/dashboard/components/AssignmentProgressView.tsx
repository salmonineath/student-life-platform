"use client";

import { motion } from "motion/react";

const overall = 75;
const total   = 10;

const legend = [
  { label: "On track", value: 6, color: "bg-indigo-300",  text: "text-indigo-400",  track: "bg-indigo-50"  },
  { label: "Behind",   value: 1, color: "bg-rose-200",    text: "text-rose-400",    track: "bg-rose-50"    },
  { label: "Done",     value: 3, color: "bg-emerald-300", text: "text-emerald-400", track: "bg-emerald-50" },
];

function DonutRing({ pct, size = 84, stroke = 10 }: { pct: number; size?: number; stroke?: number }) {
  const r    = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const cx   = size / 2;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
      <defs>
        <linearGradient id="ring-grad" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#a5b4fc" /> {/* indigo-300 */}
          <stop offset="100%" stopColor="#c4b5fd" /> {/* violet-300 */}
        </linearGradient>
      </defs>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
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

export default function AssignmentProgressView() {
  return (
    <div className="p-5 h-full flex flex-col">

      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-[3px] h-5 rounded-full bg-emerald-300" />
        <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
          Progress
        </h2>
      </div>

      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-[84px] h-[84px] shrink-0">
          <DonutRing pct={overall} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-black text-stone-800 leading-none tabular-nums">{overall}%</span>
            <span className="text-[8px] font-bold uppercase tracking-[0.12em] text-stone-400 mt-0.5">done</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 flex-1">
          {legend.map((l, i) => (
            <div key={l.label}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${l.color}`} />
                  <span className="text-[11px] text-stone-500">{l.label}</span>
                </div>
                <span className={`text-xs font-bold tabular-nums ${l.text}`}>{l.value}</span>
              </div>
              <div className={`h-[3px] rounded-full ${l.track} overflow-hidden`}>
                <motion.div
                  className={`h-full rounded-full ${l.color}`}
                  initial={{ width: "0%" }}
                  animate={{ width: `${(l.value / total) * 100}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 + i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
