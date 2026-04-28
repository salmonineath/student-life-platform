import { MessageSquare } from "lucide-react";
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
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 bg-slate-50 h-full">
        <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center mb-4">
          <MessageSquare className="w-10 h-10 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-700 mb-2">Select a group</h2>
        <p className="text-sm text-slate-400 max-w-xs">
          Choose a study group from the left to start chatting with your team.
        </p>
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
        <MessageList messages={messages} currentUserId={currentUserId} />
      </div>
      <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
    </div>
  );
}