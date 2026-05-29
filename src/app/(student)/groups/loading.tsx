"use client";

import { motion } from "motion/react";

function Bone({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-stone-200 animate-pulse rounded-lg ${className}`}
      style={style}
    />
  );
}

const messages = [
  { self: false, w: "55%" },
  { self: true,  w: "40%" },
  { self: false, w: "65%" },
  { self: true,  w: "35%" },
  { self: false, w: "48%" },
  { self: true,  w: "60%" },
];

export default function GroupsLoading() {
  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left panel — group list */}
      <div className="w-80 shrink-0 border-r border-stone-200 bg-white flex flex-col">
        <div className="p-4 border-b border-stone-200">
          <Bone className="h-6 w-24 mb-3" />
          <Bone className="h-9 w-full rounded-xl" />
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex items-center gap-3 p-3 rounded-xl mb-0.5"
            >
              <Bone className="h-10 w-10 rounded-full shrink-0" />
              <div className="flex-1 min-w-0">
                <Bone className="h-4 mb-2" style={{ width: `${50 + (i % 4) * 10}%` }} />
                <Bone className="h-3" style={{ width: `${35 + (i % 3) * 8}%` }} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right panel — chat area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        <div className="h-16 border-b border-stone-200 bg-white px-5 flex items-center gap-3 shrink-0">
          <Bone className="h-9 w-9 rounded-full shrink-0" />
          <div>
            <Bone className="h-4 w-36 mb-1.5" />
            <Bone className="h-3 w-24" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col justify-end gap-3">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className={`flex items-end gap-2 ${m.self ? "flex-row-reverse" : ""}`}
            >
              {!m.self && <Bone className="h-7 w-7 rounded-full shrink-0" />}
              <Bone
                className="h-10 rounded-2xl"
                style={{ width: m.w, borderBottomLeftRadius: m.self ? 16 : 4, borderBottomRightRadius: m.self ? 4 : 16 }}
              />
            </motion.div>
          ))}
        </div>

        <div className="h-16 bg-white border-t border-stone-200 px-4 flex items-center gap-3 shrink-0">
          <Bone className="h-10 flex-1 rounded-xl" />
          <Bone className="h-10 w-10 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
