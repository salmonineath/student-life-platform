"use client";

import { motion } from "motion/react";

const current = {
  time:     "10:00",
  endTime:  "11:00 AM",
  subject:  "English Literature",
  room:     "Room 204",
  progress: 67,
};

const upcoming = [
  { id: 2, time: "1:30 PM",  subject: "Computer Science", room: "Lab 3",    dot: "bg-sky-300",    dotBg: "bg-sky-50",    timeColor: "text-sky-400"   },
  { id: 3, time: "3:30 PM",  subject: "Math Tutorial",    room: "Room 101", dot: "bg-amber-300",  dotBg: "bg-amber-50",  timeColor: "text-amber-400" },
];

export default function TodayScheduleView() {
  return (
    <div className="p-5 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-indigo-300" />
          <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Schedule
          </h2>
        </div>
        <a href="#" className="text-[11px] text-stone-400 hover:text-stone-600 font-medium transition-colors">
          Full view →
        </a>
      </div>

      {/* Current class — light gradient inner card */}
      <div className="relative rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50/60 border border-indigo-100/80 overflow-hidden p-4 mb-4">
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-violet-200/30 blur-2xl rounded-full pointer-events-none" />

        <div className="relative">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.14em]">
                Live now
              </span>
            </div>
            <span className="text-stone-400 text-[11px] tabular-nums">
              {current.time} – {current.endTime}
            </span>
          </div>

          <p className="text-stone-900 text-[1.05rem] font-bold leading-tight mb-0.5" style={{ fontFamily: "var(--font-sora)" }}>
            {current.subject}
          </p>
          <p className="text-stone-400 text-xs mb-3">{current.room}</p>

          <div className="flex items-center gap-2.5">
            <div className="flex-1 h-[3px] bg-indigo-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                initial={{ width: "0%" }}
                animate={{ width: `${current.progress}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
              />
            </div>
            <span className="text-indigo-500 text-[11px] font-bold tabular-nums shrink-0">
              {current.progress}%
            </span>
          </div>
        </div>
      </div>

      <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.14em] mb-2">
        Up next
      </p>

      <div className="flex flex-col gap-1.5 flex-1">
        {upcoming.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.45 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-xl ${item.dotBg} flex items-center justify-center shrink-0`}>
              <div className={`w-2 h-2 rounded-full ${item.dot}`} />
            </div>
            <span className={`text-xs font-bold tabular-nums w-14 shrink-0 ${item.timeColor}`}>
              {item.time}
            </span>
            <span className="text-sm font-medium text-stone-800 flex-1 truncate">
              {item.subject}
            </span>
            <span className="text-[11px] text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-lg shrink-0">
              {item.room}
            </span>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
