"use client";

/**
 * ScheduleStats — the three stat cards shown at the top of the schedule page.
 *
 * Reads schedule data directly from Redux so it doesn't need any props.
 * Always shows: Total Events | Weekly Classes | One-time Events
 *
 * Also renders the "Important events" banner if there are any flagged events.
 */

import { Star } from "lucide-react";
import { useAppSelector } from "@/redux/hook";

export default function ScheduleStats() {
  const { schedules, loading } = useAppSelector((s) => s.schedule);

  // Count by type
  const total = schedules.length;
  const recurring = schedules.filter((s) => s.type === "RECURRING").length;
  const oneTime = schedules.filter((s) => s.type === "ONE_TIME").length;
  const important = schedules.filter((s) => s.important).length;

  if (loading) return <StatsSkeleton />;

  return (
    <div className="space-y-3">
      {/* ── Three stat cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm">
        <StatCard value={total} label="Total Events" color="text-blue-600" />
        <StatCard
          value={recurring}
          label="Weekly Classes"
          color="text-purple-500"
        />
        <StatCard
          value={oneTime}
          label="One-time Events"
          color="text-green-500"
        />
      </div>

      {/* ── Important banner — only shown when count > 0 ───────────── */}
      {important > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-amber-200 bg-amber-50 text-sm text-amber-800">
          <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
          <span>
            You have{" "}
            <strong className="font-semibold">{important} important</strong>{" "}
            {important === 1 ? "event" : "events"} this week. Stay on top of
            them!
          </span>
        </div>
      )}
    </div>
  );
}

// ── Single stat card ───────────────────────────────────────────────────────────

interface StatCardProps {
  value: number;
  label: string;
  color: string; // Tailwind text color class
}

function StatCard({ value, label, color }: StatCardProps) {
  return (
    <div className="flex flex-col items-center py-5">
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
      <span className="text-xs text-slate-400 mt-0.5">{label}</span>
    </div>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-3 divide-x divide-slate-100 border border-slate-100 rounded-2xl bg-white overflow-hidden">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col items-center py-5 gap-2">
          <div className="h-8 w-10 bg-slate-100 rounded-lg animate-pulse" />
          <div className="h-3 w-20 bg-slate-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
