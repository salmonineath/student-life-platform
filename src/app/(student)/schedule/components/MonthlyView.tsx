"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
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

function apiDayOfWeek(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

function getSchedulesForDay(schedules: Schedule[], date: Date): Schedule[] {
  const targetStr = format(date, "yyyy-MM-dd");
  return schedules.filter((s) => {
    if (s.type === "ONE_TIME") {
      const ot = s as OneTimeSchedule;
      const startDateStr = ot.startTime.slice(0, 10);
      const endDateStr = ot.endTime.slice(0, 10);
      return startDateStr === targetStr || endDateStr === targetStr;
    }
    return (s as RecurringSchedule).dayOfWeek === apiDayOfWeek(date);
  });
}

const MAX_VISIBLE = 2;
const WEEKDAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function EventPill({
  schedule,
  isHighlighted,
}: {
  schedule: Schedule;
  isHighlighted: boolean;
}) {
  const router = useRouter();
  const isOneTime = schedule.type === "ONE_TIME";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        // If it has an assignmentId, go to the assignment; otherwise do nothing
        if (schedule.assignmentId) {
          router.push(`/assignment/${schedule.assignmentId}`);
        }
      }}
      className={`truncate text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-tight
        ${
          isHighlighted
            ? "bg-blue-200 text-blue-800 ring-1 ring-blue-500 cursor-pointer"
            : isOneTime
              ? "bg-green-100 text-green-700"
              : "bg-purple-100 text-purple-700"
        }
        ${schedule.important ? "ring-1 ring-amber-300" : ""}
        ${schedule.assignmentId && !isHighlighted ? "cursor-pointer hover:bg-indigo-100 hover:text-indigo-700" : ""}
      `}
      title={
        schedule.assignmentId ? "Click to view assignment" : schedule.title
      }
    >
      {isHighlighted ? "★ " : ""}
      {schedule.title}
    </div>
  );
}

interface MonthlyViewProps {
  onDayClick: (date: Date) => void;
  highlightId?: number | null;
}

export default function MonthlyView({
  onDayClick,
  highlightId,
}: MonthlyViewProps) {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useAppSelector((s) => s.schedule);
  const [currentMonth, setCurrentMonth] = useState<Date>(
    startOfMonth(new Date()),
  );

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const gridDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(monthStart, { weekStartsOn: 1 }),
      end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
    });
  }, [currentMonth]);

  useEffect(() => {
    dispatch(
      getMyScheduleAction({
        startDate: format(monthStart, "yyyy-MM-dd"),
        endDate: format(monthEnd, "yyyy-MM-dd"),
      }),
    );
  }, [currentMonth]);

  const isCurrentMonth = useMemo(
    () => format(currentMonth, "yyyy-MM") === format(new Date(), "yyyy-MM"),
    [currentMonth],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        {!isCurrentMonth && (
          <button
            onClick={() => setCurrentMonth(startOfMonth(new Date()))}
            className="text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
        )}
        <button
          onClick={() => setCurrentMonth((d) => subMonths(d, 1))}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold text-slate-700 px-2">
          {format(currentMonth, "MMMM yyyy")}
        </span>
        <button
          onClick={() => setCurrentMonth((d) => addMonths(d, 1))}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
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

        {loading ? (
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
        ) : (
          <div className="grid grid-cols-7">
            {gridDays.map((day, i) => {
              const daySchedules = getSchedulesForDay(schedules, day);
              const today = isToday(day);
              const inMonth = isSameMonth(day, currentMonth);
              const visible = daySchedules.slice(0, MAX_VISIBLE);
              const overflow = daySchedules.length - MAX_VISIBLE;
              const hasHighlight =
                highlightId != null &&
                daySchedules.some((s) => s.id === highlightId);

              return (
                <button
                  key={i}
                  onClick={() => onDayClick(day)}
                  className={`relative flex flex-col gap-1 p-2 min-h-[80px] text-left border-b border-r border-slate-100 transition-colors duration-100
                    ${inMonth ? "hover:bg-slate-50" : "bg-slate-50/50 hover:bg-slate-100/50"}
                    ${today ? "bg-blue-50/40 hover:bg-blue-50/60" : ""}
                    ${hasHighlight ? "ring-2 ring-inset ring-blue-400" : ""}
                  `}
                >
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                      today
                        ? "bg-blue-600 text-white"
                        : inMonth
                          ? "text-slate-700"
                          : "text-slate-300"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  <div className="flex flex-col gap-0.5 w-full">
                    {visible.map((s) => (
                      <EventPill
                        key={s.id}
                        schedule={s}
                        isHighlighted={
                          highlightId != null && s.id === highlightId
                        }
                      />
                    ))}
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
