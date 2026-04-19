"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  MapPin,
  Star,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { getMyScheduleAction, deleteScheduleAction } from "../core/action";
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
import DeleteConfirmModal from "../modal/DeleteConfirmModal";

function apiDayOfWeek(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

function getSchedulesForDay(schedules: Schedule[], date: Date): Schedule[] {
  return schedules.filter((s) => {
    if (s.type === "ONE_TIME")
      return isSameDay(new Date((s as OneTimeSchedule).startTime), date);
    return (s as RecurringSchedule).dayOfWeek === apiDayOfWeek(date);
  });
}

function formatTime(time: string): string {
  const t = time.includes("T") ? time.split("T")[1] : time;
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 === 0 ? 12 : hour % 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function EventCard({
  schedule,
  onEdit,
  onDelete,
  isHighlighted,
}: {
  schedule: Schedule;
  onEdit: (s: Schedule) => void;
  onDelete: (s: Schedule) => void;
  isHighlighted: boolean;
}) {
  const router = useRouter();
  const isOneTime = schedule.type === "ONE_TIME";
  const s = schedule as OneTimeSchedule;
  const r = schedule as RecurringSchedule;
  const timeRange = isOneTime
    ? `${formatTime(s.startTime)} – ${formatTime(s.endTime)}`
    : `${formatTime(r.recurringStartTime)} – ${formatTime(r.recurringEndTime)}`;

  return (
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150 hover:shadow-sm ${
        isHighlighted
          ? "ring-2 ring-blue-500 ring-offset-1 bg-blue-50 border-blue-200"
          : isOneTime
            ? "bg-green-50 border-green-100"
            : "bg-purple-50 border-purple-100"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full shrink-0 ${isHighlighted ? "bg-blue-500" : isOneTime ? "bg-green-500" : "bg-purple-500"}`}
      />

      <span className="font-semibold text-slate-800 text-sm">
        {schedule.title}
      </span>

      <span
        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
          isHighlighted
            ? "bg-blue-100 text-blue-700"
            : isOneTime
              ? "bg-green-100 text-green-700"
              : "bg-purple-100 text-purple-700"
        }`}
      >
        {isOneTime ? "One-time" : "Weekly"}
      </span>

      {schedule.important && (
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
      )}

      {/* Assignment badge */}
      {schedule.assignmentId && (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
          Assignment
        </span>
      )}

      {isHighlighted && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
          ← here
        </span>
      )}

      <div className="flex-1" />

      <span className="flex items-center gap-1 text-xs text-slate-500">
        <Clock className="w-3.5 h-3.5 text-slate-400" /> {timeRange}
      </span>

      {schedule.location && (
        <span className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {schedule.location}
        </span>
      )}

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150">
        {/* Go to assignment */}
        {schedule.assignmentId && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/assignment/${schedule.assignmentId}`);
            }}
            className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600"
            title="View linked assignment"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(schedule);
          }}
          className="p-1.5 rounded-lg hover:bg-white/60 text-slate-400 hover:text-slate-600"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(schedule);
          }}
          className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

interface WeeklyViewProps {
  onDayClick: (date: Date) => void;
  onEditSchedule: (schedule: Schedule) => void;
  highlightId?: number | null;
}

export default function WeeklyView({
  onDayClick,
  onEditSchedule,
  highlightId,
}: WeeklyViewProps) {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useAppSelector((s) => s.schedule);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
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

  const isCurrentWeek = useMemo(() => {
    const todayWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return (
      format(currentWeekStart, "yyyy-MM-dd") ===
      format(todayWeekStart, "yyyy-MM-dd")
    );
  }, [currentWeekStart]);

  const handleDelete = async () => {
    if (!scheduleToDelete) return;
    setDeleting(true);
    try {
      await dispatch(deleteScheduleAction(scheduleToDelete.id)).unwrap();
      setScheduleToDelete(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
        {!isCurrentWeek && (
          <button
            onClick={() =>
              setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
            }
            className="text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
        )}
        <button
          onClick={() => setCurrentWeekStart((d) => subWeeks(d, 1))}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
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
          onClick={() => setCurrentWeekStart((d) => addWeeks(d, 1))}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
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
      ) : (
        <div className="flex flex-col gap-3">
          {days.map((day, i) => {
            const daySchedules = getSchedulesForDay(schedules, day);
            const today = isToday(day);
            const hasHighlight =
              highlightId != null &&
              daySchedules.some((s) => s.id === highlightId);

            return (
              <div
                key={i}
                className={`flex gap-5 bg-white border rounded-2xl px-5 py-4 shadow-sm ${hasHighlight ? "border-blue-200" : "border-slate-100"}`}
              >
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
                        onDelete={(schedule) => setScheduleToDelete(schedule)}
                        isHighlighted={
                          highlightId != null && s.id === highlightId
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
          {scheduleToDelete && (
            <DeleteConfirmModal
              title={scheduleToDelete.title}
              isDeleting={deleting}
              onConfirm={handleDelete}
              onCancel={() => setScheduleToDelete(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}
