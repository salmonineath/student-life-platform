"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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

export default function GroupsPage() {
  const dispatch = useDispatch<AppDispatch>();

  // ── Auth: current user from your existing Redux auth slice ───────────────
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const {
    groups,
    messageMap,
    activeId,
    input,
    search,
    showClearConfirm,
  } = useSelector((state: RootState) => state.group);

  const activeGroup = groups.find((g) => g.assignmentId === activeId) ?? null;
  const messages    = activeId ? (messageMap[activeId] ?? []) : [];

  // ── Load groups on mount ──────────────────────────────────────────────────
  useEffect(() => {
    dispatch(getAllGroupAction());
  }, [dispatch]);

  // ── Load history when switching groups ────────────────────────────────────
  useEffect(() => {
    if (!activeId) return;
    if (messageMap[activeId]) return; // already loaded
    dispatch(getChatHistoryAction(activeId));
  }, [activeId, dispatch]);

  // ── WebSocket — real-time incoming messages ───────────────────────────────
  const handleIncoming = useCallback(
    (msg: ChatMessage) => {
      dispatch(appendIncomingMessage(msg));
    },
    [dispatch]
  );

  const { sendMessage: wsSend } = useGroupSocket({
    assignmentId: activeId,
    onMessage:    handleIncoming,
  });

  // ── Send ─────────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!input.trim() || !activeId || !currentUser) return;

    const optimistic: ChatMessage = {
      id:             Date.now(),       // temp id — real one comes back via WS
      assignmentId:   activeId,
      senderId:       currentUser.id,
      senderFullname: currentUser.fullname,  // matches AuthUser.fullname
      senderUsername: currentUser.username,
      content:        input.trim(),
      createdAt:      new Date().toISOString(),
    };

    dispatch(appendOptimisticMessage(optimistic));
    wsSend(activeId, input.trim());
  };

  // ── Clear ─────────────────────────────────────────────────────────────────
  const handleClear = () => {
    if (!activeId) return;
    dispatch(clearChatHistoryAction(activeId));
  };

  // ── Guard: user not loaded yet ────────────────────────────────────────────
  if (!currentUser) return null;

  return (
    <div className="flex h-full overflow-hidden">
      <GroupList
        groups={groups}
        activeId={activeId}
        search={search}
        onSearchChange={(val) => dispatch(setSearch(val))}
        onSelect={(id) => dispatch(setActiveId(id))}
      />

      <ChatPanel
        activeGroup={activeGroup}
        messages={messages}
        currentUserId={currentUser.id}
        input={input}
        onInputChange={(val) => dispatch(setInput(val))}
        onSend={handleSend}
        onBack={() => dispatch(setActiveId(null))}
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