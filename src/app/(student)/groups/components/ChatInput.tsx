"use client";

import { useRef } from "react";
import { Send } from "lucide-react";

interface Props {
  value:    string;
  onChange: (val: string) => void;
  onSend:   () => void;
}

export default function ChatInput({ value, onChange, onSend }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
      ref.current?.focus();
    }
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-slate-100">
      <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message…"
          rows={1}
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none max-h-32 py-0.5"
        />
        <button
          onClick={onSend}
          disabled={!value.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shrink-0 active:scale-95"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="text-[10px] text-slate-300 text-center mt-1.5">
        Messages auto-delete after 5 days · Enter to send
      </p>
    </div>
  );
}