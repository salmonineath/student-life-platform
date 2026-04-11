"use client";

/**
 * MonthlyView — shows a full calendar grid for the current month.
 *
 * Key behaviours:
 *  - Fetches schedules for the entire displayed month from the API (via Redux action).
 *  - Each day cell shows up to 2 event pills; overflows show "+ N more".
 *  - Clicking any day cell calls `onDayClick(date)` → parent switches to Daily view.
 *  - Today is highlighted with a blue circle.
 *  - Prev/Next arrows navigate month by month.
 *
 * Props:
 *  onDayClick(date) — called when user clicks a day cell.
 */

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMyScheduleAction } from "../core/action";
import {
  Schedule,
  OneTimeSchedule,
  RecurringSchedule,
} from "@/types/scheduleTypes";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
  addMonths,
  subMonths,
} from "date-fns";

// ── Helpers ────────────────────────────────────────────────────────────────────

function apiDayOfWeek(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

function getSchedulesForDay(schedules: Schedule[], date: Date): Schedule[] {
  return schedules.filter((s) => {
    if (s.type === "ONE_TIME") {
      return isSameDay(new Date((s as OneTimeSchedule).startTime), date);
    }
    return (s as RecurringSchedule).dayOfWeek === apiDayOfWeek(date);
  });
}

// ── Event Pill ─────────────────────────────────────────────────────────────────

/**
 * A compact coloured pill showing a schedule title inside a day cell.
 */
function EventPill({ schedule }: { schedule: Schedule }) {
  const isOneTime = schedule.type === "ONE_TIME";
  return (
    <div
      className={`
      truncate text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-tight
      ${isOneTime ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"}
      ${schedule.important ? "ring-1 ring-amber-300" : ""}
    `}
    >
      {schedule.title}
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface MonthlyViewProps {
  /** Called when user clicks a day cell — parent switches to Daily view for that date. */
  onDayClick: (date: Date) => void;
}

// ── Monthly View ───────────────────────────────────────────────────────────────

// Column headers — week starts on Monday
const WEEKDAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

// Max event pills to show per cell before "+" overflow label
const MAX_VISIBLE_EVENTS = 2;

export default function MonthlyView({ onDayClick }: MonthlyViewProps) {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useAppSelector((s) => s.schedule);

  // The month currently displayed
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date()),
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Build the full grid — all days from the Monday before monthStart
  // to the Sunday after monthEnd so the grid is always complete rows
  const gridDays = useMemo(() => {
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [currentMonth]);

  // Fetch the full month's schedules whenever the displayed month changes
  useEffect(() => {
    dispatch(
      getMyScheduleAction({
        startDate: format(monthStart, "yyyy-MM-dd"),
        endDate: format(monthEnd, "yyyy-MM-dd"),
      }),
    );
  }, [currentMonth]);

  const goToPrevMonth = () => setCurrentMonth((d) => subMonths(d, 1));
  const goToNextMonth = () => setCurrentMonth((d) => addMonths(d, 1));
  const goToToday = () => setCurrentMonth(startOfMonth(new Date()));

  const isCurrentMonth = useMemo(
    () => format(currentMonth, "yyyy-MM") === format(new Date(), "yyyy-MM"),
    [currentMonth],
  );

  return (
    <div className="space-y-4">
      {/* ── Month Navigation ───────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2">
        {!isCurrentMonth && (
          <button
            onClick={goToToday}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
        )}

        <button
          onClick={goToPrevMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-semibold text-slate-700 px-2">
          {format(currentMonth, "MMMM yyyy")}
        </span>

        <button
          onClick={goToNextMonth}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Calendar Grid ──────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
        {/* Weekday column headers */}
        <div className="grid grid-cols-7 border-b border-slate-100">
          {WEEKDAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-2 text-center text-[10px] font-bold text-slate-400 tracking-widest"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Day cells */}
        {loading ? (
          <MonthlyViewSkeleton />
        ) : (
          <div className="grid grid-cols-7">
            {gridDays.map((day, i) => {
              const daySchedules = getSchedulesForDay(schedules, day);
              const today = isToday(day);
              const inMonth = isSameMonth(day, currentMonth);
              const visible = daySchedules.slice(0, MAX_VISIBLE_EVENTS);
              const overflow = daySchedules.length - MAX_VISIBLE_EVENTS;

              return (
                <button
                  key={i}
                  onClick={() => onDayClick(day)}
                  className={`
                    relative flex flex-col gap-1 p-2 min-h-[80px] text-left
                    border-b border-r border-slate-100
                    transition-colors duration-100
                    ${inMonth ? "hover:bg-slate-50" : "bg-slate-50/50 hover:bg-slate-100/50"}
                    ${today ? "bg-blue-50/40 hover:bg-blue-50/60" : ""}
                  `}
                  title={`View ${format(day, "EEEE, MMMM d")}`}
                >
                  {/* Day number */}
                  <span
                    className={`
                    text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                    ${
                      today
                        ? "bg-blue-600 text-white"
                        : inMonth
                          ? "text-slate-700"
                          : "text-slate-300"
                    }
                  `}
                  >
                    {format(day, "d")}
                  </span>

                  {/* Event pills (max 2) */}
                  <div className="flex flex-col gap-0.5 w-full">
                    {visible.map((s) => (
                      <EventPill key={s.id} schedule={s} />
                    ))}

                    {/* Overflow indicator */}
                    {overflow > 0 && (
                      <span className="text-[9px] font-semibold text-slate-400 px-1">
                        +{overflow} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Loading Skeleton ───────────────────────────────────────────────────────────

function MonthlyViewSkeleton() {
  return (
    <div className="grid grid-cols-7">
      {Array.from({ length: 35 }).map((_, i) => (
        <div
          key={i}
          className="p-2 min-h-[80px] border-b border-r border-slate-100"
        >
          <div className="h-4 w-4 bg-slate-100 rounded-full animate-pulse mb-2" />
          <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
