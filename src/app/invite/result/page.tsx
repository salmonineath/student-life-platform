"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { getMyScheduleAction } from "@/app/(student)/schedule/core/action";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react";

// ─── Status config ────────────────────────────────────────────────────────────

type InviteStatus = "accepted" | "declined" | "expired" | "invalid" | "already_responded";

const STATUS_CONFIG: Record<
  InviteStatus,
  { icon: React.ReactNode; title: string; message: string; color: string }
> = {
  accepted: {
    icon: <CheckCircle className="w-14 h-14 text-green-500" />,
    title: "You're in!",
    message: "The assignment has been added to your schedule. You can view it on your calendar now.",
    color: "green",
  },
  declined: {
    icon: <XCircle className="w-14 h-14 text-slate-400" />,
    title: "Invitation declined",
    message: "You've declined the invitation. No changes were made to your schedule.",
    color: "slate",
  },
  expired: {
    icon: <Clock className="w-14 h-14 text-amber-400" />,
    title: "Link expired",
    message: "This invitation link has expired. Ask the assignment owner to send a new invite.",
    color: "amber",
  },
  invalid: {
    icon: <AlertCircle className="w-14 h-14 text-red-400" />,
    title: "Invalid link",
    message: "This invitation link is not valid or has already been used.",
    color: "red",
  },
  already_responded: {
    icon: <AlertCircle className="w-14 h-14 text-blue-400" />,
    title: "Already responded",
    message: "You have already accepted or declined this invitation.",
    color: "blue",
  },
};

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function InviteResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const didRefresh = useRef(false);

  const status = (searchParams.get("status") ?? "invalid") as InviteStatus;
  const assignmentId = searchParams.get("assignmentId");

  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.invalid;

  // When accepted: refresh the schedule so it appears immediately on the calendar
  useEffect(() => {
    if (status === "accepted" && !didRefresh.current) {
      didRefresh.current = true;
      const now = new Date();
      dispatch(
        getMyScheduleAction({
          startDate: format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
          endDate: format(endOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd"),
        })
      );
    }
  }, [status, dispatch]);

  function goToSchedule() {
    if (assignmentId) {
      // Deep-link into schedule: highlights the specific assignment card
      const today = format(new Date(), "yyyy-MM-dd");
      router.push(`/schedule?highlightId=${assignmentId}&date=${today}`);
    } else {
      router.push("/schedule");
    }
  }

  function goToAssignment() {
    if (assignmentId) router.push(`/assignment/${assignmentId}`);
  }

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 max-w-md w-full px-8 py-12 flex flex-col items-center text-center gap-6">
        {config.icon}

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">{config.title}</h1>
          <p className="text-sm text-slate-500 leading-relaxed">{config.message}</p>
        </div>

        <div className="flex flex-col gap-3 w-full pt-2">
          {status === "accepted" && (
            <>
              <button
                onClick={goToSchedule}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                View on my schedule
              </button>
              {assignmentId && (
                <button
                  onClick={goToAssignment}
                  className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors"
                >
                  Open assignment details
                </button>
              )}
            </>
          )}

          {status !== "accepted" && (
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold transition-colors"
            >
              Go to dashboard
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function InviteResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F6FA]" />}>
      <InviteResultContent />
    </Suspense>
  );
}