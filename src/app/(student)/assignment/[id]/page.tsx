"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAssignmentByIdAction } from "@/app/(student)/assignment/core/action";
import { clearSelectedAssignment } from "@/app/(student)/assignment/core/reducer";
import { Calendar } from "lucide-react";

function AssignmentDetailSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-2/3" />
      <div className="h-4 bg-slate-100 rounded w-1/4" />
      <div className="space-y-2 pt-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
      </div>
      <div className="flex gap-3 pt-2">
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
        <div className="h-6 w-20 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const dispatch = useDispatch<AppDispatch>();
  const { selectedAssignment, loading, error } = useSelector(
    (state: RootState) => state.assignment,
  );

  useEffect(() => {
    dispatch(clearSelectedAssignment());
    if (id) {
      dispatch(getAssignmentByIdAction(id));
    }
  }, [id, dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "late":
        return "bg-red-100 text-red-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="min-h-screen space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Assignment Detail
        </h1>
        <p className="text-sm text-slate-500">
          Overview of assignment information
        </p>
      </div>

      {loading && <AssignmentDetailSkeleton />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && !error && selectedAssignment && (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Main Card */}
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
              {selectedAssignment.description}
            </p>

            <div className="flex items-center gap-2 text-slate-500 text-sm pt-2">
              <Calendar size={16} />
              <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            {/* Status Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 space-y-3">
              <h3 className="text-sm font-medium text-slate-500">Status</h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  selectedAssignment.status,
                )}`}
              >
                {selectedAssignment.status}
              </span>
            </div>

            {/* Progress Card */}
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
          </div>
        </div>
      )}
    </div>
  );
}
