"use client";

/**
 * ScheduleHighlight
 *
 * Wrap any schedule card/row with this component.
 * If the schedule's id matches highlightId, it:
 *   1. Adds a visible blue ring + background tint
 *   2. Auto-scrolls into view on mount
 *   3. Shows a small "From assignment" badge
 *
 * Usage in DailyView / WeeklyView:
 *
 *   <ScheduleHighlight id={schedule.id} highlightId={highlightId}>
 *     <YourScheduleCard schedule={schedule} />
 *   </ScheduleHighlight>
 */

import { useEffect, useRef } from "react";

interface Props {
  id: number;
  highlightId: number | null;
  children: React.ReactNode;
}

export default function ScheduleHighlight({
  id,
  highlightId,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isHighlighted = highlightId !== null && id === highlightId;

  // Auto-scroll into view when this is the highlighted entry
  useEffect(() => {
    if (isHighlighted && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isHighlighted]);

  if (!isHighlighted) {
    return <>{children}</>;
  }

  return (
    <div
      ref={ref}
      className="relative rounded-2xl ring-2 ring-blue-500 ring-offset-2 bg-blue-50/40"
    >
      {/* Badge */}
      <div className="absolute -top-3 left-4 z-10">
        <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow">
          <svg width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
          From assignment
        </span>
      </div>
      {children}
    </div>
  );
}
