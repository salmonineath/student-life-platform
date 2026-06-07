"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { SendHorizonal } from "lucide-react";

interface Props {
  value:    string;
  onChange: (val: string) => void;
  onSend:   () => void;
}

const MAX_CHARS = 1000;

export default function ChatInput({ value, onChange, onSend }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
      ref.current?.focus();
    }
  };

  const charCount   = value.length;
  const nearLimit   = charCount > MAX_CHARS * 0.85;
  const canSend     = value.trim().length > 0 && charCount <= MAX_CHARS;

  return (
    <div className="shrink-0 px-5 py-4 bg-white border-t border-slate-100 shadow-[0_-1px_12px_rgba(0,0,0,0.04)]">
      <div className="flex items-end gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all duration-200">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          rows={1}
          maxLength={MAX_CHARS}
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none max-h-36 py-0.5 leading-relaxed"
        />

        <motion.button
          onClick={onSend}
          disabled={!canSend}
          whileTap={canSend ? { scale: 0.88 } : undefined}
          className={`p-2.5 rounded-xl shrink-0 transition-all duration-200 ${
            canSend
              ? "bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/30"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          <SendHorizonal size={16} />
        </motion.button>
      </div>

      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-[10px] text-slate-400">
          <kbd className="font-medium">Enter</kbd> to send ·{" "}
          <kbd className="font-medium">Shift+Enter</kbd> for new line
        </p>
        {nearLimit && (
          <p className={`text-[10px] font-semibold tabular-nums ${charCount >= MAX_CHARS ? "text-red-500" : "text-amber-500"}`}>
            {MAX_CHARS - charCount} left
          </p>
        )}
      </div>
    </div>
  );
}
