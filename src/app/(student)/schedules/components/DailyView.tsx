"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Star, Pencil, MapPin, ExternalLink } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { getMyScheduleAction } from "../core/action";
import { Schedule, OneTimeSchedule, RecurringSchedule } from "@/types/scheduleTypes";
import { format, isToday, addDays, subDays } from "date-fns";

// ── Grid constants ─────────────────────────────────────────────────────────────
const START_HOUR = 7;
const END_HOUR = 22;
const HOUR_HEIGHT = 72;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);

// ── Helpers ────────────────────────────────────────────────────────────────────
function apiDayOfWeek(date: Date): number {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

function timeToMins(t: string): number {
  const s = t.includes("T") ? t.split("T")[1] : t;
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

function getStart(s: Schedule) {
  return timeToMins(s.type === "ONE_TIME" ? (s as OneTimeSchedule).startTime : (s as RecurringSchedule).recurringStartTime);
}

function getEnd(s: Schedule) {
  return timeToMins(s.type === "ONE_TIME" ? (s as OneTimeSchedule).endTime : (s as RecurringSchedule).recurringEndTime);
}

function fmt(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtHour(h: number) {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
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

function overlapMap(events: Schedule[]): Map<number, { idx: number; total: number }> {
  const map = new Map<number, { idx: number; total: number }>();
  events.forEach((ev) => {
    const a = getStart(ev);
    const b = Math.max(getEnd(ev), a + 30);
    const group = events.filter((o) => {
      const c = getStart(o);
      const d = Math.max(getEnd(o), c + 30);
      return c < b && d > a;
    });
    map.set(ev.id, { idx: group.findIndex((o) => o.id === ev.id), total: group.length });
  });
  return map;
}

// ── Event block ────────────────────────────────────────────────────────────────
const COLORS = {
  oneTime:  { bg: "bg-emerald-500", bar: "bg-emerald-700", text: "text-white", badge: "bg-white/20 text-white" },
  recurring:{ bg: "bg-violet-500",  bar: "bg-violet-700",  text: "text-white", badge: "bg-white/20 text-white" },
  hi:       { bg: "bg-indigo-600",  bar: "bg-indigo-900",  text: "text-white", badge: "bg-white/20 text-white" },
};

function DayEventBlock({
  s, style, onEdit, hi,
}: {
  s: Schedule;
  style: React.CSSProperties;
  onEdit: (s: Schedule) => void;
  hi: boolean;
}) {
  const router = useRouter();
  const c = hi ? COLORS.hi : s.type === "ONE_TIME" ? COLORS.oneTime : COLORS.recurring;
  const start = getStart(s);
  const end = getEnd(s);
  const dur = end - start;
  const compact = dur < 40;
  const medium = dur >= 40 && dur < 75;

  return (
    <div
      className={`absolute group rounded-xl overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:brightness-95 ${c.bg} ${c.text}`}
      style={{ ...style, zIndex: hi ? 10 : 1 }}
      onClick={(e) => { e.stopPropagation(); onEdit(s); }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.bar}`} />
      <div className="pl-3 pr-2 py-1.5 h-full flex flex-col gap-0.5">

        {/* Title row */}
        <div className="flex items-start justify-between gap-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className={`font-bold leading-tight truncate ${compact ? "text-xs" : "text-sm"}`}>{s.title}</p>
              {s.important && <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />}
            </div>
            {!compact && (
              <p className="text-xs opacity-50 mt-0.5">{fmt(start)} – {fmt(end)}</p>
            )}
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(s); }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-white/25 transition-all shrink-0"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>

        {/* Extra details for larger blocks */}
        {!compact && !medium && (
          <div className="space-y-0.5 mt-0.5">
            {s.location && (
              <p className="flex items-center gap-1 text-[11px] opacity-60">
                <MapPin className="w-2.5 h-2.5 shrink-0" />{s.location}
              </p>
            )}
            {s.description && (
              <p className="text-[11px] opacity-50 line-clamp-1">{s.description}</p>
            )}
          </div>
        )}

        {/* Assignment badge */}
        {!compact && s.assignmentId && (
          <button
            onClick={(e) => { e.stopPropagation(); router.push("/assignments"); }}
            className={`mt-auto inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-1 rounded-md w-fit ${c.badge}`}
          >
            <ExternalLink className="w-3.5 h-3.5" /> Assignment
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
interface DailyViewProps {
  initialDate?: Date;
  onEditSchedule: (schedule: Schedule) => void;
  onSlotClick?: (date: Date, startTime: string, endTime: string) => void;
  highlightId?: number | null;
}

function fmtPad(mins: number) {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

function slotFromY(y: number): { startTime: string; endTime: string } {
  const totalMins = START_HOUR * 60 + (y / HOUR_HEIGHT) * 60;
  const rounded = Math.round(totalMins / 15) * 15;
  const startMins = Math.max(Math.min(rounded, (END_HOUR - 1) * 60), START_HOUR * 60);
  const endMins = Math.min(startMins + 60, END_HOUR * 60);
  return { startTime: fmtPad(startMins), endTime: fmtPad(endMins) };
}

export default function DailyView({ initialDate, onEditSchedule, onSlotClick, highlightId }: DailyViewProps) {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useAppSelector((s) => s.schedule);
  const [currentDate, setCurrentDate] = useState<Date>(initialDate ?? new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (initialDate) setCurrentDate(initialDate); }, [initialDate]);

  useEffect(() => {
    const d = format(currentDate, "yyyy-MM-dd");
    dispatch(getMyScheduleAction({ startDate: d, endDate: d }));
  }, [currentDate]);

  // Scroll to current time on mount
  useEffect(() => {
    if (!scrollRef.current) return;
    const now = new Date();
    const offset = ((now.getHours() * 60 + now.getMinutes() - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    scrollRef.current.scrollTop = Math.max(0, offset - 80);
  }, []);

  const isCurrentDay = isToday(currentDate);
  const daySchedules = useMemo(
    () => forDay(schedules, currentDate).sort((a, b) => getStart(a) - getStart(b)),
    [schedules, currentDate],
  );
  const olm = useMemo(() => overlapMap(daySchedules), [daySchedules]);

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowTop = ((nowMins - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const showNow = isCurrentDay && nowMins > START_HOUR * 60 && nowMins < END_HOUR * 60;

  return (
    <div className="space-y-3">
      {/* Nav + date display */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-0.5">
            {format(currentDate, "EEEE")}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${isCurrentDay ? "text-indigo-600" : "text-stone-800"}`}>
              {format(currentDate, "d")}
            </span>
            <span className="text-sm text-stone-500 font-medium">{format(currentDate, "MMMM yyyy")}</span>
            {isCurrentDay && (
              <span className="text-[10px] font-bold text-white bg-indigo-500 px-2 py-0.5 rounded-full">Today</span>
            )}
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            {loading ? "—" : daySchedules.length === 0 ? "Nothing scheduled" : `${daySchedules.length} event${daySchedules.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {!isCurrentDay && (
            <button onClick={() => setCurrentDate(new Date())}
              className="text-xs font-semibold text-stone-600 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors">
              Today
            </button>
          )}
          <button onClick={() => setCurrentDate((d) => subDays(d, 1))} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <label className="relative cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors">
            <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs font-medium text-stone-600">Jump to</span>
            <input type="date" className="absolute inset-0 opacity-0 cursor-pointer w-full"
              value={format(currentDate, "yyyy-MM-dd")}
              onChange={(e) => { if (!e.target.value) return; setCurrentDate(new Date(e.target.value + "T00:00:00")); }} />
          </label>
          <button onClick={() => setCurrentDate((d) => addDays(d, 1))} className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Time grid card */}
      <div className="bg-white border border-stone-300 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-400 text-sm">
            <div className="w-4 h-4 border-2 border-stone-200 border-t-indigo-400 rounded-full animate-spin mr-2" />
            Loading…
          </div>
        ) : (
          <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 560 }}>
            <div className="relative" style={{ height: TOTAL_HEIGHT, display: "grid", gridTemplateColumns: "52px 1fr" }}>

              {/* Time gutter */}
              <div className="relative border-r border-stone-300 bg-white z-10">
                {HOURS.map((h) => (
                  <div key={h} className="absolute right-2 text-[10px] font-medium text-stone-600 -translate-y-1/2 whitespace-nowrap select-none"
                    style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}>
                    {fmtHour(h)}
                  </div>
                ))}
              </div>

              {/* Single day column */}
              <div
                className="relative"
                style={{ cursor: onSlotClick ? "cell" : "default" }}
                onClick={(e) => {
                  if (!onSlotClick) return;
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const { startTime, endTime } = slotFromY(y);
                  onSlotClick(currentDate, startTime, endTime);
                }}
              >
                {/* Hour lines */}
                {HOURS.map((h) => (
                  <div key={h} className="absolute left-0 right-0 border-t border-stone-300" style={{ top: (h - START_HOUR) * HOUR_HEIGHT }} />
                ))}
                {/* Half-hour lines */}
                {HOURS.map((h) => (
                  <div key={`${h}-h`} className="absolute left-0 right-0 border-t border-stone-200" style={{ top: (h - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />
                ))}

                {/* Empty state overlay */}
                {daySchedules.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <CalendarDays className="w-8 h-8 text-stone-200 mx-auto mb-2" />
                      <p className="text-sm font-medium text-stone-300">Nothing scheduled</p>
                      <p className="text-xs text-stone-200">Your day is all yours.</p>
                    </div>
                  </div>
                )}

                {/* Now line */}
                {showNow && (
                  <div className="absolute left-0 right-0 z-20 pointer-events-none flex items-center" style={{ top: nowTop }}>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 -ml-1.5" />
                    <div className="flex-1 border-t-2 border-red-500" />
                  </div>
                )}

                {/* Events */}
                {daySchedules.map((ev) => {
                  const start = getStart(ev);
                  const end = getEnd(ev);
                  const dur = Math.max(end - start, 30);
                  const top = ((start - START_HOUR * 60) / 60) * HOUR_HEIGHT + 1;
                  const height = Math.max((dur / 60) * HOUR_HEIGHT - 2, 28);
                  const { idx, total } = olm.get(ev.id) ?? { idx: 0, total: 1 };
                  const w = 92 / total;
                  const l = 3 + idx * w;
                  return (
                    <DayEventBlock key={ev.id} s={ev} onEdit={onEditSchedule}
                      hi={highlightId != null && ev.id === highlightId}
                      style={{ top, height, left: `${l}%`, width: `${w}%` }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
