"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X, Users, BookOpen, UserPlus, Wifi, Crown } from "lucide-react";
import { GroupSummary, Member } from "@/types/groupMessageType";
import { getInitials, avatarColor } from "@/utils/GroupUtil";
import axiosInstance from "@/lib/axios";

interface Props {
  group:          GroupSummary;
  onlineUserIds?: number[];
  onClose:        () => void;
  onInvite:       () => void;
}

export default function GroupPanelDrawer({ group, onlineUserIds = [], onClose, onInvite }: Props) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setMembers([]);
    axiosInstance
      .get(`/chat/${group.assignmentId}/members`)
      .then((res) => {
        if (cancelled) return;
        const raw: Member[] = res.data.data ?? [];
        const unique = Array.from(new Map(raw.map((m) => [m.id, m])).values());
        setMembers(unique);
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [group.assignmentId]);

  const membersWithPresence = members.map((m) => ({
    ...m,
    online: onlineUserIds.includes(m.id) || m.online,
  }));

  const onlineCount = membersWithPresence.filter((m) => m.online).length;
  const displayMemberCount = loading ? group.memberCount : members.length;

  return (
      /* Outer shell animates width so the chat panel smoothly compresses */
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 320 }}
        exit={{ width: 0, transition: { duration: 0.22, ease: [0.4, 0, 1, 1] } }}
        transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
        className="h-full shrink-0 overflow-hidden"
      >
      {/* Inner panel — fixed width so content never wraps during animation */}
      <div className="h-full w-80 bg-white border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(group.assignmentId)}`}>
                {getInitials(group.assignmentTitle)}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 leading-tight">{group.assignmentTitle}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{group.subject}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
            >
              <X size={16} />
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="bg-indigo-50 border border-indigo-100/80 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-indigo-400 mb-1.5">
                <Users size={11} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Members</span>
              </div>
              <span className="text-xl font-black text-indigo-700 tabular-nums">{displayMemberCount}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100/80 rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1.5">
                <Wifi size={11} />
                <span className="text-[9px] font-bold uppercase tracking-widest">Online</span>
              </div>
              <span className="text-xl font-black text-emerald-600 tabular-nums">{onlineCount}</span>
            </div>
          </div>

          {/* Owner */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 rounded-xl px-3 py-2">
            <Crown size={11} className="text-amber-400 shrink-0" />
            <span>Created by <span className="font-semibold text-slate-600">{group.ownerName}</span></span>
          </div>
        </div>

        {/* Members list */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Members ({displayMemberCount})
              </h3>
              <button
                onClick={onInvite}
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <UserPlus size={11} />
                Invite
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 animate-pulse">
                    <div className="w-9 h-9 bg-slate-100 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 bg-slate-100 rounded-full w-2/3" />
                      <div className="h-2.5 bg-slate-100 rounded-full w-1/2" />
                    </div>
                    <div className="h-3 w-10 bg-slate-100 rounded-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1">
                {membersWithPresence.map((member, i) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28, delay: i * 0.03, ease: [0.4, 0, 0.2, 1] }}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    {/* Avatar + presence dot */}
                    <div className="relative shrink-0">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${avatarColor(member.id)}`}>
                        {getInitials(member.fullname)}
                      </div>
                      <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                        member.online ? "bg-emerald-500" : "bg-slate-300"
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{member.fullname}</p>
                      <p className="text-xs text-slate-400 truncate">@{member.username}</p>
                    </div>

                    <span className={`text-[10px] font-bold shrink-0 ${
                      member.online ? "text-emerald-500" : "text-slate-400"
                    }`}>
                      {member.online ? "Online" : "Away"}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {group.subject && (
          <div className="px-5 py-4 border-t border-slate-100 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <BookOpen size={11} className="text-slate-300 shrink-0" />
              <span className="truncate">{group.subject}</span>
            </div>
          </div>
        )}
      </div>
      </motion.div>
  );
}
