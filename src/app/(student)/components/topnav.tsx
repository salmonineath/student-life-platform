"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/redux/hook";
import type { AppDispatch } from "@/redux/store";
import { getUnreadCountAction } from "@/app/(student)/notifications/core/action";

const PAGE_NAMES: Record<string, string> = {
  "/dashboard":     "Dashboard",
  "/schedules":     "Schedule",
  "/assignments":   "Assignments",
  "/groups":        "Study Groups",
  "/profile":       "Profile",
  "/notifications": "Notifications",
};

function getPageName(pathname: string): string {
  const entry = Object.entries(PAGE_NAMES).find(([key]) =>
    key === "/dashboard" ? pathname === key : pathname.startsWith(key)
  );
  return entry ? entry[1] : "";
}

const TopNav = () => {
  const pathname = usePathname();
  const router   = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const pageName = getPageName(pathname);
  const user = useAppSelector((state) => state.auth.user);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  // Keep the bell badge fresh: fetch on mount, then poll every 60s.
  useEffect(() => {
    dispatch(getUnreadCountAction());
    const interval = setInterval(() => dispatch(getUnreadCountAction()), 60_000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const initials = (user?.fullname ?? "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-6 sticky top-0 z-30 shrink-0">

      {/* Page title */}
      <h2
        className="text-base font-semibold text-stone-800"
        style={{ fontFamily: "var(--font-sora)" }}
      >
        {pageName}
      </h2>

      {/* Right actions */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <button
          onClick={() => router.push("/notifications")}
          title="Notifications"
          className={`relative p-2 rounded-xl transition-colors ${
            pathname.startsWith("/notifications")
              ? "text-indigo-600 bg-indigo-50"
              : "text-stone-600 hover:text-stone-800 hover:bg-stone-100"
          }`}
        >
          <Bell className="w-[18px] h-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        <div className="w-px h-5 bg-stone-200 mx-1" />

        {/* Profile */}
        <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-stone-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-indigo-600">
              {initials || "?"}
            </span>
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-stone-800 leading-tight">
              {user?.fullname ?? ""}
            </p>
            <p className="text-[11px] text-stone-600 leading-tight mt-0.5">
              {user?.academicYear ? `${user.academicYear} · Student` : "Student"}
            </p>
          </div>
        </button>

      </div>
    </header>
  );
};

export default TopNav;
