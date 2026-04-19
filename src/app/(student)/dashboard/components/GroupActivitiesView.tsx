const activities = [
  {
    id: 1,
    name: "Emma B.",
    avatar: "EB",
    avatarClass: "bg-indigo-100 text-indigo-600",
    action: "shared a file in",
    target: "Physics Project",
    time: "2h ago",
    iconLabel: "↑",
    iconClass: "bg-indigo-50 text-indigo-500",
  },
  {
    id: 2,
    name: "James K.",
    avatar: "JK",
    avatarClass: "bg-cyan-100 text-cyan-600",
    action: "commented on",
    target: "History Quiz Notes",
    time: "5h ago",
    iconLabel: "✦",
    iconClass: "bg-cyan-50 text-cyan-500",
  },
  {
    id: 3,
    name: "Mia R.",
    avatar: "MR",
    avatarClass: "bg-amber-100 text-amber-600",
    action: "completed task in",
    target: "Math Assignment",
    time: "Yesterday",
    iconLabel: "✓",
    iconClass: "bg-green-50 text-green-500",
  },
];

export default function GroupActivitiesView() {
  return (
    <div className="p-6 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
            Collaboration
          </p>
          <h2 className="text-xl font-bold text-stone-900">Group Activity</h2>
        </div>
        <span className="text-[11px] font-medium text-stone-500 bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-full">
          2 active groups
        </span>
      </div>

      {/* Feed */}
      <ul className="flex flex-col gap-1 flex-1">
        {activities.map((a) => (
          <li
            key={a.id}
            className="group flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {/* Avatar + icon badge */}
            <div className="relative shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold ${a.avatarClass}`}>
                {a.avatar}
              </div>
              <div className={`absolute -bottom-0.5 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold ${a.iconClass}`}>
                {a.iconLabel}
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-stone-600 leading-snug">
                <span className="font-semibold text-stone-900">{a.name}</span>{" "}
                {a.action}{" "}
                <span className="font-semibold text-indigo-600">{a.target}</span>
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">{a.time}</p>
            </div>
          </li>
        ))}
      </ul>

      <a href="#" className="block text-center mt-auto pt-4 text-xs font-semibold text-indigo-600 hover:underline">
        Open study groups →
      </a>
    </div>
  );
}