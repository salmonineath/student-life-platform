"use client";

/**
 * ScheduleModal — handles Create, Edit, and Delete for schedules.
 *
 * Modes:
 *  - Create : `scheduleToEdit` is null  → shows type tabs (One-time / Recurring)
 *  - Edit   : `scheduleToEdit` is set   → tab is locked to the schedule's type
 *
 * Delete:
 *  - Edit mode shows a "Delete" button that triggers the inline DeleteConfirmModal.
 *
 * Props:
 *  scheduleToEdit  — the schedule to pre-fill when editing; null for create mode
 *  onClose         — called when modal should close (backdrop click, cancel, X)
 *  onSuccess       — called after any successful create / edit / delete
 *                    (parent should re-fetch or the reducer already updated state)
 */

import { useEffect, useState } from "react";
import { X, Star, Trash2 } from "lucide-react";
import { useAppDispatch } from "@/redux/hook";
import {
  createOneTimeScheduleAction,
  createRecurringScheduleAction,
  updateScheduleAction,
  deleteScheduleAction,
} from "../core/action";
import {
  Schedule,
  OneTimeSchedule,
  RecurringSchedule,
  OneTimeScheduleRequest,
  RecurringScheduleRequest,
  ScheduleUpdateRequest,
} from "@/types/scheduleTypes";
import DeleteConfirmModal from "./DeleteConfirmModal";

// ── Constants ──────────────────────────────────────────────────────────────────

// Day options for the recurring schedule day picker
// API uses 1 = Monday … 7 = Sunday (ISO week day)
const DAY_OPTIONS = [
  { label: "Monday", value: 1 },
  { label: "Tuesday", value: 2 },
  { label: "Wednesday", value: 3 },
  { label: "Thursday", value: 4 },
  { label: "Friday", value: 5 },
  { label: "Saturday", value: 6 },
  { label: "Sunday", value: 7 },
];

// ── Form State Types ───────────────────────────────────────────────────────────

interface OneTimeForm {
  title: string;
  description: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  location: string;
  isImportant: boolean;
}

interface RecurringForm {
  title: string;
  description: string;
  dayOfWeek: number; // 1–7
  recurringStartTime: string; // "HH:mm"
  recurringEndTime: string; // "HH:mm"
  location: string;
  isImportant: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** "2026-04-10T09:00:00Z" → { date: "2026-04-10", time: "09:00" } */
function splitIsoDatetime(iso: string | null | undefined): {
  date: string;
  time: string;
} {
  if (!iso) return { date: "", time: "" };
  const [date, timeFull] = iso.split("T");
  return { date, time: timeFull.slice(0, 5) }; // keep "HH:mm" only
}

/** "HH:mm:ss" or "HH:mm" → "HH:mm" */
function toHHmm(t: string | null | undefined): string {
  if (!t) return "";
  return t.slice(0, 5);
}

/** "YYYY-MM-DD" + "HH:mm" → "YYYY-MM-DDTHH:mm:00Z" */
function toIsoDatetime(date: string, time: string): string {
  return `${date}T${time}:00Z`;
}

/** "HH:mm" → "HH:mm:00" */
function toHHmmss(t: string): string {
  return `${t}:00`;
}

// ── Props ──────────────────────────────────────────────────────────────────────

interface Props {
  scheduleToEdit: Schedule | null; // null = create mode
  onClose: () => void;
  onSuccess: () => void;
}

// ── Modal Component ────────────────────────────────────────────────────────────

export default function ScheduleModal({
  scheduleToEdit,
  onClose,
  onSuccess,
}: Props) {
  const dispatch = useAppDispatch();

  const isEditing = !!scheduleToEdit;

  // Which type tab is active; locked to the schedule's type when editing
  const [activeTab, setActiveTab] = useState<"ONE_TIME" | "RECURRING">(
    scheduleToEdit?.type ?? "ONE_TIME",
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Animate-in: starts hidden so the CSS transition fires on mount
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Lock the tab when editing (type cannot be changed)
  useEffect(() => {
    if (scheduleToEdit) setActiveTab(scheduleToEdit.type);
  }, [scheduleToEdit]);

  // ── One-time form state — pre-filled when editing ───────────────────────────
  const [oneTime, setOneTime] = useState<OneTimeForm>(() => {
    if (scheduleToEdit?.type === "ONE_TIME") {
      const s = scheduleToEdit as OneTimeSchedule;
      const { date, time: startTime } = splitIsoDatetime(s.startTime);
      const { time: endTime } = splitIsoDatetime(s.endTime);
      return {
        title: s.title,
        description: s.description ?? "",
        date,
        startTime,
        endTime,
        location: s.location ?? "",
        isImportant: s.important,
      };
    }
    // Create mode — empty
    return {
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      isImportant: false,
    };
  });

  // ── Recurring form state — pre-filled when editing ─────────────────────────
  const [recurring, setRecurring] = useState<RecurringForm>(() => {
    if (scheduleToEdit?.type === "RECURRING") {
      const r = scheduleToEdit as RecurringSchedule;
      return {
        title: r.title,
        description: r.description ?? "",
        dayOfWeek: r.dayOfWeek,
        recurringStartTime: toHHmm(r.recurringStartTime),
        recurringEndTime: toHHmm(r.recurringEndTime),
        location: r.location ?? "",
        isImportant: r.important,
      };
    }
    // Create mode — empty
    return {
      title: "",
      description: "",
      dayOfWeek: 1,
      recurringStartTime: "",
      recurringEndTime: "",
      location: "",
      isImportant: false,
    };
  });

  // Typed setters so we don't repeat { ...prev, [key]: value } everywhere
  function setOT<K extends keyof OneTimeForm>(key: K, value: OneTimeForm[K]) {
    setOneTime((prev) => ({ ...prev, [key]: value }));
  }
  function setRec<K extends keyof RecurringForm>(
    key: K,
    value: RecurringForm[K],
  ) {
    setRecurring((prev) => ({ ...prev, [key]: value }));
  }

  // Animate-out then call onClose
  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 200);
  }

