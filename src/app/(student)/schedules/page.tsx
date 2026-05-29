"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { motion } from "motion/react";
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
import ScheduleModal from "./modal/ScheduleModal";

type ViewType = "weekly" | "daily" | "monthly";

interface PrefillData {
  date?: string;       // "YYYY-MM-DD"
  startTime?: string;  // "HH:mm"
  endTime?: string;    // "HH:mm"
}

function ScheduleContent() {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();

  const highlightId = searchParams.get("highlightId")
    ? Number(searchParams.get("highlightId"))
    : null;
  const dateParam = searchParams.get("date");

  const [activeView, setActiveView] = useState<ViewType>("weekly");
  const [selectedDate, setSelectedDate] = useState<Date>(
    dateParam ? new Date(dateParam + "T00:00:00") : new Date(),
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [scheduleToEdit, setScheduleToEdit] = useState<Schedule | null>(null);
  const [prefillData, setPrefillData] = useState<PrefillData | null>(null);

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

  function openCreateModal(prefill?: PrefillData) {
    setScheduleToEdit(null);
    setPrefillData(prefill ?? null);
    setModalOpen(true);
  }

  function openEditModal(schedule: Schedule) {
    setScheduleToEdit(schedule);
    setPrefillData(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setScheduleToEdit(null);
    setPrefillData(null);
  }

  // Called when user clicks a time slot in Weekly or Daily view
  function handleSlotClick(date: Date, startTime: string, endTime: string) {
    openCreateModal({ date: format(date, "yyyy-MM-dd"), startTime, endTime });
  }

  // Called when user clicks an empty day cell in Monthly view
  function handleDayCreate(date: Date) {
    openCreateModal({ date: format(date, "yyyy-MM-dd") });
  }

  const handleSuccess = useCallback(() => {
    const now = selectedDate;
    if (activeView === "weekly") {
      dispatch(getMyScheduleAction({
        startDate: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        endDate: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
      }));
    } else if (activeView === "daily") {
      const d = format(now, "yyyy-MM-dd");
      dispatch(getMyScheduleAction({ startDate: d, endDate: d }));
    } else {
      dispatch(getMyScheduleAction({
        startDate: format(startOfMonth(now), "yyyy-MM-dd"),
        endDate: format(endOfMonth(now), "yyyy-MM-dd"),
      }));
    }
  }, [activeView, selectedDate, dispatch]);

  function handleDayClick(date: Date) {
    setSelectedDate(date);
    setActiveView("daily");
  }

  return (
    <>
      {/* ── Sticky Header + Tabs ── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="sticky top-16 z-10 -mx-6 -mt-6 px-6 pt-6 pb-0 bg-gray-100"
      >
        {/* Title row */}
        <div className="pb-4">
          <p className="text-xs font-medium text-stone-400 tracking-widest uppercase mb-1.5">
            Schedule
          </p>
          <h1
            className="text-[1.9rem] font-bold text-stone-900 leading-tight tracking-tight"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            My Schedule
          </h1>
          <p className="text-sm text-stone-400 mt-1">
            {format(selectedDate, "EEEE, MMMM d")} &mdash; click any slot to add an event.
          </p>
        </div>

        {/* View tabs — underline style, acts as the bottom border of the sticky block */}
        <ViewTabs activeView={activeView} onChange={setActiveView} />
      </motion.header>

      {/* ── Content ── */}
      <div className="mt-5">
        {highlightId && (
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-2xl text-sm font-medium mb-5">
            <svg className="w-4 h-4 text-indigo-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6 2a1 1 0 0 0-1 1v1H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1V3a1 1 0 1 0-2 0v1H7V3a1 1 0 0 0-1-1z" />
            </svg>
            Showing the schedule linked to your assignment — it&apos;s highlighted below.
          </div>
        )}

        {activeView === "weekly" && (
          <WeeklyView
            onDayClick={handleDayClick}
            onEditSchedule={openEditModal}
            onSlotClick={handleSlotClick}
            highlightId={highlightId}
          />
        )}
        {activeView === "daily" && (
          <DailyView
            initialDate={selectedDate}
            onEditSchedule={openEditModal}
            onSlotClick={handleSlotClick}
            highlightId={highlightId}
          />
        )}
        {activeView === "monthly" && (
          <MonthlyView
            onDayClick={handleDayClick}
            onDayCreate={handleDayCreate}
            highlightId={highlightId}
          />
        )}
      </div>

      {modalOpen && (
        <ScheduleModal
          scheduleToEdit={scheduleToEdit}
          prefill={prefillData ?? undefined}
          onClose={closeModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

export default function SchedulePage() {
  return (
    <Suspense fallback={<div className="p-8 text-stone-400">Loading schedule…</div>}>
      <ScheduleContent />
    </Suspense>
  );
}

// ── View tab bar ───────────────────────────────────────────────────────────────
interface ViewTabsProps {
  activeView: ViewType;
  onChange: (view: ViewType) => void;
}

const TABS: { label: string; value: ViewType }[] = [
  { label: "Weekly", value: "weekly" },
  { label: "Daily",  value: "daily"  },
  { label: "Monthly", value: "monthly" },
];

function ViewTabs({ activeView, onChange }: ViewTabsProps) {
  return (
    <div className="flex -mx-6 px-6 border-b border-stone-200 gap-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all duration-150 cursor-pointer ${
            activeView === tab.value
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
