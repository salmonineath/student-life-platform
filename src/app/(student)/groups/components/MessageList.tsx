"use client";

import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { ChatMessage } from "@/types/groupMessageType";
import { formatDateSeparator } from "@/utils/GroupUtil";
import MessageBubble from "./MessageBubble";

interface Props {
  messages:      ChatMessage[];
  currentUserId: number;
}

export default function MessageList({ messages, currentUserId }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center bg-slate-50">
        <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
          <MessageSquare className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-slate-400">No messages yet</p>
        <p className="text-xs text-slate-300 mt-1">Say hello to your group! 👋</p>
      </div>
    );
  }

  const grouped: { date: string; items: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const date = formatDateSeparator(msg.createdAt);
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) last.items.push(msg);
    else grouped.push({ date, items: [msg] });
  });

  return (
    <div className="min-h-full px-4 py-4 space-y-4 bg-slate-50">
      {grouped.map(({ date, items }) => (
        <div key={date}>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              {date}
            </span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <div className="space-y-1">
            {items.map((msg, idx) => (
              <MessageBubble
                key={msg.id}
                msg={msg}
                prevMsg={idx > 0 ? items[idx - 1] : null}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}