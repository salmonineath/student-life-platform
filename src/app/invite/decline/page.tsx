"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function DeclineInviteContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      router.replace("/invite/result?status=invalid");
      return;
    }

    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/invite/decline?token=${token}`;
  }, [token]);

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex items-center justify-center">
      <p className="text-slate-400 text-sm font-medium animate-pulse">
        Processing your response…
      </p>
    </div>
  );
}

export default function DeclineInvitePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F6FA]" />}>
      <DeclineInviteContent />
    </Suspense>
  );
}