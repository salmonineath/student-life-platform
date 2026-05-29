"use client";

import { motion } from "motion/react";

const activities = [
  {
    id: 1,
    name:        "Emma B.",
    avatar:      "EB",
    avatarClass: "bg-indigo-100 text-indigo-600",
    action:      "shared a file in",
    target:      "Physics Project",
    targetClass: "text-indigo-600",
    time:        "2h ago",
    badge:       "↑",
    badgeClass:  "bg-indigo-500 text-white",
  },
  {
    id: 2,
    name:        "James K.",
    avatar:      "JK",
    avatarClass: "bg-cyan-100 text-cyan-600",
    action:      "commented on",
    target:      "History Quiz Notes",
    targetClass: "text-cyan-600",
    time:        "5h ago",
    badge:       "✦",
    badgeClass:  "bg-cyan-500 text-white",
  },
  {
    id: 3,
    name:        "Mia R.",
    avatar:      "MR",
    avatarClass: "bg-amber-100 text-amber-600",
    action:      "completed task in",
    target:      "Math Assignment",
    targetClass: "text-emerald-600",
    time:        "Yesterday",
    badge:       "✓",
    badgeClass:  "bg-emerald-500 text-white",
  },
];

const feedVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.4 } },
};

const feedItem = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export default function GroupActivitiesView() {
  return (
    <div className="p-6 h-full flex flex-col">

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-600 mb-1">
            Collaboration
          </p>
          <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Group Activity
          </h2>
        </div>
        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full">
          2 active
        </span>
      </div>

      <motion.ul
        className="flex flex-col gap-1 flex-1"
        variants={feedVariants}
        initial="hidden"
        animate="visible"
      >
        {activities.map((a) => (
          <motion.li
            key={a.id}
            variants={feedItem}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-stone-100 cursor-pointer transition-colors"
          >
            <div className="relative shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${a.avatarClass}`}>
                {a.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold ${a.badgeClass}`}>
                {a.badge}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm leading-snug text-stone-500">
                <span className="font-semibold text-stone-900">{a.name}</span>{" "}
                {a.action}{" "}
                <span className={`font-semibold ${a.targetClass}`}>{a.target}</span>
              </p>
              <p className="text-[11px] text-stone-600 mt-0.5">{a.time}</p>
            </div>
          </motion.li>
        ))}
      </motion.ul>

      <a href="#" className="block text-center mt-auto pt-4 text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors">
        Open study groups →
      </a>

    </div>
  );
}
