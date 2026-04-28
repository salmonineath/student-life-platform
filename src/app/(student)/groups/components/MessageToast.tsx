"use client";

import { useEffect, useState } from "react";
import { X, MessageSquare } from "lucide-react";
import { getInitials, avatarColor } from "@/utils/GroupUtil";

export interface ToastMessage {
  id:             string;
  groupTitle:     string;
  assignmentId:   number;
  senderFullname: string;
  content:        string;
}

interface Props {
  toasts:   ToastMessage[];
  onDismiss: (id: string) => void;
  onNavigate: (assignmentId: number) => void;
}

export default function MessageToast({ toasts, onDismiss, onNavigate }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={onDismiss}
          onNavigate={onNavigate}
        />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
  onNavigate,
}: {
  toast:      ToastMessage;
  onDismiss:  (id: string) => void;
  onNavigate: (id: number) => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true));
    // Auto-dismiss after 5s
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="pointer-events-auto"
      style={{
        transform: visible ? "translateX(0)" : "translateX(120%)",
        opacity:   visible ? 1 : 0,
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease",
      }}
    >
      <div
        className="flex items-start gap-3 bg-white border border-slate-200 rounded-2xl shadow-lg px-4 py-3 w-72 cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => { onNavigate(toast.assignmentId); onDismiss(toast.id); }}
      >
        {/* Avatar */}
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(toast.assignmentId)}`}>
          {getInitials(toast.groupTitle)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[10px] font-bold text-indigo-600 truncate">{toast.groupTitle}</span>
          </div>
          <p className="text-xs font-semibold text-slate-700 truncate">{toast.senderFullname}</p>
          <p className="text-xs text-slate-500 truncate mt-0.5">{toast.content}</p>
        </div>

        {/* Dismiss */}
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(toast.id); }}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 shrink-0 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}