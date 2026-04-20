"use client";

import { useState } from "react";
import { X, BookOpen, Calendar, Tag, AlignLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { createAssignmentAction } from "../core/action";
import { CreateAssignmentPayload } from "@/types/assignmentType";

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

export default function AssignmentModal({ onClose, onSuccess }: AssignmentModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.assignment);
  const [form, setForm] = useState<CreateAssignmentPayload>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.subject || !form.dueDate) return;
    const result = await dispatch(
      createAssignmentAction({ ...form, dueDate: new Date(form.dueDate).toISOString() }),
    );
    if (createAssignmentAction.fulfilled.match(result)) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-stone-100">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 mb-0.5">
              Create
            </p>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              New Assignment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Form ── */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-500 text-xs font-medium p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-stone-400" />
              Title <span className="text-red-400">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Research JWT authentication"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Subject */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5 text-stone-400" />
              Subject <span className="text-red-400">*</span>
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. IT, Math, Science"
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              Due Date <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-600 flex items-center gap-1.5 uppercase tracking-wider">
              <AlignLeft className="w-3.5 h-3.5 text-stone-400" />
              Description{" "}
              <span className="text-stone-300 font-normal normal-case tracking-normal">optional</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add any details about this assignment…"
              rows={3}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex gap-3 px-6 py-4 border-t border-stone-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-sm font-semibold text-stone-600 transition-colors"
          >
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
      </div>
    </div>
  );
}