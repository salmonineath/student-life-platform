import { MessageSquare } from "lucide-react";
import { GroupSummary, ChatMessage } from "@/types/groupMessageType";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

interface Props {
  activeGroup:    GroupSummary | null;
  messages:       ChatMessage[];
  currentUserId:  number;
  input:          string;
  onInputChange:  (val: string) => void;
  onSend:         () => void;
  onBack:         () => void;
  onClearRequest: () => void;
}

export default function ChatPanel({
  activeGroup, messages, currentUserId, input, onInputChange, onSend, onBack, onClearRequest,
}: Props) {
  return (
    <div className={`flex-1 flex flex-col min-w-0 ${!activeGroup ? "hidden md:flex" : "flex"}`}>
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
          <ChatHeader group={activeGroup} onBack={onBack} onClearRequest={onClearRequest} />
          <MessageList messages={messages} currentUserId={currentUserId} />
          <ChatInput value={input} onChange={onInputChange} onSend={onSend} />
        </>
      )}
    </div>
  );
}