import { useEffect, useRef, useCallback } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatMessage, PresenceEvent } from "@/types/groupMessageType";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

interface UseGroupSocketProps {
  assignmentId:    number | null;
  onMessage:       (msg: ChatMessage) => void;
  onPresence?:     (event: PresenceEvent) => void;
}

export function useGroupSocket({
  assignmentId,
  onMessage,
  onPresence,
}: UseGroupSocketProps) {
  const clientRef      = useRef<Client | null>(null);
  const onMessageRef   = useRef(onMessage);
  const onPresenceRef  = useRef(onPresence);
  onMessageRef.current  = onMessage;
  onPresenceRef.current = onPresence;

  useEffect(() => {
    if (!assignmentId) return;

    const token = localStorage.getItem("accessToken");

    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE}/ws`),
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${token}` },

      onConnect: () => {
        // Subscribe to chat messages
        client.subscribe(`/topic/group/${assignmentId}`, (frame: IMessage) => {
          try {
            const msg: ChatMessage = JSON.parse(frame.body);
            onMessageRef.current(msg);
          } catch {
            console.error("Failed to parse WS message", frame.body);
          }
        });

        // Subscribe to presence updates
        client.subscribe(`/topic/group/${assignmentId}/presence`, (frame: IMessage) => {
          try {
            const event: PresenceEvent = JSON.parse(frame.body);
            onPresenceRef.current?.(event);
          } catch {
            console.error("Failed to parse presence event", frame.body);
          }
        });

        // Tell backend this user is now viewing this group
        client.publish({
          destination: "/app/chat.join",
          body: JSON.stringify({ assignmentId, content: "" }),
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      // Tell backend user left before disconnecting
      if (client.connected) {
        client.publish({
          destination: "/app/chat.leave",
          body: JSON.stringify({ assignmentId, content: "" }),
        });
      }
      client.deactivate();
      clientRef.current = null;
    };
  }, [assignmentId]);

  const sendMessage = useCallback((assignmentId: number, content: string) => {
    const client = clientRef.current;
    if (!client?.connected) {
      console.warn("WebSocket not connected");
      return;
    }
    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ assignmentId, content }),
    });
  }, []);

  return { sendMessage };
}