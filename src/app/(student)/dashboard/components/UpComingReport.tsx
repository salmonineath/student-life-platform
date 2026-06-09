"use client";

import { motion } from "motion/react";
import { Assignments } from "@/types/assignmentType";

interface Props {
  assignments: Assignments[];
  loading: boolean;
}

const STATUS_STYLES = {
  OVERDUE:     { stripe: "bg-rose-500",   subjectChip: "bg-rose-100 text-rose-700",   dueColor: "text-rose-600",   label: "Overdue",  labelBg: "bg-rose-500"   },
  IN_PROGRESS: { stripe: "bg-amber-500",  subjectChip: "bg-amber-100 text-amber-700", dueColor: "text-amber-600",  label: "Due soon", labelBg: "bg-amber-500"  },
  PENDING:     { stripe: "bg-sky-500",    subjectChip: "bg-sky-100 text-sky-700",     dueColor: "text-sky-600",    label: "Pending",  labelBg: "bg-sky-500"    },
  COMPLETED:   { stripe: "bg-emerald-500",subjectChip: "bg-emerald-100 text-emerald-700", dueColor: "text-emerald-600", label: "Done", labelBg: "bg-emerald-500" },
};

function formatDue(dueDate: string): string {
  const diff = Math.ceil((new Date(dueDate).getTime() - Date.now()) / 86_400_000);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff <= 7) return `${diff}d`;
  return new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function Skeleton() {
  return (
    <div className="p-5 h-full flex flex-col animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-stone-200" />
          <div className="h-4 w-20 bg-stone-200 rounded" />
        </div>
        <div className="h-3 w-12 bg-stone-200 rounded" />
      </div>
      <ul className="flex flex-col gap-2 flex-1">
        {[1, 2, 3].map((i) => (
          <li key={i} className="flex items-stretch gap-0 rounded-xl border border-stone-100 overflow-hidden">
            <div className="w-[4px] shrink-0 bg-stone-200" />
            <div className="flex items-center gap-3 flex-1 px-3 py-2.5">
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 bg-stone-200 rounded" />
                <div className="h-2.5 w-1/2 bg-stone-200 rounded" />
              </div>
              <div className="h-4 w-12 bg-stone-200 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-2 py-8">
      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
        <svg className="w-5 h-5 text-amber-500" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10 6v4.5l3 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <p className="text-xs font-medium text-stone-500">No deadlines on the horizon</p>
    </div>
  );
}

export default function UpComingReport({ assignments, loading }: Props) {
  if (loading) return <Skeleton />;

  const items = assignments
    .filter((a) => a.status !== "COMPLETED")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  return (
    <div className="p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-[3px] h-5 rounded-full bg-amber-500" />
          <h2 className="text-sm font-bold text-stone-900" style={{ fontFamily: "var(--font-sora)" }}>
            Deadlines
          </h2>
        </div>
        <a href="/assignments" className="text-[11px] text-stone-500 hover:text-stone-700 font-medium transition-colors">
          View all →
        </a>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="flex flex-col gap-2 flex-1">
          {items.map((item, i) => {
            const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.PENDING;
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.38, delay: 0.3 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                className="group flex items-stretch gap-0 rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 overflow-hidden cursor-pointer transition-all"
              >
                <div className={`w-[4px] shrink-0 ${s.stripe}`} />
                <div className="flex items-center gap-3 flex-1 px-3 py-2.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-stone-800 truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${s.subjectChip}`}>
                        {item.subject}
                      </span>
                      <span className="text-stone-400 text-[10px]">·</span>
                      <span className={`text-[11px] font-medium ${s.dueColor}`}>
                        Due {formatDue(item.dueDate)}
                      </span>
                    </div>
                  </div>
                  <span className={`shrink-0 text-[9px] font-bold uppercase tracking-wide text-white px-2 py-0.5 rounded-full ${s.labelBg}`}>
                    {s.label}
                  </span>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
