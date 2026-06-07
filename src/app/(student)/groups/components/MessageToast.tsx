"use client";

import { X, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { getInitials, avatarColor } from "@/utils/GroupUtil";

export interface ToastMessage {
  id:             string;
  groupTitle:     string;
  assignmentId:   number;
  senderFullname: string;
  content:        string;
}

interface ToastContentProps {
  msg:        ToastMessage;
  toastId:    string | number;
  onNavigate: (assignmentId: number) => void;
}

function MessageToastContent({ msg, toastId, onNavigate }: ToastContentProps) {
  return (
    <div
      className="relative flex items-start gap-3 bg-white border border-slate-100 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-3 w-[320px] cursor-pointer overflow-hidden group"
      onClick={() => {
        onNavigate(msg.assignmentId);
        toast.dismiss(toastId);
      }}
    >
      {/* Animated progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4.8, ease: "linear" }}
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-400 origin-left"
      />

      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(msg.assignmentId)}`}
      >
        {getInitials(msg.groupTitle)}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <MessageSquare size={10} className="text-indigo-500 shrink-0" />
          <span className="text-[10px] font-bold text-indigo-600 truncate">
            {msg.groupTitle}
          </span>
          <span className="text-[10px] text-slate-400 shrink-0 ml-auto">now</span>
        </div>
        <p className="text-xs font-semibold text-slate-800 truncate">{msg.senderFullname}</p>
        <p className="text-xs text-slate-500 truncate mt-0.5">{msg.content}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toast.dismiss(toastId);
        }}
        className="shrink-0 p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
      >
        <X size={11} />
      </button>
    </div>
  );
}

export function showMessageToast(
  msg: ToastMessage,
  onNavigate: (assignmentId: number) => void,
) {
  toast.custom(
    (t) => <MessageToastContent msg={msg} toastId={t} onNavigate={onNavigate} />,
    {
      id:       msg.id,
      duration: 5000,
      unstyled: true,
    },
  );
}
