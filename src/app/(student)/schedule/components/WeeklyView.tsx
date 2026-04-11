"use client";

/**
 * WeeklyView — shows the 7 days of the current week, each with its events.
 *
 * Key behaviours:
 *  - Fetches schedules for the displayed week from the API (via Redux action).
 *  - Clicking a day label → calls onDayClick(date) → parent switches to Daily view.
 *  - Clicking the pencil icon on an event → calls onEditSchedule(schedule) → parent opens modal.
 *
 * Props:
 *  onDayClick(date)        — user clicked a day; parent switches tab to Daily.
 *  onEditSchedule(schedule)— user clicked edit on an event; parent opens edit modal.
 */

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Pencil,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMyScheduleAction } from "../core/action";
import {
  Schedule,
  OneTimeSchedule,
  RecurringSchedule,
} from "@/types/scheduleTypes";
import {
  format,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  eachDayOfInterval,
  isSameDay,
  isToday,
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

function formatTime(time: string): string {
  const t = time.includes("T") ? time.split("T")[1] : time;
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${ampm}`;
}

// ── Event Card ─────────────────────────────────────────────────────────────────

/**
 * A single event shown inside a day row.
 * Hovering reveals an edit button (pencil icon).
 */
function EventCard({
  schedule,
  onEdit,
}: {
  schedule: Schedule;
  onEdit: (s: Schedule) => void;
}) {
  const isOneTime = schedule.type === "ONE_TIME";
  const s = schedule as OneTimeSchedule;
  const r = schedule as RecurringSchedule;

  const timeRange = isOneTime
    ? `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`
    : `${formatTime(r.recurringStartTime)} – ${formatTime(r.recurringEndTime)}`;

  return (
    <div
      className={`
        group flex items-center gap-3 px-4 py-3 rounded-xl border
        transition-all duration-150 hover:shadow-sm
        ${isOneTime ? "bg-green-50 border-green-100" : "bg-purple-50 border-purple-100"}
      `}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${isOneTime ? "bg-green-500" : "bg-purple-500"}`}
      />

      <span className="font-semibold text-slate-800 text-sm">
        {schedule.title}
      </span>

      <span
        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
          isOneTime
            ? "bg-green-100 text-green-700"
            : "bg-purple-100 text-purple-700"
        }`}
      >
        {isOneTime ? "One-time" : "Weekly"}
      </span>

      {schedule.important && (
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
      )}

      <div className="flex-1" />

      <span className="flex items-center gap-1 text-xs text-slate-500">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        {timeRange}
      </span>

      {schedule.location && (
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          {schedule.location}
        </span>
      )}

      {/* Edit button — appears on hover */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // don't trigger day click
          onEdit(schedule);
        }}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-all duration-150"
        title="Edit schedule"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface WeeklyViewProps {
  onDayClick: (date: Date) => void;
  onEditSchedule: (schedule: Schedule) => void;
  // initialDate?: Date;
}

// ── Weekly View ────────────────────────────────────────────────────────────────

export default function WeeklyView({
  onDayClick,
  onEditSchedule,
}: WeeklyViewProps) {
  const dispatch = useAppDispatch();
  // const [currentDate, setCurrentDate] = useState<Date>(
  //   initialDate ?? new Date(),
  // );
  const { schedules, loading } = useAppSelector((s) => s.schedule);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

  useEffect(() => {
    dispatch(
      getMyScheduleAction({
        startDate: format(currentWeekStart, "yyyy-MM-dd"),
        endDate: format(weekEnd, "yyyy-MM-dd"),
      }),
    );
  }, [currentWeekStart]);

  const goToPrevWeek = () => setCurrentWeekStart((d) => subWeeks(d, 1));
  const goToNextWeek = () => setCurrentWeekStart((d) => addWeeks(d, 1));
  const goToToday = () =>
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));

  const isCurrentWeek = useMemo(() => {
    const todayWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return (
      format(currentWeekStart, "yyyy-MM-dd") ===
      format(todayWeekStart, "yyyy-MM-dd")
    );
  }, [currentWeekStart]);

  return (
    <div className="space-y-4">
      {/* ── Date Navigation ──────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2">
        {!isCurrentWeek && (
          <button
            onClick={goToToday}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
        )}

        <button
          onClick={goToPrevWeek}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <label className="relative cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            {format(currentWeekStart, "MMMM d")} –{" "}
            {format(weekEnd, "MMMM d, yyyy")}
          </span>
          <input
            type="date"
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
            value={format(currentWeekStart, "yyyy-MM-dd")}
            onChange={(e) => {
              if (!e.target.value) return;
              setCurrentWeekStart(
                startOfWeek(new Date(e.target.value + "T00:00:00"), {
                  weekStartsOn: 1,
                }),
              );
            }}
          />
        </label>

        <button
          onClick={goToNextWeek}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Day Rows ─────────────────────────────────────────────────── */}
      {loading ? (
        <WeeklyViewSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          {days.map((day, i) => {
            const daySchedules = getSchedulesForDay(schedules, day);
            const today = isToday(day);

            return (
              <div
                key={i}
                className="flex gap-5 bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm"
              >
                {/* Day label — clicking switches to Daily view for this day */}
                <button
                  onClick={() => onDayClick(day)}
                  className="w-12 shrink-0 flex flex-col text-left hover:opacity-60 transition-opacity"
                  title={`View ${format(day, "EEEE, MMMM d")}`}
                >
                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                    {format(day, "EEE")}
                  </span>
                  <span
                    className={`text-2xl font-bold leading-tight ${today ? "text-blue-600" : "text-slate-800"}`}
                  >
                    {format(day, "d")}
                  </span>
                  {daySchedules.length > 0 && (
                    <span className="text-[11px] text-slate-400 mt-1">
                      {daySchedules.length}{" "}
                      {daySchedules.length === 1 ? "event" : "events"}
                    </span>
                  )}
                  {today && (
                    <span className="text-[10px] font-semibold text-blue-500 mt-0.5">
                      Today
                    </span>
                  )}
                </button>

                {/* Event cards */}
                <div className="flex-1 flex flex-col gap-2 justify-center min-h-[48px]">
                  {daySchedules.length === 0 ? (
                    <span className="text-sm text-slate-300 italic">
                      No events
                    </span>
                  ) : (
                    daySchedules.map((s) => (
                      <EventCard
                        key={s.id}
                        schedule={s}
                        onEdit={onEditSchedule}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function WeeklyViewSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-5 bg-white border border-slate-100 rounded-2xl px-5 py-4"
        >
          <div className="w-12 space-y-2">
            <div className="h-3 w-6 bg-slate-100 rounded animate-pulse" />
            <div className="h-7 w-7 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="h-10 bg-slate-100 rounded-xl animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
