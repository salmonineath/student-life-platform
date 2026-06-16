"use client";

import { useEffect } from "react";

export default function WarmUpServer() {
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_HEALTH_API_URL ?? "http://localhost:5000/health";
    fetch(url).catch(() => {});
  }, []);
  return null;
}
