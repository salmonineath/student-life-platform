"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { getMeAction } from "@/app/(auth)/core/action";
import { toast } from "sonner";
import { usePageTransition } from "@/app/PageTransitionProvider";

export default function ClientAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const { transitionReady } = usePageTransition();

  useEffect(() => {
    // Double RAF: signal the page-transition overlay only after the browser has
    // actually painted this page, not just after the JS resolved.
    const signalReady = () =>
      requestAnimationFrame(() => requestAnimationFrame(transitionReady));

    // Already have user in Redux (e.g. just navigated from login) — skip /me.
    if (user) {
      signalReady();
      return;
    }

    dispatch(getMeAction())
      .unwrap()
      .catch((err) => {
        // Cookie expired or not present — silently ignore Unauthorized.
        // Only surface unexpected errors to the user.
        if (err !== "Unauthorized") {
          toast.error(err || "Something went wrong");
        }
      })
      .finally(signalReady);
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