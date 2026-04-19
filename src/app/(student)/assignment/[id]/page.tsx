"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAssignmentByIdAction } from "@/app/(student)/assignment/core/action";
import { clearSelectedAssignment } from "@/app/(student)/assignment/core/reducer";
import AssignmentDetailSkeleton from "@/app/Skeleton/AssignmentDetailSkeleton";
import { Calendar, ExternalLink, ArrowLeft } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  OVERDUE: "bg-red-100 text-red-700",
};

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

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Assignment Detail
          </h1>
          <p className="text-sm text-slate-500">
            Overview of assignment information
          </p>
        </div>
      </div>

      {loading && <AssignmentDetailSkeleton />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && !error && selectedAssignment && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* ── Main card ── */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedAssignment.title}
              </h2>
              <p className="text-blue-600 text-sm font-medium">
                {selectedAssignment.subject}
              </p>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {selectedAssignment.description || (
                <span className="text-slate-400 italic">
                  No description provided.
                </span>
              )}
            </p>

            <div
              className={`flex items-center gap-2 text-sm pt-2 ${isOverdue ? "text-red-500" : "text-slate-500"}`}
            >
              <Calendar size={16} />
              <span>Due: {fmt(selectedAssignment.dueDate)}</span>
              {isOverdue && (
                <span className="text-xs font-medium">(Overdue)</span>
              )}
            </div>
          </div>

          {/* ── Side panel ── */}
          <div className="space-y-4">
            {/* Status */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <h3 className="text-sm font-medium text-slate-500">Status</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[selectedAssignment.status] ?? "bg-slate-100 text-slate-600"}`}
              >
                {selectedAssignment.status.replace("_", " ")}
              </span>
            </div>

            {/* Progress */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <h3 className="text-sm font-medium text-slate-500">Progress</h3>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${selectedAssignment.progress}%` }}
                />
              </div>
              <p className="text-sm text-slate-600 font-medium">
                {selectedAssignment.progress}%
              </p>
            </div>

            {/* ── Linked Schedule ── */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <h3 className="text-sm font-medium text-slate-500">
                Linked Schedule
              </h3>

              {selectedAssignment.scheduleId ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Schedule #{selectedAssignment.scheduleId}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Auto-created when this assignment was added. Covers the 1
                    hour leading up to the due date.
                  </p>
                  <button
                    onClick={() =>
                      router.push(
                        `/schedule?highlightId=${selectedAssignment.scheduleId}`,
                      )
                    }
                    className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2.5 rounded-xl text-sm font-medium transition"
                  >
                    <ExternalLink size={14} />
                    View in Schedule
                  </button>
                </>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  No linked schedule found. Try deleting and recreating this
                  assignment.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
