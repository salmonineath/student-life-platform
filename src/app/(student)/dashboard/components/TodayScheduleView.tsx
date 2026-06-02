"use client";

import { motion } from "motion/react";
import { Schedule, OneTimeSchedule, RecurringSchedule } from "@/types/scheduleTypes";

interface Props {
  schedules: Schedule[];
  loading: boolean;
}

const DOT_COLORS = [
  { dot: "bg-sky-500", dotBg: "bg-sky-100", timeColor: "text-sky-600" },
  { dot: "bg-amber-500", dotBg: "bg-amber-100", timeColor: "text-amber-600" },
  { dot: "bg-violet-500", dotBg: "bg-violet-100", timeColor: "text-violet-600" },
  { dot: "bg-emerald-500", dotBg: "bg-emerald-100", timeColor: "text-emerald-600" },
];

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function getScheduleStartMinutes(s: Schedule): number {
  if (s.type === "ONE_TIME") {
    const time = (s as OneTimeSchedule).startTime?.split("T")[1] ?? "00:00:00";
    return toMinutes(time);
  }
  return toMinutes((s as RecurringSchedule).recurringStartTime ?? "00:00:00");
}

function getScheduleEndMinutes(s: Schedule): number {
  if (s.type === "ONE_TIME") {
    const time = (s as OneTimeSchedule).endTime?.split("T")[1] ?? "23:59:00";
    return toMinutes(time);
  }
  return toMinutes((s as RecurringSchedule).recurringEndTime ?? "23:59:00");
}

function getScheduleLabel(s: Schedule): string {
  if (s.type === "ONE_TIME") {
    const start = (s as OneTimeSchedule).startTime?.split("T")[1] ?? "";
    return formatTime(start);
  }
  return formatTime((s as RecurringSchedule).recurringStartTime ?? "");
}

function Skeleton() {
  return (
    <div className="p-5 h-full flex flex-col animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-stone-200" />
          <div className="h-4 w-20 bg-stone-200 rounded" />
        </div>
        <div className="h-3 w-14 bg-stone-200 rounded" />
      </div>

      <div className="rounded-xl bg-stone-100 p-4 mb-4 space-y-2">
        <div className="h-3 w-24 bg-stone-200 rounded" />
        <div className="h-5 w-40 bg-stone-200 rounded" />
        <div className="h-3 w-20 bg-stone-200 rounded" />
        <div className="h-[3px] w-full bg-stone-200 rounded-full mt-2" />
      </div>

      <div className="h-3 w-12 bg-stone-200 rounded mb-3" />
      {[1, 2].map((i) => (
        <div key={i} className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-xl bg-stone-200" />
          <div className="h-3 w-14 bg-stone-200 rounded" />
          <div className="h-3 flex-1 bg-stone-200 rounded" />
          <div className="h-3 w-16 bg-stone-200 rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-indigo-300" viewBox="0 0 20 20" fill="none">
          <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M7 2v4M13 2v4M3 9h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-xs font-medium text-stone-500">No classes scheduled today</p>
    </div>
  );
}

export default function TodayScheduleView({ schedules, loading }: Props) {
  if (loading) return <Skeleton />;

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const todayDow = now.getDay();

  const todaySchedules = schedules
    .filter((s) => {
      if (s.type === "ONE_TIME") return true;
      return (s as RecurringSchedule).dayOfWeek === todayDow;
    })
    .sort((a, b) => getScheduleStartMinutes(a) - getScheduleStartMinutes(b));

  const current = todaySchedules.find((s) => {
    const start = getScheduleStartMinutes(s);
    const end = getScheduleEndMinutes(s);
    return nowMinutes >= start && nowMinutes <= end;
  }) ?? null;

  const upcoming = todaySchedules.filter((s) => getScheduleStartMinutes(s) > nowMinutes).slice(0, 3);

  const currentProgress = current
    ? Math.round(
        ((nowMinutes - getScheduleStartMinutes(current)) /
          (getScheduleEndMinutes(current) - getScheduleStartMinutes(current))) *
          100,
      )
    : 0;

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-indigo-300" />
          <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Schedule
          </h2>
        </div>
        <a href="/schedules" className="text-[11px] text-stone-500 hover:text-stone-700 font-medium transition-colors">
          Full view →
        </a>
      </div>

      {current ? (
        <div className="relative rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50/60 border border-indigo-100/80 overflow-hidden p-4 mb-4">
          <div className="absolute -top-8 -right-8 w-28 h-28 bg-violet-200/30 blur-2xl rounded-full pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-emerald-600 text-[10px] font-bold uppercase tracking-[0.14em]">Live now</span>
              </div>
              <span className="text-stone-500 text-[11px] tabular-nums">
                {getScheduleLabel(current)} –{" "}
                {current.type === "ONE_TIME"
                  ? formatTime((current as OneTimeSchedule).endTime?.split("T")[1] ?? "")
                  : formatTime((current as RecurringSchedule).recurringEndTime ?? "")}
              </span>
            </div>
            <p className="text-stone-900 text-[1.05rem] font-bold leading-tight mb-0.5" style={{ fontFamily: "var(--font-sora)" }}>
              {current.title}
            </p>
            <p className="text-stone-500 text-xs mb-3">{current.location ?? ""}</p>
            <div className="flex items-center gap-2.5">
              <div className="flex-1 h-[3px] bg-indigo-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-400"
                  initial={{ width: "0%" }}
                  animate={{ width: `${currentProgress}%` }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
                />
              </div>
              <span className="text-indigo-700 text-[11px] font-bold tabular-nums shrink-0">{currentProgress}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-stone-50 border border-stone-100 p-4 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-stone-300" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-xs text-stone-500">No class in progress right now</p>
        </div>
      )}

      {upcoming.length > 0 ? (
        <>
          <p className="text-[9px] font-bold text-stone-500 uppercase tracking-[0.14em] mb-2">Up next</p>
          <div className="flex flex-col gap-1.5 flex-1">
            {upcoming.map((item, i) => {
              const c = DOT_COLORS[i % DOT_COLORS.length];
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.45 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-stone-50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-xl ${c.dotBg} flex items-center justify-center shrink-0`}>
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                  </div>
                  <span className={`text-xs font-bold tabular-nums w-14 shrink-0 ${c.timeColor}`}>
                    {getScheduleLabel(item)}
                  </span>
                  <span className="text-sm font-medium text-stone-800 flex-1 truncate">{item.title}</span>
                  {item.location && (
                    <span className="text-[11px] text-stone-600 bg-stone-200 px-2.5 py-0.5 rounded-lg shrink-0">
                      {item.location}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </>
      ) : (
        !current && <EmptyState />
      )}
    </div>
  );
}
