"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ClipboardList,
  Users,
  User,
  LogOut,
  GraduationCap,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useDispatch } from "react-redux";
import { logoutAction } from "@/app/(auth)/core/action";
import type { AppDispatch } from "@/redux/store";

export const EXPANDED_W  = 256;
export const COLLAPSED_W = 64;

// paddingLeft that centers a 17px icon inside a 64px collapsed rail
// (64 - 17) / 2 ≈ 23px
const ICON_CENTER_PL = 23;

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const DUR  = "320ms";

const navItems = [
  { name: "Dashboard",    icon: LayoutDashboard, href: "/dashboard"   },
  { name: "Schedule",     icon: CalendarDays,    href: "/schedules"   },
  { name: "Assignments",  icon: ClipboardList,   href: "/assignments" },
  { name: "Study Groups", icon: Users,           href: "/groups"      },
  { name: "Profile",      icon: User,            href: "/profile"     },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle:  () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const [loggingOut,  setLoggingOut]  = useState(false);
  const [loadingHref, setLoadingHref] = useState<string | null>(null);
  const pathname = usePathname();
  const router   = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => { setLoadingHref(null); }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    // Unlink this browser's push subscription from the user
    // so the next person to log in doesn't get their notifications.
    try {
      const OneSignal = (await import("react-onesignal")).default;
      await OneSignal.logout();
    } catch {
      // OneSignal may not be initialized (e.g. unsupported browser) — ignore.
    }
    await dispatch(logoutAction());
    window.location.href = "/student-life";
  };

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  // Shared layout style for every nav row.
  // Transitions padding-left and gap so the icon slides to center when collapsed.
  const rowStyle: React.CSSProperties = {
    paddingLeft:  collapsed ? `${ICON_CENTER_PL}px` : "12px",
    paddingRight: "12px",
    paddingTop:   "10px",
    paddingBottom:"10px",
    gap:          collapsed ? "0px" : "12px",
    transition: [
      `padding-left ${DUR} ${EASE}`,
      `gap          ${DUR} ${EASE}`,
      "background-color 150ms ease",
      "color 150ms ease",
    ].join(", "),
  };

  // Label fades + collapses in sync with the sidebar width.
  const labelStyle: React.CSSProperties = {
    opacity:    collapsed ? 0 : 1,
    maxWidth:   collapsed ? "0px" : "160px",
    overflow:   "hidden",
    whiteSpace: "nowrap",
    transition: `opacity 200ms ease, max-width ${DUR} ${EASE}`,
  };

  return (
    <aside
      style={{
        width:      collapsed ? COLLAPSED_W : EXPANDED_W,
        transition: `width ${DUR} ${EASE}`,
      }}
      className="fixed top-0 left-0 h-screen bg-white border-r border-stone-200 flex flex-col z-40 overflow-hidden"
    >
      {/* ── Header ─────────────────────────────────────────────── */}
      {/* Two completely separate layouts to avoid any overlap issue. */}
      <div className="h-16 border-b border-stone-200 shrink-0">
        <AnimatePresence mode="wait" initial={false}>
          {collapsed ? (
            // Collapsed: the whole header IS the expand button — no overlap possible
            <motion.button
              key="collapsed"
              onClick={onToggle}
              title="Expand sidebar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="w-full h-full flex items-center justify-center hover:bg-indigo-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <GraduationCap className="w-[18px] h-[18px] text-white" />
              </div>
            </motion.button>
          ) : (
            // Expanded: logo + brand name + collapse button
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              className="h-full flex items-center justify-between px-4"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-[18px] h-[18px] text-white" />
                </div>
                <span
                  className="text-[14px] font-bold text-stone-900 whitespace-nowrap tracking-tight"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  Student Life
                </span>
              </div>
              <button
                onClick={onToggle}
                title="Collapse sidebar"
                className="shrink-0 p-1.5 rounded-lg text-stone-600 hover:text-stone-600 hover:bg-stone-100 transition-colors"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active       = isActive(item.href);
          const isNavLoading = loadingHref === item.href;
          return (
            <button
              key={item.name}
              onClick={() => {
                if (active || isNavLoading) return;
                setLoadingHref(item.href);
                router.push(item.href);
              }}
              title={collapsed ? item.name : undefined}
              style={rowStyle}
              className={`w-full flex items-center rounded-xl ${
                active
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-stone-500 hover:bg-stone-100 hover:text-stone-800"
              }`}
            >
              {/* Icon / spinner */}
              {isNavLoading ? (
                <svg
                  className="animate-spin w-[17px] h-[17px] shrink-0 text-indigo-500"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <item.icon className="w-[17px] h-[17px] shrink-0" />
              )}

              {/* Label */}
              <span className="text-sm font-medium" style={labelStyle}>
                {item.name}
              </span>

              {/* Active dot — always in the tree, hidden when collapsed */}
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"
                  style={{
                    opacity:    collapsed ? 0 : 1,
                    transform:  `scale(${collapsed ? 0 : 1})`,
                    transition: "opacity 150ms ease, transform 150ms ease",
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Log out ────────────────────────────────────────────── */}
      <div className="px-2 py-3 border-t border-stone-200 shrink-0">
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          title={collapsed ? "Log out" : undefined}
          style={rowStyle}
          className="w-full flex items-center rounded-xl text-stone-600 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
        >
          {loggingOut ? (
            <svg
              className="animate-spin w-[17px] h-[17px] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <LogOut className="w-[17px] h-[17px] shrink-0" />
          )}
          <span className="text-sm font-medium" style={labelStyle}>
            {loggingOut ? "Logging out..." : "Log out"}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
