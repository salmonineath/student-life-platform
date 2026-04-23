"use client";

import { Calendar, Edit2, Trash2, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Assignments } from "@/types/assignmentType";
import StatusBadge from "./StatusBadge";

function ProgressBar({ value }: { value: number }) {
  const color =
    value === 100
      ? "bg-green-500"
      : value >= 60
        ? "bg-indigo-500"
        : value > 0
          ? "bg-amber-400"
          : "bg-stone-200";

  return (
    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
      <div
        className={`h-1.5 rounded-full transition-all duration-300 ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function AssignmentCard({
  assignment,
  onDeleteClick,
}: {
  assignment: Assignments;
  onDeleteClick: (id: number) => void;
}) {
  const router = useRouter();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isOverdue =
    assignment.status !== "COMPLETED" &&
    new Date(assignment.dueDate) < new Date();

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col hover:shadow-lg hover:shadow-stone-100 transition-all duration-200 group">

      {/* ── Top ── */}
      <div className="flex items-start justify-between gap-2 mb-3 cursor-pointer"
           onClick={() => router.push(`/assignment/${assignment.id}`)}>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-2 mb-0.5">
            {assignment.title}
          </h3>
          <p className="text-xs font-semibold text-indigo-500">{assignment.subject}</p>
        </div>
        <StatusBadge status={assignment.status} />
      </div>

      {/* ── Description ── */}
      <p className="text-sm text-stone-400 line-clamp-2 mb-4 flex-1 leading-relaxed">
        {assignment.description || "No description provided."}
      </p>

      {/* ── Progress ── */}
      <div className="mb-4 space-y-1.5">
        <div className="flex justify-between text-xs">
          <span className="text-stone-400 font-medium">Progress</span>
          <span className="font-bold text-stone-700">{assignment.progress}%</span>
        </div>
        <ProgressBar value={assignment.progress} />
      </div>

      {/* ── Due date ── */}
      <div
        className={`flex items-center gap-1.5 text-xs font-medium mb-4 ${
          isOverdue ? "text-red-500" : "text-stone-400"
        }`}
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>Due {formatDate(assignment.dueDate)}</span>
        {isOverdue && (
          <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-500 px-1.5 py-0.5 rounded">
            Overdue
          </span>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-stone-100">
        {assignment.scheduleId ? (
          <button
            onClick={() =>
              router.push(
                `/schedule?highlightId=${assignment.scheduleId}&date=${assignment.dueDate.split("T")[0]}`,
              )
            }
            className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Schedule
          </button>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-1.5 bg-stone-50 text-stone-300 py-2 rounded-xl text-xs font-semibold cursor-not-allowed"
          >
            <Calendar className="w-3.5 h-3.5" />
            Schedule
          </button>
        )}

        <button className="flex-1 flex items-center justify-center gap-1.5 bg-stone-50 hover:bg-stone-100 text-stone-600 py-2 rounded-xl text-xs font-semibold transition-colors">
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>

        <button
          onClick={() => onDeleteClick(assignment.id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 py-2 rounded-xl text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div> 
    </div>
  );
}