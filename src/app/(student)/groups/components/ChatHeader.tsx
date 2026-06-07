import { ArrowLeft, Trash2, MoreVertical } from "lucide-react";
import { GroupSummary } from "@/types/groupMessageType";
import { getInitials, avatarColor } from "@/utils/GroupUtil";

interface Props {
  group:          GroupSummary;
  onlineCount:    number;
  onBack:         () => void;
  onClearRequest: () => void;
  onOpenPanel:    () => void;
}

export default function ChatHeader({ group, onlineCount, onBack, onClearRequest, onOpenPanel }: Props) {
  const othersOnline = onlineCount - 1;
  const showOnline   = othersOnline > 0;

  return (
    <div className="relative flex items-center gap-3 px-4 py-3.5 bg-white border-b border-slate-100 shadow-[0_1px_8px_rgba(0,0,0,0.04)] shrink-0">
      {/* Top gradient accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-400 to-transparent pointer-events-none" />

      {/* Back */}
      <button
        onClick={onBack}
        className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors shrink-0"
        title="Back to groups"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Avatar */}
      <div
        className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 cursor-pointer ${avatarColor(group.assignmentId)}`}
        onClick={onOpenPanel}
        title="Group info"
      >
        {getInitials(group.assignmentTitle)}
        {showOnline && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onOpenPanel}>
        <h2 className="text-sm font-bold text-slate-900 truncate leading-tight">
          {group.assignmentTitle}
        </h2>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-500">
            {group.memberCount} member{group.memberCount !== 1 ? "s" : ""}
          </span>
          {showOnline && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {othersOnline} online
            </span>
          )}
        </div>
      </div>

      {/* Clear chat */}
      <button
        onClick={onClearRequest}
        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors shrink-0"
        title="Clear chat history"
      >
        <Trash2 size={16} />
      </button>

      {/* Group info */}
      <button
        onClick={onOpenPanel}
        className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
        title="Group info & members"
      >
        <MoreVertical size={18} />
      </button>
    </div>
  );
}
