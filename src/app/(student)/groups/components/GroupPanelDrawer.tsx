"use client";

import { useEffect, useState } from "react";
import { X, Users, UserPlus, Wifi } from "lucide-react";
import { GroupSummary, Member } from "@/types/groupMessageType";
import { getInitials, avatarColor } from "@/utils/GroupUtil";
import axiosInstance from "@/lib/axios";

interface Props {
  group:          GroupSummary;
  onlineUserIds?: number[];
  onClose:        () => void;
  onInvite:       () => void;
}

export default function GroupPanelDrawer({
  group,
  onlineUserIds = [],
  onClose,
  onInvite,
}: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/api/v1/chat/${group.assignmentId}/members`)
      .then((res) => setMembers(res.data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [group.assignmentId]);

  const membersWithPresence = members.map((m) => ({
    ...m,
    online: onlineUserIds.includes(m.id) || m.online,
  }));

  const onlineCount = membersWithPresence.filter((m) => m.online).length;

  // This component fills 100% of its parent column — no fixed/absolute/overlay
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 shrink-0">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(group.assignmentId)}`}>
              {getInitials(group.assignmentTitle)}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">
                {group.assignmentTitle}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 truncate">{group.subject}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1">
              <Users size={11} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">Members</span>
            </div>
            <span className="text-xl font-bold text-slate-800">{group.memberCount}</span>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-green-500 mb-1">
              <Wifi size={11} />
              <span className="text-[10px] font-semibold uppercase tracking-wide">Online</span>
            </div>
            <span className="text-xl font-bold text-green-600">{onlineCount}</span>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-3">
          <span className="font-medium text-slate-500">Owner:</span> {group.ownerName}
        </p>
      </div>

      {/* Members list — scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="px-4 pt-3 pb-4">

          {/* Section header + invite button */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
              Members ({members.length})
            </span>
            <button
              onClick={onInvite}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <UserPlus size={12} />
              Invite
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-9 h-9 bg-slate-100 rounded-full shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                    <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : membersWithPresence.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Users size={18} className="text-slate-300" />
              </div>
              <p className="text-xs text-slate-400">No members yet</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {membersWithPresence.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  {/* Avatar + online dot */}
                  <div className="relative shrink-0">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(member.id)}`}>
                      {getInitials(member.fullname)}
                    </div>
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      member.online ? "bg-green-500" : "bg-slate-300"
                    }`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate leading-tight">
                      {member.fullname}
                    </p>
                    <p className="text-xs text-slate-400 truncate">@{member.username}</p>
                  </div>

                  {/* Status */}
                  <span className={`text-[10px] font-semibold shrink-0 ${
                    member.online ? "text-green-500" : "text-slate-300"
                  }`}>
                    {member.online ? "Online" : "Offline"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}