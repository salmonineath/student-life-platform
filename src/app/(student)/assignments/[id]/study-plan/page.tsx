"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Send,
  CheckCircle2,
  Circle,
  Bot,
  User,
  Loader2,
  BookOpen,
} from "lucide-react";
import { AppDispatch, RootState } from "@/redux/store";
import { generateStudyPlanAction } from "./core/action";
import { updatePlanLocally } from "./core/reducer";
import { updateProgressAction } from "@/app/(student)/assignments/core/action";
import { getAssignmentByIdAction } from "@/app/(student)/assignments/core/action";
import axiosInstance from "@/lib/axios";
import { PlanTask, ChatMessage } from "@/types/studyPlanType";

// Parse "* Day 1–2: detail" lines into task objects
function parsePlan(raw: string): PlanTask[] {
  return raw
    .split("\n")
    .filter((l) => l.trim().startsWith("*") || l.trim().startsWith("-"))
    .map((line) => {
      const text = line.replace(/^[*-]\s*/, "").trim();
      const match = text.match(/^(Day[\s\d–\-]+):\s*(.*)/s);
      return {
        day: match ? match[1].trim() : "",
        detail: match ? match[2].trim() : text,
        done: false,
      };
    })
    .filter((t) => t.detail.length > 0);
}

function serializeTasks(tasks: PlanTask[]): string {
  return tasks.map((t) => `* ${t.day ? t.day + ": " : ""}${t.detail}`).join("\n");
}

