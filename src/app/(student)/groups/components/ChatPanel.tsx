import { motion } from "motion/react";
import { MessageSquare, Sparkles } from "lucide-react";
import { GroupSummary, ChatMessage } from "@/types/groupMessageType";
import ChatHeader  from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput   from "./ChatInput";

interface Props {
  activeGroup:    GroupSummary | null;
  messages:       ChatMessage[];
  currentUserId:  number;
  input:          string;
  onlineCount:    number;
  onInputChange:  (val: string) => void;
  onSend:         () => void;
  onBack:         () => void;
  onClearRequest: () => void;
  onOpenPanel:    () => void;
}

export default function ChatPanel({
  activeGroup, messages, currentUserId, input, onlineCount,
  onInputChange, onSend, onBack, onClearRequest, onOpenPanel,
}: Props) {
  if (!activeGroup) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-[#f4f5f8] h-full">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Icon cluster */}
          <div className="relative mb-6">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-[0_8px_32px_rgba(99,102,241,0.15)] border border-indigo-100/60"
            >
              <MessageSquare className="w-9 h-9 text-indigo-400" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
              className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-md border border-amber-100"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
            </motion.div>
          </div>

          <h2 className="text-lg font-bold text-slate-800 mb-2" style={{ fontFamily: "var(--font-sora)" }}>
            Pick a group to chat
          </h2>
          <p className="text-sm text-slate-500 max-w-[220px] leading-relaxed">
            Select a study group from the left panel to start collaborating with your team.
          </p>

          {/* Subtle hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <p className="text-xs text-slate-500 font-medium">Real-time messaging, powered by WebSocket</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <ChatHeader
        group={activeGroup}
        onlineCount={onlineCount}
        onBack={onBack}
        onClearRequest={onClearRequest}
        onOpenPanel={onOpenPanel}
      />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <MessageList
          messages={messages}
          currentUserId={currentUserId}
        />
      </div>
      <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
    </div>
  );
}
