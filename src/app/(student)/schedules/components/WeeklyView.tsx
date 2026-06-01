"use client";

import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, CalendarDays, Star, Trash2, ExternalLink } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { useRouter } from "next/navigation";
import { getMyScheduleAction, deleteScheduleAction, updateScheduleAction } from "../core/action";
import { Schedule, OneTimeSchedule, RecurringSchedule, ScheduleUpdateRequest } from "@/types/scheduleTypes";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isToday } from "date-fns";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";

// ── Grid constants ─────────────────────────────────────────────────────────────
const START_HOUR = 7;
const END_HOUR = 22;
const HOUR_HEIGHT = 64;
const TOTAL_HEIGHT = (END_HOUR - START_HOUR) * HOUR_HEIGHT;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
const DRAG_THRESHOLD = 5;

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

function getStart(s: Schedule): number {
  return timeToMins(s.type === "ONE_TIME" ? (s as OneTimeSchedule).startTime : (s as RecurringSchedule).recurringStartTime);
}

function getEnd(s: Schedule): number {
  return timeToMins(s.type === "ONE_TIME" ? (s as OneTimeSchedule).endTime : (s as RecurringSchedule).recurringEndTime);
}

function fmt(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function fmtHour(h: number): string {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h > 12 ? `${h - 12} PM` : `${h} AM`;
}

function fmtPad(mins: number): string {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
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

// ── Colors ─────────────────────────────────────────────────────────────────────
const COLORS = {
  oneTime: {
    bg: "bg-emerald-500", bar: "bg-emerald-700", ring: "ring-emerald-300",
    dropBg: "bg-emerald-50", dropBorder: "border-emerald-400",
  },
  recurring: {
    bg: "bg-violet-500", bar: "bg-violet-700", ring: "ring-violet-300",
    dropBg: "bg-violet-50", dropBorder: "border-violet-400",
  },
  hi: {
    bg: "bg-indigo-600", bar: "bg-indigo-900", ring: "ring-indigo-300",
    dropBg: "bg-indigo-50", dropBorder: "border-indigo-400",
  },
};

// ── Drag state type ────────────────────────────────────────────────────────────
interface DragState {
  schedule: Schedule;
  offsetY: number;
  blockHeight: number;
  duration: number;
  ghostX: number;
  ghostY: number;
  targetDayIndex: number | null;
  targetStartMins: number | null;
}

// ── EventBlock ─────────────────────────────────────────────────────────────────
interface EventBlockProps {
  s: Schedule;
  style: React.CSSProperties;
  onEdit: (s: Schedule) => void;
  onDelete: (s: Schedule) => void;
  hi: boolean;
  isDragging: boolean;
  onDragStart: (e: React.PointerEvent, s: Schedule, offsetY: number) => void;
}

function EventBlock({ s, style, onEdit, onDelete, hi, isDragging, onDragStart }: EventBlockProps) {
  const router = useRouter();
  const c = hi ? COLORS.hi : s.type === "ONE_TIME" ? COLORS.oneTime : COLORS.recurring;
  const start = getStart(s);
  const end = getEnd(s);
  const compact = end - start < 45;

  return (
    <div
      className={`absolute group rounded-lg overflow-hidden select-none
        ${isDragging
          ? "opacity-20 cursor-grabbing pointer-events-none"
          : "cursor-grab hover:shadow-lg hover:brightness-95 transition-all"}
        ${c.bg} text-white`}
      style={{ ...style, zIndex: hi ? 10 : 1 }}
      onPointerDown={(e) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        const rect = e.currentTarget.getBoundingClientRect();
        onDragStart(e, s, e.clientY - rect.top);
      }}
      onClick={(e) => {
        if (isDragging) return;
        e.stopPropagation();
        onEdit(s);
      }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${c.bar}`} />
      <div className="pl-2.5 pr-1 py-1 h-full flex flex-col">
        <div className="flex items-start justify-between gap-0.5">
          <div className="min-w-0">
            <p className={`font-semibold leading-tight truncate ${compact ? "text-[10px]" : "text-[11px]"}`}>
              {s.title}
            </p>
            {!compact && (
              <p className="text-[10px] opacity-50 mt-0.5 leading-none">{fmt(start)}–{fmt(end)}</p>
            )}
          </div>
          {!isDragging && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              {s.assignmentId && (
                <button onClick={(e) => { e.stopPropagation(); router.push("/assignments"); }}
                  className="p-1 rounded-md hover:bg-white/25 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5 text-white/80" />
                </button>
              )}
              <button onClick={(e) => { e.stopPropagation(); onDelete(s); }}
                className="p-1 rounded-md hover:bg-black/20 transition-colors">
                <Trash2 className="w-3.5 h-3.5 text-white/90" />
              </button>
            </div>
          )}
        </div>
        {!compact && s.important && <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 mt-auto" />}
      </div>
    </div>
  );
}

// ── DragGhost ──────────────────────────────────────────────────────────────────
function DragGhost({ drag }: { drag: DragState }) {
  const { schedule, ghostX, ghostY, blockHeight, targetStartMins, duration } = drag;
  const c = schedule.type === "ONE_TIME" ? COLORS.oneTime : COLORS.recurring;
  const targetEndMins = targetStartMins !== null
    ? Math.min(targetStartMins + duration, END_HOUR * 60)
    : null;
  const compact = blockHeight < 36;

  return (
    <div
      className={`fixed pointer-events-none z-50 rounded-lg overflow-hidden shadow-2xl ${c.bg} text-white ring-2 ${c.ring}`}
      style={{ left: ghostX, top: ghostY, width: 140, height: blockHeight, opacity: 0.93 }}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${c.bar}`} />
      <div className="pl-2.5 pr-1 py-1 h-full flex flex-col select-none">
        <p className={`font-semibold leading-tight truncate ${compact ? "text-[10px]" : "text-[11px]"}`}>
          {schedule.title}
        </p>
        {!compact && targetStartMins !== null && targetEndMins !== null && (
          <p className="text-[10px] opacity-90 mt-0.5 leading-none">
            {fmt(targetStartMins)}–{fmt(targetEndMins)}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
interface WeeklyViewProps {
  onDayClick: (date: Date) => void;
  onEditSchedule: (schedule: Schedule) => void;
  onSlotClick?: (date: Date, startTime: string, endTime: string) => void;
  highlightId?: number | null;
}

function fmtPadSlot(mins: number) {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

function slotFromY(y: number): { startTime: string; endTime: string } {
  const totalMins = START_HOUR * 60 + (y / HOUR_HEIGHT) * 60;
  const rounded = Math.round(totalMins / 15) * 15;
  const startMins = Math.max(Math.min(rounded, (END_HOUR - 1) * 60), START_HOUR * 60);
  const endMins = Math.min(startMins + 60, END_HOUR * 60);
  return { startTime: fmtPadSlot(startMins), endTime: fmtPadSlot(endMins) };
}

export default function WeeklyView({ onDayClick, onEditSchedule, onSlotClick, highlightId }: WeeklyViewProps) {
  const dispatch = useAppDispatch();
  const { schedules, loading } = useAppSelector((s) => s.schedule);
  const [toDelete, setToDelete] = useState<Schedule | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [weekStart, setWeekStart] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const scrollRef = useRef<HTMLDivElement>(null);

  // Optimistic overrides for smooth drag UX
  const [localOverrides, setLocalOverrides] = useState<Map<number, Schedule>>(new Map());

  // Drag: ref for logic (no stale closure), state for rendering
  const [dragDisplay, setDragDisplay] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const dragPendingRef = useRef<{
    schedule: Schedule;
    offsetY: number;
    blockHeight: number;
    duration: number;
    startX: number;
    startY: number;
  } | null>(null);
  const daysRef = useRef<Date[]>([]);

  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
  daysRef.current = days;

  useEffect(() => {
    dispatch(getMyScheduleAction({ startDate: format(weekStart, "yyyy-MM-dd"), endDate: format(weekEnd, "yyyy-MM-dd") }));
  }, [weekStart]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const now = new Date();
    const offset = ((now.getHours() * 60 + now.getMinutes() - START_HOUR * 60) / 60) * HOUR_HEIGHT;
    scrollRef.current.scrollTop = Math.max(0, offset - 80);
  }, []);

  const isThisWeek = useMemo(() => {
    return format(weekStart, "yyyy-MM-dd") === format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd");
  }, [weekStart]);

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const nowTop = ((nowMins - START_HOUR * 60) / 60) * HOUR_HEIGHT;
  const showNow = isThisWeek && nowMins > START_HOUR * 60 && nowMins < END_HOUR * 60;

  // Merge redux schedules with optimistic overrides
  const effectiveSchedules = useMemo(() => {
    if (localOverrides.size === 0) return schedules;
    return schedules.map((s) => localOverrides.get(s.id) ?? s);
  }, [schedules, localOverrides]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try { await dispatch(deleteScheduleAction(toDelete.id)).unwrap(); setToDelete(null); }
    catch (e) { console.log(e); }
    finally { setDeleting(false); }
  };

  // Compute target day/time from pointer coordinates
  const computeTarget = useCallback((clientX: number, clientY: number, offsetY: number) => {
    if (!scrollRef.current) return { targetDayIndex: null, targetStartMins: null };
    const rect = scrollRef.current.getBoundingClientRect();
    const scrollTop = scrollRef.current.scrollTop;
    const yInGrid = clientY - rect.top + scrollTop - offsetY;
    const xInContainer = clientX - rect.left;
    if (xInContainer < 52) return { targetDayIndex: null, targetStartMins: null };
    const colWidth = (rect.width - 52) / 7;
    const dayIndex = Math.max(0, Math.min(6, Math.floor((xInContainer - 52) / colWidth)));
    const totalMins = START_HOUR * 60 + (yInGrid / HOUR_HEIGHT) * 60;
    const snapped = Math.round(totalMins / 15) * 15;
    const clamped = Math.max(START_HOUR * 60, Math.min((END_HOUR - 1) * 60, snapped));
    return { targetDayIndex: dayIndex, targetStartMins: clamped };
  }, []);

  // Document-level pointer listeners for drag
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      // Pending → active drag when threshold crossed
      if (dragPendingRef.current && !dragRef.current) {
        const { startX, startY, schedule, offsetY, blockHeight, duration } = dragPendingRef.current;
        if (Math.hypot(e.clientX - startX, e.clientY - startY) < DRAG_THRESHOLD) return;
        const { targetDayIndex, targetStartMins } = computeTarget(e.clientX, e.clientY, offsetY);
        const state: DragState = {
          schedule, offsetY, blockHeight, duration,
          ghostX: e.clientX - 60, ghostY: e.clientY - offsetY,
          targetDayIndex, targetStartMins,
        };
        dragRef.current = state;
        setDragDisplay(state);
        return;
      }
      // Update active drag
      if (dragRef.current) {
        const { offsetY, blockHeight, duration, schedule } = dragRef.current;
        const { targetDayIndex, targetStartMins } = computeTarget(e.clientX, e.clientY, offsetY);
        const state: DragState = {
          schedule, offsetY, blockHeight, duration,
          ghostX: e.clientX - 60, ghostY: e.clientY - offsetY,
          targetDayIndex, targetStartMins,
        };
        dragRef.current = state;
        setDragDisplay({ ...state });
      }
    };

    const onUp = async () => {
      dragPendingRef.current = null;
      const current = dragRef.current;
      dragRef.current = null;
      setDragDisplay(null);
      if (!current) return;

      const { schedule, targetDayIndex, targetStartMins, duration } = current;
      if (targetDayIndex === null || targetStartMins === null) return;

      const targetDay = daysRef.current[targetDayIndex];
      if (!targetDay) return;
      const targetEndMins = Math.min(targetStartMins + duration, END_HOUR * 60);

      // No-op: same day and same start time
      const originalStartMins = getStart(schedule);
      const originalDayIdx = daysRef.current.findIndex((d) =>
        schedule.type === "ONE_TIME"
          ? (schedule as OneTimeSchedule).startTime.slice(0, 10) === format(d, "yyyy-MM-dd")
          : (schedule as RecurringSchedule).dayOfWeek === apiDayOfWeek(d)
      );
      if (originalDayIdx === targetDayIndex && originalStartMins === targetStartMins) return;

      // Build update body
      let body: ScheduleUpdateRequest;
      if (schedule.type === "ONE_TIME") {
        const dateStr = format(targetDay, "yyyy-MM-dd");
        body = {
          startTime: `${dateStr}T${fmtPad(targetStartMins)}:00`,
          endTime: `${dateStr}T${fmtPad(targetEndMins)}:00`,
        };
      } else {
        body = {
          dayOfWeek: apiDayOfWeek(targetDay),
          recurringStartTime: `${fmtPad(targetStartMins)}:00`,
          recurringEndTime: `${fmtPad(targetEndMins)}:00`,
        };
      }

      // Optimistic update
      const optimistic: Schedule = schedule.type === "ONE_TIME"
        ? { ...(schedule as OneTimeSchedule), startTime: body.startTime!, endTime: body.endTime! }
        : {
            ...(schedule as RecurringSchedule),
            dayOfWeek: body.dayOfWeek!,
            recurringStartTime: body.recurringStartTime!,
            recurringEndTime: body.recurringEndTime!,
          };

      setLocalOverrides((m) => new Map(m).set(schedule.id, optimistic));

      try {
        await dispatch(updateScheduleAction({ id: schedule.id, body })).unwrap();
      } catch {
        // revert: removing the override lets Redux's original state show
      } finally {
        setLocalOverrides((m) => { const n = new Map(m); n.delete(schedule.id); return n; });
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };
  }, [computeTarget, dispatch]);

  const handleDragStart = useCallback((e: React.PointerEvent, schedule: Schedule, offsetY: number) => {
    const start = getStart(schedule);
    const end = getEnd(schedule);
    const duration = Math.max(end - start, 30);
    const blockHeight = Math.max((duration / 60) * HOUR_HEIGHT - 2, 22);
    dragPendingRef.current = {
      schedule, offsetY, blockHeight, duration,
      startX: e.clientX, startY: e.clientY,
    };
  }, []);

  const isDraggingAny = dragDisplay !== null;

  return (
    <div className="space-y-3">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-stone-700">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
        </span>
        <div className="flex items-center gap-1.5">
          {!isThisWeek && (
            <button onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
              className="text-xs font-semibold text-stone-600 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors">
              Today
            </button>
          )}
          <button onClick={() => setWeekStart((d) => subWeeks(d, 1))}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <label className="relative cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors">
            <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
            <span className="text-xs font-medium text-stone-600">Jump to</span>
            <input type="date" className="absolute inset-0 opacity-0 cursor-pointer w-full"
              value={format(weekStart, "yyyy-MM-dd")}
              onChange={(e) => {
                if (!e.target.value) return;
                setWeekStart(startOfWeek(new Date(e.target.value + "T00:00:00"), { weekStartsOn: 1 }));
              }} />
          </label>
          <button onClick={() => setWeekStart((d) => addWeeks(d, 1))}
            className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar card */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Day header row */}
        <div className="grid border-b border-stone-300" style={{ gridTemplateColumns: "52px repeat(7, 1fr)" }}>
          <div className="border-r border-stone-300" />
          {days.map((day, i) => {
            const today = isToday(day);
            return (
              <button key={i} onClick={() => onDayClick(day)}
                className={`py-3 flex flex-col items-center gap-0.5 border-l border-stone-300 hover:bg-stone-50 transition-colors ${today ? "bg-indigo-100/50" : ""}`}>
                <span className="text-[10px] font-bold text-stone-600 tracking-widest uppercase">{format(day, "EEE")}</span>
                <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors ${today ? "bg-indigo-600 text-white" : "text-stone-700 hover:bg-stone-100"}`}>
                  {format(day, "d")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time grid — only show full loading spinner on initial empty load */}
        {loading && schedules.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-stone-300 text-sm">
            <div className="w-4 h-4 border-2 border-stone-200 border-t-indigo-400 rounded-full animate-spin mr-2" />
            Loading…
          </div>
        ) : (
          <div ref={scrollRef} className={`overflow-y-auto ${isDraggingAny ? "cursor-grabbing" : ""}`} style={{ maxHeight: 560 }}>
            <div className="relative" style={{ height: TOTAL_HEIGHT, display: "grid", gridTemplateColumns: "52px repeat(7, 1fr)" }}>

              {/* Time gutter */}
              <div className="relative border-r border-stone-300 bg-white z-10">
                {HOURS.map((h) => (
                  <div key={h} className="absolute right-2 text-[10px] font-medium text-stone-600 -translate-y-1/2 whitespace-nowrap select-none"
                    style={{ top: (h - START_HOUR) * HOUR_HEIGHT }}>
                    {fmtHour(h)}
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {days.map((day, di) => {
                const daySched = forDay(effectiveSchedules, day);
                const olm = overlapMap(daySched);
                const today = isToday(day);
                const isDropTarget = dragDisplay?.targetDayIndex === di;
                const dropC = dragDisplay
                  ? (dragDisplay.schedule.type === "ONE_TIME" ? COLORS.oneTime : COLORS.recurring)
                  : COLORS.oneTime;
                const dropTop = dragDisplay?.targetStartMins != null
                  ? ((dragDisplay.targetStartMins - START_HOUR * 60) / 60) * HOUR_HEIGHT
                  : 0;
                const dropHeight = dragDisplay
                  ? Math.max((dragDisplay.duration / 60) * HOUR_HEIGHT - 2, 22)
                  : 0;

                return (
                  <div
                    key={di}
                    className={`relative border-l border-stone-300 ${today ? "bg-indigo-50/25" : ""}`}
                    style={{ cursor: isDraggingAny ? "grabbing" : onSlotClick ? "cell" : "default" }}
                    onClick={(e) => {
                      if (!onSlotClick || isDraggingAny) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const y = e.clientY - rect.top;
                      const { startTime, endTime } = slotFromY(y);
                      onSlotClick(day, startTime, endTime);
                    }}
                  >
                    {/* Hour lines */}
                    {HOURS.map((h) => (
                      <div key={h} className="absolute left-0 right-0 border-t border-stone-300"
                        style={{ top: (h - START_HOUR) * HOUR_HEIGHT }} />
                    ))}
                    {/* Half-hour lines */}
                    {HOURS.map((h) => (
                      <div key={`${h}-h`} className="absolute left-0 right-0 border-t border-stone-200"
                        style={{ top: (h - START_HOUR) * HOUR_HEIGHT + HOUR_HEIGHT / 2 }} />
                    ))}
                    {/* Now indicator */}
                    {today && showNow && (
                      <div className="absolute left-0 right-0 z-20 pointer-events-none flex items-center" style={{ top: nowTop }}>
                        <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 -ml-1" />
                        <div className="flex-1 border-t-2 border-red-500" />
                      </div>
                    )}
                    {/* Drop target indicator */}
                    {isDropTarget && dragDisplay && (
                      <div
                        className={`absolute left-[2%] right-[2%] rounded-md border-2 border-dashed pointer-events-none z-20 ${dropC.dropBg} ${dropC.dropBorder}`}
                        style={{ top: dropTop, height: dropHeight }}
                      />
                    )}
                    {/* Events */}
                    {daySched.map((ev) => {
                      const start = getStart(ev);
                      const end = getEnd(ev);
                      const dur = Math.max(end - start, 30);
                      const top = ((start - START_HOUR * 60) / 60) * HOUR_HEIGHT + 1;
                      const height = Math.max((dur / 60) * HOUR_HEIGHT - 2, 22);
                      const { idx, total } = olm.get(ev.id) ?? { idx: 0, total: 1 };
                      const w = 92 / total;
                      const l = 2 + idx * w;
                      return (
                        <EventBlock
                          key={ev.id}
                          s={ev}
                          onEdit={onEditSchedule}
                          onDelete={(sc) => setToDelete(sc)}
                          hi={highlightId != null && ev.id === highlightId}
                          isDragging={dragDisplay?.schedule.id === ev.id}
                          onDragStart={handleDragStart}
                          style={{ top, height, left: `${l}%`, width: `${w}%` }}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating ghost that follows the cursor */}
      {dragDisplay && <DragGhost drag={dragDisplay} />}

      {toDelete && (
        <DeleteConfirmModal title={toDelete.title} isDeleting={deleting}
          onConfirm={handleDelete} onCancel={() => setToDelete(null)} />
      )}
    </div>
  );
}
