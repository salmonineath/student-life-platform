"use client";

/**
 * Schedule Page — top-level controller for the schedule feature.
 *
 * Responsibilities:
 *  1. Track active view: "weekly" | "daily" | "monthly"
 *  2. Track selected date so clicking a day in Weekly/Monthly
 *     jumps to Daily view for that exact date.
 *  3. Control the ScheduleModal — open for create OR edit.
 *  4. After any successful create/edit/delete, re-fetch the
 *     current view's schedules so the list stays fresh.
 *
 * Modal state:
 *  modalOpen      — whether the modal is visible
 *  scheduleToEdit — null = create mode, Schedule = edit mode
 */

import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { getMyScheduleAction } from "./core/action";
import { Schedule } from "@/types/scheduleTypes";

import WeeklyView from "./components/WeeklyView";
import DailyView from "./components/DailyView";
import MonthlyView from "./components/MonthlyView";
import ScheduleStats from "./components/ScheduleStats";
import ScheduleModal from "./modal/ScheduleModal";

type ViewType = "weekly" | "daily" | "monthly";

export default function SchedulePage() {
  const dispatch = useAppDispatch();

  // ── View & date state ────────────────────────────────────────────────────────
  const [activeView, setActiveView] = useState<ViewType>("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // ── Modal state ──────────────────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);

  /** Open modal in create mode */
  function openCreateModal() {
    setScheduleToEdit(null);
    setModalOpen(true);
  }

  /** Open modal in edit mode with a pre-filled schedule */
  function openEditModal(schedule: Schedule) {
    setScheduleToEdit(schedule);
    setModalOpen(true);
  }

  /** Close modal and reset edit target */
  function closeModal() {
    setModalOpen(false);
    setScheduleToEdit(null);
  }

  /**
   * Called after a successful create / edit / delete.
   * Re-fetches the schedules for whichever view is currently active
   * so the list reflects the latest data from the server.
   */
  const handleSuccess = useCallback(() => {
    const now = selectedDate;

    if (activeView === "weekly") {
      const start = startOfWeek(now, { weekStartsOn: 1 });
      const end = endOfWeek(now, { weekStartsOn: 1 });
      dispatch(
        getMyScheduleAction({
          startDate: format(start, "yyyy-MM-dd"),
          endDate: format(end, "yyyy-MM-dd"),
        }),
      );
    } else if (activeView === "daily") {
      const dateStr = format(now, "yyyy-MM-dd");
      dispatch(getMyScheduleAction({ startDate: dateStr, endDate: dateStr }));
    } else {
      const start = startOfMonth(now);
      const end = endOfMonth(now);
      dispatch(
        getMyScheduleAction({
          startDate: format(start, "yyyy-MM-dd"),
          endDate: format(end, "yyyy-MM-dd"),
        }),
      );
    }
  }, [activeView, selectedDate, dispatch]);

  /**
   * Called when user clicks a day in Weekly or Monthly view.
   * Switches to Daily and shows that day's schedule.
   */
  function handleDayClick(date: Date) {
    setSelectedDate(date);
    setActiveView("daily");
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <div className="space-y-6">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              My Schedule
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage and view your personal study schedule
            </p>
          </div>

          {/* Opens the modal in create mode */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            Add Schedule
          </button>
        </div>

        {/* ── Stats + Important Banner ────────────────────────────────── */}
        <ScheduleStats />

        {/* ── Tab Switcher ────────────────────────────────────────────── */}
        <ViewTabs activeView={activeView} onChange={setActiveView} />

        {/* ── Active View ─────────────────────────────────────────────── */}
        <div>
          {activeView === "weekly" && (
            <WeeklyView
              onDayClick={handleDayClick}
              onEditSchedule={openEditModal}
            />
          )}

          {activeView === "daily" && (
            <DailyView
              initialDate={selectedDate}
              onEditSchedule={openEditModal}
            />
          )}

          {activeView === "monthly" && (
            <MonthlyView onDayClick={handleDayClick} />
          )}
        </div>
      </div>

      {/* ── Schedule Modal ──────────────────────────────────────────────── */}
      {/*
        Rendered outside the content div so it sits above everything.
        Only mounted when open so form state resets cleanly each time.
      */}
      {modalOpen && (
        <ScheduleModal
          scheduleToEdit={scheduleToEdit}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}

// ── Tab Switcher ───────────────────────────────────────────────────────────────

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
