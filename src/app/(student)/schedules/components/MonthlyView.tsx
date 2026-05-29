"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { getMyScheduleAction } from "../core/action";
import { Schedule, OneTimeSchedule, RecurringSchedule } from "@/types/scheduleTypes";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isToday, isSameMonth, addMonths, subMonths,
} from "date-fns";

function apiDayOfWeek(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

function forDay(schedules: Schedule[], date: Date): Schedule[] {
  const target = format(date, "yyyy-MM-dd");
  return schedules.filter((s) => {
    if (s.type === "ONE_TIME") {
      const o = s as OneTimeSchedule;
      return o.startTime.slice(0, 10) === target || o.endTime.slice(0, 10) === target;
    }
    return (s as RecurringSchedule).dayOfWeek === apiDayOfWeek(date);
  });
}

const MAX_VISIBLE = 3;
const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// ── Event pill ─────────────────────────────────────────────────────────────────
function EventPill({ s, hi }: { s: Schedule; hi: boolean }) {
  const router = useRouter();
  const isOneTime = s.type === "ONE_TIME";

  const base = hi
    ? "bg-indigo-600 text-white font-bold"
    : isOneTime
      ? "bg-emerald-500 text-white border-l-[3px] border-emerald-700"
      : "bg-violet-500 text-white border-l-[3px] border-violet-700";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation(); // never bubble up to day cell
        if (s.assignmentId) router.push("/assignments");
      }}
      className={`truncate text-[10px] font-semibold px-1.5 py-px rounded leading-snug flex items-center gap-0.5 ${base} ${s.assignmentId ? "cursor-pointer hover:opacity-80" : ""}`}
      title={s.title}
    >
      {s.important && <Star className="w-2 h-2 fill-amber-400 text-amber-400 shrink-0" />}
      <span className="truncate">{s.title}</span>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
interface MonthlyViewProps {
  onDayClick: (date: Date) => void;
  onDayCreate?: (date: Date) => void;
  highlightId?: number | null;
}

export default function MonthlyView({ onDayClick, onDayCreate, highlightId }: MonthlyViewProps) {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useAppSelector((s) => s.schedule);
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date()));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const gridDays = useMemo(() => eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
  }), [currentMonth]);

  useEffect(() => {
    dispatch(getMyScheduleAction({
      startDate: format(monthStart, "yyyy-MM-dd"),
      endDate: format(monthEnd, "yyyy-MM-dd"),
    }));
  }, [currentMonth]);

  const isCurrentMonth = useMemo(
    () => format(currentMonth, "yyyy-MM") === format(new Date(), "yyyy-MM"),
    [currentMonth],
  );

  return (
    <div className="space-y-3">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-stone-800">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex items-center gap-1.5">
          {!isCurrentMonth && (
            <button onClick={() => setCurrentMonth(startOfMonth(new Date()))}
              className="text-xs font-semibold text-stone-600 px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-50 transition-colors">
              Today
            </button>
          )}
          <button onClick={() => setCurrentMonth((d) => subMonths(d, 1))} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setCurrentMonth((d) => addMonths(d, 1))} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="bg-white border border-stone-300 rounded-2xl shadow-sm overflow-hidden">

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-stone-300">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2.5 text-center text-[10px] font-bold text-stone-600 tracking-widest">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {loading ? (
          <div className="grid grid-cols-7">
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="p-2 min-h-[100px] border-b border-r border-stone-300">
                <div className="h-5 w-5 bg-stone-100 rounded-full animate-pulse mb-1.5" />
                <div className="h-3 w-full bg-stone-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7">
            {gridDays.map((day, i) => {
              const daySched = forDay(schedules, day);
              const today = isToday(day);
              const inMonth = isSameMonth(day, currentMonth);
              const visible = daySched.slice(0, MAX_VISIBLE);
              const overflow = daySched.length - MAX_VISIBLE;
              const hasHi = highlightId != null && daySched.some((s) => s.id === highlightId);

              return (
                <div
                  key={i}
                  className={`relative flex flex-col gap-1 p-2 min-h-[100px] border-b border-r border-stone-300 transition-colors
                    ${inMonth ? "" : "opacity-40"}
                    ${today && inMonth ? "bg-indigo-50/50" : ""}
                    ${hasHi ? "ring-2 ring-inset ring-indigo-300" : ""}
                    ${onDayCreate && inMonth ? "cursor-cell hover:bg-stone-50/80" : ""}
                  `}
                  onClick={() => inMonth && onDayCreate?.(day)}
                >
                  {/* Day number — click switches to daily view */}
                  <button
                    onClick={(e) => { e.stopPropagation(); onDayClick(day); }}
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors z-10 shrink-0 ${
                      today ? "bg-indigo-600 text-white" : "text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    {format(day, "d")}
                  </button>

                  {/* Event pills */}
                  <div className="flex flex-col gap-0.5 w-full min-w-0 z-10">
                    {visible.map((s) => (
                      <EventPill key={s.id} s={s} hi={highlightId != null && s.id === highlightId} />
                    ))}
                    {overflow > 0 && (
                      <span className="text-[9px] font-semibold text-stone-400 px-1.5">
                        +{overflow} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
