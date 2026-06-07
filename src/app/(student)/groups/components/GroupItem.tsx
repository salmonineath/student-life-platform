import { motion } from "motion/react";
import { GroupSummary } from "@/types/groupMessageType";
import { getInitials, avatarColor, formatSidebarTime } from "@/utils/GroupUtil";

interface Props {
  group:    GroupSummary;
  isActive: boolean;
  onClick:  () => void;
}

export default function GroupItem({ group, isActive, onClick }: Props) {
  const unread = group.unreadCount ?? 0;

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: isActive ? 0 : 2 }}
      transition={{ duration: 0.15 }}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 text-left ${
        isActive
          ? "bg-indigo-50 shadow-[inset_3px_0_0_#6366f1]"
          : "hover:bg-slate-50 shadow-[inset_3px_0_0_transparent]"
      }`}
    >
      {/* Avatar with unread badge */}
      <div className={`relative w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(group.assignmentId)}`}>
        {getInitials(group.assignmentTitle)}
        {unread > 0 && !isActive && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white px-1"
          >
            {unread > 99 ? "99+" : unread}
          </motion.span>
        )}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm truncate ${
            isActive
              ? "font-bold text-indigo-700"
              : unread > 0
              ? "font-bold text-slate-900"
              : "font-semibold text-slate-800"
          }`}>
            {group.assignmentTitle}
          </span>
          {group.lastMessageTime && (
            <span className={`text-[10px] shrink-0 tabular-nums ${
              unread > 0 && !isActive ? "text-indigo-500 font-semibold" : "text-slate-400"
            }`}>
              {formatSidebarTime(group.lastMessageTime)}
            </span>
          )}
        </div>

        <p className={`text-xs truncate mt-0.5 ${
          unread > 0 && !isActive ? "text-slate-700 font-medium" : "text-slate-400"
        }`}>
          {group.lastMessage
            ? `${group.lastMessageSender}: ${group.lastMessage}`
            : `${group.memberCount} members · ${group.subject}`}
        </p>
      </div>
    </motion.button>
  );
}
