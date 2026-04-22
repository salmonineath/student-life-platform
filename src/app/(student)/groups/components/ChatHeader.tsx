import { ArrowLeft, Users, Trash2 } from "lucide-react";
import { GroupSummary } from "@/types/groupMessageType";
import { getInitials, avatarColor } from "@/utils/GroupUtil";

interface Props {
  group:          GroupSummary;
  onBack:         () => void;
  onClearRequest: () => void;
}

export default function ChatHeader({ group, onBack, onClearRequest }: Props) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white">
      {/* Mobile back */}
      <button
        onClick={onBack}
        className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
      >
        <ArrowLeft size={18} />
      </button>

      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(group.assignmentId)}`}>
        {getInitials(group.assignmentTitle)}
      </div>

      {/* Name + meta */}
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-bold text-slate-900 truncate">{group.assignmentTitle}</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{group.memberCount} members</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs text-slate-400">Online</span>
        </div>
      </div>

      {/* Actions */}
      <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-indigo-50 transition">
        <Users size={14} /> Members
      </button>
      <button
        onClick={onClearRequest}
        className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}