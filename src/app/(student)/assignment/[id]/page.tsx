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
    <div className="bg-white p-6 rounded-2xl shadow space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-6 bg-slate-200 rounded-lg w-2/3" />
        <div className="h-4 bg-slate-100 rounded-lg w-1/4" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-100 rounded w-full" />
        <div className="h-3 bg-slate-100 rounded w-5/6" />
        <div className="h-3 bg-slate-100 rounded w-4/6" />
      </div>
      <div className="h-4 bg-slate-100 rounded w-1/3" />
      <div className="h-4 bg-slate-100 rounded w-1/4" />
      <div className="h-4 bg-slate-100 rounded w-1/4" />
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

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Assignment Detail</h1>

      {loading && <AssignmentDetailSkeleton />}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && !error && selectedAssignment && (
        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {selectedAssignment.title}
            </h2>
            <p className="text-blue-600 font-medium">
              {selectedAssignment.subject}
            </p>
          </div>

          <p className="text-slate-600">{selectedAssignment.description}</p>

          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Calendar size={16} />
            <span>Due: {formatDate(selectedAssignment.dueDate)}</span>
          </div>

          <div className="text-sm text-slate-500">
            Status:{" "}
            <span className="font-medium">{selectedAssignment.status}</span>
          </div>

          <div className="text-sm text-slate-500">
            Progress:{" "}
            <span className="font-medium">{selectedAssignment.progress}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