  // ── Submit (Create or Update) ───────────────────────────────────────────────
  async function handleSubmit() {
    setError(null);
    setSubmitting(true);

    try {
      if (isEditing && scheduleToEdit) {
        // ── UPDATE ─────────────────────────────────────────────────────────────
        // Build the update payload based on the schedule's type.
        // All fields are sent; the backend only applies non-null ones.
        const payload: ScheduleUpdateRequest =
          scheduleToEdit.type === "ONE_TIME"
            ? {
                title: oneTime.title,
                description: oneTime.description || undefined,
                startTime: toIsoDatetime(oneTime.date, oneTime.startTime),
                endTime: toIsoDatetime(oneTime.date, oneTime.endTime),
                location: oneTime.location || undefined,
                isImportant: oneTime.isImportant,
              }
            : {
                title: recurring.title,
                description: recurring.description || undefined,
                dayOfWeek: recurring.dayOfWeek,
                recurringStartTime: toHHmmss(recurring.recurringStartTime),
                recurringEndTime: toHHmmss(recurring.recurringEndTime),
                location: recurring.location || undefined,
                isImportant: recurring.isImportant,
              };

        await dispatch(
          updateScheduleAction({ id: scheduleToEdit.id, body: payload }),
        ).unwrap();
      } else {
        // ── CREATE ─────────────────────────────────────────────────────────────
        if (activeTab === "ONE_TIME") {
          const payload: OneTimeScheduleRequest = {
            title: oneTime.title,
            description: oneTime.description,
            startTime: toIsoDatetime(oneTime.date, oneTime.startTime),
            endTime: toIsoDatetime(oneTime.date, oneTime.endTime),
            location: oneTime.location,
            isImportant: oneTime.isImportant,
          };
          await dispatch(createOneTimeScheduleAction(payload)).unwrap();
        } else {
          const payload: RecurringScheduleRequest = {
            title: recurring.title,
            description: recurring.description,
            dayOfWeek: recurring.dayOfWeek,
            recurringStartTime: toHHmmss(recurring.recurringStartTime),
            recurringEndTime: toHHmmss(recurring.recurringEndTime),
            location: recurring.location,
            isImportant: recurring.isImportant,
          };
          await dispatch(createRecurringScheduleAction(payload)).unwrap();
        }
      }

      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(
        typeof err === "string"
          ? err
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // ── Delete ─────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!scheduleToEdit) return;
    setDeleting(true);
    try {
      await dispatch(deleteScheduleAction(scheduleToEdit.id)).unwrap();
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(typeof err === "string" ? err : "Failed to delete schedule.");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Overlay + Modal ──────────────────────────────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal card */}
        <div
          className={`relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col transition-all duration-200 ${
            visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-4 scale-95"
          }`}
        >
          {/* ── Header ───────────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditing ? "Edit Schedule" : "Add Schedule"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing
                  ? "Update the details below"
                  : "Fill in the details to create a new event"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Delete button — only shown in edit mode */}
              {isEditing && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete this schedule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ── Type Tabs — hidden when editing (type is locked) ──────────────── */}
          {!isEditing && (
            <div className="px-6 pt-4">
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                {(["ONE_TIME", "RECURRING"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-150 ${
                      activeTab === tab
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab === "ONE_TIME" ? "One-time" : "Recurring"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Form Fields (scrollable) ──────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {/* Error message */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ── ONE-TIME fields ───────────────────────────────────────────── */}
            {activeTab === "ONE_TIME" && (
              <>
                <Field label="Title" required>
                  <Input
                    value={oneTime.title}
                    onChange={(v) => setOT("title", v)}
                    placeholder="e.g. Calculus Exam"
                  />
                </Field>

                <Field label="Description">
                  <Textarea
                    value={oneTime.description}
                    onChange={(v) => setOT("description", v)}
                    placeholder="Optional notes…"
                  />
                </Field>

                <Field label="Date" required>
                  <Input
                    type="date"
                    value={oneTime.date}
                    onChange={(v) => setOT("date", v)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Time" required>
                    <Input
                      type="time"
                      value={oneTime.startTime}
                      onChange={(v) => setOT("startTime", v)}
                    />
                  </Field>
                  <Field label="End Time" required>
                    <Input
                      type="time"
                      value={oneTime.endTime}
                      onChange={(v) => setOT("endTime", v)}
                    />
                  </Field>
                </div>

                <Field label="Location">
                  <Input
                    value={oneTime.location}
                    onChange={(v) => setOT("location", v)}
                    placeholder="e.g. Hall A, Room 12"
                  />
                </Field>

                <ImportantToggle
                  value={oneTime.isImportant}
                  onChange={(v) => setOT("isImportant", v)}
                />
              </>
            )}

            {/* ── RECURRING fields ──────────────────────────────────────────── */}
            {activeTab === "RECURRING" && (
              <>
                <Field label="Title" required>
                  <Input
                    value={recurring.title}
                    onChange={(v) => setRec("title", v)}
                    placeholder="e.g. Math 101"
                  />
                </Field>

                <Field label="Description">
                  <Textarea
                    value={recurring.description}
                    onChange={(v) => setRec("description", v)}
                    placeholder="Optional notes…"
                  />
                </Field>

                <Field label="Day of Week" required>
                  <select
                    value={recurring.dayOfWeek}
                    onChange={(e) =>
                      setRec("dayOfWeek", Number(e.target.value))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                  >
                    {DAY_OPTIONS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start Time" required>
                    <Input
                      type="time"
                      value={recurring.recurringStartTime}
                      onChange={(v) => setRec("recurringStartTime", v)}
                    />
                  </Field>
                  <Field label="End Time" required>
                    <Input
                      type="time"
                      value={recurring.recurringEndTime}
                      onChange={(v) => setRec("recurringEndTime", v)}
                    />
                  </Field>
                </div>

                <Field label="Location">
                  <Input
                    value={recurring.location}
                    onChange={(v) => setRec("location", v)}
                    placeholder="e.g. Room A1"
                  />
                </Field>

                <ImportantToggle
                  value={recurring.isImportant}
                  onChange={(v) => setRec("isImportant", v)}
                />
              </>
            )}
          </div>

          {/* ── Footer ───────────────────────────────────────────────────────── */}
          <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex gap-3">
            <button
              onClick={handleClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isEditing ? "Saving…" : "Creating…"}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Schedule"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal (layered on top) ──────────────────────── */}
      {showDeleteModal && scheduleToEdit && (
        <DeleteConfirmModal
          title={scheduleToEdit.title}
          isDeleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

/** Wraps a label + input field with consistent spacing. */
function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

/** Styled text / date / time input. */
function Input({
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
    />
  );
}

/** Styled multi-line textarea. */
function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none"
    />
  );
}

/** Toggle button to mark a schedule as important. */
function ImportantToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
        value
          ? "border-amber-300 bg-amber-50 text-amber-700"
          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
      }`}
    >
      <Star
        className={`w-4 h-4 ${value ? "fill-amber-400 text-amber-400" : "text-slate-400"}`}
      />
      Mark as Important
    </button>
  );
}
