"use client";

import { useRouter } from "next/navigation";
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

function BentoCard({
  children,
  className,
  delay = 0,
  href,
}: {
  children: React.ReactNode;
  className: string;
  delay?: number;
  href?: string;
}) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={href ? { y: -2, transition: { duration: 0.15, ease: "easeOut" } } : undefined}
      className={`group relative overflow-hidden transition-shadow duration-300${href ? " cursor-pointer" : ""} ${className}`}
      onClick={href ? () => router.push(href) : undefined}
    >
      {/* Dot-grid texture from 21st.dev bento pattern — appears on hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.04)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>
      {children}
    </motion.div>
  );
}

const heroStats = [
  { label: "Classes today",  value: "3",  accent: "text-indigo-500", border: "border-indigo-100", bg: "bg-indigo-50/80"  },
  { label: "Due this week",  value: "2",  accent: "text-amber-500",  border: "border-amber-100",  bg: "bg-amber-50/80"   },
  { label: "Study streak",   value: "7d", accent: "text-teal-500",   border: "border-teal-100",   bg: "bg-teal-50/80"    },
];

export default function DashboardPage() {
  const firstName = "Sal";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div>
      {/* ── Sticky Hero ── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="sticky top-16 z-10 -mx-6 -mt-6 px-6 pt-6 pb-5 bg-gray-100"
      >
        <div className="relative rounded-2xl bg-white border border-stone-200/80 overflow-hidden px-6 py-5 shadow-sm">
          {/* Subtle dot texture */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.018)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none" />
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-300 via-violet-200 to-transparent" />

          <div className="relative flex items-center justify-between gap-6">
            <div>
              <p className="text-stone-400 text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5">
                {today}
              </p>
              <h1
                className="text-[1.45rem] font-bold text-stone-900 leading-tight"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                {getGreeting()},{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  {firstName}
                </span>
              </h1>
              <p className="text-stone-400 text-xs mt-1.5">
                You have{" "}
                <span className="text-amber-500 font-semibold">2 deadlines</span>{" "}
                this week — stay focused.
              </p>
            </div>

            <div className="flex items-stretch gap-2 shrink-0">
              {heroStats.map((s) => (
                <div
                  key={s.label}
                  className={`flex flex-col items-center justify-center px-5 py-2.5 rounded-xl border ${s.border} ${s.bg}`}
                >
                  <span className={`text-[1.6rem] font-black tabular-nums leading-none ${s.accent}`}>
                    {s.value}
                  </span>
                  <span className="text-stone-400 text-[9px] font-bold uppercase tracking-[0.12em] mt-1 whitespace-nowrap">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-12 gap-4 mt-5">

        <BentoCard
          delay={0.06}
          href="/schedules"
          className="col-span-7 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] hover:border-indigo-200/70"
        >
          <TodayScheduleView />
        </BentoCard>

        <div className="col-span-5 flex flex-col gap-4">
          <BentoCard
            delay={0.1}
            href="/assignments"
            className="flex-1 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(139,92,246,0.1)] hover:border-violet-200/70"
          >
            <AssignmentStatusView />
          </BentoCard>
          <BentoCard
            delay={0.14}
            href="/assignments"
            className="flex-1 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:border-emerald-200/70"
          >
            <AssignmentProgressView />
          </BentoCard>
        </div>

        <BentoCard
          delay={0.18}
          href="/assignments"
          className="col-span-5 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(245,158,11,0.09)] hover:border-amber-200/70"
        >
          <UpComingReport />
        </BentoCard>

        <BentoCard
          delay={0.22}
          href="/groups"
          className="col-span-7 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(6,182,212,0.09)] hover:border-cyan-200/70"
        >
          <GroupActivitiesView />
        </BentoCard>

      </div>
    </div>
  );
}
