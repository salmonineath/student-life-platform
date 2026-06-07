"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare } from "lucide-react";
import { ChatMessage } from "@/types/groupMessageType";
import { formatDateSeparator } from "@/utils/GroupUtil";
import MessageBubble from "./MessageBubble";

interface Props {
  messages:      ChatMessage[];
  currentUserId: number;
  isTyping?:     { name: string } | null;
}

function TypingIndicator({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      className="flex items-end gap-2.5 mt-2"
    >
      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 self-end">
        ···
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[11px] font-semibold text-slate-400 mb-1.5 px-1">{name}</span>
        <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-[5px] px-4 py-3 shadow-[0_1px_6px_rgba(0,0,0,0.06)] flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 block"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function MessageList({ messages, currentUserId, isTyping }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (messages.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-20 text-center bg-[#f4f5f8]">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Animated icon */}
          <div className="relative mb-5">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.07)]"
            >
              <MessageSquare className="w-7 h-7 text-indigo-400" />
            </motion.div>
            {/* Decorative dots */}
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-indigo-300"
                style={{
                  top:  i === 0 ? -4  : i === 1 ? 2 : -8,
                  right: i === 0 ? -4 : i === 1 ? -10 : 6,
                }}
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </div>

          <p className="text-sm font-bold text-slate-700 mb-1">No messages yet</p>
          <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
            Be the first to say something. Your team is waiting! 👋
          </p>
        </motion.div>
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
    <div className="min-h-full px-5 py-5 space-y-2 bg-[#f4f5f8]">
      {grouped.map(({ date, items }) => (
        <div key={date}>
          {/* Date separator */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-slate-200/80" />
            <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200/80 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
              {date}
            </span>
            <div className="flex-1 h-px bg-slate-200/80" />
          </div>

          <div className="space-y-0.5">
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

      {/* Typing indicator */}
      <AnimatePresence>
        {isTyping && <TypingIndicator name={isTyping.name} />}
      </AnimatePresence>

      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
