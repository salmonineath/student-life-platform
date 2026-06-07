"use client";

import { motion } from "motion/react";
import { ChatMessage } from "@/types/groupMessageType";
import { getInitials, avatarColor, formatMessageTime } from "@/utils/GroupUtil";

interface Props {
  msg:           ChatMessage;
  prevMsg:       ChatMessage | null;
  currentUserId: number;
}

export default function MessageBubble({ msg, prevMsg, currentUserId }: Props) {
  const isMe      = msg.senderId === currentUserId;
  const showMeta  = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);
  const isGrouped = prevMsg !== null && prevMsg.senderId === msg.senderId;

  const meBubble = isGrouped
    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl rounded-tr-[8px] rounded-br-[8px] shadow-md shadow-indigo-500/20"
    : "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl rounded-br-[5px] shadow-md shadow-indigo-500/20";

  const otherBubble = isGrouped
    ? "bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-tl-[8px] rounded-bl-[8px] shadow-[0_1px_6px_rgba(0,0,0,0.06)]"
    : "bg-white border border-slate-100 text-slate-800 rounded-2xl rounded-bl-[5px] shadow-[0_1px_6px_rgba(0,0,0,0.06)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : ""} ${
        showMeta ? "mt-5" : isGrouped ? "mt-0.5" : "mt-2"
      }`}
    >
      {/* Avatar column (others only) */}
      {!isMe && (
        showMeta ? (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 self-end ${avatarColor(msg.senderId)}`}
          >
            {getInitials(msg.senderFullname)}
          </div>
        ) : (
          <div className="w-8 shrink-0" />
        )
      )}

      {/* Content */}
      <div className={`flex flex-col max-w-[68%] ${isMe ? "items-end" : "items-start"}`}>
        {showMeta && (
          <span className="text-[11px] font-semibold text-slate-500 mb-1.5 px-1">
            {msg.senderFullname}
          </span>
        )}

        <div className={`px-4 py-2.5 text-sm leading-relaxed break-words ${isMe ? meBubble : otherBubble}`}>
          {msg.content}
        </div>

        <span className="text-[10px] text-slate-400 mt-1 px-1 select-none">
          {formatMessageTime(msg.createdAt)}
        </span>
      </div>
    </motion.div>
  );
}
