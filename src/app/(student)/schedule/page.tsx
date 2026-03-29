"use client";

import { useEffect, useState } from "react";
import { Plus, Star } from "lucide-react";

import { ScheduleItem, ViewMode } from "@/types/scheduleTypes";
import { DAY_FULL, MONTH_NAMES, getWeekDates } from "@/lib/schdeulsUtils";

import ViewSwitcher from "./components/ViewSwitcher";
import NavControls from "./components/NavControls";
import WeeklyView from "./components/WeeklyView";
import DailyView from "./components/DailyView";
import MonthlyView from "./components/MonthlyView";

export default function SchedulePage() {
  const today = new Date();

  const [view, setView] = useState<ViewMode>("weekly");
  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [anchorDate, setAnchorDate] = useState(today); // used by weekly & daily
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  // ── Load mock data ──────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/schedule.json");
        const json = await res.json();
        setItems(json.data.items);
      } catch (e) {
        console.error("Failed to load schedule:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────────
  function goBack() {
    if (view === "weekly") {
      const d = new Date(anchorDate);
      d.setDate(d.getDate() - 7);
      setAnchorDate(d);
    } else if (view === "daily") {
      const d = new Date(anchorDate);
      d.setDate(d.getDate() - 1);
      setAnchorDate(d);
    } else {
      if (calMonth === 0) {
        setCalYear((y) => y - 1);
        setCalMonth(11);
      } else setCalMonth((m) => m - 1);
    }
  }

  function goForward() {
    if (view === "weekly") {
      const d = new Date(anchorDate);
      d.setDate(d.getDate() + 7);
      setAnchorDate(d);
    } else if (view === "daily") {
      const d = new Date(anchorDate);
      d.setDate(d.getDate() + 1);
      setAnchorDate(d);
    } else {
      if (calMonth === 11) {
        setCalYear((y) => y + 1);
        setCalMonth(0);
      } else setCalMonth((m) => m + 1);
    }
  }

  function goToday() {
    setAnchorDate(today);
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
  }

  // Clicking a day in weekly/monthly jumps to that day in daily view
  function handleDayClick(date: Date) {
    setAnchorDate(date);
    setView("daily");
  }

  // ── Period label shown in the nav bar ───────────────────────────────────────
  function getPeriodLabel(): string {
    if (view === "weekly") {
      const dates = getWeekDates(anchorDate);
      const first = dates[0];
      const last = dates[6];
      if (first.getMonth() === last.getMonth()) {
        return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
      }
      return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}, ${last.getFullYear()}`;
    }
    if (view === "daily") {
      return `${DAY_FULL[anchorDate.getDay()]}, ${MONTH_NAMES[anchorDate.getMonth()]} ${anchorDate.getDate()}, ${anchorDate.getFullYear()}`;
    }
    return `${MONTH_NAMES[calMonth]} ${calYear}`;
  }

  // ── Summary counts ──────────────────────────────────────────────────────────
  const totalImportant = items.filter((i) => i.isImportant).length;
  const totalRecurring = items.filter((i) => i.type === "RECURRING").length;
  const totalOneTime = items.filter((i) => i.type === "ONE_TIME").length;

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400 text-sm">Loading your schedule…</p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">My Schedule</h2>
            <p className="text-slate-400 text-sm mt-1">
              Manage and view your personal study schedule
            </p>
          </div>
          <button className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md">
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Events",
              value: items.length,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Weekly Classes",
              value: totalRecurring,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
            {
              label: "One-time Events",
              value: totalOneTime,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`${stat.bg} rounded-2xl p-4 text-center`}
            >
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* View switcher + navigation */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <ViewSwitcher current={view} onChange={setView} />
          <NavControls
            label={getPeriodLabel()}
            onPrev={goBack}
            onNext={goForward}
            onToday={goToday}
          />
        </div>

        {/* Important events banner (weekly only) */}
        {view === "weekly" && totalImportant > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <p className="text-sm text-amber-700 font-medium">
              You have <strong>{totalImportant} important</strong> event
              {totalImportant > 1 ? "s" : ""} this week. Stay on top of them!
            </p>
          </div>
        )}

        {/* View content */}
        {view === "weekly" && (
          <WeeklyView
            items={items}
            weekDates={getWeekDates(anchorDate)}
            today={today}
            onEdit={(item) => console.log("edit", item)}
            onDelete={(id) => console.log("delete", id)}
            onDayClick={handleDayClick}
          />
        )}

        {view === "daily" && (
          <DailyView
            items={items}
            date={anchorDate}
            today={today}
            onEdit={(item) => console.log("edit", item)}
            onDelete={(id) => console.log("delete", id)}
          />
        )}

        {view === "monthly" && (
          <MonthlyView
            items={items}
            year={calYear}
            month={calMonth}
            today={today}
            onDayClick={handleDayClick}
          />
        )}
      </div>
    </>
  );
}
