const upcoming = [
  {
    id: 1,
    title: "Math Assignment",
    subject: "Mathematics",
    dueLabel: "Due tomorrow",
    tag: "Overdue",
    tagClass: "text-red-600 bg-red-50",
    stripClass: "bg-red-400",
  },
  {
    id: 2,
    title: "History Quiz",
    subject: "History",
    dueLabel: "Due Wednesday",
    tag: "Due soon",
    tagClass: "text-amber-600 bg-amber-50",
    stripClass: "bg-amber-400",
  },
  {
    id: 3,
    title: "Physics Project",
    subject: "Physics",
    dueLabel: "Group · Due Friday",
    tag: "Group",
    tagClass: "text-cyan-600 bg-cyan-50",
    stripClass: "bg-cyan-400",
  },
];

export default function UpComingReport() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-1">
            Upcoming
          </p>
          <h2 className="text-xl font-bold text-stone-900">Deadlines</h2>
        </div>
        <a
          href="#"
          className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          View all →
        </a>
      </div>

      <ul className="flex flex-col gap-1 flex-1">
        {upcoming.map((item) => (
          <li
            key={item.id}
            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors"
          >
            <div className={`w-[3px] self-stretch rounded-full shrink-0 ${item.stripClass}`} />
            <div className="flex-1 min-w-0 pl-1">
              <p className="text-sm font-semibold text-stone-800 truncate leading-snug">
                {item.title}
              </p>
              <p className="text-xs text-stone-400 mt-0.5">
                {item.subject} · {item.dueLabel}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shrink-0 ${item.tagClass}`}
            >
              {item.tag}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
