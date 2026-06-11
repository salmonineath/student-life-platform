"use client";

import { useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { setSessionCookie } from "@/lib/session";

// Backend base URL (same default the shared axios instance uses).
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

function JoinInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  // Guard against React 18 double-invoke / re-renders firing the join twice.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (!token) {
      router.replace("/invite/result?status=invalid");
      return;
    }

    // We deliberately use a bare axios call (not the shared instance) so the
    // global 401 interceptor doesn't bounce an unauthenticated visitor to the
    // landing page — we want to send them through sign-up and resume here.
    const join = () =>
      axios.post(
        `${API_URL}/assignments/invite/join`,
        { token },
        { withCredentials: true }
      );

    (async () => {
      try {
        let res;
        try {
          res = await join();
        } catch (err) {
          const status = (err as any)?.response?.status;
          if (status === 401) {
            // Maybe just an expired access token — try a single refresh, then retry.
            try {
              await axios.post(`${API_URL}/auth/refresh-token`, {}, { withCredentials: true });
              res = await join();
            } catch {
              // Not signed in → send them to create an account, then come back here.
              const next = `/invite/join?token=${encodeURIComponent(token)}`;
              router.replace(`/register?next=${encodeURIComponent(next)}`);
              return;
            }
          } else {
            throw err;
          }
        }

        // Joined (or already a member). Make sure the session cookie is present.
        await setSessionCookie().catch(() => {});
        const assignmentId = res?.data?.data?.assignmentId;
        router.replace(
          `/invite/result?status=accepted${assignmentId ? `&assignmentId=${assignmentId}` : ""}`
        );
      } catch {
        // Bad/expired/unknown token, or any other failure.
        router.replace("/invite/result?status=invalid");
      }
    })();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
      <p className="text-slate-400 text-sm font-medium animate-pulse">
        Joining the assignment…
      </p>
    </div>
  );
}

export default function JoinInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F6FA]" />}>
      <JoinInviteContent />
    </Suspense>
  );
}
