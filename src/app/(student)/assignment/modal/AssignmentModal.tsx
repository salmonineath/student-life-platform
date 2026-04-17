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

export default function AssignmentModal({
  onClose,
  onSuccess,
}: AssignmentModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(
    (state: RootState) => state.assignment,
  );
  const [form, setForm] = useState<CreateAssignmentPayload>(initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.subject || !form.dueDate) return;
    const result = await dispatch(
      createAssignmentAction({
        ...form,
        dueDate: new Date(form.dueDate).toISOString(),
      }),
    );
    if (createAssignmentAction.fulfilled.match(result)) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600 w-5 h-5" />
            <h2 className="text-lg font-semibold text-slate-800">
              New Assignment
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Title{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Research JWT"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" /> Subject{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="e.g. IT, Math, Science"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Due Date{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5" /> Description{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add any details about this assignment..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !form.title || !form.subject || !form.dueDate}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
          >
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}
