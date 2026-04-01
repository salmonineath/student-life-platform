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
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
