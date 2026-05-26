"use client";

import { useEffect, useCallback, useState, useRef, Suspense } from "react";
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
  updatePresence,
} from "./core/reducer";
import {
  getAllGroupAction,
  getChatHistoryAction,
  clearChatHistoryAction,
} from "./core/action";
import { useGroupSocket }    from "@/hooks/useGroupSocket";
import { ChatMessage, PresenceEvent } from "@/types/groupMessageType";

import GroupList          from "./components/GroupList";
import ChatPanel          from "./components/ChatPanel";
import ClearConfirmModal  from "./modal/ClearConfirmModal";
import GroupPanelDrawer   from "./components/GroupPanelDrawer";
import MessageToast, { ToastMessage } from "./components/MessageToast";

function GroupsContent() {
  const dispatch     = useDispatch<AppDispatch>();
  const router       = useRouter();
  const searchParams = useSearchParams();
  const assignmentIdParam = searchParams.get("assignmentId");

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const { groups, messageMap, activeId, input, search, showClearConfirm } =
    useSelector((state: RootState) => state.group);

  const activeGroup = groups.find((g) => g.assignmentId === activeId) ?? null;
  const messages    = activeId ? (messageMap[activeId] ?? []) : [];

  const [groupSidebarCollapsed, setGroupSidebarCollapsed] = useState(false);
  const [panelOpen, setPanelOpen]   = useState(false);
  const [toasts, setToasts]         = useState<ToastMessage[]>([]);
  const [onlineUserIds, setOnlineUserIds] = useState<number[]>([]);

  // Track onlineCount per group (assignmentId -> count)
  const onlineCountMap = useRef<Record<number, number>>({});
  const activeOnlineCount = activeId ? (onlineCountMap.current[activeId] ?? 0) : 0;

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

  // Handle incoming chat messages
  const handleIncoming = useCallback(
    (msg: ChatMessage) => {
      dispatch(appendIncomingMessage(msg));

      // Show in-app toast if message is from another group or another user
      if (msg.assignmentId !== activeId && msg.senderId !== currentUser?.id) {
        const group = groups.find((g) => g.assignmentId === msg.assignmentId);
        const toast: ToastMessage = {
          id:             `${Date.now()}-${msg.id}`,
          groupTitle:     group?.assignmentTitle ?? "Group",
          assignmentId:   msg.assignmentId,
          senderFullname: msg.senderFullname,
          content:        msg.content,
        };
        setToasts((prev) => [...prev.slice(-4), toast]); // max 5 toasts

        // Browser push notification (OneSignal) — fire and forget
        if (typeof window !== "undefined" && (window as any).OneSignal) {
          // OneSignal handles the actual push — this is just a client hint
          // The real push comes from your backend OneSignal integration
        }
      }
    },
    [dispatch, activeId, currentUser, groups]
  );

  // Handle presence updates
  const handlePresence = useCallback(
    (event: PresenceEvent) => {
      onlineCountMap.current[event.assignmentId] = event.onlineCount;
      setOnlineUserIds(event.onlineUserIds ?? []);
      dispatch(updatePresence(event));
    },
    [dispatch]
  );

  const { sendMessage: wsSend } = useGroupSocket({
    assignmentId: activeId,
    onMessage:    handleIncoming,
    onPresence:   handlePresence,
  });

  const handleSelect = (id: number) => {
    dispatch(setActiveId(id));
    router.replace(`/groups?assignmentId=${id}`, { scroll: false });
    setPanelOpen(false);
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
    setPanelOpen(false);
    router.replace("/groups", { scroll: false });
  };

  const handleClear = () => {
    if (!activeId) return;
    dispatch(clearChatHistoryAction(activeId));
  };

  const dismissToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id));

  const navigateFromToast = (assignmentId: number) => {
    handleSelect(assignmentId);
  };

  if (!currentUser) return null;

  return (
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

      {/* Chat panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <ChatPanel
          activeGroup={activeGroup}
          messages={messages}
          currentUserId={currentUser.id}
          input={input}
          onlineCount={activeOnlineCount}
          onInputChange={(val) => dispatch(setInput(val))}
          onSend={handleSend}
          onBack={handleBack}
          onClearRequest={() => dispatch(setShowClearConfirm(true))}
          onOpenPanel={() => setPanelOpen(true)}
        />
      </div>

      {/* Group panel drawer */}
      {panelOpen && activeGroup && (
        <GroupPanelDrawer
          group={activeGroup}
          onlineUserIds={onlineUserIds}
          onClose={() => setPanelOpen(false)}
          onInvite={() => {
            setPanelOpen(false);
            // TODO: dispatch your existing invite modal open action here
          }}
        />
      )}

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <ClearConfirmModal
          onConfirm={handleClear}
          onCancel={() => dispatch(setShowClearConfirm(false))}
        />
      )}

      {/* In-app message toasts */}
      <MessageToast
        toasts={toasts}
        onDismiss={dismissToast}
        onNavigate={navigateFromToast}
      />
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