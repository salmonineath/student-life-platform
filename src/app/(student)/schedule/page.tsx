"use client";

/**
 * Schedule Page — the top-level controller for the schedule feature.
 *
 * Responsibilities:
 *  1. Track which view is active: "weekly" | "daily" | "monthly"
 *  2. Track the "selected date" so clicking a day in Weekly/Monthly
 *     can jump to Daily view for that exact date.
 *  3. Render the shared header (tabs + stats + date nav) and the
 *     correct view component based on activeView.
 *
 * Data flow (props-down pattern):
 *  page → WeeklyView  : onDayClick(date) → switches tab + sets selectedDate
 *  page → MonthlyView : onDayClick(date) → same
 *  page → DailyView   : initialDate      → which day to show first
 */

import { useState } from "react";
import { Plus } from "lucide-react";

import WeeklyView from "./components/WeeklyView";
import DailyView from "./components/DailyView";
import MonthlyView from "./components/MonthlyView";
import ScheduleStats from "./components/ScheduleStats";

// The three possible views the user can switch between
type ViewType = "weekly" | "daily" | "monthly";

export default function SchedulePage() {
  // Which tab is currently showing
  const [activeView, setActiveView] = useState<ViewType>("weekly");

  // When user clicks a day in Weekly or Monthly, we store it here
  // and switch to Daily view to show that day's schedule
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  /**
   * Called by WeeklyView and MonthlyView when the user clicks on a day.
   * Switches the active tab to "daily" and passes the clicked date down.
   */
  function handleDayClick(date: Date) {
    setSelectedDate(date);
    setActiveView("daily");
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="space-y-6">
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              My Schedule
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage and view your personal study schedule
            </p>
          </div>

          {/* Add Schedule button — modal wired up later */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all duration-150">
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>

        {/* ── Stats Bar (total / weekly / one-time counts) ─────────── */}
        {/*
          ScheduleStats pulls data from Redux itself.
          We render it here so it's always visible regardless of active view.
        */}
        <ScheduleStats />

        {/* ── Tab Switcher ─────────────────────────────────────────── */}
        <ViewTabs activeView={activeView} onChange={setActiveView} />

        {/* ── Active View ──────────────────────────────────────────── */}
        <div>
          {activeView === "weekly" && (
            <WeeklyView onDayClick={handleDayClick} />
          )}

          {activeView === "daily" && (
            /*
              Pass selectedDate so Daily view knows which day to show.
              If user switched to Daily without clicking a specific day
              (e.g. clicked the tab directly), selectedDate defaults to today.
            */
            <DailyView initialDate={selectedDate} />
          )}

          {activeView === "monthly" && (
            <MonthlyView onDayClick={handleDayClick} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tab Switcher Component ─────────────────────────────────────────────────────

/**
 * The three tabs: Weekly / Daily / Monthly.
 * Receives the current view and a setter so clicking a tab updates the page.
 */
interface ViewTabsProps {
  activeView: ViewType;
  onChange: (view: ViewType) => void;
}

const TABS: { label: string; value: ViewType }[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Daily", value: "daily" },
  { label: "Monthly", value: "monthly" },
];

function ViewTabs({ activeView, onChange }: ViewTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white border border-slate-100 rounded-xl w-fit shadow-sm">
      {TABS.map((tab) => {
        const isActive = activeView === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150
              ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
