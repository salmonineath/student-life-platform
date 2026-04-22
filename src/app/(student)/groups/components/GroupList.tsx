import { Search, Users } from "lucide-react";
import { GroupSummary } from "@/types/groupMessageType";
import GroupItem from "./GroupItem";

interface Props {
  groups:         GroupSummary[];
  activeId:       number | null;
  search:         string;
  onSearchChange: (val: string) => void;
  onSelect:       (id: number) => void;
}

export default function GroupList({ groups, activeId, search, onSearchChange, onSelect }: Props) {
  const filtered = groups.filter(
    (g) =>
      g.assignmentTitle.toLowerCase().includes(search.toLowerCase()) ||
      g.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`flex flex-col border-r border-slate-100 bg-white ${
      activeId ? "hidden md:flex w-80 shrink-0" : "flex w-full md:w-80 md:shrink-0"
    }`}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3 border-b border-slate-100">
        <h1 className="text-xl font-bold text-slate-900 mb-3">Study Groups</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search groups…"
            className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-semibold text-slate-500">No groups found</p>
          </div>
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
      </div>
    </div>
  );
}