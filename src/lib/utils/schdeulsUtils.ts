import { ScheduleItem } from "@/types/scheduleTypes";

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// ── Color palette, cycles by item id ─────────────────────────────────────────

export const COLORS = [
  {
    bg: "bg-blue-50",
    border: "border-blue-200",
    dot: "bg-blue-500",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    text: "text-violet-700",
    badge: "bg-violet-100 text-violet-700",
  },
  {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-500",
    text: "text-amber-700",
    badge: "bg-amber-100 text-amber-700",
  },
  {
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-500",
    text: "text-rose-700",
    badge: "bg-rose-100 text-rose-700",
  },
  {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    dot: "bg-cyan-500",
    text: "text-cyan-700",
    badge: "bg-cyan-100 text-cyan-700",
  },
];

export function getColor(id: number) {
  return COLORS[id % COLORS.length];
}

// ── Time helpers ──────────────────────────────────────────────────────────────

function parseTime(t: string): { h: number; m: number } {
  const [h, m] = t.split(":").map(Number);
  return { h, m };
}

function to12Hour(t: string): string {
  const { h, m } = parseTime(t);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** Returns how many minutes from midnight — used for sorting events by time */
export function getStartMinutes(item: ScheduleItem): number {
  if (item.type === "RECURRING" && item.recurringStartTime) {
    const { h, m } = parseTime(item.recurringStartTime);
    return h * 60 + m;
  }
  if (item.startTime) {
    const d = new Date(item.startTime);
    return d.getHours() * 60 + d.getMinutes();
  }
  return 0;
}

/** Returns a readable time range string like "8:00 AM – 9:30 AM" */
export function getDisplayTime(item: ScheduleItem): string {
  if (item.type === "RECURRING") {
    const start = item.recurringStartTime
      ? to12Hour(item.recurringStartTime)
      : "";
    const end = item.recurringEndTime ? to12Hour(item.recurringEndTime) : "";
    return start && end ? `${start} – ${end}` : "All day";
  }

  if (item.startTime) {
    const fmt = (d: Date) => {
      const h = d.getHours(),
        m = d.getMinutes();
      return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
    };
    const start = fmt(new Date(item.startTime));
    const end = item.endTime ? fmt(new Date(item.endTime)) : null;
    return end ? `${start} – ${end}` : start;
  }

  return "All day";
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Returns Mon–Sun dates for the week containing the anchor date */
export function getWeekDates(anchor: Date): Date[] {
  const day = anchor.getDay();
  const monday = new Date(anchor);
  monday.setDate(anchor.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

/** Returns the full calendar grid for a month (Mon-based, null = empty cell) */
export function getMonthGrid(year: number, month: number): (Date | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++)
    cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

// ── Filter helpers ────────────────────────────────────────────────────────────

/** Get all items that belong to a specific weekday within a given week */
export function getItemsForWeekday(
  items: ScheduleItem[],
  weekday: number,
  weekDates: Date[],
): ScheduleItem[] {
  return items
    .filter((item) => {
      if (item.type === "RECURRING") return item.dayOfWeek === weekday;
      if (item.startTime) {
        const d = new Date(item.startTime);
        return (
          d.getDay() === weekday && weekDates.some((wd) => isSameDay(wd, d))
        );
      }
      return false;
    })
    .sort((a, b) => getStartMinutes(a) - getStartMinutes(b));
}

/** Get all items that belong to a specific date */
export function getItemsForDate(
  items: ScheduleItem[],
  date: Date,
): ScheduleItem[] {
  return items
    .filter((item) => {
      if (item.type === "RECURRING") return item.dayOfWeek === date.getDay();
      if (item.startTime) return isSameDay(new Date(item.startTime), date);
      return false;
    })
    .sort((a, b) => getStartMinutes(a) - getStartMinutes(b));
}
