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
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
        isActive ? "bg-indigo-50" : "hover:bg-slate-50"
      }`}
    >
      {/* Avatar */}
      <div className={`relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(group.assignmentId)}`}>
        {getInitials(group.assignmentTitle)}
        {unread > 0 && !isActive && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-indigo-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white px-1">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold truncate ${
            isActive ? "text-indigo-700" : unread > 0 ? "text-slate-900 font-bold" : "text-slate-900"
          }`}>
            {group.assignmentTitle}
          </span>
          {group.lastMessageTime && (
            <span className={`text-[10px] shrink-0 ${unread > 0 && !isActive ? "text-indigo-500 font-semibold" : "text-slate-400"}`}>
              {formatSidebarTime(group.lastMessageTime)}
            </span>
          )}
        </div>
        <p className={`text-xs truncate mt-0.5 ${unread > 0 && !isActive ? "text-slate-700 font-medium" : "text-slate-400"}`}>
          {group.lastMessage
            ? `${group.lastMessageSender}: ${group.lastMessage}`
            : `${group.memberCount} members · ${group.subject}`}
        </p>
      </div>
    </button>
  );
}