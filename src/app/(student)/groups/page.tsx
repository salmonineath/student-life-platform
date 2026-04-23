"use client";

import { useEffect, useCallback, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation"; // ← added useRouter
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
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter(); // ← added
  const searchParams = useSearchParams();
  const assignmentIdParam = searchParams.get("assignmentId");

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { groups, messageMap, activeId, input, search, showClearConfirm } =
    useSelector((state: RootState) => state.group);

  const activeGroup = groups.find((g) => g.assignmentId === activeId) ?? null;
  const messages    = activeId ? (messageMap[activeId] ?? []) : [];

  // Load groups on mount
  useEffect(() => {
    dispatch(getAllGroupAction());
  }, [dispatch]);

  // Auto-select group from URL param once groups are loaded
  useEffect(() => {
    if (!assignmentIdParam || groups.length === 0) return;
    const id = Number(assignmentIdParam);
    if (id === activeId) return;
    const exists = groups.some((g) => g.assignmentId === id);
    if (exists) dispatch(setActiveId(id));
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

  const { sendMessage: wsSend } = useGroupSocket({
    assignmentId: activeId,
    onMessage:    handleIncoming,
  });

  // ← added: updates both Redux state AND the URL
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
  };

  const handleClear = () => {
    if (!activeId) return;
    dispatch(clearChatHistoryAction(activeId));
  };

  if (!currentUser) return null;

  return (
    <div className="flex h-full overflow-hidden">
      <GroupList
        groups={groups}
        activeId={activeId}
        search={search}
        onSearchChange={(val) => dispatch(setSearch(val))}
        onSelect={handleSelect} // ← was: (id) => dispatch(setActiveId(id))
      />
      <ChatPanel
        activeGroup={activeGroup}
        messages={messages}
        currentUserId={currentUser.id}
        input={input}
        onInputChange={(val) => dispatch(setInput(val))}
        onSend={handleSend}
        onBack={() => {
          dispatch(setActiveId(null));
          router.replace("/groups", { scroll: false }); // ← clear param on back
        }}
        onClearRequest={() => dispatch(setShowClearConfirm(true))}
      />
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
    <Suspense fallback={<div className="flex h-full" />}>
      <GroupsContent />
    </Suspense>
  );
}