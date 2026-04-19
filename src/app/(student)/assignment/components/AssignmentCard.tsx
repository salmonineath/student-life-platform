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
        ? "bg-blue-500"
        : value > 0
          ? "bg-amber-500"
          : "bg-border";

  return (
    <div className="w-full bg-border/60 rounded-full h-1.5 overflow-hidden">
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
    <div className="bg-card border border-border/60 rounded-3xl p-6 flex flex-col hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 pr-2">
            {assignment.title}
          </h3>
          <p className="text-primary font-medium text-sm mt-1">
            {assignment.subject}
          </p>
        </div>
        <StatusBadge status={assignment.status} />
      </div>

      <p className="text-muted-foreground text-sm line-clamp-3 mb-5 flex-1">
        {assignment.description}
      </p>

      {/* Progress */}
      <div className="mb-5 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium">{assignment.progress}%</span>
        </div>
        <ProgressBar value={assignment.progress} />
      </div>

      {/* Due date */}
      <div
        className={`flex items-center gap-2 text-sm mb-6 ${
          isOverdue ? "text-destructive" : "text-muted-foreground"
        }`}
      >
        <Calendar className="h-4 w-4" />
        Due: {formatDate(assignment.dueDate)}
        {isOverdue && <span className="text-xs font-medium">(Overdue)</span>}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-border/60">
        {assignment.scheduleId ? (
          <button
            onClick={() =>
              router.push(`/schedule?highlightId=${assignment.scheduleId}&date=${assignment.dueDate.split("T")[0]}`)
            }
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary/10 hover:bg-primary/15 text-primary py-2.5 rounded-2xl text-sm font-medium transition"
          >
            <ExternalLink className="h-4 w-4" />
            Schedule
          </button>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-1.5 bg-muted text-muted-foreground py-2.5 rounded-2xl text-sm font-medium cursor-not-allowed"
          >
            <Calendar className="h-4 w-4" />
            Schedule
          </button>
        )}

        <button className="flex-1 flex items-center justify-center gap-1.5 bg-muted hover:bg-muted/80 text-foreground py-2.5 rounded-2xl text-sm font-medium transition">
          <Edit2 className="h-4 w-4" /> Edit
        </button>

        <button
          onClick={() => onDeleteClick(assignment.id)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-destructive/10 hover:bg-destructive/15 text-destructive py-2.5 rounded-2xl text-sm font-medium transition"
        >
          <Trash2 className="h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  );
}
