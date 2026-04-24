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
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { logoutAction } from "@/app/(auth)/core/action";
import type { AppDispatch } from "@/redux/store";

const EXPANDED_W  = 256; // w-64
const COLLAPSED_W = 64;  // icon-only rail

interface SidebarProps {
  collapsed:  boolean;
  onToggle:   () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const pathname              = usePathname();
  const dispatch              = useDispatch<AppDispatch>();

  const navItems = [
    { name: "Dashboard",   icon: LayoutDashboard, href: "/dashboard"  },
    { name: "Schedule",    icon: CalendarDays,    href: "/schedule"   },
    { name: "Assignment",  icon: ClipboardList,   href: "/assignment" },
    { name: "Study Group", icon: Users,           href: "/groups"     },
    { name: "Notes",       icon: StickyNote,      href: "/notes"      },
    { name: "AI Chat",     icon: BotMessageSquare,href: "/chat"       },
    { name: "Profile",     icon: User,            href: "/profile"    },
    { name: "Settings",    icon: Settings,        href: "/settings"   },
  ];

  // const handleLogout = async () => {
  //   setLoading(true);
  //   setError("");

  //   try {
  //     await dispatch(logoutAction());
  //     // Full reload so cookies are fully cleared before middleware checks them
  //     window.location.href = "/student-life";
  //   } catch (err: any) {
  //     if (err.response) {
  //       console.error(
  //         "Logout failed:",
  //         err.response.data?.message || err.message,
  //       );
  //     } else if (err.request) {
  //       console.error("No response from server during logout");
  //     } else {
  //       console.error("Error during logout:", err.message);
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogout = async () => {
    setLoading(true);
    await dispatch(logoutAction());
    window.location.href = "/student-life";
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside
      style={{ width: collapsed ? COLLAPSED_W : EXPANDED_W }}
      className="fixed top-0 left-0 h-screen bg-white border-r border-slate-200 text-slate-800 flex flex-col z-40 overflow-hidden transition-[width] duration-300 ease-in-out"
    >
      {/* Logo + hamburger */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-4 shrink-0">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200 shrink-0">
          <GraduationCap className="text-white w-5 h-5" />
        </div>

        {/* Title — fades out when collapsed */}
        <div
          className="flex-1 min-w-0 overflow-hidden transition-opacity duration-200"
          style={{ opacity: collapsed ? 0 : 1 }}
        >
          <span className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
            Student Life
          </span>
          <p className="text-xs text-slate-500 whitespace-nowrap">Welcome</p>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 mt-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              title={collapsed ? item.name : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                active
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                  : "hover:bg-slate-100 text-slate-700"
              }`}
            >
              <item.icon
                className={`w-5 h-5 shrink-0 transition-all duration-200 ${
                  active ? "text-white" : "text-slate-500 group-hover:text-blue-500"
                }`}
              />

              {/* Label — slides + fades out when collapsed */}
              <span
                className="font-medium text-sm whitespace-nowrap overflow-hidden transition-all duration-300"
                style={{
                  opacity:   collapsed ? 0 : 1,
                  maxWidth:  collapsed ? 0 : 200,
                  marginLeft: collapsed ? 0 : undefined,
                }}
              >
                {item.name}
              </span>

              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-200 mt-auto shrink-0">
        {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
        <button
          onClick={handleLogout}
          disabled={loading}
          title={collapsed ? "Logout" : undefined}
          className={`group relative flex items-center justify-center gap-2 w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-red-200 transition-all duration-300 active:scale-[0.97] overflow-hidden ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {!loading && (
            <span className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full bg-white/20 transition-transform duration-700 w-3/5" />
          )}

          {loading ? (
            <svg className="animate-spin w-4 h-4 relative z-10" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:rotate-6 relative z-10 shrink-0" />
          )}

          <span
            className="relative z-10 font-medium whitespace-nowrap overflow-hidden transition-all duration-300"
            style={{ opacity: collapsed ? 0 : 1, maxWidth: collapsed ? 0 : 200 }}
          >
            {loading ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;