"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAssignmentByIdAction } from "@/app/(student)/assignment/core/action";
import { clearSelectedAssignment } from "@/app/(student)/assignment/core/reducer";
import AssignmentDetailSkeleton from "@/app/Skeleton/AssignmentDetailSkeleton";
import { Calendar, ExternalLink, ArrowLeft, AlertCircle } from "lucide-react";

const STATUS_STYLES: Record<string, { badge: string; label: string }> = {
  PENDING:     { badge: "bg-amber-50 text-amber-600 border border-amber-100",   label: "Pending"     },
  IN_PROGRESS: { badge: "bg-indigo-50 text-indigo-600 border border-indigo-100", label: "In Progress" },
  COMPLETED:   { badge: "bg-green-50 text-green-600 border border-green-100",   label: "Completed"   },
  OVERDUE:     { badge: "bg-red-50 text-red-500 border border-red-100",         label: "Overdue"     },
};

const PROGRESS_COLOR = (v: number) =>
  v === 100 ? "bg-green-500" : v >= 60 ? "bg-indigo-500" : v > 0 ? "bg-amber-400" : "bg-stone-200";

export default function AssignmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const dispatch = useDispatch<AppDispatch>();

  const { selectedAssignment, loading, error } = useSelector(
    (state: RootState) => state.assignment,
  );

  useEffect(() => {
    dispatch(clearSelectedAssignment());
    if (id) dispatch(getAssignmentByIdAction(id));
  }, [id, dispatch]);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const isOverdue =
    selectedAssignment &&
    selectedAssignment.status !== "COMPLETED" &&
    new Date(selectedAssignment.dueDate) < new Date();

  const statusStyle = selectedAssignment
    ? STATUS_STYLES[selectedAssignment.status] ?? { badge: "bg-stone-100 text-stone-600 border border-stone-200", label: selectedAssignment.status }
    : null;

  return (
    <div className="min-h-screen bg-stone-50 px-8 py-8">

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-500 hover:bg-stone-100 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
            Assignment
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Detail</h1>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading && <AssignmentDetailSkeleton />}

      {/* ── Error ── */}
      {!loading && error && (
        <div className="bg-white border border-red-100 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-sm font-semibold text-stone-800">Failed to load assignment</p>
            <p className="text-xs text-stone-400 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      {!loading && !error && selectedAssignment && (
        <div className="grid md:grid-cols-3 gap-4">

          {/* ── Main card ── */}
          <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-md transition-shadow space-y-5">

            {/* Title + subject */}
            <div>
              <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">
                {selectedAssignment.subject}
              </p>
              <h2 className="text-2xl font-bold text-stone-900 leading-snug">
                {selectedAssignment.title}
              </h2>
            </div>

            <div className="border-t border-stone-100" />

            {/* Description */}
            <div>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-2">
                Description
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                {selectedAssignment.description || (
                  <span className="italic text-stone-300">No description provided.</span>
                )}
              </p>
            </div>

            <div className="border-t border-stone-100" />

            {/* Due date */}
            <div
              className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-xl ${
                isOverdue
                  ? "bg-red-50 text-red-500"
                  : "bg-stone-50 text-stone-500"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Due {fmt(selectedAssignment.dueDate)}</span>
              {isOverdue && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-500 px-1.5 py-0.5 rounded">
                  Overdue
                </span>
              )}
            </div>
          </div>

          {/* ── Side panel ── */}
          <div className="flex flex-col gap-4">

            {/* Status */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-3">
                Status
              </p>
              {statusStyle && (
                <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg ${statusStyle.badge}`}>
                  {statusStyle.label}
                </span>
              )}
            </div>

            {/* Progress */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-3">
                Progress
              </p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-stone-900">
                  {selectedAssignment.progress}%
                </span>
                <span className="text-xs text-stone-400 mb-1">
                  {selectedAssignment.progress === 100 ? "Complete" : "In progress"}
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${PROGRESS_COLOR(selectedAssignment.progress)}`}
                  style={{ width: `${selectedAssignment.progress}%` }}
                />
              </div>
            </div>

            {/* Linked Schedule */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-3">
                Linked Schedule
              </p>

              {selectedAssignment.scheduleId ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span className="text-sm font-semibold text-stone-700">
                      Schedule #{selectedAssignment.scheduleId}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    Auto-created when this assignment was added. Covers the 1 hour leading up to the due date.
                  </p>
                  <button
                    onClick={() =>
                      router.push(`/schedule?highlightId=${selectedAssignment.scheduleId}`)
                    }
                    className="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View in Schedule
                  </button>
                </div>
              ) : (
                <div className="bg-stone-50 border border-dashed border-stone-200 rounded-xl p-4 text-center">
                  <p className="text-xs text-stone-400 leading-relaxed">
                    No linked schedule found. Try deleting and recreating this assignment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}