"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Users, Search, MessageSquare, ArrowLeft } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface GroupSummary {
  assignmentId: number;
  assignmentTitle: string;
  subject: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSender?: string;
}

interface ChatMessage {
  id: number;
  assignmentId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
}

// ── Static Demo Data ──────────────────────────────────────────────────────────

const CURRENT_USER = { id: 1, name: "You" };

const DEMO_GROUPS: GroupSummary[] = [
  {
    assignmentId: 1,
    assignmentTitle: "Algorithms & Data Structures",
    subject: "CS301",
    memberCount: 6,
    lastMessage: "Did you finish problem set 4?",
    lastMessageTime: new Date().toISOString(),
    lastMessageSender: "Sarah Kim",
  },
  {
    assignmentId: 2,
    assignmentTitle: "Organic Chemistry Lab",
    subject: "CHEM210",
    memberCount: 4,
    lastMessage: "Bring your safety goggles!",
    lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
    lastMessageSender: "James Wu",
  },
  {
    assignmentId: 3,
    assignmentTitle: "Macroeconomics Study",
    subject: "ECON201",
    memberCount: 8,
    lastMessage: "Here are my notes from lecture",
    lastMessageTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastMessageSender: "You",
  },
  {
    assignmentId: 4,
    assignmentTitle: "Linear Algebra Review",
    subject: "MATH220",
    memberCount: 5,
    lastMessage: "Chapter 5 eigenvectors done",
    lastMessageTime: new Date(Date.now() - 2 * 86400000).toISOString(),
    lastMessageSender: "Priya S.",
  },
  {
    assignmentId: 5,
    assignmentTitle: "English Literature",
    subject: "ENG105",
    memberCount: 7,
    lastMessage: "Great discussion today everyone",
    lastMessageTime: new Date(Date.now() - 3 * 86400000).toISOString(),
    lastMessageSender: "Tom B.",
  },
];

const DEMO_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, assignmentId: 1, senderId: 10, senderName: "Sarah Kim",  content: "Hey everyone! Has anyone started on problem set 4 yet?",    createdAt: new Date(Date.now() - 40 * 60000).toISOString() },
    { id: 2, assignmentId: 1, senderId: 11, senderName: "Marcus T.",  content: "Not yet, the binary tree section looks tough 😅",            createdAt: new Date(Date.now() - 38 * 60000).toISOString() },
    { id: 3, assignmentId: 1, senderId: 11, senderName: "Marcus T.",  content: "Anyone want to pair on it tonight?",                         createdAt: new Date(Date.now() - 37 * 60000).toISOString() },
    { id: 4, assignmentId: 1, senderId: 1,  senderName: "You",        content: "I can do 8pm if that works!",                               createdAt: new Date(Date.now() - 33 * 60000).toISOString() },
    { id: 5, assignmentId: 1, senderId: 10, senderName: "Sarah Kim",  content: "8pm works for me too!",                                     createdAt: new Date(Date.now() - 31 * 60000).toISOString() },
    { id: 6, assignmentId: 1, senderId: 10, senderName: "Sarah Kim",  content: "Did you finish problem set 4?",                             createdAt: new Date(Date.now() - 11 * 60000).toISOString() },
  ],
  2: [
    { id: 1, assignmentId: 2, senderId: 20, senderName: "James Wu",   content: "Lab report is due Friday, just a reminder for everyone",    createdAt: new Date(Date.now() - 86400000 - 3 * 3600000).toISOString() },
    { id: 2, assignmentId: 2, senderId: 1,  senderName: "You",        content: "Thanks for the heads up! I'm halfway through mine.",        createdAt: new Date(Date.now() - 86400000 - 2 * 3600000).toISOString() },
    { id: 3, assignmentId: 2, senderId: 20, senderName: "James Wu",   content: "Bring your safety goggles!",                               createdAt: new Date(Date.now() - 86400000 - 1 * 3600000).toISOString() },
  ],
  3: [
    { id: 1, assignmentId: 3, senderId: 1,  senderName: "You",        content: "Here are my notes from lecture today",                     createdAt: new Date(Date.now() - 2 * 86400000 - 2 * 3600000).toISOString() },
    { id: 2, assignmentId: 3, senderId: 30, senderName: "Anika P.",   content: "These are so helpful, thank you!",                         createdAt: new Date(Date.now() - 2 * 86400000 - 1 * 3600000).toISOString() },
    { id: 3, assignmentId: 3, senderId: 30, senderName: "Anika P.",   content: "Does anyone understand the IS-LM model?",                  createdAt: new Date(Date.now() - 2 * 86400000 - 3600000 + 600000).toISOString() },
  ],
  4: [
    { id: 1, assignmentId: 4, senderId: 40, senderName: "Priya S.",   content: "Chapter 5 eigenvectors done, moving on to eigenvalues",    createdAt: new Date(Date.now() - 2 * 86400000 - 5 * 3600000).toISOString() },
    { id: 2, assignmentId: 4, senderId: 1,  senderName: "You",        content: "Nice work! I just finished chapter 4.",                    createdAt: new Date(Date.now() - 2 * 86400000 - 4 * 3600000).toISOString() },
  ],
  5: [
    { id: 1, assignmentId: 5, senderId: 50, senderName: "Tom B.",     content: "Great discussion today everyone, really helped clarify the themes.", createdAt: new Date(Date.now() - 3 * 86400000 - 2 * 3600000).toISOString() },
    { id: 2, assignmentId: 5, senderId: 1,  senderName: "You",        content: "Agreed! The symbolism section was eye-opening.",           createdAt: new Date(Date.now() - 3 * 86400000 - 1 * 3600000).toISOString() },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-cyan-100 text-cyan-700",
  "bg-amber-100 text-amber-700",
  "bg-emerald-100 text-emerald-700",
  "bg-pink-100 text-pink-700",
  "bg-violet-100 text-violet-700",
];

