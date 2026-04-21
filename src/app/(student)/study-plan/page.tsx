"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Trash2, Plus, Sparkles, AlertTriangle } from "lucide-react";
import axiosInstance from "@/lib/axios";

interface StudySession {
  id: string;
  title: string;
  date: string;
  startTime: string;
  duration: number; // minutes
}

interface SavedPlan {
  assignmentId: number;
  generatedAt: string;
  plan: string;
}

// Parse the bullet list from Gemini into structured sessions
function parsePlanToSessions(plan: string, assignmentId: number): StudySession[] {
  const lines = plan.split("\n").filter((l) => l.trim().startsWith("-"));
  const today = new Date();

  return lines.map((line, i) => {
    const text = line.replace(/^-\s*/, "").trim();
    const date = new Date(today);
    date.setDate(today.getDate() + i * 2); // spread sessions every 2 days

    return {
      id: `session-${i}`,
      title: text.length > 60 ? text.substring(0, 60) + "…" : text,
      date: date.toISOString().split("T")[0],
      startTime: "18:00",
      duration: 90,
    };
  });
}

export default function StudyPlanPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignmentId = Number(params.id);
  const mode = searchParams.get("mode"); // "edit" or null

  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [rawPlan, setRawPlan] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load plan from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`study-plan-${assignmentId}`);
    if (stored) {
      const parsed: SavedPlan = JSON.parse(stored);
      setRawPlan(parsed.plan);
      setSessions(parsePlanToSessions(parsed.plan, assignmentId));
    }
  }, [assignmentId]);

  // Intercept back navigation
  const handleBack = () => {
    if (hasChanges && !saved) {
      setShowLeaveConfirm(true);
      setPendingRoute(`/assignment/${assignmentId}`);
    } else {
      router.push(`/assignment/${assignmentId}`);
    }
  };

  const handleSessionChange = (id: string, field: keyof StudySession, value: string | number) => {
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
    setHasChanges(true);
    setSaved(false);
  };

  const handleAddSession = () => {
    const last = sessions[sessions.length - 1];
    const newDate = last
      ? new Date(new Date(last.date).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    setSessions((prev) => [
      ...prev,
      { id: `session-${Date.now()}`, title: "Study session", date: newDate, startTime: "18:00", duration: 90 },
    ]);
    setHasChanges(true);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    setHasChanges(true);
    setSaved(false);
  };

  // Save sessions to schedule
  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all(
        sessions.map((session) => {
          const startDateTime = `${session.date}T${session.startTime}:00`;
          const endDate = new Date(new Date(startDateTime).getTime() + session.duration * 60 * 1000);
          const endDateTime = endDate.toISOString().replace("Z", "").substring(0, 19);

          return axiosInstance.post("/schedule/one-time", {
            title: session.title,
            description: `Study session for assignment #${assignmentId}`,
            startTime: startDateTime,
            endTime: endDateTime,
            isImportant: true,
          });
        }),
      );

      // Clear localStorage after saving
      localStorage.removeItem(`study-plan-${assignmentId}`);
      setSaved(true);
      setHasChanges(false);

      // Redirect after short delay
      setTimeout(() => router.push(`/assignment/${assignmentId}`), 1500);
    } catch (err) {
      console.error("Failed to save sessions", err);
    } finally {
      setSaving(false);
    }
  };

  // Leave without saving
  const handleDiscard = () => {
    localStorage.removeItem(`study-plan-${assignmentId}`);
    setShowLeaveConfirm(false);
    if (pendingRoute) router.push(pendingRoute);
  };

  // Save and leave
  const handleSaveAndLeave = async () => {
    setShowLeaveConfirm(false);
    await handleSave();
  };

  return (
    <div className="min-h-screen p-6 space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={handleBack} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition">
          <ArrowLeft size={18} />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            Study Plan
          </h1>
          <p className="text-sm text-slate-400">Review, edit and save your study sessions to your schedule</p>
        </div>
        {saved && (
          <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            Saved to schedule!
          </span>
        )}
      </div>

      {/* Raw plan preview */}
      {rawPlan && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
          <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">AI Generated Plan</p>
          <pre className="text-xs text-indigo-700 whitespace-pre-wrap font-sans leading-relaxed">{rawPlan}</pre>
        </div>
      )}

      {/* Sessions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Study Sessions</h2>
          <button
            onClick={handleAddSession}
            className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add session
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No sessions yet. Add one or go back and generate a plan.
          </div>
        ) : (
          sessions.map((session, i) => (
            <div key={session.id} className="bg-white border border-slate-100 rounded-2xl p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session {i + 1}</span>
                <button onClick={() => handleDeleteSession(session.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Title */}
              <input
                value={session.title}
                onChange={(e) => handleSessionChange(session.id, "title", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Session title"
              />

              <div className="grid grid-cols-3 gap-2">
                {/* Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={session.date}
                    onChange={(e) => handleSessionChange(session.id, "date", e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Start time */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Start</label>
                  <input
                    type="time"
                    value={session.startTime}
                    onChange={(e) => handleSessionChange(session.id, "startTime", e.target.value)}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Duration</label>
                  <select
                    value={session.duration}
                    onChange={(e) => handleSessionChange(session.id, "duration", Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={30}>30 min</option>
                    <option value={60}>1 hour</option>
                    <option value={90}>1.5 hrs</option>
                    <option value={120}>2 hours</option>
                    <option value={180}>3 hours</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save button */}
      {sessions.length > 0 && !saved && (
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving to schedule…" : "Save all sessions to schedule"}
        </button>
      )}

      {/* Leave confirm modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Leave without saving?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your study sessions haven't been saved to your schedule yet.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDiscard}
                className="flex-1 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
              >
                Discard
              </button>
              <button
                onClick={handleSaveAndLeave}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition"
              >
                Save & leave
              </button>
            </div>
            <button
              onClick={() => setShowLeaveConfirm(false)}
              className="w-full text-xs text-slate-400 hover:text-slate-600 transition"
            >
              Stay on this page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}