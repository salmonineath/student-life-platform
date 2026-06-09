import { Search, Users, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GroupSummary } from "@/types/groupMessageType";
import GroupItem from "./GroupItem";
import { avatarColor, getInitials } from "@/utils/GroupUtil";

interface Props {
  groups:           GroupSummary[];
  activeId:         number | null;
  search:           string;
  collapsed:        boolean;
  onSearchChange:   (val: string) => void;
  onSelect:         (id: number) => void;
  onToggleCollapse: () => void;
}

export default function GroupList({
  groups, activeId, search, collapsed, onSearchChange, onSelect, onToggleCollapse,
}: Props) {
  const filtered = groups.filter(
    (g) =>
      g.assignmentTitle.toLowerCase().includes(search.toLowerCase()) ||
      g.subject.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white">

      {/* Header */}
      <div className={`shrink-0 border-b border-slate-100 flex items-center gap-2 transition-all duration-300 ${
        collapsed ? "px-2 py-3.5 justify-center" : "px-4 py-4"
      }`}>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-[13px] font-bold text-slate-900 whitespace-nowrap overflow-hidden">
              Study Groups
            </h1>
            <p className="text-[10px] text-slate-400 mt-0.5">{groups.length} group{groups.length !== 1 ? "s" : ""}</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      {/* Search bar (hidden when collapsed) */}
      <div
        className="shrink-0 overflow-hidden transition-all duration-300"
        style={{ maxHeight: collapsed ? 0 : 64, opacity: collapsed ? 0 : 1 }}
      >
        <div className="px-4 py-2.5 relative">
          <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search groups…"
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-300 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {collapsed ? (
          /* Avatar rail */
          <div className="flex flex-col items-center gap-2 py-3 px-1">
            {groups.map((group) => (
              <button
                key={group.assignmentId}
                onClick={() => onSelect(group.assignmentId)}
                title={group.assignmentTitle}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all hover:scale-110 ${avatarColor(group.assignmentId)} ${
                  group.assignmentId === activeId ? "ring-2 ring-indigo-500 ring-offset-2" : ""
                }`}
              >
                {getInitials(group.assignmentTitle)}
                {group.lastMessage && group.assignmentId !== activeId && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-white" />
                )}
              </button>
            ))}
          </div>
        ) : (
          /* Full list */
          <div className="px-2 py-2">
            <AnimatePresence mode="popLayout">
              {filtered.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 px-4 text-center"
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500">No groups match that search</p>
                  <p className="text-xs text-slate-400 mt-1">Try a different name or keyword.</p>
                </motion.div>
              ) : (
                filtered.map((group) => (
                  <GroupItem
                    key={group.assignmentId}
                    group={group}
                    isActive={group.assignmentId === activeId}
                    onClick={() => onSelect(group.assignmentId)}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
