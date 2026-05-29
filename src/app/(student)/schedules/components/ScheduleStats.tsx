"use client";

import { Star, CalendarDays, RefreshCw, Clock } from "lucide-react";
import { useAppSelector } from "@/redux/hook";

export default function ScheduleStats() {
  const { schedules, loading } = useAppSelector((s) => s.schedule);

  const total = schedules.length;
  const recurring = schedules.filter((s) => s.type === "RECURRING").length;
  const oneTime = schedules.filter((s) => s.type === "ONE_TIME").length;
  const important = schedules.filter((s) => s.important).length;

  if (loading) return <StatsSkeleton />;

  const cards = [
    { label: "Total",       value: total,     icon: CalendarDays, color: "text-indigo-600",  bg: "bg-indigo-50"  },
    { label: "Recurring",   value: recurring, icon: RefreshCw,    color: "text-violet-600",  bg: "bg-violet-50"  },
    { label: "One-time",    value: oneTime,   icon: Clock,        color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Important",   value: important, icon: Star,         color: "text-amber-600",   bg: "bg-amber-50"   },
  ];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white border border-stone-200 rounded-2xl px-5 py-4 hover:shadow-md hover:shadow-stone-100 transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold tracking-widest uppercase text-stone-400">{label}</p>
              <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {important > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
          <span>
            You have <strong className="font-semibold">{important} important</strong> {important === 1 ? "event" : "events"} — stay on top of them.
          </span>
        </div>
      )}
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bg-white border border-stone-200 rounded-2xl px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-2.5 w-16 bg-stone-100 rounded animate-pulse" />
            <div className="h-7 w-7 bg-stone-100 rounded-lg animate-pulse" />
          </div>
          <div className="h-8 w-10 bg-stone-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
