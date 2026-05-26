const stats = [
  { label: "Upcoming", value: 4, valueClass: "text-indigo-600", bgClass: "bg-indigo-50" },
  { label: "Overdue",  value: 1, valueClass: "text-red-600",    bgClass: "bg-red-50"    },
  { label: "Done",     value: 3, valueClass: "text-green-600",  bgClass: "bg-green-50"  },
];

const recentItem = {
  title: "Year contributions account…",
  subject: "Mathematics",
  due: "Tomorrow",
};

export default function AssignmentStatusView() {
  return (
    <div className="p-6 h-full flex flex-col">

      {/* Header */}
      <div className="mb-5">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
          Status
        </p>
        <h2 className="text-xl font-bold text-stone-900">Assignments</h2>
      </div>

      {/* Stat pills */}
      <div className="flex gap-2 mb-5">
        {stats.map((s) => (
          <div key={s.label} className={`flex-1 rounded-xl px-2 py-3 flex flex-col items-center gap-0.5 ${s.bgClass}`}>
            <span className={`text-2xl font-bold leading-none ${s.valueClass}`}>{s.value}</span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider opacity-70 ${s.valueClass}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-100 mb-4" />

      {/* Recent */}
      <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-2">
        Recent
      </p>
      <div className="flex items-center gap-2.5 bg-stone-50 rounded-xl p-3 cursor-pointer hover:bg-stone-100 transition-colors group">
        <div className="w-7 h-7 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">
          ✓
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-stone-800 truncate">{recentItem.title}</p>
          <p className="text-[11px] text-stone-400 mt-0.5">{recentItem.subject} · Due {recentItem.due}</p>
        </div>
        <span className="text-stone-300 group-hover:text-indigo-500 text-sm transition-colors">→</span>
      </div>

      {/* CTA */}
      <a href="#" className="block text-center mt-auto pt-4 text-xs font-semibold text-indigo-600 hover:underline">
        View all assignments →
      </a>
    </div>
  );
}