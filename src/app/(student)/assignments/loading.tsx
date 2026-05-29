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

export default function AssignmentsLoading() {
  return (
    <>
      {/* Sticky header skeleton */}
      <div className="sticky top-16 z-10 -mx-6 -mt-6 px-6 pt-6 pb-5 bg-gray-100 flex items-start justify-between gap-4">
        <div>
          <Bone className="h-2.5 w-24 mb-2" />
          <Bone className="h-8 w-52 mb-2" />
          <Bone className="h-3.5 w-72" />
        </div>
        <Bone className="h-10 w-40 rounded-xl shrink-0" />
      </div>

      <div className="space-y-6 mt-6">
        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-2xl px-5 py-4">
              <Bone className="h-2.5 w-16 mb-3" />
              <Bone className="h-8 w-12" />
            </div>
          ))}
        </div>

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Bone className="h-10 flex-1 rounded-xl" />
          <Bone className="h-10 w-48 rounded-xl shrink-0" />
        </div>

        {/* Assignment card rows */}
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <div className="bg-white border border-stone-200 rounded-2xl p-4 flex items-center gap-4">
                <Bone className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex-1 min-w-0">
                  <Bone className="h-4 mb-2" style={{ width: `${55 + (i % 3) * 12}%` }} />
                  <Bone className="h-3" style={{ width: `${35 + (i % 2) * 10}%` }} />
                </div>
                <Bone className="h-6 w-20 rounded-full shrink-0" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
