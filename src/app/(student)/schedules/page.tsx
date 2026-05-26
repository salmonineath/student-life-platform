"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { Plus } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import { useSearchParams } from "next/navigation";
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

// ✅ Inner component that safely uses useSearchParams()
function ScheduleContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const highlightId = searchParams.get("highlightId")
    ? Number(searchParams.get("highlightId"))
    : null;

  const dateParam = searchParams.get("date");

  const [activeView, setActiveView] = useState<ViewType>("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(
    dateParam ? new Date(dateParam + "T00:00:00") : new Date()
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);

  const didAutoSwitch = useRef(false);
  useEffect(() => {
    if (highlightId && !didAutoSwitch.current) {
      didAutoSwitch.current = true;
      setActiveView("daily");
      if (dateParam) {
        dispatch(getMyScheduleAction({ startDate: dateParam, endDate: dateParam }));
      }
    }
  }, [highlightId]);

  function openCreateModal() {
    setScheduleToEdit(null);
    setModalOpen(true);
  }

  function openEditModal(schedule: Schedule) {
    setScheduleToEdit(schedule);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setScheduleToEdit(null);
  }

  const handleSuccess = useCallback(() => {
    const now = selectedDate;
    if (activeView === "weekly") {
      dispatch(
        getMyScheduleAction({
          startDate: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
          endDate: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        })
      );
    } else if (activeView === "daily") {
      const d = format(now, "yyyy-MM-dd");
      dispatch(getMyScheduleAction({ startDate: d, endDate: d }));
    } else {
      dispatch(
        getMyScheduleAction({
          startDate: format(startOfMonth(now), "yyyy-MM-dd"),
          endDate: format(endOfMonth(now), "yyyy-MM-dd"),
        })
      );
    }
  }, [activeView, selectedDate, dispatch]);

  function handleDayClick(date: Date) {
    setSelectedDate(date);
    setActiveView("daily");
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            My Schedule
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Manage and view your personal study schedule
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-semibold shadow-sm transition-all duration-150"
        >
          <Plus className="w-4 h-4" />
          Add Schedule
        </button>
      </div>

      {highlightId && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-2xl text-sm font-medium">
          <span className="text-blue-500">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1z" />
            </svg>
          </span>
          Showing the schedule linked to your assignment — it's highlighted below.
        </div>
      )}

      <ScheduleStats />
      <ViewTabs activeView={activeView} onChange={setActiveView} />

      <div>
        {activeView === "weekly" && (
          <WeeklyView
            onDayClick={handleDayClick}
            onEditSchedule={openEditModal}
            highlightId={highlightId}
          />
        )}
        {activeView === "daily" && (
          <DailyView
            initialDate={selectedDate}
            onEditSchedule={openEditModal}
            highlightId={highlightId}
          />
        )}
        {activeView === "monthly" && (
          <MonthlyView onDayClick={handleDayClick} highlightId={highlightId} />
        )}
      </div>

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

// ✅ Page component wraps the inner component in Suspense
export default function SchedulePage() {
  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Suspense fallback={<div className="p-8 text-slate-400">Loading schedule…</div>}>
        <ScheduleContent />
      </Suspense>
    </div>
  );
}

// --- ViewTabs (unchanged) ---
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
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${
            activeView === tab.value
              ? "bg-blue-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}