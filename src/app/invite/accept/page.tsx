"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // Backend invite endpoints live at the server root (no /api/v1 prefix)
  const API_URL = (
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1"
  ).replace(/\/api\/v1\/?$/, "");

  useEffect(() => {
    if (!token) {
      router.replace("/invite/result?status=invalid");
      return;
    }

    // Forward the token to the backend — it processes it and redirects back
    window.location.href = `${API_URL}/invite/accept?token=${token}`;
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
      <p className="text-slate-400 text-sm font-medium animate-pulse">
        Processing your invitation…
      </p>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F6FA]" />}>
      <AcceptInviteContent />
    </Suspense>
  );
}