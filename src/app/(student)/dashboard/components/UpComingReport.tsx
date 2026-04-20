const upcoming = [
  {
    id: 1,
    title: "Math Assignment",
    due: "Due Tomorrow",
    tag: "Overdue",
    tagClass: "bg-red-50 text-red-600",
    subject: "Mathematics",
    initials: "MA",
    dotColor: "bg-indigo-500",
    avatarClass: "bg-indigo-50 text-indigo-600",
  },
  {
    id: 2,
    title: "History Quiz",
    due: "Wednesday",
    tag: "Due Soon",
    tagClass: "bg-amber-50 text-amber-600",
    subject: "History",
    initials: "HI",
    dotColor: "bg-amber-500",
    avatarClass: "bg-amber-50 text-amber-600",
  },
  {
    id: 3,
    title: "Physics Project",
    due: "Group · Due Friday",
    tag: "Group",
    tagClass: "bg-cyan-50 text-cyan-600",
    subject: "Physics",
    initials: "PH",
    dotColor: "bg-cyan-500",
    avatarClass: "bg-cyan-50 text-cyan-600",
  },
];

export default function UpComingReport() {
  return (
    <div className="p-6 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
            Upcoming
          </p>
          <h2 className="text-xl font-bold text-stone-900">Deadlines</h2>
        </div>
        <a
          href="#"
          className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-full transition-colors"
        >
          View all →
        </a>
      </div>

      {/* List */}
      <ul className="flex flex-col gap-1 flex-1">
        {upcoming.map((item) => (
          <li
            key={item.id}
            className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 ${item.avatarClass}`}>
              {item.initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-semibold text-stone-800 truncate">
                  {item.title}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${item.tagClass}`}>
                  {item.tag}
                </span>
              </div>
              <span className="text-xs text-stone-400">{item.due}</span>
            </div>

            {/* Arrow */}
            <span className="text-stone-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all text-sm">
              →
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}