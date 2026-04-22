import { ChatMessage } from "@/types/groupMessageType";
import { getInitials, avatarColor, formatMessageTime } from "@/utils/GroupUtil";

interface Props {
  msg:           ChatMessage;
  prevMsg:       ChatMessage | null;
  currentUserId: number;
}

export default function MessageBubble({ msg, prevMsg, currentUserId }: Props) {
  const isMe     = msg.senderId === currentUserId;
  const showMeta = !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

  return (
    <div className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""} ${showMeta ? "mt-3" : "mt-0.5"}`}>
      {/* Avatar column */}
      {!isMe && (
        showMeta ? (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 self-end ${avatarColor(msg.senderId)}`}>
            {getInitials(msg.senderFullname)}
          </div>
        ) : (
          <div className="w-8 shrink-0" />
        )
      )}

      {/* Bubble */}
      <div className={`flex flex-col max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
        {showMeta && (
          <span className="text-[11px] font-semibold text-slate-500 mb-1 px-1">
            {msg.senderFullname}
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
}