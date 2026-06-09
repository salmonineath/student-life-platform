"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "motion/react";
import { AppDispatch, RootState } from "@/redux/store";
import {
  getNotificationsAction,
  markAsReadAction,
  markAllAsReadAction,
  deleteNotificationAction,
  clearReadNotificationsAction,
} from "./core/action";
import { dismissClearError } from "./core/reducer";
import { Notification, NotificationType } from "@/types/notificationType";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  Trash2,
  AlertCircle,
  Loader2,
  MessageSquare,
  ClipboardList,
  UserPlus,
  Megaphone,
  Clock,
  CalendarDays,
  Info,
  X,
} from "lucide-react";

// ── Helpers ───────────────────────────────────────────────────────────────────

const TYPE_META: Record<
  NotificationType,
  { icon: React.ReactNode; accent: string; label: string }
> = {
  CHAT:         { icon: <MessageSquare className="w-4 h-4" />, accent: "bg-sky-50 text-sky-500",         label: "Chat"         },
  ASSIGNMENT:   { icon: <ClipboardList className="w-4 h-4" />, accent: "bg-indigo-50 text-indigo-500",   label: "Assignment"   },
  INVITE:       { icon: <UserPlus      className="w-4 h-4" />, accent: "bg-violet-50 text-violet-500",   label: "Invite"       },
  ANNOUNCEMENT: { icon: <Megaphone     className="w-4 h-4" />, accent: "bg-amber-50 text-amber-500",     label: "Announcement" },
  REMINDER:     { icon: <Clock         className="w-4 h-4" />, accent: "bg-rose-50 text-rose-400",       label: "Reminder"     },
  SCHEDULE:     { icon: <CalendarDays  className="w-4 h-4" />, accent: "bg-emerald-50 text-emerald-500", label: "Schedule"     },
  SYSTEM:       { icon: <Info          className="w-4 h-4" />, accent: "bg-stone-100 text-stone-500",    label: "System"       },
};

// Where each notification type takes the user when clicked. Used as the base
// path; when the backend supplies a `referenceId` we deep-link to the item.
const TYPE_ROUTE: Record<NotificationType, string> = {
  CHAT:         "/groups",
  ASSIGNMENT:   "/assignments",
  INVITE:       "/groups",
  ANNOUNCEMENT: "/dashboard",
  REMINDER:     "/schedules",
  SCHEDULE:     "/schedules",
  SYSTEM:       "/notifications",
};

// Types that have a dedicated detail page we can deep-link into via /<base>/<id>.
const DEEP_LINKABLE = new Set<NotificationType>(["ASSIGNMENT"]);

// Resolve the in-app destination for a notification.
//   1. Explicit `link` from the backend wins (used as-is).
//   2. Otherwise, if there's a `referenceId` and the type has a detail page,
//      deep-link to /<base>/<referenceId>.
//   3. Otherwise fall back to the section page for that type.
function resolveDestination(n: Notification): string {
  if (n.link) return n.link;
  const base = TYPE_ROUTE[n.type] ?? "/dashboard";
  if (n.referenceId != null && DEEP_LINKABLE.has(n.type)) {
    return `${base}/${n.referenceId}`;
  }
  return base;
}

function timeAgo(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-stone-200/80 rounded-2xl p-4 flex items-start gap-3.5"
        >
          <div className="w-9 h-9 rounded-xl bg-stone-200 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2 py-0.5">
            <div className="h-4 w-1/3 bg-stone-200 rounded-lg animate-pulse" />
            <div className="h-3 w-2/3 bg-stone-100 rounded-lg animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Notification Card ─────────────────────────────────────────────────────────

function NotificationCard({
  notification,
  index,
  onOpen,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  index: number;
  onOpen: (n: Notification) => void;
  onMarkRead: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const meta = TYPE_META[notification.type] ?? TYPE_META.SYSTEM;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3), ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(notification)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(notification);
        }
      }}
      className={`group relative bg-white border rounded-2xl p-4 flex items-start gap-3.5 transition-colors cursor-pointer hover:border-indigo-200 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
        ${notification.read
          ? "border-stone-200/80"
          : "border-indigo-100 bg-indigo-50/30"
        }`}
    >
      {/* Type icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.accent}`}>
        {meta.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm truncate ${notification.read ? "font-medium text-stone-700" : "font-bold text-stone-900"}`}>
            {notification.title}
          </p>
          {!notification.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${meta.accent}`}>
            {meta.label}
          </span>
          <span className="text-[11px] text-stone-400">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
      </div>

      {/* Hover actions */}
      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMarkRead(notification.id);
            }}
            title="Mark as read"
            className="p-2 rounded-xl text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          title="Delete"
          className="p-2 rounded-xl text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

