import { GroupSummary } from "@/types/groupMessageType";
import { getInitials, avatarColor, formatSidebarTime } from "@/utils/GroupUtil";

interface Props {
  group:    GroupSummary;
  isActive: boolean;
  onClick:  () => void;
}

export default function GroupItem({ group, isActive, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${
        isActive ? "bg-indigo-50" : "hover:bg-slate-50"
      }`}
    >
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(group.assignmentId)}`}>
        {getInitials(group.assignmentTitle)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-sm font-semibold truncate ${isActive ? "text-indigo-700" : "text-slate-900"}`}>
            {group.assignmentTitle}
          </span>
          {group.lastMessageTime && (
            <span className="text-[10px] text-slate-400 shrink-0">
              {formatSidebarTime(group.lastMessageTime)}
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {group.lastMessage
            ? `${group.lastMessageSender}: ${group.lastMessage}`
            : `${group.memberCount} members · ${group.subject}`}
        </p>
      </div>
    </button>
  );
}