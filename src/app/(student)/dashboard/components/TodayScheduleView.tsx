const schedule = [
  {
    id: 1,
    time: "10:00 AM",
    subject: "English Literature",
    room: "Room 204",
    duration: "60 min",
    accentClass: "bg-indigo-500",
    bgClass: "bg-indigo-50",
    status: "current" as const,
  },
  {
    id: 2,
    time: "1:30 PM",
    subject: "Computer Science",
    room: "Lab 3",
    duration: "90 min",
    accentClass: "bg-cyan-500",
    bgClass: "bg-cyan-50",
    status: "upcoming" as const,
  },
  {
    id: 3,
    time: "3:30 PM",
    subject: "Math Tutorial",
    room: "Room 101",
    duration: "45 min",
    accentClass: "bg-amber-500",
    bgClass: "bg-amber-50",
    status: "upcoming" as const,
  },
];

export default function TodayScheduleView() {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-stone-400 mb-1">
            Today
          </p>
          <h2 className="text-xl font-bold text-stone-900">Schedule</h2>
        </div>
        <a
          href="#"
          className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600 transition-colors"
        >
          Full schedule →
        </a>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        {schedule.map((item) => (
          <div
            key={item.id}
            className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
              item.status === "current"
                ? item.bgClass
                : "hover:bg-stone-50"
            }`}
          >
            <div
              className={`w-[3px] h-10 rounded-full shrink-0 ${item.accentClass} ${
                item.status !== "current"
                  ? "opacity-40 group-hover:opacity-80"
                  : ""
              } transition-opacity`}
            />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-stone-800">{item.subject}</p>
              <p className="text-xs text-stone-400 mt-0.5">
                {item.room} · {item.duration}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-xs font-bold text-stone-700">{item.time}</span>
              {item.status === "current" && (
                <span
                  className={`flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${item.accentClass} text-white`}
                >
                  <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse inline-block" />
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
