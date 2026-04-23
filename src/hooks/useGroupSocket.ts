import { useEffect, useRef } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatMessage } from "@/types/groupMessageType";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

interface UseGroupSocketProps {
  assignmentId: number | null;
  onMessage: (msg: ChatMessage) => void;
}

export function useGroupSocket({ assignmentId, onMessage }: UseGroupSocketProps) {
  const clientRef = useRef<Client | null>(null);
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!assignmentId) return;

    // Get token the same way axios does — from localStorage
    const token = localStorage.getItem("accessToken");

    const client = new Client({
      webSocketFactory: () => new SockJS(`${BASE}/ws`),
      reconnectDelay: 5000,

      // ← pass JWT here so Spring knows who you are
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },

      onConnect: () => {
        client.subscribe(`/topic/group/${assignmentId}`, (frame: IMessage) => {
          try {
            const msg: ChatMessage = JSON.parse(frame.body);
            onMessageRef.current(msg);
          } catch {
            console.error("Failed to parse WS message", frame.body);
          }
        });
      },
      onStompError: (frame) => {
        console.error("STOMP error", frame);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [assignmentId]);

  const sendMessage = (assignmentId: number, content: string) => {
    const client = clientRef.current;
    if (!client?.connected) {
      console.warn("WebSocket not connected");
      return;
    }
    client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify({ assignmentId, content }),
    });
  };

  return { sendMessage };
}