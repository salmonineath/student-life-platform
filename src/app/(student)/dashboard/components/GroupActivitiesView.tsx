"use client";

import { motion } from "motion/react";
import { GroupSummary } from "@/types/groupMessageType";

interface Props {
  groups: GroupSummary[];
  loading: boolean;
}

const AVATAR_STYLES = [
  { bg: "bg-indigo-200", text: "text-indigo-700", dot: "bg-indigo-500" },
  { bg: "bg-sky-200",    text: "text-sky-700",    dot: "bg-sky-500"    },
  { bg: "bg-violet-200", text: "text-violet-700", dot: "bg-violet-500" },
  { bg: "bg-emerald-200",text: "text-emerald-700",dot: "bg-emerald-500"},
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

function Skeleton() {
  return (
    <div className="p-5 h-full flex flex-col animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-stone-200" />
          <div className="h-4 w-28 bg-stone-200 rounded" />
        </div>
        <div className="h-5 w-16 bg-stone-200 rounded-full" />
      </div>
      <div className="relative flex-1">
        <div className="absolute left-[19px] top-5 bottom-5 w-px bg-stone-100" />
        <ul className="flex flex-col gap-1">
          {[1, 2, 3].map((i) => (
            <li key={i} className="flex items-start gap-3 px-2 py-2.5">
              <div className="w-10 h-10 rounded-xl bg-stone-200 shrink-0" />
              <div className="flex-1 pt-0.5 space-y-1.5">
                <div className="h-3.5 w-3/4 bg-stone-200 rounded" />
                <div className="h-3 w-1/3 bg-stone-200 rounded" />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 pt-3 border-t border-stone-100 h-4 bg-stone-200 rounded w-32 mx-auto" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
      <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-sky-500" viewBox="0 0 20 20" fill="none">
          <circle cx="7" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="13" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
          <path d="M1 17c0-3 2.7-5 6-5M11 12c3.3 0 6 2 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-xs font-medium text-stone-500">No group activity yet</p>
    </div>
  );
}

export default function GroupActivitiesView({ groups, loading }: Props) {
  if (loading) return <Skeleton />;

  const withActivity = groups
    .filter((g) => g.lastMessage && g.lastMessageSender)
    .sort((a, b) =>
      new Date(b.lastMessageTime ?? 0).getTime() - new Date(a.lastMessageTime ?? 0).getTime(),
    )
    .slice(0, 4);

  const activeCount = groups.length;

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-sky-500" />
          <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Group Activity
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {activeCount} {activeCount === 1 ? "group" : "groups"}
        </div>
      </div>

      {withActivity.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="relative flex-1">
          <div className="absolute left-[19px] top-5 bottom-5 w-px bg-stone-200" />
          <ul className="flex flex-col gap-1">
            {withActivity.map((g, i) => {
              const style = AVATAR_STYLES[i % AVATAR_STYLES.length];
              const initials = getInitials(g.lastMessageSender ?? g.ownerName);
              return (
                <motion.li
                  key={g.assignmentId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.35 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative flex items-start gap-3 px-2 py-2.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer"
                >
                  <div className={`relative z-10 w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center text-xs font-bold shrink-0 ring-2 ring-white`}>
                    {initials}
                    <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${style.dot} ring-2 ring-white`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-stone-500 leading-snug">
                      <span className="font-semibold text-stone-800">{g.lastMessageSender}</span>{" "}
                      sent a message in{" "}
                      <span className={`font-semibold ${style.text}`}>{g.assignmentTitle}</span>
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-medium text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded-md">
                      {g.lastMessageTime ? relativeTime(g.lastMessageTime) : ""}
                    </span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}

      <a
        href="/groups"
        className="flex items-center justify-center gap-1.5 mt-3 pt-3 border-t border-stone-200 text-[11px] font-semibold text-stone-500 hover:text-stone-700 transition-colors"
      >
        Open study groups
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
