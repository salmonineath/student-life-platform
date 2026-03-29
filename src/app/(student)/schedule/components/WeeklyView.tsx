import { ScheduleItem } from "@/types/scheduleTypes";
import { DAY_NAMES, getItemsForWeekday, isSameDay } from "@/lib/schdeulsUtils";
import EventCard from "./EventCard";

interface Props {
  items: ScheduleItem[];
  weekDates: Date[];
  today: Date;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: number) => void;
  onDayClick: (date: Date) => void;
}

export default function WeeklyView({
  items,
  weekDates,
  today,
  onEdit,
  onDelete,
  onDayClick,
}: Props) {
  return (
    <div className="space-y-3">
      {weekDates.map((date) => {
        const weekday = date.getDay();
        const dayItems = getItemsForWeekday(items, weekday, weekDates);
        const isToday = isSameDay(date, today);

        return (
          <div
            key={date.toISOString()}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row">
              {/* Day label — clicking drills into daily view */}
              <button
                onClick={() => onDayClick(date)}
                className={`w-full sm:w-40 p-4 flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1
                  border-b sm:border-b-0 sm:border-r border-slate-100
                  hover:bg-slate-50 transition-colors
                  ${isToday ? "bg-blue-50 sm:bg-blue-50" : ""}`}
              >
                <span
                  className={`text-xs font-semibold uppercase tracking-widest ${isToday ? "text-blue-600" : "text-slate-400"}`}
                >
                  {DAY_NAMES[weekday]}
                </span>
                <span
                  className={`text-2xl font-bold ${isToday ? "text-blue-600" : "text-slate-700"}`}
                >
                  {date.getDate()}
                </span>
                {isToday && (
                  <span className="text-[10px] font-medium text-blue-500 bg-blue-100 px-1.5 py-0.5 rounded-full">
                    Today
                  </span>
                )}
                {dayItems.length > 0 && (
                  <span className="sm:mt-auto text-[11px] text-slate-400">
                    {dayItems.length} event{dayItems.length > 1 ? "s" : ""}
                  </span>
                )}
              </button>

              {/* Events list */}
              <div className="flex-1 p-3 space-y-2">
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
                  <div className="flex items-center justify-center min-h-[56px]">
                    <p className="text-slate-300 text-sm italic">No events</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
