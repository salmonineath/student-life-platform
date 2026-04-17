"use client";

/**
 * DailyView — shows all schedules for a single day, sorted by start time.
 *
 * Key behaviours:
 *  - Accepts `initialDate` so Weekly/Monthly can pass the clicked day.
 *  - Clicking the pencil icon on a row → calls onEditSchedule → parent opens modal.
 *  - Fetches schedules for the displayed date from the API (via Redux action).
 *
 * Props:
 *  initialDate?            — which day to show first (defaults to today).
 *  onEditSchedule(schedule)— user clicked edit; parent opens edit modal.
 */

import { useEffect, useState, useMemo } from "react";
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
import { format, isSameDay, isToday, addDays, subDays } from "date-fns";

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

function getStartMinutes(schedule: Schedule): number {
  const isOneTime = schedule.type === "ONE_TIME";
  const timeStr = isOneTime
    ? (schedule as OneTimeSchedule).startTime
    : (schedule as RecurringSchedule).recurringStartTime;
  const t = timeStr.includes("T") ? timeStr.split("T")[1] : timeStr;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

// ── Schedule Row ───────────────────────────────────────────────────────────────

/**
 * Detailed card for one schedule in the daily view.
 * Edit button appears on hover.
 */
function ScheduleRow({
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

  const [startTime, endTime] = timeRange.split("–").map((t) => t.trim());

  return (
    <div
      className={`
      group flex items-start gap-4 p-4 rounded-2xl border
      transition-all duration-150 hover:shadow-md
      ${isOneTime ? "bg-green-50 border-green-100" : "bg-purple-50 border-purple-100"}
    `}
    >
      {/* Time column */}
      <div className="flex flex-col items-center min-w-[64px]">
        <Clock
          className={`w-3.5 h-3.5 mb-1 ${isOneTime ? "text-green-400" : "text-purple-400"}`}
        />
        <span
          className={`text-xs font-semibold text-center leading-tight ${isOneTime ? "text-green-600" : "text-purple-600"}`}
        >
          {startTime}
        </span>
        <span className="text-[10px] text-slate-400">– {endTime}</span>
      </div>

      {/* Vertical divider */}
      <div
        className={`w-px self-stretch rounded-full ${isOneTime ? "bg-green-200" : "bg-purple-200"}`}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide ${
              isOneTime
                ? "bg-green-100 text-green-700"
                : "bg-purple-100 text-purple-700"
            }`}
          >
            {isOneTime ? "One-time" : "Weekly"}
          </span>
          {schedule.important && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-amber-100 text-amber-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              Important
            </span>
          )}
        </div>

        <p className="font-semibold text-slate-800">{schedule.title}</p>

        {schedule.description && (
          <p className="text-sm text-slate-500 mt-0.5 leading-snug">
            {schedule.description}
          </p>
        )}

        {schedule.location && (
          <p className="flex items-center gap-1 text-xs text-slate-400 mt-1.5">
            <MapPin className="w-3 h-3" />
            {schedule.location}
          </p>
        )}
      </div>

      {/* Right side: creator info + edit button */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        {/* Creator info — hidden on mobile */}
        <div className="hidden sm:flex flex-col items-end gap-0.5">
          <span className="text-[10px] text-slate-400">by</span>
          <span className="text-xs font-medium text-slate-600">
            {schedule.createdBy.fullname}
          </span>
          <span className="text-[10px] text-slate-400">
            {schedule.createdBy.username}
          </span>
        </div>

        {/* Edit button — appears on hover */}
        <button
          onClick={() => onEdit(schedule)}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600 transition-all duration-150"
          title="Edit schedule"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface DailyViewProps {
  initialDate?: Date;
  onEditSchedule: (schedule: Schedule) => void;
}

// ── Daily View ─────────────────────────────────────────────────────────────────

export default function DailyView({
  initialDate,
  onEditSchedule,
}: DailyViewProps) {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useAppSelector((s) => s.schedule);

  const [currentDate, setCurrentDate] = useState<Date>(
    initialDate ?? new Date(),
  );

  // Sync if parent sends a new date (e.g. user clicks different day in Weekly)
  useEffect(() => {
    if (initialDate) setCurrentDate(initialDate);
  }, [initialDate]);

  useEffect(() => {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    dispatch(getMyScheduleAction({ startDate: dateStr, endDate: dateStr }));
  }, [currentDate]);

  const goToPrevDay = () => setCurrentDate((d) => subDays(d, 1));
  const goToNextDay = () => setCurrentDate((d) => addDays(d, 1));
  const goToToday = () => setCurrentDate(new Date());

  const isCurrentDay = isToday(currentDate);

  const daySchedules = useMemo(
    () =>
      getSchedulesForDay(schedules, currentDate).sort(
        (a, b) => getStartMinutes(a) - getStartMinutes(b),
      ),
    [schedules, currentDate],
  );

  return (
    <div className="space-y-4">
      {/* ── Day header card ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-100 rounded-2xl px-5 py-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
          {format(currentDate, "EEEE")}
        </p>
        <div className="flex items-baseline gap-2">
          <span
            className={`text-4xl font-bold ${isCurrentDay ? "text-blue-600" : "text-slate-800"}`}
          >
            {format(currentDate, "d")}
          </span>
          <span className="text-lg text-slate-500 font-medium">
            {format(currentDate, "MMMM yyyy")}
          </span>
          {isCurrentDay && (
            <span className="ml-1 text-xs font-bold text-white bg-blue-500 px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 mt-1">
          {daySchedules.length === 0
            ? "No schedules"
            : `${daySchedules.length} ${daySchedules.length === 1 ? "event" : "events"} scheduled`}
        </p>
      </div>

      {/* ── Date Navigation ─────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2">
        {!isCurrentDay && (
          <button
            onClick={goToToday}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
        )}

        <button
          onClick={goToPrevDay}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <label className="relative cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-700">
            {format(currentDate, "EEEE, MMMM d yyyy")}
          </span>
          <input
            type="date"
            className="absolute inset-0 opacity-0 cursor-pointer w-full"
            value={format(currentDate, "yyyy-MM-dd")}
            onChange={(e) => {
              if (!e.target.value) return;
              setCurrentDate(new Date(e.target.value + "T00:00:00"));
            }}
          />
        </label>

        <button
          onClick={goToNextDay}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── Schedule list ────────────────────────────────────────────── */}
      {loading ? (
        <DailyViewSkeleton />
      ) : daySchedules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <CalendarDays className="w-6 h-6 text-slate-300" />
          </div>
          <p className="font-semibold text-slate-500">
            No schedules for this day
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Enjoy your free time! 🎉
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {daySchedules.map((s) => (
            <ScheduleRow key={s.id} schedule={s} onEdit={onEditSchedule} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function DailyViewSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-slate-100 animate-pulse" />
      ))}
    </div>
  );
}
