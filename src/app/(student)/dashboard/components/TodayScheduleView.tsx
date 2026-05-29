"use client";

import { motion } from "motion/react";

const current = {
  time:     "10:00 AM",
  endTime:  "11:00 AM",
  subject:  "English Literature",
  room:     "Room 204",
  duration: "60 min",
  progress: 67,
};

const upcoming = [
  { id: 2, time: "1:30 PM",  subject: "Computer Science", room: "Lab 3",    dot: "bg-cyan-400"  },
  { id: 3, time: "3:30 PM",  subject: "Math Tutorial",    room: "Room 101", dot: "bg-amber-400" },
];

const upNextVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.45 } },
};

const upNextItem = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

export default function TodayScheduleView() {
  return (
    <div className="p-6 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-600 mb-1">
            Today
          </p>
          <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Schedule
          </h2>
        </div>
        <a href="#" className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
          Full schedule →
        </a>
      </div>

      {/* Current class block */}
      <div className="bg-indigo-50 rounded-xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            In progress
          </span>
          <span className="text-[11px] text-indigo-400 font-medium">ends {current.endTime}</span>
        </div>

        <p className="text-[1.05rem] font-bold text-stone-900 mb-0.5" style={{ fontFamily: "var(--font-sora)" }}>
          {current.subject}
        </p>
        <p className="text-xs text-stone-600 mb-3.5">
          {current.room} &middot; {current.duration}
        </p>

        {/* Animated class progress bar */}
        <div className="flex items-center gap-2.5">
          <div className="flex-1 h-[5px] bg-indigo-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-indigo-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${current.progress}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            />
          </div>
          <span className="text-[10px] font-bold text-indigo-400 shrink-0 tabular-nums">
            {current.progress}%
          </span>
        </div>
      </div>

      {/* Up next — staggered rows */}
      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-600 mb-1">
        Up next
      </p>
      <motion.div
        className="flex flex-col gap-0.5 flex-1"
        variants={upNextVariants}
        initial="hidden"
        animate="visible"
      >
        {upcoming.map((item) => (
          <motion.div
            key={item.id}
            variants={upNextItem}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <div className={`w-2 h-2 rounded-full shrink-0 ${item.dot} opacity-70 group-hover:opacity-100 transition-opacity`} />
            <span className="text-xs font-medium text-stone-600 w-14 shrink-0 tabular-nums">{item.time}</span>
            <span className="text-sm font-medium text-stone-700 flex-1 truncate">{item.subject}</span>
            <span className="text-xs text-stone-600 shrink-0">{item.room}</span>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
