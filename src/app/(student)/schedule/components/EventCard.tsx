import { Clock, MapPin, Pencil, Star, Trash2 } from "lucide-react";
import { ScheduleItem } from "@/types/scheduleTypes";
import { getColor, getDisplayTime } from "@/lib/schdeulsUtils";

interface Props {
  item: ScheduleItem;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: number) => void;
}

export default function EventCard({ item, onEdit, onDelete }: Props) {
  const c = getColor(item.id);

  return (
    <div
      className={`group flex items-start gap-3 p-3.5 rounded-xl border ${c.bg} ${c.border} transition-all hover:shadow-sm`}
    >
      {/* Color dot */}
      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${c.dot}`} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 text-sm leading-tight">
              {item.title}
            </span>
            {item.isImportant && (
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
            )}
            <span
              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${c.badge}`}
            >
              {item.type === "RECURRING" ? "Weekly" : "One-time"}
            </span>
          </div>

          {/* Action buttons — visible on hover */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-blue-600 transition-all"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-1.5 hover:bg-white rounded-lg text-slate-400 hover:text-red-500 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Time & location row */}
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            {getDisplayTime(item)}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <MapPin className="w-3 h-3" />
            {item.location}
          </span>
        </div>
      </div>
    </div>
  );
}
