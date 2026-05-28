"use client";

import { motion } from "motion/react";
import UpComingReport from "./components/UpComingReport";
import TodayScheduleView from "./components/TodayScheduleView";
import AssignmentStatusView from "./components/AssignmentStatusView";
import GroupActivitiesView from "./components/GroupActivitiesView";
import AssignmentProgressView from "./components/AssignmentProgressView";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Card wrapper — entrance (staggered via delay) + subtle hover lift
function AnimatedCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function DashboardPage() {
  const firstName = "Sal";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>

      {/* Sticky header — fades in on mount (no y so sticky position never shifts) */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-16 z-10 -mx-6 -mt-6 px-6 pt-6 pb-5 bg-gray-100 flex items-start justify-between gap-4"
      >
        <div>
          <p className="text-xs font-medium text-stone-400 tracking-wide mb-1.5">
            {today}
          </p>
          <h1
            className="text-[1.9rem] font-bold text-stone-900 leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            {getGreeting()},{" "}
            <span className="text-indigo-600">{firstName}</span>
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            You have{" "}
            <span className="font-semibold text-amber-500">2 deadlines</span>{" "}
            this week &mdash; keep the momentum.
          </p>
        </div>

        <div className="flex gap-2 shrink-0 pt-1">
          <button className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-sm shadow-indigo-500/20 transition-all duration-150">
            + Assignment
          </button>
          <button className="bg-white hover:bg-stone-50 active:scale-95 text-stone-600 text-sm font-medium px-4 py-2 rounded-lg border border-stone-200 shadow-sm transition-all duration-150">
            + Event
          </button>
        </div>
      </motion.header>

      {/* Grid — cards stagger in */}
      <div className="grid grid-cols-12 gap-4 mt-6">

        {/* Row 1 */}
        <AnimatedCard
          delay={0.05}
          className="col-span-7 bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <TodayScheduleView />
        </AnimatedCard>

        <div className="col-span-5 flex flex-col gap-4">
          <AnimatedCard
            delay={0.1}
            className="flex-1 bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <AssignmentStatusView />
          </AnimatedCard>
          <AnimatedCard
            delay={0.15}
            className="flex-1 bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden"
          >
            <AssignmentProgressView />
          </AnimatedCard>
        </div>

        {/* Row 2 */}
        <AnimatedCard
          delay={0.15}
          className="col-span-5 bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <UpComingReport />
        </AnimatedCard>

        <AnimatedCard
          delay={0.2}
          className="col-span-7 bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <GroupActivitiesView />
        </AnimatedCard>

      </div>
    </div>
  );
}