type Filter = "all" | "unread";

export default function NotificationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markingAll,
    clearingRead,
    clearError,
  } = useSelector((state: RootState) => state.notification);

  const [filter, setFilter] = useState<Filter>("all");
  const readCount = notifications.length - unreadCount;

  useEffect(() => {
    dispatch(getNotificationsAction());
  }, [dispatch]);

  // Clicking a notification marks it read and jumps straight to the relevant page.
  const handleOpen = (n: Notification) => {
    if (!n.read) dispatch(markAsReadAction(n.id));
    router.push(resolveDestination(n));
  };

  const visible =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  // ── Error state ──
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white border border-rose-100 rounded-2xl p-8 flex flex-col items-center gap-3 text-center max-w-sm shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-rose-400" />
          </div>
          <p className="text-sm font-bold text-stone-800">Failed to load notifications</p>
          <p className="text-xs text-stone-500">{error}</p>
          <button
            onClick={() => dispatch(getNotificationsAction())}
            className="mt-1 text-xs font-semibold text-indigo-600 hover:underline"
          >
            Try again →
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6 flex items-end justify-between flex-wrap gap-3"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-400 mb-1">
            Stay Updated
          </p>
          <h1
            className="text-3xl font-bold text-stone-900 flex items-center gap-3"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Notifications
            {unreadCount > 0 && (
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Clear all read */}
          <button
            onClick={() => dispatch(clearReadNotificationsAction())}
            disabled={clearingRead || readCount === 0 || loading}
            title="Delete all notifications you've already read"
            className="flex items-center gap-2 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-stone-600 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
          >
            {clearingRead ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Clear read
          </button>

          {/* Mark all as read */}
          <button
            onClick={() => dispatch(markAllAsReadAction())}
            disabled={markingAll || unreadCount === 0 || loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
          >
            {markingAll ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCheck className="w-3.5 h-3.5" />
            )}
            Mark all as read
          </button>
        </div>
      </motion.div>

      {/* ── Filter tabs ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center gap-1.5 mb-4"
      >
        {(
          [
            { key: "all",    label: "All",    count: notifications.length },
            { key: "unread", label: "Unread", count: unreadCount          },
          ] as { key: Filter; label: string; count: number }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors
              ${filter === tab.key
                ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                : "text-stone-500 hover:bg-stone-100 border border-transparent"
              }`}
          >
            {tab.label}
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full
                ${filter === tab.key ? "bg-indigo-100 text-indigo-600" : "bg-stone-100 text-stone-500"}`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* ── Clear-read failure notice (inline, dismissible) ── */}
      <AnimatePresence>
        {clearError && (
          <motion.div
            key="clear-error"
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-3 bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="flex-1 text-xs text-rose-700 leading-relaxed">
                {clearError}
              </p>
              <button
                onClick={() => dispatch(dismissClearError())}
                title="Dismiss"
                className="p-1 -m-1 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-100 transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── List ── */}
      {loading ? (
        <NotificationSkeleton />
      ) : visible.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white border border-stone-200/80 rounded-2xl py-16 flex flex-col items-center gap-3 text-center shadow-sm"
        >
          <div className="w-14 h-14 rounded-2xl bg-stone-50 flex items-center justify-center">
            {filter === "unread" ? (
              <CheckCheck className="w-7 h-7 text-stone-300" />
            ) : (
              <BellOff className="w-7 h-7 text-stone-300" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-stone-700">
              {filter === "unread" ? "All caught up!" : "No notifications yet"}
            </p>
            <p className="text-xs text-stone-400 mt-1 max-w-xs">
              {filter === "unread"
                ? "You've read everything. New alerts will show up here."
                : "Deadline alerts, schedule reminders, and group updates will appear here."}
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {visible.map((n, i) => (
              <NotificationCard
                key={n.id}
                notification={n}
                index={i}
                onOpen={handleOpen}
                onMarkRead={(id) => dispatch(markAsReadAction(id))}
                onDelete={(id) => dispatch(deleteNotificationAction(id))}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
