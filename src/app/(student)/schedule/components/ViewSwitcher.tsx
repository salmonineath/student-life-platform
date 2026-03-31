import { Calendar, CalendarDays, LayoutList } from "lucide-react";
import { ViewMode } from "@/types/scheduleTypes";

interface Props {
  current: ViewMode;
  onChange: (view: ViewMode) => void;
}

const VIEWS = [
  { id: "weekly" as ViewMode, icon: LayoutList, label: "Weekly" },
  { id: "daily" as ViewMode, icon: CalendarDays, label: "Daily" },
  { id: "monthly" as ViewMode, icon: Calendar, label: "Monthly" },
];

export default function ViewSwitcher({ current, onChange }: Props) {
  return (
    <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1">
      {VIEWS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
            ${
              current === id
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
