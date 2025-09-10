type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: string;
};

export const ChatMessage = ({
  message,
  isUser,
}: {
  message: Message;
  isUser: boolean;
}) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`
          flex flex-col gap-2 px-4 py-3 rounded-2xl border max-w-[40%] shadow-sm
          ${
            isUser
              ? "bg-primary text-white border-primary/50"
              : "bg-muted/30 text-foreground border-muted/50"
          }
        `}
      >
        <div className="flex justify-between items-center text-xs font-medium">
          <span
            className={`${isUser ? "text-white/80" : "text-foreground/70"}`}
          >
            {message.sender}
          </span>
          <span
            className={`${
              isUser ? "text-white/70" : "text-foreground/50"
            } ml-2`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-base break-words leading-relaxed">{message.text}</p>
      </div>
    </div>
  );
};
