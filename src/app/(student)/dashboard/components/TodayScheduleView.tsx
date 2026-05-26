const schedule = [
  {
    id: 1,
    time: "10:00 AM",
    subject: "English Literature",
    room: "Room 204",
    duration: "60 min",
    accentClass: "bg-indigo-500",
    status: "current" as const,
  },
  {
    id: 2,
    time: "1:30 PM",
    subject: "Computer Science",
    room: "Lab 3",
    duration: "90 min",
    accentClass: "bg-cyan-500",
    status: "upcoming" as const,
  },
  {
    id: 3,
    time: "3:30 PM",
    subject: "Math Tutorial",
    room: "Room 101",
    duration: "45 min",
    accentClass: "bg-amber-500",
    status: "upcoming" as const,
  },
];

export default function TodayScheduleView() {
  return (
    <div className="p-6 h-full flex flex-col">

      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
            Today
          </p>
          <h2 className="text-xl font-bold text-stone-900">Schedule</h2>
        </div>
        <a
          href="#"
          className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-3 py-1.5 rounded-full transition-colors"
        >
          Full schedule →
        </a>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-2 flex-1">
        {schedule.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-colors cursor-pointer
              ${item.status === "current"
                ? "bg-stone-50 border border-stone-200"
                : "hover:bg-stone-50 border border-transparent"
              }`}
          >
            {/* Left accent bar */}
            <div className={`w-1 h-11 rounded-full shrink-0 ${item.accentClass}`} />

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-800 mb-0.5">
                {item.subject}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-stone-400">
                <span>{item.room}</span>
                <span className="w-1 h-1 rounded-full bg-stone-300 inline-block" />
                <span>{item.duration}</span>
              </div>
            </div>

            {/* Time + badge */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs font-bold text-stone-700">{item.time}</span>
              {item.status === "current" && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-600 text-white px-2 py-0.5 rounded">
                  Now
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}