import { Star } from "lucide-react";
import { ScheduleItem } from "@/types/scheduleTypes";
import {
  getColor,
  getItemsForDate,
  getMonthGrid,
  isSameDay,
} from "@/lib/utils/schdeulsUtils";

interface Props {
  items: ScheduleItem[];
  year: number;
  month: number;
  today: Date;
  onDayClick: (date: Date) => void;
}

export default function MonthlyView({
  items,
  year,
  month,
  today,
  onDayClick,
}: Props) {
  const grid = getMonthGrid(year, month);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-slate-100">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div
            key={d}
            className="py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {grid.map((date, idx) => {
          // Empty cell (padding before month starts)
          if (!date) {
            return (
              <div
                key={`empty-${idx}`}
                className="h-24 border-b border-r border-slate-50"
              />
            );
          }

          const dayItems = getItemsForDate(items, date);
          const isToday = isSameDay(date, today);
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDayClick(date)}
              className={`h-24 p-2 border-b border-r border-slate-50 text-left flex flex-col
                transition-all hover:bg-slate-50
                ${isWeekend ? "bg-slate-50/50" : ""}`}
            >
              {/* Date number */}
              <span
                className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                ${isToday ? "bg-blue-600 text-white" : "text-slate-600"}`}
              >
                {date.getDate()}
              </span>

              {/* Event badges (max 2 shown) */}
              <div className="mt-1 space-y-0.5 overflow-hidden w-full">
                {dayItems.slice(0, 2).map((item) => {
                  const c = getColor(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${c.bg} ${c.text}`}
                    >
                      {item.isImportant && (
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
                      )}
                      <span className="truncate">{item.title}</span>
                    </div>
                  );
                })}
                {dayItems.length > 2 && (
                  <p className="text-[10px] text-slate-400 px-1">
                    +{dayItems.length - 2} more
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
