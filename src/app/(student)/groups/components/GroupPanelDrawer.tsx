"use client";

import { useEffect, useState, useRef } from "react";
import { X, Users, Mail, BookOpen, GraduationCap, UserPlus, Wifi } from "lucide-react";
import { GroupSummary, Member } from "@/types/groupMessageType";
import { getInitials, avatarColor } from "@/utils/GroupUtil";
import axiosInstance from "@/lib/axios";

interface Props {
  group:          GroupSummary;
  onlineUserIds?: number[];
  onClose:        () => void;
  onInvite:       () => void; // opens your existing invite modal
}

export default function GroupPanelDrawer({ group, onlineUserIds = [], onClose, onInvite }: Props) {
  const [members, setMembers]   = useState<Member[]>([]);
  const [loading, setLoading]   = useState(true);
  const drawerRef               = useRef<HTMLDivElement>(null);

  // Fetch members
  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/api/v1/chat/${group.assignmentId}/members`)
      .then((res) => setMembers(res.data.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [group.assignmentId]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  // Merge presence from WebSocket into member list
  const membersWithPresence = members.map((m) => ({
    ...m,
    online: onlineUserIds.includes(m.id) || m.online,
  }));

  const onlineCount = membersWithPresence.filter((m) => m.online).length;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-30 transition-opacity" />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-40 flex flex-col animate-slide-in"
        style={{ animation: "slideInRight 0.25s cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(group.assignmentId)}`}>
                {getInitials(group.assignmentTitle)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">
                  {group.assignmentTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{group.subject}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Group meta */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Users size={12} />
                <span className="text-[10px] font-medium uppercase tracking-wide">Members</span>
              </div>
              <span className="text-lg font-bold text-slate-800">{group.memberCount}</span>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-green-500 mb-1">
                <Wifi size={12} />
                <span className="text-[10px] font-medium uppercase tracking-wide">Online</span>
              </div>
              <span className="text-lg font-bold text-green-600">{onlineCount}</span>
            </div>
          </div>

          {/* Owner */}
          <div className="mt-3 text-xs text-slate-400">
            <span className="font-medium text-slate-500">Owner:</span> {group.ownerName}
          </div>
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                Members ({members.length})
              </h3>
              <button
                onClick={onInvite}
                className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 rounded-lg transition-colors"
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
            ) : (
              <div className="space-y-1">
                {membersWithPresence.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {/* Avatar with online dot */}
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

                    {/* Online label */}
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

        {/* Footer info */}
        <div className="px-5 py-4 border-t border-slate-100 shrink-0 space-y-2">
          {group.subject && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <BookOpen size={12} className="text-slate-400 shrink-0" />
              <span>{group.subject}</span>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}