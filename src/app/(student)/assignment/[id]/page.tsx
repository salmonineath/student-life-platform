"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getAssignmentByIdAction, updateProgressAction } from "../core/action";
import { clearSelectedAssignment } from "../core/reducer";
import {
  ArrowLeft,
  Calendar,
  Sparkles,
  CheckCircle,
  Clock,
  BookOpen,
  TrendingUp,
  Bell,
  Users,
  ChevronRight,
  Flag,
  UserPlus
} from "lucide-react";
import InviteModal from "../modal/InviteModal";

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING:     { label: "Pending",     className: "bg-amber-50 text-amber-600 border border-amber-200" },
    IN_PROGRESS: { label: "In Progress", className: "bg-indigo-50 text-indigo-600 border border-indigo-200" },
    COMPLETED:   { label: "Completed",   className: "bg-green-50 text-green-600 border border-green-200" },
    OVERDUE:     { label: "Overdue",     className: "bg-red-50 text-red-500 border border-red-200" },
  };
  const s = map[status] ?? map.PENDING;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${s.className}`}>
      {s.label}
    </span>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  const color = value === 100 ? "#22c55e" : value >= 60 ? "#6366f1" : value > 0 ? "#f59e0b" : "#e5e7eb";

  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r={r} fill="none" stroke="#f1f0ea" strokeWidth="10" />
      <circle
        cx="64" cy="64" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 64 64)"
        style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.4s ease" }}
      />
      <text x="64" y="60" textAnchor="middle" fontSize="22" fontWeight="700" fill="#1c1917">
        {value}%
      </text>
      <text x="64" y="76" textAnchor="middle" fontSize="10" fontWeight="500" fill="#a8a29e">
        progress
      </text>
    </svg>
  );
}

const PROGRESS_STEPS = [0, 25, 50, 75, 100];

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAssignment: assignment, loading, error } = useSelector(
    (state: RootState) => state.assignment,
  );

  const [updating, setUpdating] = useState(false);
  const [localProgress, setLocalProgress] = useState<number | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  useEffect(() => {
    if (id) dispatch(getAssignmentByIdAction(Number(id)));
    return () => { dispatch(clearSelectedAssignment()); };
  }, [id, dispatch]);

  useEffect(() => {
    if (assignment) setLocalProgress(assignment.progress);
  }, [assignment]);

  const handleProgressUpdate = async (value: number) => {
    if (!assignment || updating) return;
    setLocalProgress(value);
    setUpdating(true);
    try {
      await dispatch(updateProgressAction({ id: assignment.id, payload: { progress: value } })).unwrap();
    } catch {
      setLocalProgress(assignment.progress);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  const daysUntilDue = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (isNaN(due.getTime())) return null;
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  if (loading || localProgress === null) {
    return (
      <div className="max-w-3xl mx-auto py-10 space-y-4 animate-pulse">
        <div className="h-5 w-32 bg-stone-100 rounded-lg" />
        <div className="h-10 w-2/3 bg-stone-100 rounded-xl" />
        <div className="h-56 bg-stone-100 rounded-2xl" />
        <div className="h-40 bg-stone-100 rounded-2xl" />
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
          <Flag className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-stone-600 font-medium">{error ?? "Assignment not found."}</p>
        <button onClick={() => router.back()} className="text-sm text-indigo-600 font-semibold hover:underline">
          Go back
        </button>
      </div>
    );
  }

  const days = daysUntilDue(assignment.dueDate);
  const isOverdue = assignment.status !== "COMPLETED" && days !== null && days < 0;
  const isDueSoon = !isOverdue && days !== null && days <= 2;
  const progress = localProgress ?? assignment.progress;

  return (
    <div className="space-y-5">

      {/* ── Back ── */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-stone-400 hover:text-stone-700 font-medium transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to assignments
      </button>

      {/* ── Hero card ── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">

        {/* Accent bar */}
        <div className={`h-1.5 w-full ${
          assignment.status === "COMPLETED" ? "bg-green-400" :
          isOverdue ? "bg-red-400" :
          isDueSoon ? "bg-amber-400" :
          "bg-indigo-500"
        }`} />

        <div className="p-7">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-widest uppercase text-indigo-500 mb-1.5">
                {assignment.subject}
              </p>
              <h1 className="text-2xl font-bold text-stone-900 leading-snug">
                {assignment.title}
              </h1>
            </div>
            <StatusPill status={assignment.status} />
          </div>

          {assignment.description && (
            <p className="text-sm text-stone-500 leading-relaxed mt-3">
              {assignment.description}
            </p>
          )}

          {/* Dates row */}
          <div className="flex flex-wrap gap-6 mt-5 pt-5 border-t border-stone-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-stone-400" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Start</p>
                <p className="text-sm font-semibold text-stone-700">{formatDate(assignment.startDate)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                isOverdue ? "bg-red-50 border-red-200" :
                isDueSoon ? "bg-amber-50 border-amber-200" :
                "bg-stone-50 border-stone-200"
              }`}>
                <Flag className={`w-4 h-4 ${isOverdue ? "text-red-400" : isDueSoon ? "text-amber-500" : "text-stone-400"}`} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Due</p>
                <p className={`text-sm font-semibold ${isOverdue ? "text-red-500" : "text-stone-700"}`}>
                  {formatDate(assignment.dueDate)}
                  {isOverdue && <span className="ml-2 text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Overdue</span>}
                  {isDueSoon && !isOverdue && <span className="ml-2 text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Due soon</span>}
                </p>
              </div>
            </div>

            {days !== null && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-stone-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Remaining</p>
                  <p className={`text-sm font-semibold ${isOverdue ? "text-red-500" : "text-stone-700"}`}>
                    {isOverdue ? `${Math.abs(days)} days ago` : days === 0 ? "Due today" : `${days} days left`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Progress + Update ── */}
      <div className="bg-white border border-stone-200 rounded-2xl p-7">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider">Progress</h2>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Ring */}
          <div className="shrink-0">
            <ProgressRing value={progress} />
          </div>

          {/* Steps */}
          <div className="flex-1 w-full space-y-3">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
              Update progress
            </p>
            <div className="flex flex-wrap gap-2">
              {PROGRESS_STEPS.map((step) => (
                <button
                  key={step}
                  onClick={() => handleProgressUpdate(step)}
                  disabled={updating}
                  className={`flex-1 min-w-[60px] py-2.5 rounded-xl text-sm font-bold transition-all border ${
                    progress === step
                      ? step === 100
                        ? "bg-green-500 border-green-500 text-white shadow-sm"
                        : "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                      : "bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100 hover:border-stone-300"
                  } ${updating ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {step === 100 ? (
                    <span className="flex items-center justify-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : `${step}%`}
                </button>
              ))}
            </div>

            {/* Slider for fine control */}
            <div className="pt-2">
              <input
                type="range" min={0} max={100} step={5}
                value={progress}
                onChange={(e) => setLocalProgress(Number(e.target.value))}
                onMouseUp={(e) => handleProgressUpdate(Number((e.target as HTMLInputElement).value))}
                onTouchEnd={(e) => handleProgressUpdate(Number((e.target as HTMLInputElement).value))}
                disabled={updating}
                className="w-full accent-indigo-600 cursor-pointer disabled:opacity-60"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-medium mt-1">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
            </div>

            {progress === 100 && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5 mt-1">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <p className="text-sm text-green-700 font-semibold">Assignment marked as completed!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Action cards row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* AI Study Plan */}
        <button
          onClick={() => router.push(`/assignments/${assignment.id}/study-plan`)}
          className="group bg-white border border-stone-200 hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50 rounded-2xl p-5 text-left transition-all"
        >
          <div className="w-10 h-10 bg-indigo-50 group-hover:bg-indigo-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
            <Sparkles className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-sm font-bold text-stone-800 mb-0.5">AI Study Plan</p>
          <p className="text-xs text-stone-400 leading-relaxed">Generate a personalized plan to finish on time</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-indigo-500 group-hover:gap-2 transition-all">
            Open plan <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Reminders */}
        <button
          onClick={() => router.push(`/assignment/${assignment.id}/reminders`)}
          className="group bg-white border border-stone-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-50 rounded-2xl p-5 text-left transition-all"
        >
          <div className="w-10 h-10 bg-amber-50 group-hover:bg-amber-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
            <Bell className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-sm font-bold text-stone-800 mb-0.5">Reminders</p>
          <p className="text-xs text-stone-400 leading-relaxed">Get alerts before the deadline approaches</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-amber-500 group-hover:gap-2 transition-all">
            Set reminders <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>

        {/* Invite Member */}
<button
  onClick={() => setInviteModalOpen(true)}
  className="group bg-white border border-stone-200 hover:border-purple-300 hover:shadow-md hover:shadow-purple-50 rounded-2xl p-5 text-left transition-all"
>
  <div className="w-10 h-10 bg-purple-50 group-hover:bg-purple-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
    <UserPlus className="w-5 h-5 text-purple-500" />
  </div>
  <p className="text-sm font-bold text-stone-800 mb-0.5">Invite Member</p>
  <p className="text-xs text-stone-400 leading-relaxed">Invite a student to collaborate on this assignment</p>
  <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-purple-500 group-hover:gap-2 transition-all">
    Send invite <ChevronRight className="w-3.5 h-3.5" />
  </div>
</button>

        {/* Group Chat */}
        <button
          onClick={() => router.push(`/groups?assignmentId=${assignment.id}`)}
          className="group bg-white border border-stone-200 hover:border-green-300 hover:shadow-md hover:shadow-green-50 rounded-2xl p-5 text-left transition-all"
        >
          <div className="w-10 h-10 bg-green-50 group-hover:bg-green-100 rounded-xl flex items-center justify-center mb-3 transition-colors">
            <Users className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-sm font-bold text-stone-800 mb-0.5">Group Chat</p>
          <p className="text-xs text-stone-400 leading-relaxed">Collaborate with members on this assignment</p>
          <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-green-600 group-hover:gap-2 transition-all">
            Open chat <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </button>
          {inviteModalOpen && (
  <InviteModal
    assignmentId={assignment.id}
    assignmentTitle={assignment.title}
    onClose={() => setInviteModalOpen(false)}
  />
)}
      </div>

      {/* ── Schedule link ── */}
      {assignment.scheduleId && (
        <button
          onClick={() => router.push(`/schedule?highlightId=${assignment.scheduleId}&date=${assignment.dueDate?.split("T")[0]}`)}
          className="w-full bg-white border border-stone-200 hover:border-indigo-200 hover:shadow-sm rounded-2xl px-6 py-4 flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-stone-800">View in Schedule</p>
              <p className="text-xs text-stone-400">See this assignment on your calendar</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
        </button>
      )}
    </div>
  );
}