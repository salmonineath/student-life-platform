"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hook/useAuth";
import { fetchMe } from "@/slices/authSlice";

export default function ClientAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchMe());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400 text-sm">Loading your schedule…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
