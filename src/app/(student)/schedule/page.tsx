"use client";

import { Plus } from "lucide-react";

export default function SchedulePage() {

  return (
    <>
      <div className="space-y-8 px-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">My Schedule</h2>
            <p className="text-slate-400 text-sm mt-1">
              Manage and view your personal study schedule
            </p>
          </div>
          <button
            // onClick={() => setScheduleModal({ open: true, item: null })}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700
              text-white px-5 py-3 rounded-xl font-medium text-sm
              transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>
</div>
        
    </>
  );
}
