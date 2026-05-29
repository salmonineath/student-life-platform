"use client";

import { motion } from "motion/react";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const col = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

function Bone({ className, style }: { className: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-stone-200 animate-pulse rounded-lg ${className}`}
      style={style}
    />
  );
}

export default function SchedulesLoading() {
  return (
    <>
      {/* Sticky header + tabs skeleton */}
      <div className="sticky top-16 z-10 -mx-6 -mt-6 px-6 pt-6 pb-0 bg-gray-100">
        <div className="pb-4">
          <Bone className="h-2.5 w-20 mb-2" />
          <Bone className="h-8 w-44 mb-2" />
          <Bone className="h-3.5 w-64" />
        </div>
        {/* Tab bar */}
        <div className="flex gap-1 border-b border-stone-200 -mx-6 px-6 pb-0">
          {[64, 52, 76].map((w, i) => (
            <Bone key={i} className="h-8 rounded-t-lg mb-0" style={{ width: w }} />
          ))}
        </div>
      </div>

      <div className="space-y-6 mt-5">

        {/* Weekly grid */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-stone-100 px-4 py-3 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Bone className="h-3 w-8" />
                <Bone className="h-7 w-7 rounded-full" />
              </div>
            ))}
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-7 gap-2 p-4"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div key={i} variants={col} className="flex flex-col gap-2">
                {Array.from({ length: 2 + (i % 3) }).map((_, j) => (
                  <Bone
                    key={j}
                    className="w-full rounded-xl"
                    style={{ height: 64 + (j % 2) * 24 }}
                  />
                ))}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
}
