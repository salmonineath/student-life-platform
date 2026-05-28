const stats = [
  {
    label: "Upcoming",
    value: 4,
    colorClass: "text-indigo-600",
    bgClass: "bg-indigo-50",
    borderClass: "border-indigo-100",
  },
  {
    label: "Overdue",
    value: 1,
    colorClass: "text-red-600",
    bgClass: "bg-red-50",
    borderClass: "border-red-100",
  },
  {
    label: "Done",
    value: 3,
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-50",
    borderClass: "border-emerald-100",
  },
];

const recentItem = {
  title: "Contribution Accounting",
  subject: "Mathematics",
  due: "Tomorrow",
};

export default function AssignmentStatusView() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-5">
        <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-1">
          Status
        </p>
        <h2 className="text-xl font-bold text-stone-900">Assignments</h2>
      </div>

      <div className="flex gap-2 mb-5">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`flex-1 rounded-xl p-3 flex flex-col items-center gap-1 border ${s.bgClass} ${s.borderClass}`}
          >
            <span className={`text-2xl font-bold leading-none ${s.colorClass}`}>
              {s.value}
            </span>
            <span className={`text-[9px] font-bold uppercase tracking-wider opacity-70 ${s.colorClass}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="h-px bg-stone-100 mb-4" />

      <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-2">
        Recent
      </p>
      <div className="group flex items-center gap-2.5 bg-stone-50 hover:bg-stone-100 rounded-xl p-3 cursor-pointer transition-colors">
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shrink-0">
          ✓
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-stone-800 truncate">
            {recentItem.title}
          </p>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {recentItem.subject} · Due {recentItem.due}
          </p>
        </div>
        <span className="text-stone-300 group-hover:text-indigo-500 text-sm transition-colors">
          →
        </span>
      </div>

      <a
        href="#"
        className="block text-center mt-auto pt-4 text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
      >
        View all →
      </a>
    </div>
  );
}
