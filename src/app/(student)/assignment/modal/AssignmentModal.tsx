"use client";

import { useState } from "react";
import { X, BookOpen, Calendar, Tag, AlignLeft, Sparkles, CheckCircle, SkipForward, RefreshCw } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";
import { createAssignmentAction } from "../core/action";
import { CreateAssignmentPayload, Assignments } from "@/types/assignmentType";
import axiosInstance from "@/lib/axios";

interface AssignmentModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const initialForm: CreateAssignmentPayload = {
  title: "",
  description: "",
  subject: "",
  dueDate: "",
};

type Step = "form" | "plan";

export default function AssignmentModal({ onClose, onSuccess }: AssignmentModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error } = useSelector((state: RootState) => state.assignment);

  const [form, setForm] = useState<CreateAssignmentPayload>(initialForm);
  const [step, setStep] = useState<Step>("form");
  const [createdAssignment, setCreatedAssignment] = useState<Assignments | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Step 1 — Create assignment then move to Step 2
  const handleSubmit = async () => {
    if (!form.title || !form.subject || !form.dueDate) return;
    const result = await dispatch(
      createAssignmentAction({ ...form, dueDate: new Date(form.dueDate).toISOString() }),
    );
    if (createAssignmentAction.fulfilled.match(result)) {
      setCreatedAssignment(result.payload);
      onSuccess();
      setStep("plan");
    }
  };

  // Generate plan from backend
  const handleGeneratePlan = async () => {
    if (!createdAssignment) return;
    setPlanLoading(true);
    setPlanError(null);
    try {
      const res = await axiosInstance.post(`/study-plan/${createdAssignment.id}`);
      const generatedPlan: string = res.data.data.plan;
      setPlan(generatedPlan);

      // Save to localStorage so student can recover it if they close the modal
      localStorage.setItem(
        `study-plan-${createdAssignment.id}`,
        JSON.stringify({
          assignmentId: createdAssignment.id,
          generatedAt: new Date().toISOString(),
          plan: generatedPlan,
        }),
      );
    } catch (err) {
      setPlanError("Failed to generate plan. Please try again.");
    } finally {
      setPlanLoading(false);
    }
  };

  // Accept — go to study plan page with plan in localStorage
  const handleAccept = () => {
    if (!createdAssignment) return;
    onClose();
    router.push(`/assignment/${createdAssignment.id}/study-plan`);
  };

  // Edit — same as accept, student edits on the page
  const handleEdit = () => {
    if (!createdAssignment) return;
    onClose();
    router.push(`/assignment/${createdAssignment.id}/study-plan?mode=edit`);
  };

  // Skip — close modal, assignment already saved
  const handleSkip = () => {
    onClose();
  };

  // Check localStorage for existing plan on mount (if modal reopened)
  const checkExistingPlan = (assignmentId: number) => {
    const saved = localStorage.getItem(`study-plan-${assignmentId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setPlan(parsed.plan);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-stone-100">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
              {step === "form" ? "Create" : "AI Study Plan"}
            </p>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              {step === "form" ? (
                <><BookOpen className="w-4 h-4 text-indigo-500" /> New Assignment</>
              ) : (
                <><Sparkles className="w-4 h-4 text-indigo-500" /> Generate Study Plan</>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Step 1: Form ── */}
        {step === "form" && (
          <>
            <div className="px-6 py-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-medium p-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-stone-400" />
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Research JWT authentication"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <Tag className="w-3.5 h-3.5 text-stone-400" />
                  Subject <span className="text-red-400">*</span>
                </label>
                <input
                  name="subject" value={form.subject} onChange={handleChange}
                  placeholder="e.g. IT, Math, Science"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  Due Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="datetime-local" name="dueDate" value={form.dueDate} onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlignLeft className="w-3.5 h-3.5 text-stone-400" />
                  Description <span className="text-stone-300 font-normal normal-case tracking-normal">optional</span>
                </label>
                <textarea
                  name="description" value={form.description} onChange={handleChange}
                  placeholder="Add any details about this assignment…"
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-stone-100">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-sm font-semibold text-stone-600 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !form.title || !form.subject || !form.dueDate}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
              >
                {loading ? "Creating…" : "Create Assignment"}
              </button>
            </div>
          </>
        )}

        {/* ── Step 2: Study Plan ── */}
        {step === "plan" && (
          <>
            <div className="px-6 py-5 space-y-4">
              {/* Success message */}
              <div className="flex items-center gap-3 bg-green-50 border border-green-100 p-3 rounded-xl">
                <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                <p className="text-sm text-green-700 font-medium">
                  Assignment <span className="font-bold">"{createdAssignment?.title}"</span> created!
                </p>
              </div>

              {/* Plan area */}
              {!plan ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto">
                    <Sparkles className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-sm text-stone-600">Let AI generate a study plan based on your assignment details.</p>
                  {planError && (
                    <p className="text-xs text-red-500 font-medium">{planError}</p>
                  )}
                  <button
                    onClick={handleGeneratePlan}
                    disabled={planLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    {planLoading ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate Study Plan</>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Plan display */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 max-h-52 overflow-y-auto">
                    <pre className="text-xs text-indigo-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {plan}
                    </pre>
                  </div>

                  {/* Regenerate */}
                  <button
                    onClick={handleGeneratePlan}
                    disabled={planLoading}
                    className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Regenerate
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-stone-100 space-y-2">
              {plan && (
                <div className="flex gap-2">
                  <button
                    onClick={handleAccept}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Accept Plan
                  </button>
                  <button
                    onClick={handleEdit}
                    className="flex-1 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-semibold transition-colors"
                  >
                    Edit Plan
                  </button>
                </div>
              )}
              <button
                onClick={handleSkip}
                className="w-full py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-stone-600 flex items-center justify-center gap-1.5 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" /> Skip for now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}