import { CalendarDays } from "lucide-react";
import { ScheduleItem } from "@/types/scheduleTypes";
import {
  DAY_FULL,
  MONTH_NAMES,
  getItemsForDate,
  isSameDay,
} from "@/lib/utils/schdeulsUtils";
import EventCard from "./EventCard";

interface Props {
  items: ScheduleItem[];
  date: Date;
  today: Date;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: number) => void;
}

export default function DailyView({
  items,
  date,
  today,
  onEdit,
  onDelete,
}: Props) {
  const dayItems = getItemsForDate(items, date);
  const isToday = isSameDay(date, today);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Day header */}
      <div
        className={`p-6 border-b border-slate-100 ${isToday ? "bg-blue-50" : ""}`}
      >
        <div className="flex items-end gap-3">
          <div>
            <p
              className={`text-sm font-semibold uppercase tracking-widest ${isToday ? "text-blue-500" : "text-slate-400"}`}
            >
              {DAY_FULL[date.getDay()]}
            </p>
            <p
              className={`text-4xl font-bold mt-0.5 ${isToday ? "text-blue-600" : "text-slate-800"}`}
            >
              {date.getDate()}{" "}
              <span className="text-2xl font-medium text-slate-400">
                {MONTH_NAMES[date.getMonth()]} {date.getFullYear()}
              </span>
            </p>
          </div>
          {isToday && (
            <span className="mb-1 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
              Today
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-400">
          {dayItems.length === 0
            ? "Nothing scheduled — enjoy your free day!"
            : `${dayItems.length} event${dayItems.length > 1 ? "s" : ""} scheduled`}
        </p>
      </div>

      {/* Events list */}
      <div className="p-4 space-y-3">
        {dayItems.length > 0 ? (
          dayItems.map((item) => (
            <EventCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-slate-300">
            <CalendarDays className="w-12 h-12 mb-3" />
            <p className="text-sm">No events for this day</p>
          </div>
        )}
      </div>
    </div>
  );
}
