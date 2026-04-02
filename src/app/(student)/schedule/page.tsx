"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Star } from "lucide-react";

import { AppDispatch, RootState } from "@/store/store";
import {
  fetchMySchedule,
  deleteSchedule,
} from "@/features/schedule/scheduleSlice";
import { ScheduleItem, ViewMode } from "@/types/scheduleTypes";
import { DAY_FULL, MONTH_NAMES, getWeekDates } from "@/lib/utils/schdeulsUtils";

import ViewSwitcher from "./components/ViewSwitcher";
import NavControls from "./components/NavControls";
import WeeklyView from "./components/WeeklyView";
import DailyView from "./components/DailyView";
import MonthlyView from "./components/MonthlyView";
import ScheduleModal from "./modal/ScheduleModal";
import DeleteConfirmModal from "./modal/DeleteConfirmModal";

// ─── Date helpers ─────────────────────────────────────────────────────────────

/** Format a Date to "YYYY-MM-DD" for the API */
function toApiDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getWeekRange(anchor: Date): { startDate: string; endDate: string } {
  const dates = getWeekDates(anchor);
  return { startDate: toApiDate(dates[0]), endDate: toApiDate(dates[6]) };
}

function getDayRange(anchor: Date): { startDate: string; endDate: string } {
  const d = toApiDate(anchor);
  return { startDate: d, endDate: d };
}

function getMonthRange(
  year: number,
  month: number,
): { startDate: string; endDate: string } {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  return { startDate: toApiDate(first), endDate: toApiDate(last) };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const today = new Date();
  const dispatch = useDispatch<AppDispatch>();

  const { items, loading } = useSelector((state: RootState) => state.schedule);

  // ── View state ─────────────────────────────────────────────────────────────
  const [view, setView] = useState<ViewMode>("weekly");
  const [anchorDate, setAnchorDate] = useState(today);
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  // ── Modal state ────────────────────────────────────────────────────────────
  const [scheduleModal, setScheduleModal] = useState<{
    open: boolean;
    item: ScheduleItem | null;
  }>({ open: false, item: null });

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    item: ScheduleItem | null;
  }>({ open: false, item: null });

  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch on view/date change ──────────────────────────────────────────────
  const fetchForCurrentView = useCallback(() => {
    let range: { startDate: string; endDate: string };

    if (view === "weekly") range = getWeekRange(anchorDate);
    else if (view === "daily") range = getDayRange(anchorDate);
    else range = getMonthRange(calYear, calMonth);

    dispatch(fetchMySchedule(range));
  }, [view, anchorDate, calYear, calMonth, dispatch]);

  useEffect(() => {
    fetchForCurrentView();
  }, [fetchForCurrentView]);

  // ── Navigation ─────────────────────────────────────────────────────────────
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
      } else {
        setCalMonth((m) => m - 1);
      }
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
      } else {
        setCalMonth((m) => m + 1);
      }
    }
  }

  function goToday() {
    setAnchorDate(today);
    setCalYear(today.getFullYear());
    setCalMonth(today.getMonth());
  }

  function handleDayClick(date: Date) {
    setAnchorDate(date);
    setView("daily");
  }

  // ── Period label ───────────────────────────────────────────────────────────
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

  // ── CRUD handlers ──────────────────────────────────────────────────────────
  function handleEdit(item: ScheduleItem) {
    setScheduleModal({ open: true, item });
  }

  function handleDeleteRequest(item: ScheduleItem) {
    setDeleteModal({ open: true, item });
  }

  async function handleDeleteConfirm() {
    if (!deleteModal.item) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteSchedule(deleteModal.item.id)).unwrap();
      setDeleteModal({ open: false, item: null });
    } catch {
      // error handled by slice; keep modal open
    } finally {
      setIsDeleting(false);
    }
  }

  // ── Summary counts ─────────────────────────────────────────────────────────
  const totalImportant = items.filter((i) => i.important).length;
  const totalRecurring = items.filter((i) => i.type === "RECURRING").length;
  const totalOneTime = items.filter((i) => i.type === "ONE_TIME").length;

  // ── Render ─────────────────────────────────────────────────────────────────
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
          <button
            onClick={() => setScheduleModal({ open: true, item: null })}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow-md"
          >
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

        {/* Important banner */}
        {view === "weekly" && totalImportant > 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
            <p className="text-sm text-amber-700 font-medium">
              You have <strong>{totalImportant} important</strong> event
              {totalImportant > 1 ? "s" : ""} this week. Stay on top of them!
            </p>
          </div>
        )}

        {/* Refetch indicator (navigating while data loads) */}
        {loading && items.length > 0 && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-500 rounded-full animate-spin" />
            Updating…
          </div>
        )}

        {/* View content */}
        {view === "weekly" && (
          <WeeklyView
            items={items}
            weekDates={getWeekDates(anchorDate)}
            today={today}
            onEdit={handleEdit}
            onDelete={(item: any) => handleDeleteRequest(item)}
            onDayClick={handleDayClick}
          />
        )}

        {view === "daily" && (
          <DailyView
            items={items}
            date={anchorDate}
            today={today}
            onEdit={handleEdit}
            onDelete={(item: any) => handleDeleteRequest(item)}
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

      {/* Add / Edit modal */}
      {scheduleModal.open && (
        <ScheduleModal
          item={scheduleModal.item}
          onClose={() => setScheduleModal({ open: false, item: null })}
          onSuccess={fetchForCurrentView}
        />
      )}

      {/* Delete confirm modal */}
      {deleteModal.open && deleteModal.item && (
        <DeleteConfirmModal
          title={deleteModal.item.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModal({ open: false, item: null })}
          isDeleting={isDeleting}
        />
      )}
    </>
  );
}
