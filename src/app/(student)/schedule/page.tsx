import React from "react";
import { Plus, Pencil, Trash2, ChevronDown } from "lucide-react";

export default function WeeklySchedule() {
  // Data structure to match your screenshot
  const scheduleData = [
    {
      day: "Monday",
      events: [
        { time: "08:00 - 09:30", title: "Math", location: "Room 101" },
        { time: "13:00 - 16:00", title: "Study Session", location: "Library" },
      ],
    },
    {
      day: "Tuesday",
      events: [{ time: "14:00 - 15:30", title: "Exercise", location: "Gym" }],
    },
    {
      day: "Wednesday",
      events: [
        { time: "10:00 - 12:00", title: "Coding Practice", location: "Lab 05" },
      ],
    },
    { day: "Thursday", events: [] },
    { day: "Friday", events: [] },
    { day: "Saturday", events: [] },
  ];

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="p-6 mb-4 border border-slate-400 rounded-xl bg-white">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Weekly Schedule
            </h1>
            <p className="text-slate-500 mt-2">
              Set and manage your repeating weekly schedule.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-sm">
            <Plus className="w-5 h-5" />
            Add Schedule
          </button>
        </div>
      </div>

      {/* Days List */}
      <div className="space-y-4">
        {scheduleData.map((item) => (
          <div
            key={item.day}
            className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
          >
            <div className="flex flex-col md:flex-row">
              {/* Day Label */}
              <div className="w-full md:w-48 p-5 bg-white border-b md:border-b-0 md:border-r border-slate-50 flex items-center">
                <span className="font-bold text-slate-700">{item.day}</span>
              </div>

              {/* Events Container */}
              <div className="flex-1 p-2 space-y-2 bg-white">
                {item.events.length > 0 ? (
                  item.events.map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:border-blue-100 transition-colors group"
                    >
                      <div className="flex items-center gap-12">
                        {/* Time and Location */}
                        <div className="w-32">
                          <p className="font-bold text-slate-800 text-sm">
                            {event.time}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {event.location}
                          </p>
                        </div>
                        {/* Title and Secondary Location */}
                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {event.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            {event.location}
                          </p>
                        </div>
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center gap-2 text-slate-400 border-l border-slate-100 pl-4">
                        <button className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="h-4 w-[1px] bg-slate-100 mx-1"></div>
                        <button className="p-2 hover:bg-slate-50 rounded-lg">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  // Empty State for days with no classes
                  <div className="p-5 flex items-center justify-center">
                    <p className="text-slate-400 text-sm italic">No schedule</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
