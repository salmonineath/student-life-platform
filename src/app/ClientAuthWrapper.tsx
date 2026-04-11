"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMeAction } from "@/app/(auth)/core/action";
import { toast } from "sonner";

export default function ClientAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  useEffect(() => {
    // Already have user in Redux (e.g. just logged in) — skip the /me call.
    if (user) return;

    dispatch(getMeAction())
      .unwrap()
      .catch((err) => {
        // Cookie expired or not present — silently ignore Unauthorized.
        // Only surface unexpected errors to the user.
        if (err !== "Unauthorized") {
          toast.error(err || "Something went wrong");
        }
      });
  }, []); // Intentionally no deps — run once on mount only.

  if (!user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}