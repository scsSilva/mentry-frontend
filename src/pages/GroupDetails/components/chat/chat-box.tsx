import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "./chat-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { io, Socket } from "socket.io-client";
import { useGroupStore } from "@/store/group-store";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/api/axios";
import toast from "react-hot-toast";

type Message = {
  id: string;
  text: string;
  sender: { id: string; name: string; username: string };
  timestamp: string;
};

export const ChatBox = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const group = useGroupStore((state) => state.group);
  const groupId = group?.id;

  useEffect(() => {
    if (!groupId) return;

    const base = api.defaults.baseURL;
    const socket = io(base, {
      withCredentials: true,
    });
    socketRef.current = socket;

    socket.emit("group:join", groupId);
    socket.on("message:created", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    (async () => {
      try {
        const res = await api.get(`/messages/group/${groupId}`);
        const data: any[] = res.data;
        const formatted = data.map((m) => ({
          id: m.id,
          text: m.content,
          sender: {
            id: m.user?.id ?? m.userId,
            name: m.user?.name ?? "Usuário",
            username: m.user?.username ?? "unknown",
          },
          timestamp: m.createdAt,
        }));
        setMessages(formatted);
      } catch (err) {
        toast.error("Erro ao carregar as mensagens");
      }
    })();

    return () => {
      try {
        socket.emit("group:leave", groupId);
      } catch (e) {
        console.error(e);
      }
      socket.off("message:created");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [groupId]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current || !groupId) return;

    socketRef.current.emit(
      "message:create",
      { groupId, content: input },
      (response: any) => {
        if (response?.status !== "ok") {
          console.error(
            "Erro ao enviar mensagem:",
            response?.error ?? response
          );
        }
      }
    );

    setInput("");
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full max-h-[80vh] min-h-[300px] flex flex-col bg-background border border-border rounded-md p-4 px-2">
      <div
        className="chat-scroll flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1"
        ref={containerRef}
      >
        {messages.map((msg) => {
          const currentUserId = useAuthStore.getState().user?.id;
          const isUser = msg.sender.id === currentUserId;

          return (
            <ChatMessage
              key={msg.id}
              message={{
                id: msg.id,
                text: msg.text,
                sender: isUser ? "Você" : msg.sender.username,
                timestamp: msg.timestamp,
              }}
              isUser={isUser}
            />
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Input
          className="flex-1 h-10 sm:h-12 text-sm rounded-md"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          onClick={handleSend}
          className="h-10 sm:h-12 text-sm px-4 sm:px-6"
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};