export default function Page() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const assignmentId = Number(params.id);

  const { plan, loading: planLoading } = useSelector(
    (state: RootState) => state.studyPlan,
  );
  const { selectedAssignment } = useSelector(
    (state: RootState) => state.assignment,
  );

  const [tasks, setTasks] = useState<PlanTask[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load assignment + plan on mount
  useEffect(() => {
    const init = async () => {
      if (!selectedAssignment) {
        await dispatch(getAssignmentByIdAction(assignmentId));
      }

      // Try localStorage first for instant load
      const cached = localStorage.getItem(`study-plan-${assignmentId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        setTasks(parsePlan(parsed.plan));
        dispatch(updatePlanLocally(parsed.plan));

        // Also load saved checkbox state
        const savedState = localStorage.getItem(`study-plan-tasks-${assignmentId}`);
        if (savedState) {
          const savedTasks: PlanTask[] = JSON.parse(savedState);
          setTasks(savedTasks);
        }
      } else {
        // No cache → generate fresh
        const result = await dispatch(generateStudyPlanAction(assignmentId));
        if (generateStudyPlanAction.fulfilled.match(result)) {
          const newTasks = parsePlan(result.payload.plan);
          setTasks(newTasks);
          localStorage.setItem(
            `study-plan-${assignmentId}`,
            JSON.stringify({
              assignmentId,
              generatedAt: new Date().toISOString(),
              plan: result.payload.plan,
            }),
          );
        }
      }
      setInitializing(false);
    };
    init();
  }, [assignmentId]);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Save task state to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem(
        `study-plan-tasks-${assignmentId}`,
        JSON.stringify(tasks),
      );
    }
  }, [tasks, assignmentId]);

  const handleToggleTask = async (index: number) => {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, done: !t.done } : t,
    );
    setTasks(updated);

    // Calculate new progress %
    const doneCount = updated.filter((t) => t.done).length;
    const pct = Math.round((doneCount / updated.length) * 100);
    const status =
      pct === 100 ? "COMPLETED" : pct > 0 ? "IN_PROGRESS" : "NOT_STARTED";

    await dispatch(
      updateProgressAction({
        id: assignmentId,
        payload: { progress: pct },
      }),
    );
  };

  const handleRegenerate = async () => {
    const result = await dispatch(generateStudyPlanAction(assignmentId));
    if (generateStudyPlanAction.fulfilled.match(result)) {
      const newTasks = parsePlan(result.payload.plan);
      setTasks(newTasks);
      localStorage.setItem(
        `study-plan-${assignmentId}`,
        JSON.stringify({
          assignmentId,
          generatedAt: new Date().toISOString(),
          plan: result.payload.plan,
        }),
      );
      localStorage.removeItem(`study-plan-tasks-${assignmentId}`);
    }
  };

  const handleSendMessage = async () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;

    const userMsg: ChatMessage = { role: "user", content: msg };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const currentPlan = serializeTasks(tasks);
      const prompt = `
You are a study plan assistant. The student has this current study plan:

${currentPlan}

The student says: "${msg}"

Your job:
- If they ask to modify the plan (e.g. "make day 1 shorter", "add a review day"), return an UPDATED plan as bullet points only, starting each line with "* Day X: detail". No extra text.
- If they ask a question (e.g. "what should I focus on?"), answer helpfully in 2-3 sentences. Do NOT return a bullet plan.

Decide which case applies and respond accordingly.
      `.trim();

      const res = await axiosInstance.post("/study-plan/chat", { prompt });
      const aiReply: string = res.data?.data?.reply ?? "";

      // If reply looks like a plan (has bullet lines) → replace plan
      const looksLikePlan =
        aiReply.includes("* Day") || aiReply.includes("- Day");

      if (looksLikePlan) {
        const newTasks = parsePlan(aiReply);
        if (newTasks.length > 0) {
          setTasks(newTasks);
          localStorage.setItem(
            `study-plan-${assignmentId}`,
            JSON.stringify({
              assignmentId,
              generatedAt: new Date().toISOString(),
              plan: aiReply,
            }),
          );
          localStorage.removeItem(`study-plan-tasks-${assignmentId}`);
          setChatMessages((prev) => [
            ...prev,
            { role: "ai", content: "I've updated your plan above! ✓" },
          ]);
        }
      } else {
        setChatMessages((prev) => [
          ...prev,
          { role: "ai", content: aiReply },
        ]);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          <p className="text-sm text-stone-500">Preparing your study plan…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-stone-100 px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to assignment
        </button>
        <div className="h-4 w-px bg-stone-200" />
        <div className="flex items-center gap-2 flex-1">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-semibold text-stone-800">AI Study Plan</span>
          {selectedAssignment && (
            <span className="text-xs text-stone-400 font-normal">
              — {selectedAssignment.title}
            </span>
          )}
        </div>
        <button
          onClick={handleRegenerate}
          disabled={planLoading}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-indigo-600 transition-colors disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${planLoading ? "animate-spin" : ""}`} />
          Regenerate
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* ── Progress bar ── */}
        <div className="bg-white rounded-2xl border border-stone-100 px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Plan Progress
            </span>
            <span className="text-sm font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-stone-400 mt-1.5">
            {doneCount} of {tasks.length} tasks completed
          </p>
        </div>

        {/* ── Checklist ── */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-stone-700">Your Tasks</span>
          </div>

          {planLoading ? (
            <div className="px-5 py-8 flex items-center justify-center gap-2 text-stone-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Generating plan…</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-stone-400">No plan yet.</p>
              <button
                onClick={handleRegenerate}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Generate Plan
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-stone-50">
              {tasks.map((task, i) => (
                <li
                  key={i}
                  onClick={() => handleToggleTask(i)}
                  className={`flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors ${
                    task.done ? "bg-stone-50" : "hover:bg-stone-50/60"
                  }`}
                >
                  {task.done ? (
                    <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-stone-300 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    {task.day && (
                      <span className="inline-block text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md mb-1">
                        {task.day}
                      </span>
                    )}
                    <p
                      className={`text-sm leading-relaxed transition-colors ${
                        task.done
                          ? "line-through text-stone-400"
                          : "text-stone-700"
                      }`}
                    >
                      {task.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ── Chat box ── */}
        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-stone-700">
              Ask AI to adjust your plan
            </span>
          </div>

          {/* Messages */}
          <div className="px-5 py-4 space-y-3 max-h-64 overflow-y-auto">
            {chatMessages.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-2">
                Try: "Make day 1 more detailed" or "What should I focus on first?"
              </p>
            ) : (
              chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2.5 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-indigo-100"
                        : "bg-stone-100"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-stone-500" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-stone-100 text-stone-700 rounded-tl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {chatLoading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-stone-500" />
                </div>
                <div className="bg-stone-100 px-3.5 py-2.5 rounded-2xl rounded-tl-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-stone-100 flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask AI to adjust your plan…"
              rows={1}
              className="flex-1 resize-none px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition max-h-28 overflow-y-auto"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || chatLoading}
              className="w-10 h-10 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}