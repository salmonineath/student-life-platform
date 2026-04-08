"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  StickyNote,
  BotMessageSquare,
  Settings,
  LogOut,
  GraduationCap,
  User,
} from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const pathname = usePathname();

  // Navigation items array for easy management
  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "Schedule", icon: CalendarDays, href: "/schedule" },
    { name: "Assignment", icon: ClipboardList, href: "/assignment" },
    { name: "Study Group", icon: Users, href: "/groups" },
    { name: "Notes", icon: StickyNote, href: "/notes" },
    { name: "AI Chat", icon: BotMessageSquare, href: "/chat" },
    { name: "Profile", icon: User, href: "/profile" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ];

  const handleLogout = async () => {
    setLoading(true);
    setError("");

    try {
      // await dispatch(logoutUser());
      // Full reload so cookies are fully cleared before middleware checks them
      window.location.href = "/student-life";
    } catch (err: any) {
      if (err.response) {
        console.error(
          "Logout failed:",
          err.response.data?.message || err.message,
        );
      } else if (err.request) {
        console.error("No response from server during logout");
      } else {
        console.error("Error during logout:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if a nav item is active
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen bg-white border-r border-slate-200 text-slate-800 flex flex-col z-40
          transition-transform duration-300 ease-in-out
          w-72 lg:w-64
        `}
      >
        {/* 1. Logo Section */}
        <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <GraduationCap className="text-white w-5 h-5 lg:w-6 lg:h-6" />
          </div>
          <div>
            <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
              Student Life
            </span>
            <p className="text-xs text-slate-500 hidden lg:block">Welcome</p>
          </div>
        </div>

        {/* 2. Navigation Menu */}
        <nav className="flex-1 px-3 lg:px-4 space-y-1 mt-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 group
                  ${
                    active
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                      : "hover:bg-slate-100 text-slate-700"
                  }
                `}
              >
                <item.icon
                  className={`
                    w-4 h-4 lg:w-5 lg:h-5 transition-all duration-200
                    ${active ? "text-white" : "text-slate-500 group-hover:text-blue-500"}
                  `}
                />
                <span
                  className={`
                  font-medium text-sm lg:text-base transition-all duration-200
                  ${active ? "font-semibold" : ""}
                `}
                >
                  {item.name}
                </span>

                {/* Active indicator for desktop */}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm hidden lg:block" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. Bottom Logout Button */}
        {/* 3. Bottom Logout Button */}
        <div className="p-3 lg:p-4 border-t border-slate-200 mt-auto">
          {/* Error */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            onClick={handleLogout}
            disabled={loading}
            className={`group relative flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-500 to-red-600  hover:from-red-600 hover:to-red-700  text-white py-2.5 lg:py-3 rounded-xl font-semibold  text-sm lg:text-base shadow-lg shadow-red-200  transition-all duration-300 active:scale-[0.97]  overflow-hidden
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {/* Animated shine effect (hide when loading) */}
            {!loading && (
              <span className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-white/20 transition-transform duration-700 w-3/5" />
            )}

            {/* Loading Spinner */}
            {loading ? (
              <svg
                className="animate-spin w-4 h-4 lg:w-5 lg:h-5 relative z-10"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="white"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="white"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            ) : (
              <LogOut className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-6 relative z-10" />
            )}

            {/* Text */}
            <span className="relative z-10 font-medium">
              {loading ? "Logging out..." : "Logout"}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
