import React from 'react';

// This function MUST have 'export default' for Next.js to recognize it as a page
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header section of the inner page */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Hello, Sal Monineath!</h2>
        <p className="text-slate-500">Here is what's happening with your studies today.</p>
      </div>

      {/* Placeholder for your Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Upcoming Assignments</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Courses this Semester</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">6</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm font-medium text-slate-500">Study Groups</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">3</p>
        </div>
      </div>
      
      {/* Placeholder for the Timetable/Schedule */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px] flex items-center justify-center">
        <p className="text-slate-400 italic">Weekly Timetable coming soon...</p>
      </div>
    </div>
  );
}