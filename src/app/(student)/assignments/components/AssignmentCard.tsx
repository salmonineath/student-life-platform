"use client";

import { Calendar, Edit2, Trash2, ArrowRight, ExternalLink, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Assignments } from "@/types/assignmentType";
import { STATUS_MAP } from "./StatusMap";

const STATUS_CONFIG = {
  pending: {
    accent:  "border-l-indigo-400",
    badge:   "bg-indigo-50 text-indigo-600 border border-indigo-100",
    label:   "Active",
    dot:     "bg-indigo-400",
    bar:     "bg-indigo-500",
  },
  completed: {
    accent:  "border-l-emerald-400",
    badge:   "bg-emerald-50 text-emerald-600 border border-emerald-100",
    label:   "Completed",
    dot:     "bg-emerald-400",
    bar:     "bg-emerald-500",
  },
  late: {
    accent:  "border-l-red-400",
    badge:   "bg-red-50 text-red-500 border border-red-100",
    label:   "Overdue",
    dot:     "bg-red-400",
    bar:     "bg-red-500",
  },
} as const;

function getDaysInfo(dueDate: string, status: string) {
  const now = Date.now();
  const due = new Date(dueDate).getTime();
  const diff = Math.ceil((due - now) / 86_400_000);

  if (status === "COMPLETED") return { label: "Completed", color: "text-emerald-600" };
  if (diff < 0)  return { label: `${Math.abs(diff)}d overdue`, color: "text-red-500" };
  if (diff === 0) return { label: "Due today", color: "text-amber-600" };
  if (diff === 1) return { label: "Due tomorrow", color: "text-amber-500" };
  if (diff <= 7)  return { label: `${diff}d left`, color: "text-amber-500" };
  return { label: `${diff}d left`, color: "text-stone-500" };
}

export default function AssignmentCard({
  assignment,
  index = 0,
  onDeleteClick,
  onEditClick,
}: {
  assignment:    Assignments;
  index?:        number;
  onDeleteClick: (id: number) => void;
  onEditClick:   (assignment: Assignments) => void;
}) {
  const router     = useRouter();
  const mapped     = STATUS_MAP[assignment.status] || "pending";
  const cfg        = STATUS_CONFIG[mapped as keyof typeof STATUS_CONFIG];
  const daysInfo   = getDaysInfo(assignment.dueDate, assignment.status);
  const progress   = assignment.progress ?? 0;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const progressColor =
    progress === 100 ? "bg-emerald-500"
    : progress >= 60  ? "bg-indigo-500"
    : progress > 0    ? "bg-amber-400"
    :                   "bg-stone-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.045, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative bg-white border border-stone-200 border-l-4 ${cfg.accent} rounded-2xl flex flex-col overflow-hidden hover:shadow-[0_6px_28px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-200`}
    >
      {/* ── Body ── */}
      <div
        className="flex-1 flex flex-col px-6 pt-6 pb-5 cursor-pointer"
        onClick={() => router.push(`/assignments/${assignment.id}`)}
      >
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-stone-900 text-[0.95rem] leading-snug line-clamp-2 flex-1">
            {assignment.title}
          </h3>
          <span className={`inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg shrink-0 ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </div>

        {/* Subject chip */}
        {assignment.subject && (
          <span className="inline-flex self-start text-[10px] font-semibold bg-indigo-50 text-indigo-500 px-3 py-1 rounded-full mb-4">
            {assignment.subject}
          </span>
        )}

        {/* Description */}
        <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed flex-1 mb-5">
          {assignment.description || "No description provided."}
        </p>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-stone-400 uppercase tracking-wider text-[10px]">Progress</span>
            <span className={`tabular-nums ${progress === 100 ? "text-emerald-600" : "text-stone-700"}`}>
              {progress}%
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, delay: index * 0.045 + 0.2, ease: "easeOut" }}
              className={`h-2 rounded-full ${progressColor}`}
            />
          </div>
        </div>

        {/* Due date + days info */}
        <div className="flex items-center justify-between text-xs font-medium mt-auto">
          <span className="flex items-center gap-1.5 text-stone-400">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(assignment.dueDate)}
          </span>
          <span className={`flex items-center gap-1.5 ${daysInfo.color} font-semibold`}>
            <Clock className="w-3.5 h-3.5" />
            {daysInfo.label}
          </span>
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex gap-2 px-6 pb-5 pt-4 border-t border-stone-100">
        <button
          onClick={() => router.push(`/assignments/${assignment.id}`)}
          className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-semibold py-2.5 rounded-xl transition-all"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          View Details
        </button>

        {assignment.scheduleId ? (
          <button
            onClick={() =>
              router.push(`/schedules?highlightId=${assignment.scheduleId}&date=${assignment.dueDate.split("T")[0]}`)
            }
            className="flex items-center justify-center bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-500 w-10 rounded-xl transition-all"
            title="View linked schedule"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        ) : null}

        <button
          onClick={() => onEditClick(assignment)}
          className="flex items-center justify-center bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-600 w-10 rounded-xl transition-all"
          title="Edit"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDeleteClick(assignment.id)}
          className="flex items-center justify-center bg-red-50 hover:bg-red-100 active:scale-95 text-red-500 w-10 rounded-xl transition-all"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
