"use client";

import { useEffect, useCallback, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { AppDispatch, RootState } from "@/redux/store";

import {
  setActiveId,
  setInput,
  setSearch,
  setShowClearConfirm,
  appendOptimisticMessage,
  appendIncomingMessage,
} from "./core/reducer";
import {
  getAllGroupAction,
  getChatHistoryAction,
  clearChatHistoryAction,
} from "./core/action";
import { useGroupSocket } from "@/hooks/useGroupSocket";
import { ChatMessage } from "@/types/groupMessageType";

import GroupList         from "./components/GroupList";
import ChatPanel         from "./components/ChatPanel";
import ClearConfirmModal from "./modal/ClearConfirmModal";

function GroupsContent() {
  const dispatch   = useDispatch<AppDispatch>();
  const router     = useRouter();
  const searchParams = useSearchParams();
  const assignmentIdParam = searchParams.get("assignmentId");

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { groups, messageMap, activeId, input, search, showClearConfirm } =
    useSelector((state: RootState) => state.group);

  const activeGroup = groups.find((g) => g.assignmentId === activeId) ?? null;
  const messages    = activeId ? (messageMap[activeId] ?? []) : [];

  // Study-groups sidebar toggle (separate from the main app sidebar)
  const [groupSidebarCollapsed, setGroupSidebarCollapsed] = useState(false);

  // Load groups on mount
  useEffect(() => { dispatch(getAllGroupAction()); }, [dispatch]);

  // Auto-select from URL param
  useEffect(() => {
    if (!assignmentIdParam || groups.length === 0) return;
    const id = Number(assignmentIdParam);
    if (id === activeId) return;
    if (groups.some((g) => g.assignmentId === id)) dispatch(setActiveId(id));
  }, [assignmentIdParam, groups]);

  // Load history when switching groups
  useEffect(() => {
    if (!activeId) return;
    if (messageMap[activeId]) return;
    dispatch(getChatHistoryAction(activeId));
  }, [activeId, dispatch]);

  // WebSocket
  const handleIncoming = useCallback(
    (msg: ChatMessage) => { dispatch(appendIncomingMessage(msg)); },
    [dispatch]
  );
  const { sendMessage: wsSend } = useGroupSocket({ assignmentId: activeId, onMessage: handleIncoming });

  const handleSelect = (id: number) => {
    dispatch(setActiveId(id));
    router.replace(`/groups?assignmentId=${id}`, { scroll: false });
  };

  const handleSend = () => {
    if (!input.trim() || !activeId || !currentUser) return;
    const optimistic: ChatMessage = {
      id:             Date.now(),
      assignmentId:   activeId,
      senderId:       currentUser.id,
      senderFullname: currentUser.fullname,
      senderUsername: currentUser.username,
      content:        input.trim(),
      createdAt:      new Date().toISOString(),
    };
    dispatch(appendOptimisticMessage(optimistic));
    wsSend(activeId, input.trim());
    dispatch(setInput(""));
  };

  const handleBack = () => {
    dispatch(setActiveId(null));
    router.replace("/groups", { scroll: false });
  };

  const handleClear = () => {
    if (!activeId) return;
    dispatch(clearChatHistoryAction(activeId));
  };

  if (!currentUser) return null;

  return (
    // This fills the full height given by the layout's overflow-hidden container
    <div className="flex h-full w-full overflow-hidden">

      {/* Study groups sidebar */}
      <div
        className="flex flex-col bg-white border-r border-slate-100 shrink-0 h-full overflow-hidden transition-[width] duration-300 ease-in-out"
        style={{ width: groupSidebarCollapsed ? 64 : 280 }}
      >
        <GroupList
          groups={groups}
          activeId={activeId}
          search={search}
          collapsed={groupSidebarCollapsed}
          onSearchChange={(val) => dispatch(setSearch(val))}
          onSelect={handleSelect}
          onToggleCollapse={() => setGroupSidebarCollapsed((c) => !c)}
        />
      </div>

      {/* Chat panel — fills remaining space, flex column so header/input stay fixed */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <ChatPanel
          activeGroup={activeGroup}
          messages={messages}
          currentUserId={currentUser.id}
          input={input}
          onInputChange={(val) => dispatch(setInput(val))}
          onSend={handleSend}
          onBack={handleBack}
          onClearRequest={() => dispatch(setShowClearConfirm(true))}
        />
      </div>

      {showClearConfirm && (
        <ClearConfirmModal
          onConfirm={handleClear}
          onCancel={() => dispatch(setShowClearConfirm(false))}
        />
      )}
    </div>
  );
}

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="flex h-full bg-white" />}>
      <GroupsContent />
    </Suspense>
  );
}