function avatarColor(id: number) {
  return AVATAR_COLORS[id % AVATAR_COLORS.length];
}

function formatTime(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
}

function formatDateSeparator(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();
  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// ── Group List Item ───────────────────────────────────────────────────────────

function GroupItem({
  group,
  isActive,
  onClick,
}: {
  group: GroupSummary;
  isActive: boolean;
  onClick: () => void;
}) {
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
            <span className="text-[10px] text-slate-400 shrink-0">{formatTime(group.lastMessageTime)}</span>
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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function GroupsPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const [groups, setGroups] = useState<GroupSummary[]>(DEMO_GROUPS);
  const [messageMap, setMessageMap] = useState<Record<number, ChatMessage[]>>(DEMO_MESSAGES);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeGroup = groups.find((g) => g.assignmentId === activeId) ?? null;
  const messages = activeId ? (messageMap[activeId] ?? []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !activeId) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      assignmentId: activeId,
      senderId: CURRENT_USER.id,
      senderName: CURRENT_USER.name,
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessageMap((prev) => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), newMsg],
    }));

    setGroups((prev) =>
      prev.map((g) =>
        g.assignmentId === activeId
          ? { ...g, lastMessage: input.trim(), lastMessageTime: newMsg.createdAt, lastMessageSender: "You" }
          : g
      )
    );

    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearHistory = () => {
    if (!activeId) return;
    setMessageMap((prev) => ({ ...prev, [activeId]: [] }));
    setGroups((prev) =>
      prev.map((g) =>
        g.assignmentId === activeId
          ? { ...g, lastMessage: undefined, lastMessageTime: undefined, lastMessageSender: undefined }
          : g
      )
    );
    setShowClearConfirm(false);
  };

  // Group messages by date
  const groupedMessages: { date: string; items: ChatMessage[] }[] = [];
  messages.forEach((msg) => {
    const date = formatDateSeparator(msg.createdAt);
    const last = groupedMessages[groupedMessages.length - 1];
    if (last && last.date === date) last.items.push(msg);
    else groupedMessages.push({ date, items: [msg] });
  });

  const filteredGroups = groups.filter(
    (g) =>
      g.assignmentTitle.toLowerCase().includes(search.toLowerCase()) ||
      g.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen overflow-hidden">

      {/* ── Left Panel: Group List ── */}
      <div className={`flex flex-col border-r border-slate-100 bg-white ${
        activeId ? "hidden md:flex w-80 shrink-0" : "flex w-full md:w-80 md:shrink-0"
      }`}>
        <div className="px-4 pt-5 pb-3 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900 mb-3">Study Groups</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search groups…"
              className="w-full pl-9 pr-3 py-2 bg-slate-100 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-2">
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No groups found</p>
            </div>
          ) : (
            filteredGroups.map((group) => (
              <GroupItem
                key={group.assignmentId}
                group={group}
                isActive={group.assignmentId === activeId}
                onClick={() => setActiveId(group.assignmentId)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right Panel: Chat ── */}
      <div className={`flex-1 flex flex-col min-w-0 ${!activeId ? "hidden md:flex" : "flex"}`}>
        {!activeGroup ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">Select a group</h2>
            <p className="text-sm text-slate-400 max-w-xs">
              Choose a study group from the left to start chatting with your team.
            </p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 bg-white">
              <button
                onClick={() => setActiveId(null)}
                className="md:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition"
              >
                <ArrowLeft size={18} />
              </button>

              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(activeGroup.assignmentId)}`}>
                {getInitials(activeGroup.assignmentTitle)}
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">{activeGroup.assignmentTitle}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">{activeGroup.memberCount} members</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs text-slate-400">Online</span>
                </div>
              </div>

              <button className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-indigo-50 transition">
                <Users size={14} /> Members
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-slate-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                  <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
                    <MessageSquare className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-sm font-semibold text-slate-400">No messages yet</p>
                  <p className="text-xs text-slate-300 mt-1">Say hello to your group! 👋</p>
                </div>
              ) : (
                groupedMessages.map(({ date, items }) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-slate-200" />
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                        {date}
                      </span>
                      <div className="flex-1 h-px bg-slate-200" />
                    </div>

                    <div className="space-y-1">
                      {items.map((msg, idx) => {
                        const isMe = msg.senderId === CURRENT_USER.id;
                        const prevMsg = idx > 0 ? items[idx - 1] : null;
                        const showAvatar = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);
                        const showName = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""} ${showAvatar ? "mt-3" : "mt-0.5"}`}
                          >
                            {!isMe ? (
                              showAvatar ? (
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 self-end ${avatarColor(msg.senderId)}`}>
                                  {getInitials(msg.senderName)}
                                </div>
                              ) : (
                                <div className="w-8 shrink-0" />
                              )
                            ) : null}

                            <div className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                              {showName && (
                                <span className="text-[11px] font-semibold text-slate-500 mb-1 px-1">
                                  {msg.senderName}
                                </span>
                              )}
                              <div className={`px-4 py-2 rounded-2xl text-sm leading-relaxed break-words ${
                                isMe
                                  ? "bg-indigo-600 text-white rounded-tr-sm"
                                  : "bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm"
                              }`}>
                                {msg.content}
                              </div>
                              <span className="text-[10px] text-slate-400 mt-1 px-1">
                                {formatMessageTime(msg.createdAt)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div className="px-4 py-3 bg-white border-t border-slate-100">
              <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100 transition">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a message…"
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none max-h-32 py-0.5"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all shrink-0 active:scale-95"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-[10px] text-slate-300 text-center mt-1.5">
                Messages auto-delete after 5 days · Enter to send
              </p>
            </div>
          </>
        )}
      </div>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Clear chat history?</h3>
                <p className="text-xs text-slate-500 mt-0.5">This will delete all messages for everyone in the group.</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}