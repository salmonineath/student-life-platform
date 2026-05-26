import { ArrowLeft, Trash2, Menu } from "lucide-react";
import { GroupSummary } from "@/types/groupMessageType";
import { getInitials, avatarColor } from "@/utils/GroupUtil";

interface Props {
  group:          GroupSummary;
  onlineCount:    number;
  onBack:         () => void;
  onClearRequest: () => void;
  onOpenPanel:    () => void;
}

export default function ChatHeader({
  group,
  onlineCount,
  onBack,
  onClearRequest,
  onOpenPanel,
}: Props) {
  const showOnline = onlineCount > 1; // only show "X online" if more than just you

  return (
    <div className="flex items-center gap-2 px-3 py-3 border-b border-slate-100 bg-white shrink-0">

      {/* Back arrow */}
      <button
        onClick={onBack}
        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        title="Back to groups"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Group avatar */}
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColor(group.assignmentId)}`}>
        {getInitials(group.assignmentTitle)}
      </div>

      {/* Name + online status */}
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-bold text-slate-900 truncate leading-tight">
          {group.assignmentTitle}
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400">{group.memberCount} members</span>
          {showOnline && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
              <span className="text-xs text-green-600 font-medium">
                {onlineCount - 1} other{onlineCount - 1 !== 1 ? "s" : ""} online
              </span>
            </>
          )}
        </div>
      </div>

      {/* Clear chat */}
      <button
        onClick={onClearRequest}
        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
        title="Clear chat"
      >
        <Trash2 size={16} />
      </button>

      {/* Hamburger — opens group panel drawer */}
      <button
        onClick={onOpenPanel}
        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors shrink-0"
        title="Group info"
      >
        <Menu size={18} />
      </button>
    </div>
  );
}