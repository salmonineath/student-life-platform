"use client";

import { useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import UpComingReport from "./components/UpComingReport";
import TodayScheduleView from "./components/TodayScheduleView";
import AssignmentStatusView from "./components/AssignmentStatusView";
import GroupActivitiesView from "./components/GroupActivitiesView";
import AssignmentProgressView from "./components/AssignmentProgressView";
import { dashboardReducer, initialDashboardState } from "./core/reducer";
import {
  getMeRequest,
  getMyAssignmentsRequest,
  getTodaySchedulesRequest,
  getMyGroupsRequest,
} from "./core/request";

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
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(99,102,241,0.04)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>
      {children}
    </motion.div>
  );
}

function HeroSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative rounded-2xl bg-white border border-stone-200/80 overflow-hidden px-6 py-5">
        <div className="flex items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-stone-200 rounded" />
            <div className="h-7 w-48 bg-stone-200 rounded" />
            <div className="h-3 w-56 bg-stone-200 rounded" />
          </div>
          <div className="flex items-stretch gap-2 shrink-0">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-20 h-16 rounded-xl bg-stone-200" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl bg-rose-50 border border-rose-200/70 px-5 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-rose-400" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 5v3.5M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <p className="text-sm text-rose-600 font-medium">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="shrink-0 text-[11px] font-bold text-rose-500 bg-white border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const [state, dispatch] = useReducer(dashboardReducer, initialDashboardState);

  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];

  async function fetchAll() {
    dispatch({ type: "FETCH_START" });
    try {
      const [userRes, assignmentsRes, schedulesRes, groupsRes] = await Promise.all([
        getMeRequest(),
        getMyAssignmentsRequest(),
        getTodaySchedulesRequest(todayStr, todayStr),
        getMyGroupsRequest(),
      ]);
      dispatch({
        type: "FETCH_SUCCESS",
        payload: {
          user: userRes.data,
          assignments: assignmentsRes.data ?? [],
          schedules: schedulesRes.data ?? [],
          groups: groupsRes.data ?? [],
        },
      });
    } catch {
      dispatch({ type: "FETCH_ERROR", payload: "Failed to load dashboard. Please try again." });
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const { user, assignments, schedules, groups, loading, error } = state;

  const firstName = user?.fullname?.split(" ")[0] ?? "—";

  const dueThisWeek = assignments.filter((a) => {
    if (a.status === "COMPLETED") return false;
    const diff = (new Date(a.dueDate).getTime() - Date.now()) / 86_400_000;
    return diff >= 0 && diff <= 7;
  }).length;

  const classesToday = schedules.length;

  const completedCount = assignments.filter((a) => a.status === "COMPLETED").length;
  const totalCount = assignments.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const heroStats = [
    {
      label: "Classes today",
      value: loading ? "—" : String(classesToday),
      accent: "text-indigo-700",
      border: "border-indigo-200",
      bg: "bg-indigo-100/80",
    },
    {
      label: "Due this week",
      value: loading ? "—" : String(dueThisWeek),
      accent: "text-amber-700",
      border: "border-amber-200",
      bg: "bg-amber-100/80",
    },
    {
      label: "Completion",
      value: loading ? "—" : `${completionPct}%`,
      accent: "text-teal-700",
      border: "border-teal-200",
      bg: "bg-teal-100/80",
    },
  ];

  const todayFormatted = today.toLocaleDateString("en-US", {
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
        {loading ? (
          <HeroSkeleton />
        ) : (
          <div className="relative rounded-2xl bg-white border border-stone-200/80 overflow-hidden px-6 py-5 shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.018)_1px,transparent_1px)] [background-size:22px_22px] pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-400 to-transparent" />

            <div className="relative flex items-center justify-between gap-6">
              <div>
                <p className="text-stone-500 text-[11px] font-semibold tracking-[0.14em] uppercase mb-1.5">
                  {todayFormatted}
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
                <p className="text-stone-500 text-xs mt-1.5">
                  {dueThisWeek > 0 ? (
                    <>
                      You have{" "}
                      <span className="text-amber-600 font-semibold">
                        {dueThisWeek} deadline{dueThisWeek > 1 ? "s" : ""}
                      </span>{" "}
                      this week — stay focused.
                    </>
                  ) : (
                    "No deadlines this week — great work!"
                  )}
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
                    <span className="text-stone-600 text-[9px] font-bold uppercase tracking-[0.12em] mt-1 whitespace-nowrap">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.header>

      {error && (
        <div className="mt-4">
          <ErrorBanner message={error} onRetry={fetchAll} />
        </div>
      )}

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-12 gap-4 mt-5">

        <BentoCard
          delay={0.06}
          href="/schedules"
          className="col-span-7 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(99,102,241,0.1)] hover:border-indigo-200/70"
        >
          <TodayScheduleView schedules={schedules} loading={loading} />
        </BentoCard>

        <div className="col-span-5 flex flex-col gap-4">
          <BentoCard
            delay={0.1}
            href="/assignments"
            className="flex-1 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(139,92,246,0.1)] hover:border-violet-200/70"
          >
            <AssignmentStatusView assignments={assignments} loading={loading} />
          </BentoCard>
          <BentoCard
            delay={0.14}
            href="/assignments"
            className="flex-1 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(16,185,129,0.08)] hover:border-emerald-200/70"
          >
            <AssignmentProgressView assignments={assignments} loading={loading} />
          </BentoCard>
        </div>

        <BentoCard
          delay={0.18}
          href="/assignments"
          className="col-span-5 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(245,158,11,0.09)] hover:border-amber-200/70"
        >
          <UpComingReport assignments={assignments} loading={loading} />
        </BentoCard>

        <BentoCard
          delay={0.22}
          href="/groups"
          className="col-span-7 bg-white rounded-2xl border border-stone-200/70 shadow-sm hover:shadow-[0_4px_20px_rgba(6,182,212,0.09)] hover:border-cyan-200/70"
        >
          <GroupActivitiesView groups={groups} loading={loading} />
        </BentoCard>

      </div>
    </div>
  );
}
